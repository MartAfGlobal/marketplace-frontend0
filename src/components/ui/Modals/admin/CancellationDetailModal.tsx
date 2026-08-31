"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Clock3, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import { CancellationRequestRow } from "@/components/admin-components/orders/CancellationRequestsTable";

interface CancellationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CancellationRequestRow | null;
  onApprove?: (request: CancellationRequestRow) => void;
  onReject?: (request: CancellationRequestRow) => void;
}

export default function CancellationDetailModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}: CancellationDetailModalProps) {
  if (!isOpen || !request) return null;

  const raw = request.raw ?? {};
  const statusKey = (raw.status || request.status || "pending").toLowerCase();

  const requestedBy = raw.requested_by ?? {};
  const staffName = requestedBy.name || request.requestedBy || "Staff Member";
  const staffEmail = requestedBy.email || request.requestedByEmail || "";
  const staffId = requestedBy.id || "";

  const paymentNo = raw.payment_no || request.orderId || "—";
  const paymentId = raw.payment || request.paymentId || "";

  const reasonTitle = raw.reason_title || request.reasonTitle || "Cancellation";
  const moreInformation = raw.more_information || request.moreInfo || "";
  const rejectionNotes = raw.rejection_notes || null;

  const reviewedBy = raw.reviewed_by;
  const reviewedAt = raw.reviewed_at
    ? new Date(raw.reviewed_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const isWholeOrder =
    raw.is_whole_order != null ? raw.is_whole_order : true;
  const itemsSummary = Array.isArray(raw.items_summary) ? raw.items_summary : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-xl flex flex-col w-full max-w-[540px] max-h-[90vh] rounded-c16 p-8 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-3">
                  <h2 className="text-c18 font-MontserratSemiBold text-[#161616]">
                    Cancellation Request Details
                  </h2>
                  {statusKey === "approved" && (
                    <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
                      
                      Approved
                    </span>
                  )}
                  {(statusKey === "rejected" || statusKey === "cancelled") && (
                    <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
                      
                      {statusKey === "rejected" ? "Rejected" : "Cancelled"}
                    </span>
                  )}
                  {statusKey === "pending" && (
                    <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
                     
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto space-y-0 hcustom-scroll pr-1 my-2">
                {/* Metadata Rows */}
                <div className="py-5 space-y-4 border-b border-[#F0F0F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-MontserratNormal text-[#161616]/60">
                      Order / Payment No
                    </span>
                    <span className="text-sm font-MontserratMedium text-[#161616]">
                      {paymentNo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-MontserratNormal text-[#161616]/60">
                      Request ID
                    </span>
                    <span className="text-sm font-MontserratMedium text-[#161616] break-all max-w-[280px] text-right text-xs">
                      {raw.id || request.id || "—"}
                    </span>
                  </div>

                  {/* Staff Request Info */}
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-MontserratNormal text-[#161616]/60 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#947FFF]" />
                      Requested By (Staff)
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-MontserratMedium text-[#161616] block">
                        {staffName}
                      </span>
                      {staffEmail && (
                        <span className="text-xs font-MontserratNormal text-[#161616]/60 block">
                          {staffEmail}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-MontserratNormal text-[#161616]/60">
                      Request Scope
                    </span>
                    <span className="text-sm font-MontserratMedium text-[#161616]">
                      {isWholeOrder ? "Whole Order" : "Item Subset"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-MontserratNormal text-[#161616]/60">
                      Date Requested
                    </span>
                    <span className="text-sm font-MontserratMedium text-[#161616]">
                      {request.date}
                    </span>
                  </div>

                  {reviewedBy && (
                    <div className="flex items-start justify-between pt-2">
                      <span className="text-sm font-MontserratNormal text-[#161616]/60 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#00BE5C]" />
                        Reviewed By
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-MontserratMedium text-[#161616] block">
                          {reviewedBy.name || reviewedBy.email || "Admin"}
                        </span>
                        {reviewedAt && (
                          <span className="text-xs font-MontserratNormal text-[#161616]/60 block">
                            {reviewedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reason Title & Additional Info */}
                <div className="py-5 border-b border-[#F0F0F0]">
                  <p className="text-sm font-MontserratMedium text-[#161616]/70 mb-2">
                    Reason
                  </p>
                  <div className="border border-000000/4 rounded-c8 p-3.5 text-xs font-MontserratNormal text-[#161616] leading-relaxed">
                    <p className="font-MontserratSemiBold text-[#161616] mb-1">
                      {reasonTitle}
                    </p>
                    {moreInformation && (
                      <p className="text-000000/68 mt-1 whitespace-pre-line">
                        {moreInformation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rejection Notes (if rejected) */}
                {rejectionNotes && (
                  <div className="py-5 border-b border-[#F0F0F0]">
                    <p className="text-sm font-MontserratMedium text-[#CA0202] mb-2">
                      Admin Rejection Notes
                    </p>
                    <div className="bg-[#FFF5F5] border border-[#FCD8DC] rounded-c8 p-3.5 text-xs font-MontserratNormal text-[#CA0202] leading-relaxed">
                      {rejectionNotes}
                    </div>
                  </div>
                )}

                {/* Items Summary (if subset) */}
                {itemsSummary.length > 0 && (
                  <div className="py-5 border-b border-[#F0F0F0]">
                    <p className="text-sm font-MontserratMedium text-[#161616]/70 mb-3">
                      Requested Items ({itemsSummary.length})
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto hcustom-scroll pr-1">
                      {itemsSummary.map((item: any, idx: number) => {
                        const itemTitle =
                          item.product_title ||
                          item.title ||
                          item.name ||
                          `Item ${idx + 1}`;
                        const itemQty = item.quantity ?? 1;
                        const itemPrice =
                          item.price ?? item.unit_price ?? item.total_price;
                        const itemImage = item.image || item.thumbnail;

                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 bg-[#F9FAFB] rounded-c8 border border-[#E5E7EB] text-xs"
                          >
                            {itemImage && (
                              <Image
                                src={itemImage}
                                alt={itemTitle}
                                width={36}
                                height={36}
                                className="rounded-md object-cover w-9 h-9 border border-[#E5E7EB]"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-MontserratMedium truncate text-[#161616]">
                                {itemTitle}
                              </p>
                              <span className="text-[#161616]/60">
                                Qty: {itemQty}
                              </span>
                            </div>
                            {itemPrice != null && (
                              <span className="font-MontserratSemiBold text-[#161616]">
                                ₦{Number(itemPrice).toLocaleString()}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-[#F0F0F0]">
                {statusKey === "pending" ? (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="secondary"
                      className=""
                      onClick={() => {
                        onClose();
                        onReject?.(request);
                      }}
                    >
                      Reject Request
                    </Button>
                    <Button
                      className=""
                      onClick={() => {
                        onClose();
                        onApprove?.(request);
                      }}
                    >
                      Approve Request
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full border-[#E5E7EB] text-[#161616] hover:bg-gray-50 h-c44 rounded-c8 font-MontserratMedium text-sm"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
