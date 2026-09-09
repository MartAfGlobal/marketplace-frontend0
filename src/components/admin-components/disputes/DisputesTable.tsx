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
      {s === "PENDING" ? "Pending" : "Requested"}
    </span>
  );
};

interface DisputesTableProps {
  rows: DisputeTableRow[];
  selectedIds: string[];
  activeRowId: string | null;
  loading: boolean;
  showCaseId?: boolean;
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
  showCaseId = true,
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
      const isRefund = Boolean(row.refundType);
      router.push(
        `/dashboard/admin/orders/refund-dispute/${row.id}${
          isRefund ? "?type=refund" : "?type=dispute"
        }`
      );
    }
  };

  console.log("rows", rows);
  return (
    <div className="overflow-x-auto min-h-[250px] box-border">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
            {/* <th className=" text-xs font-MontserratSemiBold text-center w-10 p-3">
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
            </th> */}

            {showCaseId && (
              <th className="p-3 font-MontserratMedium text-xs leading-[1%]">Case ID</th>
            )}
            <th className="p-3 font-MontserratMedium text-xs leading-[1%]">Order ID</th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%] ">
              Buyer
            </th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%] ">
              Vendor
            </th>
            
            <th className="p-3 font-MontserratMedium text-xs leading-[1%]  text-center">
              Qty
            </th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%]">Amount</th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%]">Status</th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%]">Date</th>
            <th className="p-3 font-MontserratMedium text-xs leading-[1%] text-center w-10"></th>
          </tr>
        </thead>
        <tbody className="text-xs text-000000/68 font-MontserratMedium">
          {loading ? (
            <tr>
              <td colSpan={showCaseId ? 10 : 9} className="py-12 text-center">
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
                className="hover:bg-gray-50/50 transition-colors h-14 border-b border-000000/4 cursor-pointer"
              >
                {/* <td
                  className="py-3 px-4 font-MontserratMedium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-4 w-4 mx-auto items-center justify-center border transition-all duration-200 cursor-pointer ${
                      selectedIds.includes(row.id)
                        ? "border-[#ff715b] bg-[#ff715b]"
                        : "border-[#161616] hover:border-[#ff715b]"
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
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td> */}

                {showCaseId && (
                  <td className="py-3 px-4">
                    <span
                      className="block max-w-[100px] truncate font-MontserratMedium"
                      title={row.disputeNumber || `#${row.id.slice(0, 8)}`}
                    >
                      {row.disputeNumber || `#${row.id.slice(0, 8)}`}
                    </span>
                  </td>
                )}
                <td className="py-3 px-4">
                  <span
                    className="block max-w-[100px] truncate text-left font-MontserratMedium cursor-pointer"
                    title={row.orderId}
                  >
                    {row.orderId}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[140px] truncate" title={row.buyer}>
                    {row.buyer}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[124px] truncate" title={row.vendor}>
                    {row.vendor}
                  </span>
                </td>
              
                <td className="py-3 px-4 text-center">
                  <span className="block max-w-[50px] truncate">
                    {row.quantity != null ? row.quantity : row.raw?.affected_quantity ?? "—"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[100px] truncate" title={row.amount}>
                    {row.amount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {renderDisputeStatus(row.status)}
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[90px] truncate" title={row.date}>
                    {row.date}
                  </span>
                </td>
                <td
                  className="py-3 px-4 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      onSetActiveRowId(activeRowId === row.id ? null : row.id)
                    }
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
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
                          className="w-full flex items-center gap-2 hover:text-ff715b px-4 py-2 hover:bg-gray-50 text-000000/68 transition-colors"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showCaseId ? 10 : 9} className="py-16 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Image
                    src={HandBug}
                    alt="No disputes"
                    width={48}
                    height={48}
                    className="opacity-40"
                  />
                  <p className="text-xs font-MontserratMedium">
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
