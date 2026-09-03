"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  AlertTriangle,
  Eye,
  ExternalLink,
} from "lucide-react";
import type { DisputeTableRow } from "@/types/admin";

export const renderDisputeStatus = (status: string) => {
  const s = (status ?? "").trim().toUpperCase();

  if (
    s === "RESOLVED" ||
    s === "APPROVED" ||
    s === "COMPLETED" ||
    s === "SUCCESSFUL"
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium whitespace-nowrap">
        <CheckCircle2 size={13} />
        Resolved
      </span>
    );
  }

  if (s === "REJECTED" || s === "CANCELLED" || s === "DECLINED") {
    return (
      <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium whitespace-nowrap">
        <XCircle size={13} />
        Rejected
      </span>
    );
  }

  if (s === "ESCALATED") {
    return (
      <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium whitespace-nowrap">
        <AlertTriangle size={13} />
        Escalated
      </span>
    );
  }

  if (s === "OPEN" || s === "IN_PROGRESS" || s === "UNDER_REVIEW") {
    return (
      <span className="inline-flex items-center gap-1 text-[#0070E9] bg-[#0070E9]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium whitespace-nowrap">
        <Clock3 size={13} />
        Open
      </span>
    );
  }

  // Default: REQUESTED / PENDING
  return (
    <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium whitespace-nowrap">
      <Clock3 size={13} />
      Requested
    </span>
  );
};

interface DisputesTableProps {
  rows: DisputeTableRow[];
  selectedIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
  onViewDetails?: (row: DisputeTableRow) => void;
}

export default function DisputesTable({
  rows,
  selectedIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onSetActiveRowId,
  onViewDetails,
}: DisputesTableProps) {
  const router = useRouter();

  const handleRowClick = (row: DisputeTableRow) => {
    if (onViewDetails) {
      onViewDetails(row);
    } else {
      router.push(`/dashboard/admin/orders/refund-dispute/${row.id}`);
    }
  };

  console.log("rows", rows);
  return (
    <div className="overflow-x-auto min-h-[280px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 &&
                  rows.every((row) => selectedIds.includes(row.id))
                    ? "border-[#ff715b] bg-[#ff715b]"
                    : "border-white hover:border-[#ff715b]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-2.5 w-2.5 ${
                    rows.length > 0 &&
                    rows.every((row) => selectedIds.includes(row.id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 hover:opacity-100 hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>

            <th className="p-3 font-MontserratNormal text-sm">Case ID</th>
            <th className="p-3 font-MontserratNormal text-sm">Order ID</th>
            <th className="p-3 font-MontserratNormal text-sm min-w-[140px]">
              Buyer
            </th>
            <th className="p-3 font-MontserratNormal text-sm min-w-[124px]">
              Vendor
            </th>
            
            <th className="p-3 font-MontserratNormal text-sm min-w-[60px]">
              Qty
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Amount</th>
            <th className="p-3 font-MontserratNormal text-sm">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Date</th>
            <th className="p-3 font-MontserratNormal text-sm text-center w-10"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={11} className="py-16 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-[#ff715b]" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="h-16 hover:bg-[#FAF8F5] duration-300 border-b border-000000/4 cursor-pointer"
              >
                <td
                  className="text-center w-10 p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onToggleRow(row.id)}
                    className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                      selectedIds.includes(row.id)
                        ? "border-[#ff715b] bg-[#ff715b]"
                        : "border-[#605d5b] hover:border-[#ff715b]"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-2.5 w-2.5 ${
                        selectedIds.includes(row.id)
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 hover:opacity-100 hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>

                <td className="p-3 text-xs font-MontserratMedium max-w-25 truncate text-[#161616] whitespace-nowrap">
                  {row.disputeNumber || `#${row.id.slice(0, 8)}`}
                </td>
                <td className="p-3 text-xs text-[#6A0DAD] max-w-25 truncate font-MontserratMedium whitespace-nowrap">
                  {row.orderId}
                </td>
                <td className="p-3 text-xs font-MontserratMedium max-w-[140px] truncate text-[#161616]">
                  <div>{row.buyer}</div>
                  {row.buyerEmail && (
                    <div className="text-[11px] text-gray-400 font-MontserratNormal truncate max-w-[150px]">
                      {row.buyerEmail}
                    </div>
                  )}
                </td>
                <td className="p-3 text-xs font-MontserratMedium max-w-[140px] truncate text-[#161616]">
                  <div>{row.vendor}</div>
                  {row.vendorEmail && (
                    <div className="text-[11px] text-gray-400 font-MontserratNormal truncate max-w-[140px]">
                      {row.vendorEmail}
                    </div>
                  )}
                </td>
              
                <td className="p-3 text-xs font-MontserratMedium text-center text-[#161616]">
                  {row.quantity != null ? row.quantity : row.raw?.affected_quantity ?? "—"}
                </td>
                <td className="p-3 text-xs font-MontserratSemiBold  max-w-25 truncate text-[#161616] whitespace-nowrap">
                  {row.amount}
                </td>
                <td className="p-3  max-w-25 truncate">{renderDisputeStatus(row.status)}</td>
                <td className="p-3 text-xs whitespace-nowrap  max-w-25 truncate">{row.date}</td>
                <td
                  className="p-3 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      onSetActiveRowId(activeRowId === row.id ? null : row.id)
                    }
                    className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-3 top-12 z-30 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-left text-xs font-MontserratMedium"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            handleRowClick(row);
                          }}
                          className="w-full flex items-center  gap-2 hover:text-ff715b px-4 py-2 hover:bg-gray-50 text-[#161616] transition-colors"
                        >
                          <Eye size={14} className=" " />
                          <span className="">View Details</span>
                        </button>
                        {/* {row.orderId && row.orderId !== "—" && (
                          <button
                            onClick={() => {
                              onSetActiveRowId(null);
                              router.push(
                                `/dashboard/admin/orders/${encodeURIComponent(
                                  row.orderId,
                                )}`,
                              );
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-[#161616] transition-colors"
                          >
                            <ExternalLink
                              size={14}
                              className="text-[#6A0DAD]"
                            />
                            <span>View Order</span>
                          </button>
                        )} */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="py-16 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Image
                    src={HandBug}
                    alt="No disputes"
                    width={48}
                    height={48}
                    className="opacity-40"
                  />
                  <p className="text-sm font-MontserratMedium">
                    No disputes or refund requests found
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
