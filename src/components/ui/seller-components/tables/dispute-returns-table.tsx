"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import dotsIcon from "@/assets/icons/dots.png"; // Assuming there's a dots icon
import Empty from "@/assets/Seller/Empty.svg";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import EyeIcon from "@/assets/icons/eye.png";
import { ChevronRight } from "lucide-react";

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "text-[#0070E9] bg-[#0070E9]/10 px-8 py-2 rounded-c16 w-fit mx-auto";
    case "resolved":
      return "text-[#2D7565] bg-[#2D7565]/10 px-8 py-2 rounded-c16 w-fit mx-auto";
    case "escalated":
      return "text-[#CA0202] bg-[#CA0202]/10 px-8 py-2 rounded-c16 w-fit mx-auto";
    case "pending":
    case "requested":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-8 py-2 rounded-c16 w-fit mx-auto";
    default:
      return "text-gray-500 bg-gray-100 px-8 py-2 rounded-c16 w-fit mx-auto";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "#0070E9";
    case "resolved":
      return "#2D7565";
    case "escalated":
      return "#CA0202";
    case "pending":
    case "requested":
      return "#FFAC06";
    default:
      return "#6B7280";
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
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-4">
        {currentRows.length > 0 ? (
          currentRows.map((row: any) => (
            <div key={row.id} className="flex flex-col border-b border-gray-100 pb-6 mb-2">
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer"
                onClick={() => router.push(`/dashboard/seller/orders/dispute-details/${row.id}`)}
              >
                <div className="flex flex-col">
                  <span className="font-MontserratSemiBold text-sm text-[#000000]">{row.orderid}</span>
                  <span className="font-MontserratNormal text-[10px] text-000000/50 mt-1">{new Date(row.date).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-MontserratMedium text-[10px] sm:text-c12 capitalize ${getStatusClass(row.status).replace('px-8', 'px-3').replace('py-2', 'py-1').replace('rounded-c16', 'rounded-full')}`}>
                    {row.status}
                  </div>
                  <ChevronRight className="w-4 h-4 text-000000/50" />
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 text-c12">
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal">Items</span>
                  <span className="font-MontserratSemiBold text-000000">{row.items}</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5 rounded">
                  <span className="text-00000 font-MontserratNormal">Type</span>
                  <span className="font-MontserratSemiBold text-000000">{row.type}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal">Amount</span>
                  <span className="font-MontserratSemiBold text-000000">{row.amount}</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5 rounded">
                  <span className="text-00000 font-MontserratNormal">Initiated by</span>
                  <span className="font-MontserratSemiBold text-000000">{row.initiatedBy}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5 rounded">
                  <span className="text-00000 font-MontserratNormal">Status</span>
                  <span className="font-MontserratSemiBold text-000000 flex items-center gap-2 capitalize">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(row.status) }}></span>
                    {row.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={48} width={48} alt="empty" />
            <p className="text-base font-MontserratNormal text-000000/20">No disputes found</p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <table className="hidden lg:table w-full min-w-[800px]">
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
                <td className=" text-center">
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
