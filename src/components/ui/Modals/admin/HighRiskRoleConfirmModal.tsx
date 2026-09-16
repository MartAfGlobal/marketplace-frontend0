"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, X } from "lucide-react";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { Input } from "@/components/ui/forms/Input";

interface HighRiskRoleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmRoleName: string) => void;
  loading?: boolean;
  roleName: string;
  /** Message from the 409 response (StaffReassignRoleView) — falls back to
   * a generic sentence if the role change hasn't been attempted yet. */
  message?: string;
}

export default function HighRiskRoleConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  roleName,
  message,
}: HighRiskRoleConfirmModalProps) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (isOpen) setConfirmText("");
  }, [isOpen]);

  const matches = confirmText.trim().toLowerCase() === roleName.trim().toLowerCase();

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
              className="relative bg-white shadow-xl flex flex-col w-full max-w-[440px] rounded-2xl p-6"
            >
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF6E5] flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#FFAC06]" />
                </div>
                <h2 className="text-base font-MontserratMedium mb-1.5">High risk role</h2>
                <p className="text-c12 font-MontserratNormal text-000000/68 max-w-[340px]">
                  {message ||
                    `You are granting this staff member the ${roleName} role. This gives them access to everything that role covers.`}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-MontserratMedium text-000000/68 mb-1">
                  Type in the name of the role below
                </label>
                <Input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Type ${roleName} to continue`}
                  disabled={loading}
                  icon={<ChevronDown className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-transparent text-[#FF715B] border border-[#FF715B] hover:bg-[#FFE8E8] h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onConfirm(confirmText)}
                  disabled={loading || !matches}
                  className="flex-1 h-11"
                >
                  {loading ? <LoadingSpinner /> : "Confirm role change"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
