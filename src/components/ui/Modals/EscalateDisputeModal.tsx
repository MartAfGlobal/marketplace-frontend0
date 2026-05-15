"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button/Button";
import ResultModal from "../forms/resultModal";

interface EscalateDisputeModalProps {
  isOpen: boolean;
  disputeId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EscalateDisputeModal({
  isOpen,
  disputeId,
  onClose,
  onSuccess,
}: EscalateDisputeModalProps) {
  const [escalationReason, setEscalationReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest, loading } = useHttp();

  const handleEscalate = () => {
    if (!token || !escalationReason.trim()) return;

    sendHttpRequest({
      requestConfig: {
        url: `/disputes/seller/${disputeId}/escalate/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
        body: {
          escalation_reason: escalationReason,
        },
      },
      successRes: () => {
        setShowSuccess(true);
        onSuccess?.();
      },
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
              <motion.div
                className="relative bg-white shadow-xl w-full max-w-lg rounded-2xl p-6 md:p-8 space-y-6"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-MontserratSemiBold text-xl text-000000">
                    Escalate dispute
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} className="text-black" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-MontserratMedium text-gray-700">
                    Reason for escalation
                  </label>
                  <textarea
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    placeholder="Enter your reason for escalating this dispute..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none transition-all resize-none font-MontserratMedium text-sm text-gray-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="w-full sm:flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading || !escalationReason.trim()}
                    onClick={handleEscalate}
                    className="w-full sm:flex-1 h-12"
                  >
                    {loading ? <LoadingSpinner /> : "Confirm"}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResultModal
        isOpen={showSuccess}
        title="Dispute Escalated"
        message="Your escalation request has been submitted successfully."
        discRescription="An administrator will review the dispute and get back to you shortly."
        onConfirm={() => {
          setShowSuccess(false);
          onClose();
        }}
        buttenText="Back to Details"
      />
    </>
  );
}
