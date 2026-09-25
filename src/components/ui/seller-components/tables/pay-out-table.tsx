"use client";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import EyeIcon from "@/assets/icons/eye.png";
import Empty from "@/assets/Seller/Empty.svg";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TransactionDetailSideModal from "@/components/ui/Modals/seller/TransactionDetailSideModal";
import type { Transaction } from "@/store/finance/transactionsSlice";

export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  statusFilter?: string;
  onFilteredCountChange?: (count: number) => void;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: { min?: number; max?: number };
    search?: string;
  };
};

function getStatusStyle(status: string | undefined): string {
  switch ((status ?? "").toLowerCase().trim()) {
    case "completed":
    case "success":
    case "paid":
    case "approved":
      return "text-[#2D7565] bg-[#2D7565]/20 border border-[#2D7565]/30";
    case "pending":
    case "awaiting approval":
    case "under review":
    case "submitted":
      return "text-[#FFAC06] bg-[#FFAC06]/10 border border-[#FFAC06]/30";
    case "in progress":
    case "processing":
    case "fulfilled":
      return "text-[#0070E9] bg-[#0070E9]/10 border border-[#0070E9]/30";
    case "failed":
    case "reversed":
    case "cancelled":
    case "rejected":
      return "text-[#CA0202] bg-[#CA0202]/10 border border-[#CA0202]/30";
    case "on hold":
    case "disputed":
      return "text-[#E8334A] bg-[#E8334A]/10 border border-[#E8334A]/30";
    default:
      return "text-gray-600 bg-gray-50 border border-gray-200";
  }
}

