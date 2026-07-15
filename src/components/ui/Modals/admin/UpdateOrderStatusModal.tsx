"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X } from "lucide-react";
import { Label } from "@/components/ui/forms/Label";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import CheckBoxButton from "@/components/ui/Button/checkBoxButton";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  loading?: boolean;
}

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: UpdateOrderStatusModalProps) {
  const [status, setStatus] = useState("Shipped");
  const [confirmed, setConfirmed] = useState(false);

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
              className="bg-white shadow-xl flex flex-col w-full max-w-[595px] rounded-2xl p-12 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-343330 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-lg font-MontserratMedium leading-[26px] mb-8">
                  Update Order Status
                </h2>
                <p className="text-xs font-MontserratMedium leading-[16px]">
                  You are about to update the status of this order. Please
                  confirm the new status before proceeding.
                </p>
              </div>

              {/* Order Status Dropdown */}
              <div className=" flex text-nowrap items-center gap-6">
                <Label className="mb-0">Order Status:</Label>
                <DropdownInput
                  placeholder="Select order status"
                  options={ORDER_STATUSES}
                  value={status}
                  onChange={(val) => setStatus(val)}
                  disabled={loading}
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 mt-8 mb-12">
                <div className="mt-0.5 shrink-0">
                  <CheckBoxButton
                    defaultChecked={confirmed}
                    onChange={(checked) => setConfirmed(checked)}
                  />
                </div>
                <p
                  className="text-xs font-MontserratNormal text-[#000000]/68 cursor-pointer leading-relaxed"
                  onClick={() => setConfirmed((prev) => !prev)}
                >
                  I confirm that the selected order status is correct and should
                  be applied.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onConfirm(status)}
                  disabled={!confirmed || loading}
                  variant="primary"
                  className="disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : "Update Status"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
