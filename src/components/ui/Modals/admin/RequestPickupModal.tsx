"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { toast } from "sonner";

export interface RequestPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  warehouseLocation?: string;
  onConfirm?: (data: { pickup_reason: string; notes: string }) => void;
  loading?: boolean;
}

const PICKUP_REASONS = [
  { value: "order_delivery", label: "Order delivery" },
  { value: "return_collection", label: "Return collection" },
  { value: "restock", label: "Restock" },
];

export default function RequestPickupModal({
  isOpen,
  onClose,
  orderId = "",
  warehouseLocation = "Utako branch",
  onConfirm,
  loading = false,
}: RequestPickupModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("order_delivery");
  const [notes, setNotes] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason("order_delivery");
      setNotes("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const currentReasonObj =
    PICKUP_REASONS.find((r) => r.value === selectedReason) || PICKUP_REASONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      toast.error("Please select a pickup reason");
      return;
    }

    if (onConfirm) {
      onConfirm({
        pickup_reason: selectedReason,
        notes: notes.trim(),
      });
    } else {
      toast.success("Pickup request created successfully.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white p-8 rounded-2xl w-full max-w-[517px] shadow-customW relative overflow-hidden"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 p-1.5 top-6  z-10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>

        <div className=" space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
              Request item pickup
            </h2>
            <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
              Trigger an email to logistics partner for order pickup
            </p>
            {orderId && (
              <h3 className="text-c20 font-MontserratMedium text-000000 pt-1 leading-[28px] tracking-tight">
                {orderId}
              </h3>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warehouse location (autofilled) */}
            <div className="space-y-2">
              <Label>Warehouse location</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={warehouseLocation || "Utako branch"}
                  disabled
                  className=" text-000000/80 cursor-not-allowed pr-10"
                />
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-000000/40 pointer-events-none" />
              </div>
            </div>

            {/* Pickup reason dropdown */}
            <div className="space-y-2" ref={dropdownRef}>
              <Label>Pickup reason</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="h-12 px-3.5 w-full rounded-c8 text-gray-700 border border-efefef bg-white flex items-center justify-between text-sm font-MontserratNormal focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none transition-colors cursor-pointer text-left"
                >
                  <span className="truncate">{currentReasonObj.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-000000/68 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-c8 shadow-lg z-50 py-1 overflow-hidden"
                    >
                      {PICKUP_REASONS.map((reason) => {
                        const isSelected = reason.value === selectedReason;
                        return (
                          <button
                            key={reason.value}
                            type="button"
                            onClick={() => {
                              setSelectedReason(reason.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs  font-MontserratNormal transition-colors cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#FF6D5B]/10 text-ff715b font-MontserratMedium"
                                : "text-text-00000/64 hover:bg-gray-50"
                            }`}
                          >
                            <span>{reason.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Extra notes textarea */}
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Collect from seller's registered address"
                className="h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingSpinner /> : "Confirm"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
