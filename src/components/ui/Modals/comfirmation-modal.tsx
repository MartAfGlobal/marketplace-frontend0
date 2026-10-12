"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { ConfirmModalProps } from "@/types/global";
import { Button } from "../Button/Button";
import { LoadingSpinner } from "../loading-spinner";

// Reusable confirmation dialog for destructive or high-impact actions. This is the app's standard
// "Are you sure?" pattern and is intentionally simpler than the side drawer pattern used for forms.
// Most screens pass a callback pair (`onYes`, `onNo`) and a short explanation so the modal remains
// a consistent user-safe wrapper around irreversible actions.
export default function ConfirmModal({
  success,
  isOpen,
  onClose,
  title,
  description,
  onYes,
  onNo,
  yesText = "Yes",
  noText = "No",
  className = "",
  loading,
}: ConfirmModalProps) {
  // The modal closes itself when the parent reports an operation success. This pattern means callers
  // can keep their state machine simple: the request resolves, success flips to true, and the modal
  // dismisses without needing duplicate close logic in each page.
  useEffect(() => {
    if (success === true && isOpen) {
      onClose();
    }
  }, [success, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`relative bg-white shadow-xl flex flex-col items-center gap-2 w-full md:max-w-101.5 h-fit rounded-t-2xl md:rounded-xl p-6 md:p-8 max-h-120 overflow-y-auto ${className}`}
            >
              <div className="flex">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="absolute top-6 right-6 text-black hover:text-gray-700 disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-000000" />
                </button>

                {/* Modal title should stay short and action-oriented so the user understands exactly
                what outcome is being confirmed before they click the primary CTA. */}
                <h2 className="text-c16 font-MontserratSemiBold mb-2 text-000000">
                  {title}
                </h2>
              </div>

              {/* The description should explain the consequence in plain language. The neutral wording
              keeps the pattern reusable for delete, cancellation, and approval flows without needing
              a bespoke component for each case. */}
              <p className="text-c12 font-MontserratMedium text-000000 mb-6 text-center">
                {description}
              </p>

              {/* Primary actions are intentionally symmetric: the secondary button acts as a cancel,
              and the primary button calls the destructive/confirming action. Both buttons share the
              same loading state to prevent duplicate requests from double-submit clicks. */}
              <div className="w-full flex gap-4 font-MontserratSemiBold text-sm justify-center">
                <Button
                  onClick={() => {
                    onNo();
                    onClose();
                  }}
                  disabled={loading}
                  className="bg-transparent text-ff715b border border-ff715b hover:text-ffffff disabled:opacity-50"
                >
                  {noText}
                </Button>

                <Button onClick={onYes} disabled={loading}>
                  {loading ? <LoadingSpinner /> : yesText}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
