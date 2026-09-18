"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Xicon from "@/assets/icons/X.svg";
import { Button } from "../../Button/Button";
import DisputReviewModal from "./DisputeReviewModal";
import ResultModal from "../../forms/resultModal";
import ConfirmDisputReviewModal from "./comfirmReviewModal";
import ConfirmRejectDisputeModal from "./ConfirmRejectDisputeModal";
import ConfirmDeliveryModal from "./ConfirmDeliveryModal";

interface DisputeDetailSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputeId: string | null;
  initialData?: any;
  onStatusUpdated?: () => void;
}

function formatStatus(statusStr?: string): {
  label: string;
  colorClass: string;
} {
  const s = (statusStr ?? "").trim().toLowerCase();
  if (
    s === "pending" ||
    s === "open" ||
    s === "return_requested" ||
    s === "dispute raised"
  ) {
    return { label: "Pending", colorClass: "text-[#FFAC06]" };
  }
  if (s === "approved" || s === "accepted") {
    return { label: "Approved", colorClass: "text-[#00BE5C]" };
  }
  if (s === "resolved") {
    return { label: "Resolved", colorClass: "text-[#00BE5C]" };
  }
  if (s === "rejected" || s === "declined") {
    return { label: "Rejected", colorClass: "text-[#CA0202]" };
  }
  if (s === "closed") {
    return { label: "Closed", colorClass: "text-[#000000]/44" };
  }
  return {
    label: statusStr
      ? statusStr.charAt(0).toUpperCase() + statusStr.slice(1)
      : "Pending",
    colorClass: "text-[#FFAC06]",
  };
}

