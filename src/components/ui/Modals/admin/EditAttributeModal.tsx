"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import type { AttributeDetailData } from "./AttributeDetailsModal";

interface EditAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: AttributeDetailData | null;
  onSuccess?: (updated: AttributeDetailData) => void;
}

export default function EditAttributeModal({
  isOpen,
  onClose,
  attribute,
  onSuccess,
}: EditAttributeModalProps) {
  const [attributeName, setAttributeName] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const { updateAdminAttribute } = AdminDetails();

  /* Pre-fill form whenever the attribute prop or isOpen changes */
  useEffect(() => {
    if (isOpen && attribute) {
      setAttributeName(attribute.name);
      setValues([...attribute.values]);
      setCurrentValue("");
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, attribute]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (w > 0) document.body.style.paddingRight = `${w}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleAddValue = () => {
    const val = currentValue.trim();
    if (val && !values.includes(val)) {
      setValues([...values, val]);
      setCurrentValue("");
    }
  };

  const handleRemoveValue = (valToRemove: string) => {
    setValues(values.filter((v) => v !== valToRemove));
  };

  const handleUpdate = () => {
    if (!attribute) return;
    if (!attributeName.trim()) {
      toast.error("Please enter an attribute name.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: attributeName.trim(),
      values: [...values],
    };

    if (!token) {
      // Offline / mock fallback
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
        if (onSuccess) {
          onSuccess({
            ...attribute,
            name: payload.name,
            values: payload.values,
          });
        }
      }, 800);
      return;
    }

    updateAdminAttribute(
      attribute.id,
      payload,
      (_res: any) => {
        setIsSubmitting(false);
        handleClose();
        if (onSuccess) {
          onSuccess({
            ...attribute,
            name: payload.name,
            values: payload.values,
          });
        }
      },
      (err: any) => {
        setIsSubmitting(false);
        const errMsg =
          err?.data?.message || err?.message || "Failed to update attribute.";
        toast.error(errMsg);
      }
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

            {/* ── SUCCESS SCREEN ── */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className="w-20 h-20 rounded-full bg-[#28A745]/10 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#28A745]" />
                  </motion.div>

                  <h2 className="text-c18 font-MontserratSemiBold text-black mb-2">
                    Attribute Updated!
                  </h2>
                  <p className="text-c12 font-MontserratNormal text-000000/60 mb-8">
                    <span className="font-MontserratSemiBold text-black">
                      {attributeName}
                    </span>{" "}
                    has been updated successfully.
                  </p>

                  {values.length > 0 && (
                    <div className="w-full mb-8">
                      <p className="text-c12 font-MontserratMedium text-000000/60 mb-3">
                        Values ({values.length})
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {values.map((val) => (
                          <span
                            key={val}
                            className="px-3 py-1 h-8 flex items-center bg-947fff/10 rounded-c8 text-c12 font-MontserratMedium text-gray-700"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleClose}>
                    Done
                  </Button>
                </motion.div>
              ) : (
                /* ── FORM SCREEN ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Title */}
                  <h2 className="text-c18 font-MontserratSemiBold mb-8 text-black">
                    Update attribute
                  </h2>

                  {/* Form Content */}
                  <div>
                    <div className="space-y-2">
                      <Label>Name of Attribute</Label>
                      <Input
                        placeholder="e.g. Colour"
                        value={attributeName}
                        onChange={(e) => setAttributeName(e.target.value)}
                      />
                    </div>

                    {/* Display Values */}
                    {values.length > 0 && (
                      <div>
                        <h3 className="text-c12 font-MontserratMedium text-000000/68 mb-4 mt-8">
                          Added values
                        </h3>
                        <div className="flex flex-wrap gap-3 max-h-36 overflow-y-auto no-scrollbar">
                          {values.map((val) => (
                            <div
                              key={val}
                              className="flex items-center gap-3 px-4 py-2 h-8 bg-ffffff border border-ff715b rounded-c8 justify-center text-c12 font-MontserratMedium text-ff715b"
                            >
                              <span className="max-w-[120px] truncate">{val}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveValue(val)}
                                className="text-ff715b flex-shrink-0 h-3 w-3 flex justify-center items-center transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="w-full flex gap-4 items-end mt-6">
                      <div className="flex-1 space-y-2">
                        <Label>Enter Value</Label>
                        <Input
                          placeholder="Enter value"
                          value={currentValue}
                          onChange={(e) => setCurrentValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddValue();
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full flex pt-4 justify-end">
                      <button
                        type="button"
                        disabled={!currentValue.trim()}
                        onClick={handleAddValue}
                        className="gap-2 flex items-center justify-center text-ff715b text-c12 font-MontserratMedium hover:opacity-90 transition-opacity disabled:text-ff715b/44 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <Plus className="w-4 h-4 text-ff715b" />
                        Add value
                      </button>
                    </div>
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
                      onClick={handleUpdate}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size={18} color="border-white" />
                      ) : (
                        "Update Attribute"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
