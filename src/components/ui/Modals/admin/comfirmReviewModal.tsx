"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { toast } from "sonner";

export interface ConfirmDisputeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  DisputeId?: string;
  onConfirm?: () => void;
  loading?: boolean;
}

export default function ConfirmDisputReviewModal({
  isOpen,
  onClose,
  DisputeId,
  onConfirm,
  loading = false,
}: ConfirmDisputeReviewModalProps) {
  const [disputeIdEntered, setDisputeIdEntered] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setDisputeIdEntered("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = disputeIdEntered.trim();
    if (!entered) {
      setError("Please type the dispute ID to confirm.");
      return;
    }

    const clean = (val?: string) => (val ?? "").replace(/^#/, "").trim().toLowerCase();

    if (DisputeId && clean(entered) !== clean(DisputeId)) {
      setError(`Dispute ID does not match "${DisputeId}".`);
      return;
    }

    setError("");
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={loading ? undefined : onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-2xl w-full max-w-[517px] shadow-customW relative overflow-hidden"
        >
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="absolute right-6 p-1.5 top-6 z-10 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <Image src={XIcon} alt="close" width={20} height={20} />
          </button>

          <div className="space-y-8">
            <div className="text-center space-y-1">
              <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
                Confirm review decision
              </h2>
              <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
                This will trigger the return/refund process for
              </p>
              {DisputeId && (
                <h3 className="text-c20 font-MontserratMedium text-000000 pt-1 leading-[28px] tracking-tight">
                  {DisputeId}
                </h3>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type in the dispute ID below to confirm</Label>
                <Input
                  placeholder={DisputeId || "e.g. DSP-..."}
                  value={disputeIdEntered}
                  onChange={(e) => {
                    setDisputeIdEntered(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                />
                {error && (
                  <p className="text-xs text-[#CA0202] font-MontserratNormal">
                    {error}
                  </p>
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
    </AnimatePresence>
  );
}
