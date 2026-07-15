"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { Label } from "../../forms/Label";

interface RejectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export default function RejectVerificationModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: RejectVerificationModalProps) {
  const [reason, setReason] = useState("");

  const reasons = [
    "Document image is unclear or blurry",
    "Information does not match",
    "Document is expired",
    "Missing required documents",
    "Other",
  ];

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
              className="bg-white shadow-xl flex flex-col w-full max-w-[426px] rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-lg font-MontserratMedium text-[#000000] mb-1">
                  Reject Verification
                </h2>
                <p className="text-xs font-MontserratNormal text-000000/68 text-center leading-4">
                  Select the reason for rejecting this verification. The user will be notified and may resubmit their documents
                </p>
              </div>

              <div className="mb-8">
                <Label className="mb-2">
                  Reason for rejection
                </Label>
                <DropdownInput
                  placeholder="Document image is unclear or blurry"
                  options={reasons}
                  value={reason}
                  onChange={(val) => setReason(val)}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-transparent text-[#FF715B] border border-[#FF715B] hover:bg-[#FFE8E8] h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onConfirm(reason)}
                  disabled={loading}
                  className="flex-1 bg-[#FF715B] text-white hover:bg-[#e56550] h-12 border-none"
                >
                  {loading ? <LoadingSpinner /> : "Submit"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
