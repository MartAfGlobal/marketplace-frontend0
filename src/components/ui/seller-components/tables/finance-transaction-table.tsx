"use client";
import React from "react";
import { useAppSelector } from "@/store/Provider";
import type { Transaction } from "@/store/finance/transactionsSlice";

export type FinanceTransactionsTableProps = {
  onPageChange?: (page: number) => void;
  filters?: {
    status?: string;
    search?: string;
    [key: string]: any;
  };
};

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(raw: string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatAmount(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return `N${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStatusStyle(status: string | undefined): string {
  switch ((status ?? "").toLowerCase()) {
    case "completed":
    case "success":
      return "bg-green-50 text-green-600 border-green-100";
    case "pending":
      return "bg-orange-50 text-orange-600 border-orange-100";
    case "failed":
    case "reversed":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FinanceTransactionsTable({ filters }: FinanceTransactionsTableProps) {
  const { items, loading, error } = useAppSelector((state) => state.transactions);

  const displayedItems = React.useMemo(() => {
    let result = items;
    if (filters?.status) {
      result = result.filter(
        (row) => (row.status ?? "").toLowerCase() === filters.status?.toLowerCase()
      );
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      if (q) {
        result = result.filter(
          (row) =>
            row.transaction_id?.toLowerCase().includes(q) ||
            (typeof row.description === "string" && row.description.toLowerCase().includes(q)) ||
            (typeof row.type === "string" && row.type.toLowerCase().includes(q))
        );
      }
    }
    return result;
  }, [items, filters]);

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <span className="text-[11px] font-MontserratMedium text-[#999999] animate-pulse">
          Loading transactions…
        </span>
      </div>
    );
  }

  if (error && !error.includes("401")) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <span className="text-[11px] font-MontserratMedium text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#947FFF] text-ffffff">
          <tr className="text-[10px] font-MontserratBold py-3 text-ffffff">
            <th className="p-3 whitespace-nowrap">Date &amp; time</th>
            <th className="p-3 whitespace-nowrap">Transaction ID</th>
            <th className="p-3 whitespace-nowrap">Type</th>
            <th className="p-3 whitespace-nowrap">Amount</th>
            <th className="p-3 whitespace-nowrap">Status</th>
            <th className="p-3 whitespace-nowrap">Linked entity</th>
            <th className="p-3 whitespace-nowrap">Description</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems.map((row: Transaction) => (
            <tr
              key={row.transaction_id}
              className="hover:bg-[#fcfcfc] transition-colors border-b border-gray-50"
            >
              <td className="p-3 text-[11px] font-MontserratMedium text-[#666666] whitespace-nowrap">
                {formatDate(row.date as string)}
              </td>
              <td className="p-3 text-[11px] font-MontserratSemiBold text-[#161616] whitespace-nowrap">
                {row.transaction_id}
              </td>
              <td className="p-3 text-[11px] font-MontserratMedium text-[#999999]">
                {(row.type as string) ?? "—"}
              </td>
              <td className="p-3 text-[11px] font-MontserratBold text-[#161616] font-inter whitespace-nowrap">
                {formatAmount(row.amount)}
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-[9px] font-MontserratBold border ${getStatusStyle(row.status as string)}`}
                >
                  {row.status ?? "—"}
                </span>
              </td>
              <td className="p-3 text-[11px] font-MontserratMedium text-[#999999]">
                {(row.linked_entity as string) ?? "—"}
              </td>
              <td className="p-3 text-[11px] font-MontserratMedium text-[#666666]">
                {(row.description as string) ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && displayedItems.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[11px] font-MontserratMedium text-[#999999]">
            No transactions found.
          </p>
        </div>
      )}
    </div>
  );
}
