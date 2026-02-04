"use client";

import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button/Button";
import { Input } from "../forms/Input";
import ResultModal from "../forms/resultModal";
import { useRouter } from "next/navigation";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: string | null;
  onClose: () => void;
  className?: string;
  isDispute: boolean;
}

interface CancellationReason {
  id: string;
  title: string;
  code: string;

  requires_additional_info: boolean;
}

export default function CancelOrderModal({
  isOpen,
  orderId,
  className,
  isDispute = false,
  onClose,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrders } = useFetchOrders();
  const { sendHttpRequest: cancelReq, loading } = useHttp();
  const { sendHttpRequest: getReasonReq, loading: loadinReason } = useHttp();
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [disputeReason, setDisputeReason] = useState("");
  const [selectedReason, setSelectedReason] =
    useState<CancellationReason | null>(null);
  const router = useRouter();
  const [success, setsuccess] = useState(false);
  const [additionalNote, setAdditionalNote] = useState("");

  const handleCancelOrder = () => {
    if (!token) return;

    const url = isDispute
      ? `/disputes/buyer/${orderId}/cancel/`
      : `/orders/buyer/${orderId}/cancel/`;

    const body = isDispute
      ? {
          reason: disputeReason || "", // optional
        }
      : {
          cancellation_reason_id: selectedReason?.id,
          additional_notes: additionalNote || selectedReason?.title,
        };

    if (!isDispute && !selectedReason) return;

    cancelReq({
      requestConfig: {
        url,
        method: "POST",
        token,
        isAuth: true,
        body,
        userType: "buyer",
      },
      successRes: () => {
        setsuccess(true);
        fetchOrders();
        onClose();
      },
    });
  };

  const fetcheReasons = () => {
    if (!token) return;

    getReasonReq({
      requestConfig: {
        url: "/cancellation/reasons/for_buyer/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res: any) => {
        console.log("reasons fectched", res);
        setReasons(res.data);
        handleClick();
      },
    });
  };

  const handleClick = () => {
    if (reasons.length) {
      setOpen((p) => !p);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && orderId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
              <motion.div
                className={`relative bg-white shadow-xl w-full max-w-128 h-fit rounded-t-2xl md:rounded-xl p-6 md:p-8 space-y-c32 ${className}`}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-MontserratSemiBold text-base text-000000">
                    {isDispute ? "Cancel dispute" : "Cancel your order"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X size={24} className="text-black" />
                  </button>
                </div>

                {/* Body */}
                <div className=" ">
                  <p className="pb-2 text-c12  font-MontserratMedium text-gray-600">
                    {isDispute
                      ? " Reason for cancelling (optional)"
                      : " Reason for cancelling"}
                  </p>

                  {isDispute ? (
                    <Input
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                    />
                  ) : (
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => {
                          // opens dropdown
                          fetcheReasons(); // optional: fetch from API
                        }}
                        className="flex w-full items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-ff715b focus:outline-none"
                      >
                        <span
                          className={
                            reasons
                              ? "text-gray-900 font-MontserratMedium text-left text-c12 "
                              : "text-black/64 font-MontserratMedium text-left text-c12"
                          }
                        >
                          {selectedReason?.title || "Select a reason"}
                        </span>

                        {loadinReason ? (
                          <LoadingSpinner color="border-ff715b" />
                        ) : (
                          <ChevronDown
                            size={18}
                            className={`transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {open && (
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
                                  setOpen(false);
                                }}
                                className="block w-full px-3 py-2 font-MontserratMedium text-left text-c12 text-gray-700 hover:bg-gray-100"
                              >
                                {item.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {selectedReason?.requires_additional_info && (
                        <textarea
                          value={additionalNote}
                          onChange={(e) => setAdditionalNote(e.target.value)}
                          placeholder="Please provide more details"
                          className="mt-3 w-full border rounded-c8 p-3 text-sm"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end ">
                  <Button
                    disabled={loading || (!isDispute && !selectedReason)}
                    onClick={handleCancelOrder}
                    className="w-full max-w-28.5"
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
        isOpen={success}
        title={
          isDispute
            ? "Dispute cancelled successfully"
            : "Order cancelled successfully"
        }
        message={
          isDispute
            ? "Your dispute has been cancelled."
            : "Your order has been cancelled."
        }
        discRescription={
          isDispute
            ? "You will receive an email confirmation and any updates regarding your order."
            : "Any payment made will be refunded according to our refund policy."
        }
        onConfirm={() => router.push("/dashboard/buyer/orders")}
        buttenText="Back to Orders"
      />
    </>
  );
}
