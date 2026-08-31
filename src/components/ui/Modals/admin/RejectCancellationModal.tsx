"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { X } from "lucide-react";

interface RejectCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  loading?: boolean;
  requestOrderId?: string;
}

export default function RejectCancellationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  requestOrderId,
}: RejectCancellationModalProps) {
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionNotes.trim()) {
      setError("Please provide a reason or note for rejecting this request.");
      return;
    }
    setError("");
    onConfirm(rejectionNotes.trim());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={loading ? undefined : onClose}
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-xl flex flex-col w-full max-w-[480px] rounded-c16 p-8 relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 max-w-[400px] mx-auto">
              <h2 className="text-c18 font-MontserratSemiBold text-[#161616] mb-2">
                Reject Cancellation Request
              </h2>
              <p className="text-sm font-MontserratNormal text-[#000000]/68">
                Are you sure you want to reject this cancellation request
                {requestOrderId ? ` for order #${requestOrderId}` : ""}? Please
                provide notes explaining the reason.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-MontserratMedium text-[#161616]/70 mb-2 block">
                  Rejection Notes <span className="text-[#CA0202]">*</span>
                </Label>
                <textarea
                  rows={4}
                  value={rejectionNotes}
                  onChange={(e) => {
                    setRejectionNotes(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  placeholder="e.g. Order has already shipped, too late to cancel."
                  className={`w-full rounded-c8 border p-3.5 text-xs font-MontserratNormal focus:outline-none transition-colors resize-none ${
                    error
                      ? "border-[#CA0202] focus:border-[#CA0202]"
                      : "border-[#E5E7EB] focus:border-[#FF715B]"
                  }`}
                />
                {error && (
                  <span className="text-xs text-[#CA0202] font-MontserratMedium mt-1 block">
                    {error}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-[#F0F0F0]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border-[#E5E7EB] text-[#161616] hover:bg-gray-50 h-c44 rounded-c8 font-MontserratMedium text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  disabled={loading}
                  className="flex-1 bg-[#CA0202] hover:bg-[#b00202] text-white h-c44 rounded-c8 font-MontserratMedium text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size={16} color="border-white" />
                     
                    </div>
                  ) : (
                    "Reject Request"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
