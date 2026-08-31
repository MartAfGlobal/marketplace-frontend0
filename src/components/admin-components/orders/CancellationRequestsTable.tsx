"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export interface CancellationRequestRow {
  id: string;
  orderId: string;
  paymentId?: string;
  requestedBy: string;
  requestedByEmail?: string;
  reasonTitle: string;
  moreInfo?: string;
  status: string;
  requestType: string;
  date: string;
  raw: any;
}

export function mapCancellationRequest(raw: any): CancellationRequestRow {
  const reqBy = raw.requested_by ?? raw.buyer ?? {};
  const reqByName =
    raw.requested_by?.name ||
    raw.buyer_name ||
    `${reqBy.first_name ?? ""} ${reqBy.last_name ?? ""}`.trim() ||
    reqBy.email ||
    "—";
  const reqByEmail = reqBy.email || raw.buyer_email || "";

  const orderId =
    raw.payment_no ||
    (raw.payment ? `ORD-${String(raw.payment).slice(0, 8).toUpperCase()}` : null) ||
    raw.order_id ||
    raw.order ||
    "—";

  const requestType =
    raw.is_whole_order != null
      ? raw.is_whole_order
        ? "Whole Order"
        : "Item Subset"
      : raw.request_type ?? "Whole Order";

  const reasonTitle =
    raw.reason_title ||
    raw.reason ||
    raw.cancellation_reason ||
    "—";

  return {
    id: String(raw.id ?? ""),
    orderId: String(orderId),
    paymentId: raw.payment ? String(raw.payment) : undefined,
    requestedBy: reqByName,
    requestedByEmail: reqByEmail,
    reasonTitle,
    moreInfo: raw.more_information || "",
    status: (raw.status ?? "pending").toLowerCase(),
    requestType,
    date: raw.created_at
      ? new Date(raw.created_at).toLocaleDateString("en-GB")
      : "—",
    raw,
  };
}

export const renderCancellationStatus = (status: string) => {
  const s = (status ?? "").trim().toLowerCase();

  if (s === "approved" || s === "accepted" || s === "successful") {
    return (
      <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <CheckCircle2 size={14} />
        Approved
      </span>
    );
  }

  if (s === "rejected" || s === "cancelled" || s === "canceled") {
    const label = s === "rejected" ? "Rejected" : "Cancelled";
    return (
      <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <XCircle size={14} />
        {label}
      </span>
    );
  }

  // Pending / default
  return (
    <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
      <Clock3 size={14} />
      Pending
    </span>
  );
};

interface CancellationRequestsTableProps {
  rows: CancellationRequestRow[];
  selectedIds?: string[];
  activeRowId?: string | null;
  loading: boolean;
  onSelectAll?: () => void;
  onToggleRow?: (id: string) => void;
  onSetActiveRowId?: (id: string | null) => void;
  onViewDetails?: (row: CancellationRequestRow) => void;
  onApprove?: (row: CancellationRequestRow) => void;
  onReject?: (row: CancellationRequestRow) => void;
}

export default function CancellationRequestsTable({
  rows,
  selectedIds = [],
  activeRowId = null,
  loading,
  onSelectAll,
  onToggleRow,
  onSetActiveRowId,
  onViewDetails,
  onApprove,
  onReject,
}: CancellationRequestsTableProps) {
  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
            {onSelectAll && (
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
            )}
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Date</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Order ID</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] w-[203.4]">
              Requested By
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">
              Request Type
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] max-w-[220px]">
              Reason
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Status</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] text-center"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={onSelectAll ? 8 : 7} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-[#ff715b]" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
                onClick={() => onViewDetails?.(row)}
              >
                {onToggleRow && (
                  <td
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
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className="block max-w-[90px] truncate" title={row.date}>
                    {row.date}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className="block max-w-[120px] truncate text-left font-MontserratMedium"
                    title={row.orderId}
                  >
                    {row.orderId}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="block max-w-[150px] truncate font-MontserratMedium" title={row.requestedBy}>
                      {row.requestedBy}
                    </span>
                    {row.requestedByEmail && (
                      <span className="block max-w-[150px] truncate text-[11px] text-000000/44" title={row.requestedByEmail}>
                        {row.requestedByEmail}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 capitalize">
                  <span className="block max-w-[120px] truncate">
                    {row.requestType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className="block max-w-[200px] truncate"
                    title={row.reasonTitle}
                  >
                    {row.reasonTitle}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {renderCancellationStatus(row.status)}
                </td>
                <td
                  className="py-3 px-4 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId?.(
                        activeRowId === row.id ? null : row.id
                      );
                    }}
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-4 mt-2 w-44 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId?.(null);
                            onViewDetails?.(row);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        {row.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                onSetActiveRowId?.(null);
                                onApprove?.(row);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[#00BE5C] transition-colors cursor-pointer"
                            >
                              Approve Request
                            </button>
                            <button
                              onClick={() => {
                                onSetActiveRowId?.(null);
                                onReject?.(row);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[#CA0202] transition-colors cursor-pointer"
                            >
                              Reject Request
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={onSelectAll ? 8 : 7}
                className="py-8 text-center font-MontserratMedium text-xs"
              >
                No cancellation requests found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