export default function PayOutTable({
  currentPage,
  rowsPerPage,
  filters = {},
  statusFilter: externalFilter = "all",
  onFilteredCountChange = () => {},
}: InventoryFullTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside() {
      setActiveDropdownId(null);
    }
    if (activeDropdownId !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdownId]);

  // dataset
  const allRows = Array.from({ length: 95 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      dateTime: "28/10/2012 5:39PM",
      transactionid: `TX998234523-${i + 1}`,
      amount: `N${30000 + i * 5000}`,
      status: [
        "Completed",
        "Pending",
        "Failed",
        "Reversed",
        "In Progress",
        "Awaiting Approval",
        "On Hold",
        "Under Review",
        "Cancelled",
      ][i % 9],
      perc,
      withdrawnTo: "Bank account - 074******324",
      description: `${10 + (i % 20)}% fee on ₦${(5000 + i * 1000).toLocaleString()}`,
      sku: `SKU${i + 100}`,
      stock,
    };
  });

  // apply filters
  let filteredRows = allRows;

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredRows = filteredRows.filter(
      (row) =>
        row.transactionid.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term) ||
        row.description.toLowerCase().includes(term)
    );
  }

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter((row) => {
      const rowDate = new Date(row.dateTime);
      return (
        rowDate >= new Date(filters.date!.start) &&
        rowDate <= new Date(filters.date!.end)
      );
    });
  }

  if (filters.perc) {
    filteredRows = filteredRows.filter((row) => row.perc >= filters.perc!);
  }

  if (filters.sku) {
    filteredRows = filteredRows.filter((row) =>
      row.sku.toLowerCase().includes(filters.sku!.toLowerCase())
    );
  }

  if (filters.qty) {
    filteredRows = filteredRows.filter(
      (row) =>
        (filters.qty!.min ? row.stock >= filters.qty!.min : true) &&
        (filters.qty!.max ? row.stock <= filters.qty!.max : true)
    );
  }

  // status filter
  if (externalFilter !== "all") {
    filteredRows = filteredRows.filter(
      (row) => row.status.toLowerCase() === externalFilter.toLowerCase()
    );
  }

  // notify parent
  useEffect(() => {
    onFilteredCountChange(filteredRows.length);
  }, [filteredRows, onFilteredCountChange]);

  // pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const handleOpenDetails = (row: typeof allRows[0]) => {
    const tx: Transaction = {
      transaction_id: row.transactionid,
      date: row.dateTime,
      amount: row.amount.replace("N", "").replace("₦", ""),
      type: "Payout",
      category: "Withdrawal",
      transaction_type: "Debit",
      status: row.status,
      linked_entity: row.withdrawnTo,
      description: row.description,
      transaction_fee: "0.00",
      running_balance: "430000.00",
    };
    setSelectedTransaction(tx);
    setIsDrawerOpen(true);
    setActiveDropdownId(null);
  };

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-6">
        {currentRows.length > 0 ? (
          currentRows.map((row) => (
            <div
              key={row.id}
              className="py-3 flex flex-col gap-3 justify-center border-b border-gray-100 last:border-0"
            >
              <div className="flex pl-1 pr-1 items-center justify-between">
                <div
                  className="flex flex-col cursor-pointer flex-1"
                  onClick={() => handleOpenDetails(row)}
                >
                  <span className="font-MontserratSemiBold text-sm text-[#000000]">
                    {row.transactionid}
                  </span>
                  <span className="font-MontserratNormal text-[11px] text-[#000000]/50 mt-0.5">
                    {row.dateTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-MontserratBold capitalize ${getStatusStyle(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-pointer p-0.5 hover:bg-gray-100 rounded"
                    onClick={() => handleOpenDetails(row)}
                  >
                    <Image src={HandBug} alt="actions" width={20} height={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-[#000000] font-MontserratNormal text-c12">Amount</span>
                  <span className="font-MontserratBold text-[#000000] text-sm">{row.amount}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-[#000000] font-MontserratNormal text-c12">Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-MontserratBold capitalize ${getStatusStyle(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-[#000000] font-MontserratNormal text-c12">Withdrawn to</span>
                  <span className="font-MontserratSemiBold text-[#000000] text-xs">{row.withdrawnTo}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-[#000000] font-MontserratNormal text-c12">Description</span>
                  <span
                    className="font-MontserratMedium text-[#666666] text-xs text-right max-w-[200px] truncate"
                    title={row.description}
                  >
                    {row.description}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={18} width={18} alt="empty" />
            <p className="text-base font-MontserratNormal text-[#000000]/20">
              No payouts available
            </p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
            <tr className="h-10">
              <th className="p-3 text-left">Date & time</th>
              <th className="p-3 text-left">Transaction ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Withdrawn to</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 w-10 text-center"></th>
            </tr>
          </thead>

          <tbody className="mt-3">
            <tr className="h-3"></tr>
            {currentRows.map((row) => {
              const isDropdownOpen = activeDropdownId === row.id;

              return (
                <tr
                  key={row.id}
                  className="h-10 text-c12 font-MontserratSemiBold text-000000/60 hover:bg-gray-50/50"
                >
                  <td className="px-3 pt-3 pb-6 text-left">{row.dateTime}</td>
                  <td className="px-3 pt-3 pb-6 text-left">{row.transactionid}</td>
                  <td className="px-3 pt-3 pb-6 text-left">{row.amount}</td>
                  <td className="px-3 pt-3 pb-6 text-left">
                    <span className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize px-3 py-1 rounded-full w-fit inline-block ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 pt-3 pb-6 text-left">{row.withdrawnTo}</td>
                  <td className="px-3 pt-3 pb-6">{row.description}</td>
                  <td className="px-3 pt-3 pb-6 text-center relative">
                    <button
                      type="button"
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(isDropdownOpen ? null : row.id);
                      }}
                      title="Actions"
                    >
                      <Image
                        src={HandBug}
                        alt="side button"
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                      />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          key="dropdown"
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 mt-2 w-36 text-nowrap text-[#000000]/65 text-c12 flex flex-col gap-2 py-2 px-3 font-MontserratNormal bg-white rounded-xl shadow-lg border border-gray-100 z-40"
                        >
                          <button
                            type="button"
                            className="flex items-center gap-2.5 w-full text-[#FF715B] hover:bg-gray-50 py-1.5 px-2 rounded-lg text-left cursor-pointer transition-colors"
                            onClick={() => handleOpenDetails(row)}
                          >
                            <Image src={EyeIcon} alt="view details" width={14} height={10} />
                            <span className="text-xs font-MontserratMedium">View Details</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              );
            })}
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


