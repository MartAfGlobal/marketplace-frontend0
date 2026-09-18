"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, FileText } from "lucide-react";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { toast } from "sonner";
import JpgIcon from "@/assets/icons/jpg-image.svg"

interface ConfirmItemDepartureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData) => void;
  loading?: boolean;
  orderId: string;
  defaultTrackingNumber?: string;
}

export default function ConfirmItemDepartureModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  orderId,
  defaultTrackingNumber = "",
}: ConfirmItemDepartureModalProps) {
  const [adminTrackingId, setAdminTrackingId] = useState(defaultTrackingNumber);
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultTrackingNumber) {
      setAdminTrackingId(defaultTrackingNumber);
    }
  }, [defaultTrackingNumber]);

  useEffect(() => {
    if (!isOpen) {
      setImages([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeBytes = 30 * 1024 * 1024; // 30MB

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported file type. Please upload JPEG or PNG.`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds 30MB maximum size.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTrackingId.trim()) {
      toast.error("Please enter the order tracking number");
      return;
    }

    const formData = new FormData();
    formData.append("admin_tracking_id_to_buyer", adminTrackingId.trim());
    formData.append("tracking_number", adminTrackingId.trim()); // accepted as fallback key

    images.forEach((file) => {
      formData.append("images", file);
    });

    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white p-8 rounded-2xl w-full max-w-[517px] max-h-[95vh] shadow-customW flex flex-col no-scrollbar relative overflow-hidden"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 p-1.5 top-6 z-10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>

        {/* Fixed Title & Description */}
        <div className="text-center space-y-1 pb-6 flex-shrink-0">
          <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
            Confirm item departure
          </h2>
          <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
            Cross check all details and upload a picture of the packaged order
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 pr-1 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <Input
                type="text"
                value={orderId || "N/A"}
                disabled
                className="bg-[#FAFAFA] text-000000/68 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label>Order tracking number</Label>
              <Input
                type="text"
                value={adminTrackingId}
                onChange={(e) => setAdminTrackingId(e.target.value)}
                placeholder="e.g. ADMIN-TRK-00987"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image of outgoing package</Label>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-[0.8px] w-full border-dashed h-[173px] rounded-xl p-6 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-[#FF6D5B] bg-[#FF6D5B]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <p className="text-xs font-MontserratMedium text-000000">
                  Choose a file
                </p>
                <p className="text-xs font-MontserratMedium text-000000/44 mt-1">
                  JPEG, PNG up to 30MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3.5 px-4 h-c44 w-[138px] py-3 border border-000000/12 rounded-c8 text-xs font-MontserratNormal text-000000/44 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Browse files
                </button>
              </div>

              {/* Uploaded File List */}
              {images.length > 0 && (
                <div className="space-y-2 max-h-[146px] overflow-y-auto custom-scrollrailes pr-1 pt-2">
                  {images.map((file, idx) => {
                    const isJpg =
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.name.toLowerCase().endsWith(".jpg") ||
                      file.name.toLowerCase().endsWith(".jpeg");

                    return (
                      <div
                        key={idx}
                        className="border-[0.5px] border-000000/12 rounded-c8 px-3 py-4 flex items-center relative bg-white "
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[#343330]">
                            {isJpg ? (
                              <Image src={JpgIcon} alt="jpg icon" width={18} height={18} />
                            ) : (
                              <FileText className="w-4 h-4 text-[#343330]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-MontserratNormal text-000000/68 truncate max-w-[210px]">
                              {file.name}
                            </p>
                            <p className="text-[10px] font-MontserratNormal text-000000/68">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1  text-000000/44 absolute top-[8.5px] right-[9.5px] transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
