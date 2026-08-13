"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";

interface CreateAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newAttribute: { name: string }) => void;
}

export default function CreateAttributeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAttributeModalProps) {
  const [attributeName, setAttributeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAttributeName, setCreatedAttributeName] = useState("");

  const token = useSelector((state: RootState) => state.token?.token);
  const { createAdminAttribute } = AdminDetails();

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

  const resetForm = () => {
    setAttributeName("");
    setIsSubmitting(false);
    setIsSuccess(false);
    setCreatedAttributeName("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSuccess = (name: string) => {
    setCreatedAttributeName(name);
    setIsSubmitting(false);
    setIsSuccess(true);
    handleClose();
    if (onSuccess) {
      onSuccess({ name });
    }
  };

  const handleCreate = () => {
    if (!attributeName.trim()) {
      toast.error("Please enter an attribute name.");
      return;
    }

    const payload = {
      name: attributeName.trim(),
      is_active: true,
    };

    setIsSubmitting(true);

    if (!token) {
      // Fallback for offline / mock state
      setTimeout(() => {
        handleSuccess(payload.name);
      }, 800);
      return;
    }

    createAdminAttribute(
      payload,
      (_res: any) => {
        handleSuccess(payload.name);
      },
      (err: any) => {
        setIsSubmitting(false);
        const errMsg =
          err?.data?.message || err?.message || "Failed to create attribute.";
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
            className="bg-white shadow-xl flex flex-col w-full max-w-[432px] rounded-[16px] p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              {/* ── FORM SCREEN ── */}
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-c18 font-MontserratSemiBold mb-8 text-black">
                  Create new attribute
                </h2>

                <div className="space-y-2">
                  <Label>Name of Attribute</Label>
                  <Input
                    placeholder="e.g. Colour"
                    value={attributeName}
                    onChange={(e) => setAttributeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreate();
                      }
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-8 justify-end border-t border-000000/4 pt-12">
                  <Button
                    variant="secondary"
                    className="w-44"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-44 flex items-center justify-center"
                    onClick={handleCreate}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size={18} color="border-white" />
                    ) : (
                      "Create Attribute"
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
