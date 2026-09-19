"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HandBug from "@/assets/Seller/handBug.png";
import { useSelector } from "react-redux";
import { SellerOrderResult } from "@/types/global";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import EyeIcon from "@/assets/icons/eye.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import Empty from "@/assets/Seller/Empty.svg";
import { ChevronRight } from "lucide-react";
import { getOrderDisplayStatus } from "@/helpers/admin/orderStatusHelper";

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "dispute closed":
    case "closed":
      return "text-[#6A0DAD] bg-[#6A0DAD]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "fulfilled":
      return "text-[#0070E9] bg-[#0070E9]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "processed":
    case "processing":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "partially_accepted":
      return "text-[#0070E9] bg-[#0070E9]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "cancelled":
    case "rejected":
      return "text-[#CA0202] bg-[#CA0202]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "delivered":
    case "completed":
      return "text-[#2D7565] bg-[#2D7565]/20 px-3 py-1 rounded-full w-fit mx-auto";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "text-[#E8334A] bg-[#E8334A]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "shipped":
    case "in transit":
      return "text-[#0070E9] bg-[#0070E9]/10 px-3 py-1 rounded-full w-fit mx-auto";
    default:
      return "text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit mx-auto";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "dispute closed":
    case "closed":
      return "#6A0DAD";
    case "fulfilled":
      return "#0070E9";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
    case "processed":
    case "processing":
      return "#FFAC06";
    case "partially_accepted":
    case "shipped":
    case "in transit":
      return "#0070E9";
    case "cancelled":
    case "rejected":
      return "#CA0202";
    case "delivered":
    case "completed":
      return "#2D7565";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "#E8334A";
    default:
      return "#6B7280";
  }
};

export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  statusFilter?: string;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: number;
    search?: string;
    timeFilter?: string;
  };
  onFilteredCount?: (count: number) => void;
  onSelectionChange?: (data: any[]) => void;
};

