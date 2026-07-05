"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, ChevronDown } from "lucide-react";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  loading?: boolean;
}

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
              className="bg-white shadow-xl flex flex-col w-full max-w-[560px] rounded-2xl p-10 relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8 max-w-sm mx-auto">
                <h2 className="text-xl font-MontserratSemiBold mb-3 text-[#161616]">
                  Update Order Status
                </h2>
                <p className="text-sm font-MontserratMedium text-[#161616]">
                  You are about to update the status of this order. Please confirm the new status before proceeding.
                </p>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <label className="text-sm font-MontserratMedium text-[#161616] whitespace-nowrap min-w-max">
                  Order Status:
                </label>
                <div className="relative w-full">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none focus:border-ff715b focus:ring-1 focus:ring-ff715b appearance-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-10">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-[#ff715b] text-[#ff715b] focus:ring-[#ff715b] cursor-pointer"
                  />
                </div>
                <label className="text-sm font-MontserratMedium text-gray-600 cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
                  I confirm that the selected order status is correct and should be applied.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onConfirm(status)}
                  disabled={!confirmed || loading}
                >
                  {loading ? <LoadingSpinner size={24} color="border-white" /> : "Update Status"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
