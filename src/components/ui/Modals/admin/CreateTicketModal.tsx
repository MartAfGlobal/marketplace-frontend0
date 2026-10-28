"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Paperclip, Check } from "lucide-react";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import Image from "next/image";

interface StaffOption {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableStaff?: { name: string; id?: string }[];
}

const CATEGORY_OPTIONS = [
  "Order issues",
  "Payment issues",
  "Account issues",
  "Delivery issues",
  "Product inquiry",
  "Technical support",
  "General inquiry",
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

const SOURCE_OPTIONS = [
  "Phone call",
  "Email",
  "Live chat",
  "Web form",
  "Social media",
];

interface CustomSelectProps {
  label?: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[] | string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = React.useMemo(() => {
    if (!value) return "";
    for (const opt of options) {
      if (typeof opt === "string") {
        if (opt === value) return opt;
      } else if (opt.value === value) {
        return opt.label;
      }
    }
    return value;
  }, [value, options]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-12 px-3.5 rounded-c8 border border-efefef bg-white text-left flex items-center justify-between text-sm font-MontserratNormal transition-all ${
          isOpen ? "border-ff715b ring-1 ring-ff715b" : "hover:border-gray-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`truncate ${
            selectedLabel ? "text-[#161616]" : "text-gray-400"
          }`}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-50 py-1"
          >
            {options.map((opt, idx) => {
              const optVal = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              const isSelected = optVal === value;

              return (
                <button
                  key={`${optVal}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-MontserratNormal flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-ff715b text-[#ff715b] font-MontserratMedium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{optLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ff715b] shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
  availableStaff = [],
}: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("Order issues");
  const [priority, setPriority] = useState("Medium");
  const [source, setSource] = useState("Phone call");
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [staffList, setStaffList] = useState<StaffOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchAdminStaffList, createAdminSupportTicket } = AdminDetails();

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Load staff members for assignment
  useEffect(() => {
    if (!isOpen) return;

    if (fetchAdminStaffList && token) {
      fetchAdminStaffList(
        { page: 1 },
        (data: any) => {
          const results = data?.results || [];
          const mapped: StaffOption[] = results.map((item: any) => ({
            id: String(item.user_id || item.id || item.staff_ref),
            name:
              item.full_name ||
              `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
              item.email ||
              "Staff member",
            email: item.email,
            avatar: item.profile_image || item.avatar,
          }));

          // Merge with any availableStaff passed from the parent page
          if (availableStaff.length > 0) {
            for (const s of availableStaff) {
              if (s.name && !mapped.some((m) => m.name.toLowerCase() === s.name.toLowerCase())) {
                mapped.push({
                  id: s.id || s.name,
                  name: s.name,
                });
              }
            }
          }

          setStaffList(mapped);
          if (mapped.length > 0 && !assignedStaffId) {
            setAssignedStaffId(mapped[0].id);
          }
        },
      );
    } else if (availableStaff.length > 0) {
      const mapped = availableStaff.map((s, idx) => ({
        id: s.id || String(idx + 1),
        name: s.name,
      }));
      setStaffList(mapped);
      if (mapped.length > 0 && !assignedStaffId) {
        setAssignedStaffId(mapped[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  const selectedStaff = staffList.find((s) => s.id === assignedStaffId) || null;

  const resetForm = () => {
    setSubject("");
    setCustomerName("");
    setDetails("");
    setCategory("Order issues");
    setPriority("Medium");
    setSource("Phone call");
    setAssignedStaffId(staffList[0]?.id || "");
    setAttachmentFile(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size cannot exceed 10MB");
        return;
      }
      setAttachmentFile(file);
    }
  };

  const handleSubmit = () => {
    if (!subject.trim()) {
      toast.error("Please enter a ticket subject.");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Please enter the customer's name.");
      return;
    }
    if (!details.trim()) {
      toast.error("Please enter ticket details.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("title", subject.trim());
    formData.append("customer_name", customerName.trim());
    formData.append("customer", customerName.trim());
    formData.append("description", details.trim());
    formData.append("details", details.trim());
    formData.append("category", category);
    formData.append("priority", priority.toLowerCase());
    formData.append("source", source);
    formData.append("ticket_source", source);

    if (assignedStaffId) {
      formData.append("assigned_to", assignedStaffId);
      if (selectedStaff?.name) {
        formData.append("assigned_to_name", selectedStaff.name);
      }
    }

    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
      formData.append("attachments", attachmentFile);
      formData.append("file", attachmentFile);
    }

    createAdminSupportTicket(
      formData,
      (_res: any) => {
        setIsSubmitting(false);
        toast.success("Ticket created successfully!");
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      },
      (err: any) => {
        setIsSubmitting(false);
        const errMsg =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          "Failed to create support ticket.";
        toast.error(errMsg);
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-end z-[9999] p-4 sm:pr-[29px]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 160 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-xl flex flex-col w-full max-w-[629px] max-h-[95vh] rounded-[16px] p-6 sm:p-8 relative overflow-hidden custom-scroll"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors z-20 disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-lg  font-MontserratMedium text-000000 leading-[26px]">
                Create a new ticket
              </h2>
              <p className="text-xs font-MontserratNormal text-000000/68  leading-4">
                Fill in the details accurately
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1 custom-scroll">
              {/* Ticket subject */}
              <div>
                <Label className="">
                  Ticket subject
                </Label>
                <Input
                  placeholder="Ticket subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Customer's name */}
              <div>
                <Label className="">
                  Customer&apos;s name
                </Label>
                <Input
                  placeholder="Customer's name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Ticket details */}
              <div>
                <Label className="">
                  Ticket details
                </Label>
                <textarea
                  rows={4}
                  placeholder="Ticket details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-3.5 rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-sm font-MontserratNormal resize-none placeholder:text-gray-400 transition-colors"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="">
                    Category
                  </Label>
                  <CustomSelect
                    placeholder="Select category"
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={setCategory}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label className="">
                    Priority
                  </Label>
                  <CustomSelect
                    placeholder="Select priority"
                    options={PRIORITY_OPTIONS}
                    value={priority}
                    onChange={setPriority}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Attachments & Ticket Source Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="">
                    Attachments
                  </Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="w-full h-12 px-3.5 rounded-c8 border border-efefef bg-white text-left flex items-center justify-between text-sm font-MontserratNormal hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <span
                      className={`truncate text-xs ${
                        attachmentFile ? "text-[#161616]" : "text-gray-400"
                      }`}
                    >
                      {attachmentFile ? attachmentFile.name : "Upload a file"}
                    </span>
                    <Paperclip className="w-4 h-4 text-gray-400 shrink-0 ml-1.5 -rotate-45" />
                  </button>
                </div>
                <div>
                  <Label className="">
                    Ticket source
                  </Label>
                  <CustomSelect
                    placeholder="Select source"
                    options={SOURCE_OPTIONS}
                    value={source}
                    onChange={setSource}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Assign to */}
              <div>
                <Label className="">
                  Assign to
                </Label>
                <CustomSelect
                  placeholder="Select staff"
                  options={staffList.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                  value={assignedStaffId}
                  onChange={setAssignedStaffId}
                  disabled={isSubmitting}
                />
              </div>

              {/* Assigned to card */}
              {selectedStaff && (
                <div className="bg-ff715b/12 border border-ff715b rounded-c8 py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    {selectedStaff.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <Image
                      width={36} height={36}
                        src={selectedStaff.avatar}
                        alt={selectedStaff.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#ff715b]/20 text-[#ff715b] flex items-center justify-center font-MontserratBold text-xs shrink-0">
                        {selectedStaff.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] text-000000/68 leading-4 tracking-[2%] font-MontserratNormal">
                        Assigned to
                      </p>
                      <p className="text-xs font-MontserratMedium text-000000 leading-[20px] tracking-[2%] truncate">
                        {selectedStaff.name}
                      </p>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-[#ff715b] shrink-0 ml-2" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="w-full flex items-center justify-center"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create ticket
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
