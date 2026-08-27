"use client";

import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AdminCancelOrderModalProps {
  isOpen: boolean;
  /** The Payment UUID — used in the endpoint /cancellation/admin/payments/{paymentId}/cancellation-requests */
  paymentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CancellationReason {
  id: string;
  title: string;
  code: string;
  requires_additional_info: boolean;
}

export default function AdminCancelOrderModal({
  isOpen,
  paymentId,
  onClose,
  onSuccess,
}: AdminCancelOrderModalProps) {
  const token = useSelector((state: RootState) => state.token.token);

  const { sendHttpRequest: fetchReasonsReq, loading: loadingReasons } =
    useHttp();
  const { sendHttpRequest: cancelReq, loading: submitting } = useHttp();

  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<CancellationReason | null>(null);
  const [moreInfo, setMoreInfo] = useState("");

  /* ── Fetch admin cancellation reasons ── */
  const fetchReasons = () => {
    if (!token) return;
    if (reasons.length) {
      setDropdownOpen((p) => !p);
      return;
    }
    fetchReasonsReq({
      requestConfig: {
        url: "/cancellation/reasons/for_admin",
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => {
        const list: CancellationReason[] = res?.data ?? res ?? [];
        setReasons(list);
        setDropdownOpen(true);
      },
    });
  };

  /* ── Submit cancellation request ── */
  const handleSubmit = () => {
    if (!token || !paymentId || !selectedReason) return;

    cancelReq({
      requestConfig: {
        url: `/cancellation/admin/payments/${paymentId}/cancellation-requests`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: {
          cancellation_reason: selectedReason.id,
          more_information:
            moreInfo || "Admin initiated cancellation via support ticket",
        },
      },
      successRes: () => {
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  const handleClose = () => {
    setSelectedReason(null);
    setMoreInfo("");
    setDropdownOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && paymentId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
            <motion.div
              className="relative bg-white shadow-xl w-full max-w-128 h-fit rounded-t-2xl md:rounded-xl p-6 md:p-8 space-y-c32"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-MontserratSemiBold text-base text-000000">
                  Cancel Order
                </h2>
                <button
                  onClick={handleClose}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X size={24} className="text-black" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <p className="text-xs font-MontserratMedium text-gray-600">
                  Select a cancellation reason
                </p>

                {/* Reason dropdown */}
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={fetchReasons}
                    className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                  >
                    <span className="font-MontserratMedium text-left text-c12 text-gray-900">
                      {selectedReason?.title || "Select a reason"}
                    </span>
                    {loadingReasons ? (
                      <LoadingSpinner color="border-ff715b" />
                    ) : (
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && reasons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                      >
                        {reasons.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedReason(item);
                              setDropdownOpen(false);
                            }}
                            className="block w-full px-3 py-2 font-MontserratMedium text-left text-c12 text-gray-700 hover:bg-gray-100"
                          >
                            {item.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Additional info textarea */}
                  {selectedReason?.requires_additional_info && (
                    <textarea
                      value={moreInfo}
                      onChange={(e) => setMoreInfo(e.target.value)}
                      placeholder="Please provide more details"
                      className="mt-3 w-full border rounded-c8 p-3 text-sm focus:outline-none focus:border-ff715b"
                      rows={3}
                    />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Close
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedReason}
                  className="bg-[#C00000] hover:bg-[#a60000] min-w-28"
                >
                  {submitting ? <LoadingSpinner /> : "Confirm"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
