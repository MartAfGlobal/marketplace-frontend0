"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { Label } from "../../forms/Label";
import { Textarea } from "../../forms/auth/text-area";

interface SuspendProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  loading?: boolean;
  /** "suspend" shows the Suspend flow; "reactivate" shows the Reactivate flow */
  action: "suspend" | "reactivate";
  productName?: string;
}

const CONFIG = {
  suspend: {
    title: "Suspend Product",
    description:
      "You are about to suspend this live product. It will be hidden from buyers immediately. The seller will be notified.",
    defaultNotes: "Seller requested temporary pause for restocking.",
    confirmLabel: "Confirm Suspend",
    confirmClass:
      "bg-[#ffac06] hover:bg-[#e69b05] text-white border-none",
    checkLabel:
      "I understand the product will be hidden from buyers immediately.",
  },
  reactivate: {
    title: "Reactivate Product",
    description:
      "You are about to reactivate this suspended product. It will become visible to buyers again.",
    defaultNotes: "Restock confirmed, resuming sales.",
    confirmLabel: "Confirm Reactivate",
    confirmClass:
      "",
    checkLabel:
      "I understand the product will become live and visible to buyers.",
  },
};

export default function SuspendProductModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  action,
  productName,
}: SuspendProductModalProps) {
  const cfg = CONFIG[action];
  const [notes, setNotes] = useState(cfg.defaultNotes);
  const [understood, setUnderstood] = useState(false);

  // Reset state each time the modal opens or switches action
  useEffect(() => {
    if (isOpen) {
      setNotes(CONFIG[action].defaultNotes);
      setUnderstood(false);
    }
  }, [isOpen, action]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[520px] rounded-2xl p-8 relative"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-c18 font-MontserratSemiBold mb-2">
                  {cfg.title}
                </h2>
                
                <p className="text-sm font-MontserratNormal text-000000/68">
                  {cfg.description}
                </p>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <Label className="">
                  Note
                </Label>
                <Textarea
                  value={notes}
                  autoResize={false}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add moderation notes…"
                  className="w-full resize-none scrollbar-hide !py-2 text-c12 font-MontserratMedium"
                  style={{ height: "80px" }}
                />
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${
                    understood
                      ? "bg-[#ff715b] border-[#ff715b]"
                      : "border-[#ff715b]"
                  }`}
                  onClick={() => setUnderstood(!understood)}
                >
                  {understood && (
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  )}
                </div>
                <Label
                  className="cursor-pointer text-xs"
                  onClick={() => setUnderstood(!understood)}
                >
                  {cfg.checkLabel}
                </Label>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                type="button"
                  onClick={() => onConfirm(notes)}
                  disabled={loading || !understood}
                  className={`disabled:cursor-not-allowed ${cfg.confirmClass}`}
                >
                  {loading ? <LoadingSpinner /> : cfg.confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
