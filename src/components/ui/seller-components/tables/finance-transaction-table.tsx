"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "@/store/Provider";
import type { Transaction } from "@/store/finance/transactionsSlice";
import Empty from "@/assets/Seller/Empty.svg";
import HandBug from "@/assets/Seller/handBug.png";
import EyeIcon from "@/assets/icons/eye.png";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TransactionDetailSideModal from "@/components/ui/Modals/seller/TransactionDetailSideModal";

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
  return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStatusStyle(status: string | undefined): string {
  switch ((status ?? "").toLowerCase()) {
    case "completed":
    case "success":
      return "text-green-600 ";
    case "pending":
      return " text-orange-600 ";
    case "failed":
    case "reversed":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FinanceTransactionsTable({ filters }: FinanceTransactionsTableProps) {
  const { items, loading, error } = useAppSelector((state) => state.transactions);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside() {
      setActiveDropdownId(null);
    }
    if (activeDropdownId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdownId]);

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
            (typeof row.type === "string" && row.type.toLowerCase().includes(q)) ||
            (typeof row.transaction_type === "string" && row.transaction_type.toLowerCase().includes(q)) ||
            (typeof row.category === "string" && row.category.toLowerCase().includes(q))
        );
      }
    }
    return result;
  }, [items, filters]);

  const handleOpenDetails = (row: Transaction) => {
    setSelectedTransaction(row);
    setIsDrawerOpen(true);
    setActiveDropdownId(null);
  };

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
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-6">
        {displayedItems.length > 0 ? (
          displayedItems.map((row: Transaction) => {
            const rowId = String(row.transaction_id || row.id);
            const isExpanded = activeRowId === rowId;
            const txType = ((row.transaction_type || row.type || "—") as string);
            const isCredit = txType.toLowerCase().includes("credit");
            const isDebit = txType.toLowerCase().includes("debit");

            return (
              <div
                key={rowId}
                className="py-3 flex flex-col gap-3 justify-center border-b border-gray-100 last:border-0"
              >
                {/* Header item */}
                <div className="flex pl-1 pr-1 items-center justify-between">
                  <div
                    className="flex flex-col cursor-pointer flex-1"
                    onClick={() => handleOpenDetails(row)}
                  >
                    <span className="font-MontserratSemiBold text-sm text-[#000000]">
                      {row.transaction_id}
                    </span>
                    <span className="font-MontserratNormal text-[11px] text-[#000000]/50 mt-0.5">
                      {formatDate((row.created_at || row.date) as string)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-MontserratBold border ${getStatusStyle(
                        row.status as string
                      )}`}
                    >
                      {row.status ?? "—"}
                    </span>
                    <button
                      type="button"
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-pointer p-0.5 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDetails(row)}
                      title="View transaction details"
                    >
                      <Image src={HandBug} alt="actions" width={20} height={20} />
                    </button>
                    <ChevronRight
                      size={18}
                      className={`text-[#000000]/40 transition-transform duration-200 cursor-pointer ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      onClick={() => setActiveRowId(isExpanded ? null : rowId)}
                    />
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 p-3 bg-[#FAFAFA] rounded-xl border border-gray-100 text-xs font-MontserratNormal mb-2">
                        {Boolean(row.category) && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#000000]/60">Category:</span>
                            <span className="font-MontserratSemiBold text-[#000000]">
                              {row.category as string}
                            </span>
                          </div>
                        )}
                        {Boolean(row.reference) && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#000000]/60">Reference:</span>
                            <span className="font-MontserratMedium text-[#000000] truncate max-w-[180px]">
                              {row.reference as string}
                            </span>
                          </div>
                        )}
                        {row.transaction_fee !== undefined && row.transaction_fee !== null && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#000000]/60">Fee:</span>
                            <span className="font-MontserratSemiBold text-[#000000]">
                              {formatAmount(row.transaction_fee as string)}
                            </span>
                          </div>
                        )}
                        {Boolean(row.running_balance) && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#000000]/60">Running balance:</span>
                            <span className="font-MontserratSemiBold text-[#000000]">
                              {formatAmount(row.running_balance as string)}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 w-full py-2 mt-2 bg-[#FF715B]/10 text-[#FF715B] rounded-lg text-xs font-MontserratSemiBold cursor-pointer hover:bg-[#FF715B]/15 transition-colors"
                          onClick={() => handleOpenDetails(row)}
                        >
                          <Image src={EyeIcon} alt="view details" width={14} height={10} />
                          <span>View Transaction Details</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alternating Striped Rows */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Date &amp; time</span>
                    <span className="font-MontserratMedium text-[#666666] text-xs">
                      {formatDate((row.created_at || row.date) as string)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Type</span>
                    <span
                      className={`font-MontserratSemiBold text-sm ${
                        isCredit
                          ? "text-[#2D7565]"
                          : isDebit
                          ? "text-[#CA0202]"
                          : "text-[#000000]"
                      }`}
                    >
                      {txType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Amount</span>
                    <span className="font-MontserratBold text-[#000000] text-sm">
                      {formatAmount(row.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Status</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-MontserratBold border ${getStatusStyle(
                        row.status as string
                      )}`}
                    >
                      {row.status ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Linked entity</span>
                    <span className="font-MontserratSemiBold text-[#000000] text-xs">
                      {((row.linked_entity || row.linked_entity_type) as string) ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                    <span className="text-[#000000] font-MontserratNormal text-c12">Description</span>
                    <span
                      className="font-MontserratMedium text-[#666666] text-xs text-right max-w-[200px] truncate"
                      title={(row.description as string) || "—"}
                    >
                      {(row.description as string) ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={18} width={18} alt="empty" />
            <p className="text-base font-MontserratNormal text-[#000000]/20">
              No transactions found
            </p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block w-full h-fit overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="text-white font-MontserratSemiBold py-3 text-c12 bg-947fff h-12">
          <tr className="text-left">
            <th className="px-3 whitespace-nowrap">Date &amp; time</th>
            <th className="px-3 whitespace-nowrap">Transaction ID</th>
            <th className="px-3 whitespace-nowrap">Amount</th>
            <th className="px-3 whitespace-nowrap">Status</th>
            <th className="px-3 whitespace-nowrap">C/D</th>
            <th className="px-3 whitespace-nowrap">Linked entity</th>
            <th className="px-3 whitespace-nowrap">Description</th>
            <th className="px-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={8} className="h-1" /></tr>
          {displayedItems.map((row: Transaction) => {
            const rowId = String(row.transaction_id || row.id);
            const isDropdownOpen = activeDropdownId === rowId;

            return (
              <tr
                key={row.transaction_id}
                className="h-12 text-c12 font-MontserratSemiBold py-3 text-000000/60"
              >
                <td className="px-3 max-w-[135px] truncate">
                  {formatDate((row.created_at || row.date) as string)}
                </td>
                <td className="px-3 max-w-[114px] truncate">
                  {row.transaction_id}
                </td>
                <td className="px-3 max-w-[100px]">
                  {formatAmount(row.amount)}
                </td>
                <td className="px-3">
                  <div className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize px-3 py-1 rounded-full w-fit ${getStatusStyle(row.status as string)}`}>
                    {row.status ?? "—"}
                  </div>
                </td>
                <td className="px-3">
                  {((row.transaction_type || row.type) as string) ?? "—"}
                </td>
                <td className="px-3 text-ff715b/68">
                  {((row.linked_entity || row.linked_entity_type) as string) ?? "—"}
                </td>
                <td className="px-3 max-w-[220px] truncate">
                  {(row.description as string) ?? "—"}
                </td>
                <td className="px-3 text-center relative">
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdownId(isDropdownOpen ? null : rowId);
                    }}
                    title="Actions"
                  >
                    <Image src={HandBug} alt="actions" width={24} height={24} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-40 text-nowrap text-000000/65 text-c12 flex flex-col gap-3 py-2.5 px-4 font-MontserratNormal bg-white rounded-xl shadow-lg border z-40"
                      >
                        <button
                          type="button"
                          className="flex items-center gap-3 w-full text-ff715b hover:bg-gray-100"
                          onClick={() => handleOpenDetails(row)}
                        >
                          <Image src={EyeIcon} alt="view details" width={15} height={10} />
                          View Details
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            );
          })}

          {!loading && displayedItems.length === 0 && (
            <tr className="h-64">
              <td colSpan={8} className="text-center py-10">
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={48} width={48} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/20">No transactions found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Side Drawer Modal */}
      <TransactionDetailSideModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}

