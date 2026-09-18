"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export interface DisputeItem {
  id: string;
  dispute_id?: string;
  product_name?: string;
  product_image?: string;
  date?: string;
  status?: string;
}

interface OrderDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputes: DisputeItem[];
  onView?: (dispute: DisputeItem) => void;
}

function formatDisputeDate(raw?: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day}${suffix} ${month}, ${d.getFullYear()}`;
}

function DisputeStatusBadge({ status }: { status?: string }) {
  const s = (status ?? "").trim().toLowerCase();
  if (s === "pending" || s === "open")
    return (
      <span className="text-[#FFAC06] text-[11px] font-MontserratMedium">
        Pending
      </span>
    );
  if (s === "closed")
    return (
      <span className="text-[#000000]/68 text-[10px] tracking-[2%] font-MontserratNormal">
        Closed
      </span>
    );
  if (s === "approved" || s === "resolved" || s === "accepted")
    return (
      <span className="text-[#2D7565] text-[10px] tracking-[2%] font-MontserratNormal">
        Approved
      </span>
    );
  if (s === "rejected" || s === "declined")
    return (
      <span className="text-[#CA0202] text-[10px] tracking-[2%] font-MontserratNormal">
        Rejected
      </span>
    );
  return (
    <span className="text-[#000000]/44 text-[10px] tracking-[2%] font-MontserratNormal">
      {status ?? "—"}
    </span>
  );
}

export default function OrderDisputeModal({
  isOpen,
  onClose,
  disputes,
  onView,
}: OrderDisputeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dispute-dropdown"
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-[452px] bg-white rounded-[16px] shadow-customW py-6 px-8 z-50 space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-MontserratNormal text-000000 tracking-tight">
              Order disputes
            </h2>
            {disputes.length > 0 && (
              <span className="w-6 h-6 rounded-full bg-ff715b text-white text-[12px] font-MontserratNormal flex items-center justify-center">
                {disputes.length}
              </span>
            )}
          </div>

          {/* Dispute Cards List */}
          <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto wno-scrollbar">
            {disputes.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-xs font-MontserratNormal text-000000/44">
                  No disputes found.
                </p>
              </div>
            ) : (
              disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="flex items-center justify-between  bg-white border border-000000/12 rounded-[8px] px-3 py-2 hover:border-000000/24 transition-colors"
                >
                  {/* Left: Product Image */}
                  <div className="flex gap-3 items-center max-w-[200px]">
                    <div className="w-[64px] h-[64px]  overflow-hidden  flex-shrink-0 flex items-center justify-center">
                      {dispute.product_image ? (
                        <Image
                          src={dispute.product_image}
                          alt={dispute.product_name ?? "Product"}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F5F5F7] rounded-[10px]" />
                      )}
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-[12px] tracking-[2%] leading-[20px] font-MontserratNormal text-000000/68 truncate " title ={dispute.dispute_id}>
                        {dispute.dispute_id}
                      </span>
                      <span className="text-[10px] leading-[16px] tracking-[2%] font-MontserratNormal text-000000/68 mb-1">
                        {formatDisputeDate(dispute.date)}
                      </span>
                      <DisputeStatusBadge status={dispute.status} />
                    </div>
                  </div>

                  {/* Right: View action */}
                  <button
                    type="button"
                    onClick={() => onView?.(dispute)}
                    className="text-ff715b text-sm font-MontserratNormal hover:opacity-80 transition-opacity flex-shrink-0 cursor-pointer leading-[21px] tracking-[1%]"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