export default function AllOrderTable({
  currentPage,
  rowsPerPage,
  statusFilter: externalFilter = "all",
  filters = {},
  onFilteredCount,
  onSelectionChange,
}: InventoryFullTableProps) {
  const router = useRouter();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const handleExport = (row: any) => {
    localStorage.setItem("exported_order", JSON.stringify(row));
    alert("Order exported to local storage");
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/dashboard/seller/orders/order-details/${orderId}`);
  };

  // dataset
  const ordersFromStore = useSelector((state: any) => state.orders.orders);

  const allRows = ordersFromStore.map((order: SellerOrderResult, i: number) => {
    const displayStatus = getOrderDisplayStatus(order);
    return {
      id: order.id,
      orderId: order.order_id,
      date: order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A",
      dateValue: order.created_at || null,
      sku: order.items?.length > 1 ? "Multiple SKU" : (order.items?.[0]?.variation_sku || "N/A"),
      items: order.items?.length > 1 ? "Multiple items" : (order.items?.[0]?.product_name || "N/A"),
      amount: order.subtotal ? `#${order.subtotal}` : "N/A",
      perc: 0,
      stock: order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0,
      status:
        displayStatus === "Dispute closed"
          ? "Dispute closed"
          : displayStatus === "Dispute raised" || displayStatus === "Dispute ongoing"
          ? "disputed"
          : (order as any).seller_status?.toLowerCase() ||
            (order.status?.toLowerCase() === "pending" ? "unprocessed" : order.status),
      country: order.shipping_address?.country || "N/A",
      accepted_quantity: order.accepted_quantity || 0,
      rejected_quantity: order.rejected_quantity || 0,
    };
  });

  // ✅ status filter
  let filteredRows =
    externalFilter === "all"
      ? allRows
      : allRows.filter((row: any) => {
          const status = row.status.toLowerCase();
          const filter = externalFilter.toLowerCase();

          return status === filter;
        });

  // ✅ other filters
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredRows = filteredRows.filter(
      (row: any) =>
        row.orderId.toLowerCase().includes(term) ||
        row.items.toLowerCase().includes(term) ||
        row.date.toLowerCase().includes(term)
    );
  }

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row: any) => {
        if (!row.dateValue) return false;
        const orderDate = new Date(row.dateValue);
        const startDate = new Date(`${filters.date!.start}T00:00:00`);
        const endDate = new Date(`${filters.date!.end}T23:59:59.999`);
        return orderDate >= startDate && orderDate <= endDate;
      },
    );
  }
  if (filters.timeFilter && filters.timeFilter !== "All time") {
    const days =
      filters.timeFilter === "This Week"
        ? 7
        : filters.timeFilter === "This Month"
          ? 30
          : 365;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    filteredRows = filteredRows.filter(
      (row: any) => row.dateValue && new Date(row.dateValue) >= cutoff,
    );
  }
  if (filters.perc) {
    filteredRows = filteredRows.filter((row: any) => row.perc >= filters.perc!);
  }
  if (filters.sku) {
    filteredRows = filteredRows.filter((row: any) =>
      row.sku.toLowerCase().includes(filters.sku!.toLowerCase())
    );
  }
  if (filters.qty) {
    filteredRows = filteredRows.filter((row: any) => row.stock >= filters.qty!);
  }

  // ✅ report filtered count to parent
  useEffect(() => {
    onFilteredCount?.(filteredRows.length);
  }, [filteredRows.length, onFilteredCount]);

  // ✅ pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev: number[]) =>
      prev.includes(id) ? prev.filter((r: number) => r !== id) : [...prev, id]
    );
  };

  const allPageSelected = currentRows.every((r: any) => selectedRows.includes(r.id));

  const togglePage = () => {
    if (allPageSelected) {
      setSelectedRows((prev: number[]) =>
        prev.filter((id: number) => !currentRows.some((r: any) => r.id === id))
      );
    } else {
      setSelectedRows((prev: number[]) => [
        ...prev,
        ...currentRows.map((r: any) => r.id).filter((id: number) => !prev.includes(id)),
      ]);
    }
  };

  // ✅ Notify parent of selection changes
  useEffect(() => {
    const selectedObjects = allRows.filter((r: any) => selectedRows.includes(r.id));
    onSelectionChange?.(selectedObjects);
  }, [selectedRows, onSelectionChange]);

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-4">
        {currentRows.length > 0 ? (
          currentRows.map((row: any) => (
            <div key={row.id} className="flex flex-col border-b border-gray-100 pb-6 mb-2">
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer"
                onClick={() => handleViewDetails(row.orderId)}
              >
                <div className="flex flex-col">
                  <span className="font-MontserratSemiBold text-sm text-[#000000]">{row.orderId}</span>
                  <span className="font-MontserratNormal text-[10px] text-000000/50 mt-1">{row.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-MontserratMedium text-[10px] sm:text-c12 capitalize ${getStatusClass(row.status)}`}>
                    {row.status.toLowerCase() === "partially_accepted" ? "Partial Accept" : row.status}
                  </div>
                  <ChevronRight className="w-4 h-4 text-000000/50" />
                </div>
              </div>
              
              <div className="flex flex-col gap-0.5 text-c12">
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal">Items</span>
                  <div className="flex flex-col items-end">
                    <span className="font-MontserratSemiBold text-000000">{row.items}</span>
                    {row.status.toLowerCase() === "partially_accepted" && (
                      <span className="text-[10px] text-gray-400">
                        (Acc: {row.accepted_quantity}, Rej: {row.rejected_quantity})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5 rounded">
                  <span className="text-00000 font-MontserratNormal">Country</span>
                  <span className="font-MontserratSemiBold text-000000">{row.country}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal">Amount</span>
                  <span className="font-MontserratSemiBold text-000000">{row.amount}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal">Status</span>
                  <span className="font-MontserratSemiBold text-000000 flex items-center gap-2 capitalize">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(row.status) }}></span>
                    {row.status.toLowerCase() === "partially_accepted" ? "Partial Accept" : row.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={48} width={48} alt="empty" />
            <p className="text-base font-MontserratNormal text-000000/20">No orders found</p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <table className="hidden lg:table w-full border-collapse">
        <thead className="text-white font-MontserratSemiBold py-3 text-c12 bg-947fff h-10 ">
          <tr className="text-left">
            <th className=" px-3 text-center ">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={togglePage}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border rounded flex items-center justify-center ${
                    allPageSelected
                      ? "bg-[#FF715B] border-0"
                      : " border-ffffff"
                  }`}
                >
                  {allPageSelected && (
                    <svg
                      className="w-4 h-4 text-white"
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
            <th className="px-3 ">Order ID</th>
            <th className="px-3 ">Date</th>
            <th className="px-3 ">Items</th>
            <th className="px-3  hidden md:table-cell">SKU</th>
            <th className="px-3  hidden md:table-cell">Country</th>
            <th className="px-3 ">Amount</th>
            <th className="px-3 ">Status</th>
            <th className="px-3 ">Action</th>
          </tr>
        </thead>
        
        <tbody className=" ">
         <tr><td colSpan={9} className="h-1" /></tr> 
          {currentRows.length > 0 ? (
            currentRows.map((row: any) => (
              <tr
                key={row.id}
                className="h-12 text-c12 font-MontserratSemiBold py-3 text-000000/60"
              >
                <td className="text-center px-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center ${
                        selectedRows.includes(row.id)
                          ? "bg-ff715b border-0"
                          : "bg-white"
                      }`}
                    >
                      {selectedRows.includes(row.id) && (
                        <svg
                          className="w-4 h-4 text-white"
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
                <td className="px-3 max-w-[116px] truncate cursor-pointer" title={row.orderId}><button onClick={() => handleViewDetails(row.id)} >{row.orderId}</button></td>
                <td className="px-3 max-w-[96px] truncate" title={row.date}>{row.date}</td>
                <td className="px-3 max-w-[234px] truncate  " title={row.items}>
                  <div className="flex flex-col">
                    <span>{row.items}</span>
                    {row.status.toLowerCase() === "partially_accepted" && (
                      <span className="text-[10px] text-gray-400">
                        (Acc: {row.accepted_quantity}, Rej: {row.rejected_quantity})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3  max-w-[124px] truncate   hidden md:table-cell" title={row.sku}>{row.sku}</td>
                <td className="px-3 max-w-[104px] truncate   hidden md:table-cell" title={row.countrys}>{row.country}</td>
                <td className="px-3 max-w-[116px]" title={row.amount}>{row.amount}</td>
                <td className="px-3 ">
                  <div className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize max-w-[124px] truncate ${getStatusClass(row.status)}`} title={row.status}>
                    {row.status.toLowerCase() === "partially_accepted" ? "Partial Accept" : row.status}
                  </div>
                </td>
                <td className="px-3 text-center relative">
                  <button
                    className="w-6 h-6 flex-shrink-0"
                    onClick={() =>
                      setActiveRowId((prev) => (prev === row.orderId ? null : row.orderId))
                    }
                  >
                    <Image src={HandBug} alt="actions" width={24} height={24} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.orderId && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-40 text-nowrap text-000000/65 text-c12 flex flex-col gap-3 py-2.5 px-4 font-MontserratNormal bg-white rounded-xl shadow-lg border z-40"
                      >
                        {/* More Details */}
                        <button
                          className="flex items-center gap-3 w-full text-ff715b hover:bg-gray-100"
                          onClick={() => handleViewDetails(row.id)}
                        >
                          <Image
                            src={EyeIcon}
                            alt="view details"
                            width={15}
                            height={10}
                          />
                          More Details
                        </button>

                        {/* Export */}
                        <button
                          className="flex items-center gap-3 w-full hover:bg-gray-100"
                          onClick={() => handleExport(row)}
                        >
                          <Image
                            src={downloadIcon}
                            alt="export"
                            width={14}
                            height={14}
                          />
                          Export Order
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-64.5">
              <td colSpan={9} className="text-center py-10">
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={48} width={48} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/20">
                    No orders found
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
