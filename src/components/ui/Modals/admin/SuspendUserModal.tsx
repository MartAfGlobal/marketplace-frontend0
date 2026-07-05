"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export default function SuspendUserModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");
  const reasons = [
    "Malicious payment information",
    "Spam activity",
    "Terms of service violation",
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
              className="bg-white shadow-xl flex flex-col w-full max-w-[517px] rounded-2xl p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-lg font-MontserratMedium mb-1">
                  Reason for Suspension
                </h2>
                <p className="text-c12 font-MontserratNormal text-000000/68">
                  Choose from the list of predefined options
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-MontserratMedium text-000000/68 mb-1">
                  Reason for suspension
                </label>
                <DropdownInput
                  placeholder="Malicious payment information"
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
                  disabled={loading || !reason}
                  className="flex-1 bg-[#ffac06] text-white hover:bg-[#e69b05] h-12 border-none"
                >
                  {loading ? <LoadingSpinner /> : "Confirm, suspend user"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
