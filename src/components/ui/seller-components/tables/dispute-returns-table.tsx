"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import dotsIcon from "@/assets/icons/dots.png"; // Assuming there's a dots icon
import Empty from "@/assets/Seller/Empty.svg";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import EyeIcon from "@/assets/icons/eye.png";

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "text-[#0070E9] bg-[#0070E9]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "resolved":
      return "text-[#2D7565] bg-[#2D7565]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "escalated":
      return "text-[#CA0202] bg-[#CA0202]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "pending":
    case "requested":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-3 py-1 rounded-full w-fit mx-auto";
    default:
      return "text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit mx-auto";
  }
};

export type DisputeTableProps = {
  currentPage: number;
  rowsPerPage: number;
  data: any[];
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: { min?: number; max?: number };
    search?: string;
  };
  onFilteredCountChange: (count: number) => void;
};

export default function DisputeTable({
  currentPage,
  rowsPerPage,
  data = [],
  filters = {},
  onFilteredCountChange,
}: DisputeTableProps) {
  const router = useRouter();
  const [activeRowId, setActiveRowId] = useState<string | number | null>(null);
  console.log("DisputeTable received data:", data);
  // apply filters
  let filteredRows = data.map((item, index) => ({
    id: item.id || index,
    orderid: item.order_number || item.order_no || item.order_id || "N/A",
    date: item.created_at || item.date || "N/A",
    status: item.status_display || item.status || "Open",
    country: item.country || "Kenya",
    initiatedBy: item.buyer_name || item.initiated_by || item.initiator || "Buyer",
    amount: item.requested_refund_amount 
      ? `₦${item.requested_refund_amount.toLocaleString()}` 
      : (item.amount || (item.total_amount ? `₦${item.total_amount.toLocaleString()}` : "₦0")),
    type: item.dispute_type_display || item.type || "Refund",
    items: item.product_name || item.items_summary || item.items || "Multiple items",
  }));

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredRows = filteredRows.filter(
      (row) =>
        row.orderid.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term) ||
        row.date.toLowerCase().includes(term)
    );
  }

  // tell parent how many rows remain
  useEffect(() => {
    onFilteredCountChange(filteredRows.length);
  }, [filteredRows.length, onFilteredCountChange]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);
  console.log("DisputeTable currentRows:", currentRows);

  // checkbox state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const allPageSelected = currentRows.length > 0 && currentRows.every((r) => selectedRows.includes(r.id));

  const togglePage = () => {
    if (allPageSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentRows.some((r) => r.id === id))
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...currentRows.map((r) => r.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="mt-c32 w-full min-h-[400px] overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
          <tr>
            <th className="w-12 text-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={togglePage}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    allPageSelected
                      ? "bg-[#FF715B] border-0"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {allPageSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </label>
            </th>
            <th className="px-3 text-left">Order ID</th>
            <th className="px-3 text-left">Date</th>
            <th className="px-3 text-left">Items</th>
            <th className="px-3 text-center">Status</th>
            <th className="px-3 text-left">Country</th>
            <th className="px-3 text-left">Initiated by</th>
            <th className="px-3 text-left">Amount</th>
            <th className="px-3 text-left">Type</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
              <tr
                key={row.id}
                className="h-16 text-c12 font-MontserratBold text-000000/60 hover:bg-gray-50 transition-colors"
              >
                <td className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center ${
                        selectedRows.includes(row.id)
                          ? "bg-[#FF715B] border-0"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedRows.includes(row.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </label>
                </td>
                <td className="px-3">{row.orderid}</td>
                <td className="px-3">
                  {new Date(row.date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-3">{row.items}</td>
                <td className="px-3 text-center">
                  <div className={getStatusClass(row.status)}>{row.status}</div>
                </td>
                <td className="px-3">{row.country}</td>
                <td className="px-3">{row.initiatedBy}</td>
                <td className="px-3">{row.amount}</td>
                <td className="px-3">{row.type}</td>
                <td className="px-3 text-center relative">
                  <button
                    className="w-6 h-6 flex-shrink-0 mx-auto"
                    onClick={() =>
                      setActiveRowId((prev) => (prev === row.id ? null : row.id))
                    }
                  >
                    <Image src={HandBug} alt="actions" width={24} height={24} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-40 text-nowrap text-000000/65 text-c12 flex flex-col gap-3 py-2.5 px-4 font-MontserratNormal bg-white rounded-xl shadow-lg border z-40"
                      >
                        <button
                          className="flex items-center gap-3 w-full text-ff715b hover:bg-gray-100"
                          onClick={() => router.push(`/dashboard/seller/orders/dispute-details/${row.id}`)}
                        >
                          <Image
                            src={EyeIcon}
                            alt="view details"
                            width={15}
                            height={10}
                          />
                          View detail
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-64">
              <td colSpan={10} className="text-center py-10">
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={48} width={48} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/40">
                    No disputes found
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