export default function DisputeDetailSideModal({
  isOpen,
  onClose,
  disputeId,
  initialData,
  onStatusUpdated,
}: DisputeDetailSideModalProps) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token?.token);
  const {
    fetchAdminDisputeDetail,
    rejectAdminDispute,
    DisputeReviewConfirm,
    resolveAdminDispute,
    confirmReturnShippedToSeller,
    closeAdminDispute,
  } = AdminDetails();

  const [isReviewOpen, setReviewOpen] = useState(false);
  const [dispute, setDispute] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [recomfirmOpen, setReComfirmOpen] = useState(false);
  const [reviewSuccess, setReviewSucess] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [resolveWarningOpen, setResolveWarningOpen] = useState(false);
  const [resolveSuccess, setResolveSuccess] = useState(false);
  const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);
  const [confirmDeliverySuccess, setConfirmDeliverySuccess] = useState(false);
  const [closeWarningOpen, setCloseWarningOpen] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const [reviewPayload, setReviewPayload] = useState<{
    resolution_type: string;
    admin_notes: string;
  } | null>(null);

  useEffect(() => {
    if (initialData) {
      setDispute(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen && disputeId && token) {
      console.log(
        `[DisputeDetailSideModal] Fetching dispute details for UUID: ${disputeId}`,
      );
      setLoading(true);
      fetchAdminDisputeDetail(
        disputeId,
        (data: any) => {
          setLoading(false);
          const res = data?.data ?? data;
          console.log(
            `[DisputeDetailSideModal] Dispute detail response for UUID ${disputeId}:`,
            res,
          );
          setDispute(res);
        },
        (err: any) => {
          setLoading(false);
          console.error(
            `[DisputeDetailSideModal] Error fetching dispute detail for UUID ${disputeId}:`,
            err,
          );
        },
      );
    }
  }, [isOpen, disputeId, token]);

  if (!isOpen) return null;

  const displayId =
    dispute?.dispute_number ||
    dispute?.reference ||
    dispute?.id ||
    disputeId ||
    "N/A";

  const statusInfo = formatStatus(
    dispute?.status_display || dispute?.status || "Pending",
  );

  const reason =
    dispute?.reason_for_return ||
    dispute?.reason ||
    dispute?.return_reason ||
    dispute?.cancellation_reason_title ||
    dispute?.reason_display ||
    "Customer requested return for this order.";

  const disputeType =
    dispute?.resolution_type_display ||
    dispute?.dispute_type ||
    dispute?.resolution_type ||
    "Return/refund";

  const createdByName =
    dispute?.created_by_name ||
    (dispute?.buyer
      ? `${dispute.buyer.first_name ?? ""} ${dispute.buyer.last_name ?? ""}`.trim()
      : "") ||
    dispute?.buyer_name ||
    dispute?.user_name ||
    "Buyer";

  const additionalInfo =
    dispute?.description || "No additional information provided.";

  // Evidence images extraction

  const disputeEvidence = dispute?.evidence || [];

  console.log("hdhhshshsh", disputeEvidence);
  const evidenceList: string[] = (() => {
    const rawEv = dispute?.evidence || [];
    if (Array.isArray(rawEv)) {
      return rawEv
        .map((item: any) => {
          const val = typeof item === "string" ? item : item?.file_url || "";
          if (!val || typeof val !== "string") return "";
          const trimmed = val.trim();
          if (
            trimmed.startsWith("http://") ||
            trimmed.startsWith("https://") ||
            trimmed.startsWith("/") ||
            trimmed.startsWith("data:")
          ) {
            return trimmed;
          }
          return `/${trimmed}`;
        })
        .filter(Boolean);
    }
    return [];
  })();

  const rawProductImg =
    dispute?.product_image ||
    dispute?.item?.image ||
    dispute?.items?.[0]?.image ||
    dispute?.order_item?.image ||
    null;

  const productImage =
    typeof rawProductImg === "string" && rawProductImg.trim()
      ? rawProductImg.trim()
      : null;

  const handleFinalRejectConfirm = () => {
    const targetId = dispute?.id || disputeId;
    if (!targetId) {
      toast.error("Could not find dispute ID.");
      return;
    }

    setActionLoading(true);
    const idToReject = String(targetId);
    rejectAdminDispute(
      idToReject,
      { reason: "Dispute rejected by admin." },
      () => {
        setActionLoading(false);
        setRejectConfirmOpen(false);
        setRejectSuccess(true);
        onStatusUpdated?.();
      },
      (err: any) => {
        setActionLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to reject dispute. Please try again.",
        );
      },
    );
  };

  const handleReviewStep1Submit = (data: {
    resolution_type: string;
    admin_notes: string;
  }) => {
    setReviewPayload(data);
    setReviewOpen(false);
    setReComfirmOpen(true);
  };

  const handleFinalDisputeReviewConfirm = () => {
    const targetId = dispute?.id || disputeId;
    if (!targetId) {
      toast.error("Could not find dispute ID.");
      return;
    }
    if (!reviewPayload) {
      toast.error("Review details are missing. Please try again.");
      return;
    }

    setReviewing(true);
    DisputeReviewConfirm(
      String(targetId),
      reviewPayload,
      (_res: any) => {
        setReviewing(false);
        setReComfirmOpen(false);
        setReviewSucess(true);
        onStatusUpdated?.();
      },
      (err: any) => {
        setReviewing(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to submit dispute review. Please try again.",
        );
      },
    );
  };

  const handleConfirmResolve = () => {
    const targetId = dispute?.id || disputeId;
    if (!targetId) {
      toast.error("Could not find dispute ID.");
      return;
    }

    setActionLoading(true);
    resolveAdminDispute(
      String(targetId),
      () => {
        setActionLoading(false);
        setResolveWarningOpen(false);
        setResolveSuccess(true);
        onStatusUpdated?.();
      },
      (err: any) => {
        setActionLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to resolve dispute. Please try again.",
        );
      },
    );
  };

  const handleConfirmDelivery = (formData: FormData) => {
    const targetId = dispute?.id || disputeId;
    if (!targetId) {
      toast.error("Could not find dispute ID.");
      return;
    }

    setActionLoading(true);
    confirmReturnShippedToSeller(
      String(targetId),
      formData,
      () => {
        setActionLoading(false);
        setConfirmDeliveryOpen(false);
        setConfirmDeliverySuccess(true);
        setDispute((prev: any) => ({
          ...prev,
          return_delivery_confirmed: true,
        }));
        onStatusUpdated?.();
      },
      (err: any) => {
        setActionLoading(false);
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to confirm delivery. Please try again.",
        );
      },
    );
  };

  const handleConfirmClose = () => {
    const targetId = dispute?.id || disputeId;
    if (!targetId) {
      toast.error("Could not find dispute ID.");
      return;
    }

    setActionLoading(true);
    closeAdminDispute(
      String(targetId),
      () => {
        setActionLoading(false);
        setCloseWarningOpen(false);
        setCloseSuccess(true);
        setDispute((prev: any) => ({
          ...prev,
          status: "CLOSED",
          status_display: "Closed",
        }));
        onStatusUpdated?.();
      },
      (err: any) => {
        setActionLoading(false);
        setCloseWarningOpen(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to close dispute. Please try again.";
        toast.error(errMsg);
      },
    );
  };

  return (
    <>
      <AnimatePresence>
        <div
          key="dispute-detail-side-modal-backdrop"
          className="fixed inset-0 bg-black/40 flex items-center justify-end z-[9998] p-4 sm:pr-[29px]"
          onClick={onClose}
        >
        <motion.div
          initial={{ opacity: 0, x: 160 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 160 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white  flex flex-col w-full  space-y-8 p-8 max-w-[581px] rounded-[16px] relative max-h-[92vh] overflow-hidden"
        >
          {/* Header */}

          <div className="flex flex-col gap-1 ">
            <span className="text-[12px] font-MontserratNormal text-000000/44  leading-[20px] tracking-[2%]">
              Dispute ID
            </span>
            <h2 className="text-[20px] font-MontserratMedium text-000000  leading-[28px]">
              {displayId}
            </h2>
            <span
              className={`text-sm font-MontserratNormal ${statusInfo.colorClass}`}
            >
              {statusInfo.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className=" absolute top-[38px] right-[38px]   transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Image
              src={Xicon}
              alt="close"
              height={20}
              width={20}
              className=""
            />
          </button>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto    space-y-8 wno-scrollbar">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <LoadingSpinner size={32} />
                <p className="text-xs font-MontserratNormal text-000000/44">
                  Loading dispute details...
                </p>
              </div>
            ) : (
              <>
                {/* Reason for return */}
                <div className="space-y-2">
                  <h3 className="text-sm font-MontserratNormal leading-[21px] text-000000/44">
                    Reason for return
                  </h3>
                  <p className="text-base font-MontserratNormal text-000000 leading-[28px] tracking-[1%]">
                    {reason}
                  </p>
                </div>

                {/* Dispute type & Created by (2 columns) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="">
                    <span className="text-sm  leading-[21px] tracking-[1%] font-MontserratNormal text-000000/44">
                      Dispute type
                    </span>
                    <p className="text-base pt-2 font-MontserratNormal text-000000 leading-[24px] tracking-[1%]">
                      {disputeType}
                    </p>
                  </div>
                  <div className="">
                    <span className="text-sm  leading-[21px] tracking-[1%] font-MontserratNormal text-000000/44">
                      Created by
                    </span>
                    <p className="text-base pt-2 font-MontserratNormal text-000000 leading-[24px] tracking-[1%]">
                      {createdByName}
                    </p>
                  </div>
                </div>

                {/* Additional information */}
                <div className="space-y-2">
                  <h3 className="text-sm leading-[21px] tracking-[1%] font-MontserratNormal text-000000/44">
                    Additional information
                  </h3>
                  <p className="text-base font-MontserratNormal text-000000 leading-[24px] tracking-[1%]">
                    {additionalInfo}
                  </p>
                </div>

                {/* Evidence submitted Card */}
                <div className="bg-ffffff rounded-[16px]  border-[0.5px] border-000000/12 space-y-6">
                  <div className="flex items-center justify-between overflow-hidden rounded-tr-[16px] rounded-tl-[16px] py-4 px-6 bg-000000/4">
                    <span className="text-base  font-MontserratNormal leading-[21px] text-000000/68">
                      Evidence submitted
                    </span>
                    {productImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(productImage)}
                        className="text-base font-MontserratNormal text-[#FF715B] hover:underline cursor-pointer"
                      >
                        View product image
                      </button>
                    )}
                  </div>

                  {evidenceList.length === 0 ? (
                    <div className="py-6 flex items-center justify-center text-center">
                      <p className="text-xs font-MontserratNormal text-000000/40">
                        No evidence photos submitted.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 px-4 pb-6">
                      {/* {evidenceList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPreviewImage(imgUrl)}
                          className="w-[139px] h-[139px] justify-between  overflow-hidden bg-white relative cursor-pointer group border border-000000/6"
                        >
                         
                          <img
                            src={imgUrl}
                            alt={`Evidence ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display =
                                "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-MontserratMedium text-center p-1">
                            <Eye size={14} className="mb-0.5" />
                            <span>View image</span>
                          </div>
                        </div>
                      ))} */}
                      {disputeEvidence.map((items: any, index: number) => {
                        return (
                          <div
                            key={items.id}
                            onClick={() => setPreviewImage(items.file_url)}
                            className="w-[139px] h-[139px] justify-between overflow-hidden bg-white relative cursor-pointer group "
                          >
                            <Image
                              src={items.file_url}
                              alt={`evidence ${index}`}
                              width={139}
                              height={139}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className=" flex items-center  justify-end gap-4">
            {(dispute?.status === "RETURN_REQUESTED" ||
              dispute?.status === "PENDING" ||
              dispute?.status === "OPEN" ||
              dispute?.status === "dispute raised") && (
              <>
                <Button
                  variant="secodary danger"
                  type="button"
                  disabled={actionLoading || reviewing}
                  onClick={() => setRejectConfirmOpen(true)}
                  className="w-[154px]"
                >
                  Reject request
                </Button>
                <Button
                  type="button"
                  disabled={actionLoading || reviewing}
                  onClick={() => setReviewOpen(true)}
                  className="w-[160px] bg-[#FFAC06] hover:bg-[#e09805] text-white  font-MontserratMedium text-xs transition-colors cursor-pointer  disabled:opacity-50"
                >
                  Review request
                </Button>
              </>
            )}

            {dispute?.status_display === "Accepted" && (
              <Button
                type="button"
                disabled={actionLoading || reviewing}
                onClick={() => setResolveWarningOpen(true)}
                className="w-[203px] "
              >
                Confirm item's return
              </Button>
            )}

            {(() => {
              const statusUpper = (
                dispute?.status ||
                dispute?.status_display ||
                ""
              ).toUpperCase();
              const isResolvedOrApproved =
                statusUpper === "APPROVED" ||
                statusUpper === "RESOLVED" ||
                statusUpper === "ACCEPTED" ||
                dispute?.status_display === "Approved" ||
                dispute?.status_display === "Resolved";

              const resType = (
                dispute?.resolution_type ||
                dispute?.resolution_type_display ||
                dispute?.dispute_type ||
                ""
              ).toUpperCase();

              const isRefundBothParties =
                resType === "REFUND_BOTH_PARTIES" || resType.includes("BOTH");

              const isDeliveryConfirmed = Boolean(
                dispute?.return_delivery_confirmed ||
                dispute?.delivery_to_seller_confirmed ||
                dispute?.return_received_at_seller
              );

              const isClosed =
                statusUpper === "CLOSED" ||
                dispute?.status_display === "Closed";

              if (!isResolvedOrApproved || isClosed) return null;

              if (!isRefundBothParties && !isDeliveryConfirmed) {
                return (
                  <Button
                    type="button"
                    disabled={actionLoading || reviewing}
                    onClick={() => setConfirmDeliveryOpen(true)}
                    className="w-[203px]"
                  >
                    Confirm delivery
                  </Button>
                );
              }

              return (
                <Button
                  type="button"
                  disabled={actionLoading || reviewing}
                  onClick={() => setCloseWarningOpen(true)}
                  className="w-[146px] text-white"
                >
                  Close dispute
                </Button>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

        {/* Image Preview Lightbox */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-3 shadow-2xl flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white rounded-full p-1.5 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
                <img
                  src={previewImage}
                  alt="Evidence Preview"
                  className="max-w-full max-h-[75vh] object-contain rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DisputReviewModal
          onClose={() => setReviewOpen(false)}
          isOpen={isReviewOpen}
          DisputeId={displayId}
          onConfirm={handleReviewStep1Submit}
        />
        <ConfirmDisputReviewModal
          isOpen={recomfirmOpen}
          DisputeId={displayId}
          onClose={() => setReComfirmOpen(false)}
          onConfirm={handleFinalDisputeReviewConfirm}
          loading={reviewing}
        />
        <ConfirmRejectDisputeModal
          isOpen={rejectConfirmOpen}
          DisputeId={displayId}
          onClose={() => setRejectConfirmOpen(false)}
          onConfirm={handleFinalRejectConfirm}
          loading={actionLoading}
        />
        <ResultModal
          isOpen={resolveWarningOpen}
          result="warning"
          title="Confirm item's return?"
          message={`Submit confirmation that the return has been delivered for ${displayId}. This will resolve the dispute.`}
          discRescription="This will terminate/complete the return process and mark the dispute as resolved."
          buttenText="Confirm"
          loading={actionLoading}
          onCancel={() => setResolveWarningOpen(false)}
          onConfirm={handleConfirmResolve}
        />
        <ResultModal
          isOpen={resolveSuccess}
          result="success"
          title="Dispute Resolved"
          message="The item return has been confirmed and the dispute has been resolved."
          discRescription="Both buyer and seller have been notified that the dispute is resolved."
          buttenText="Okay"
          onConfirm={() => {
            setResolveSuccess(false);
            onClose();
          }}
          onCancel={() => {
            setResolveSuccess(false);
            onClose();
          }}
        />
        <ResultModal
          isOpen={reviewSuccess}
          result="success"
          title="Dispute Review Submitted"
          message="The dispute review decision has been recorded and the resolution process has been initiated."
          discRescription="Both buyer and seller have been notified of the resolution decision."
          buttenText="Okay"
          onConfirm={() => {
            setReviewSucess(false);
            onClose();
          }}
          onCancel={() => {
            setReviewSucess(false);
            onClose();
          }}
        />
        <ResultModal
          isOpen={rejectSuccess}
          result="success"
          title="Return Request Rejected"
          message="The return/refund request has been rejected and the process terminated."
          discRescription="Both buyer and seller have been notified of this rejection."
          buttenText="Okay"
          onConfirm={() => {
            setRejectSuccess(false);
            onClose();
          }}
          onCancel={() => {
            setRejectSuccess(false);
            onClose();
          }}
        />
        <ConfirmDeliveryModal
          isOpen={confirmDeliveryOpen}
          disputeId={displayId}
          onClose={() => setConfirmDeliveryOpen(false)}
          onConfirm={handleConfirmDelivery}
          loading={actionLoading}
        />
        <ResultModal
          isOpen={confirmDeliverySuccess}
          result="success"
          title="Delivery Confirmed"
          message="The returned item has been confirmed as shipped back to the seller."
          discRescription="The seller has been notified and the dispute record has been updated."
          buttenText="Okay"
          onConfirm={() => {
            setConfirmDeliverySuccess(false);
            onClose();
          }}
          onCancel={() => {
            setConfirmDeliverySuccess(false);
            onClose();
          }}
        />
        <ResultModal
          isOpen={closeWarningOpen}
          result="warning"
          title="Close dispute?"
          message={`Are you sure you want to close dispute ${displayId}?`}
          discRescription="Final step: seller confirms they've received the returned good back. No money moves here. Dispute status will become Closed."
          buttenText="Close"
          loading={actionLoading}
          onCancel={() => setCloseWarningOpen(false)}
          onConfirm={handleConfirmClose}
        />
        <ResultModal
          isOpen={closeSuccess}
          result="success"
          title="Dispute Closed"
          message="The dispute has been successfully closed."
          discRescription="The seller has confirmed receipt of returned goods, and this dispute is now finalized and marked as Closed."
          buttenText="Okay"
          onConfirm={() => {
            setCloseSuccess(false);
            onClose();
          }}
          onCancel={() => {
            setCloseSuccess(false);
            onClose();
          }}
        />
    </>
  );
}
