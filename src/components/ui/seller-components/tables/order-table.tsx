"use client";

import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import CaretDown from "@/assets/Seller/caretDownb.png";
import { useSelector } from "react-redux";
import Empty from "@/assets/Seller/Empty.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import EyeIcon from "@/assets/icons/eye.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import { useState, useEffect, useRef } from "react";
import {
  getSellerDetailedStatus,
  getSellerTableStatus,
  getSellerStatusClass as getStatusClass,
} from "@/helpers/sellers/sellerOrderStatusHelper";
import { useMobileViewport } from "@/hooks/useMobileViewport";
import { downloadTableRows } from "@/utils/downloadTableRows";

export type InventoryTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: number;
    search?: string;
  };
  onSelectionChange?: (rows: any[]) => void;
};

const getPayoutStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "escrowed":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "paid":
    case "payout_completed":
    case "completed":
      return "text-[#2D7565] bg-[#2D7565]/20 px-3 py-1 rounded-full w-fit mx-auto";
    case "pending":
    case "processing":
      return "text-[#0070E9] bg-[#0070E9]/10 px-3 py-1 rounded-full w-fit mx-auto";
    case "failed":
    case "refunded":
      return "text-[#CA0202] bg-[#CA0202]/10 px-3 py-1 rounded-full w-fit mx-auto";
    default:
      return "text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit mx-auto";
  }
};

export default function OrderTable({
  currentPage,
  rowsPerPage,
  filters = {},
  onSelectionChange,
}: InventoryTableProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const ordersFromStore = useSelector((state: any) => state.orders.orders);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const isMobile = useMobileViewport();
  const lastSelectionSignature = useRef("");

  const handleExport = (row: any) => {
    downloadTableRows([row], `order-${row.orderId || row.id}`);
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/dashboard/seller/orders/order-details/${orderId}`);
  };

  const allRows = ordersFromStore.map((order: any) => {
    const realStatus = getSellerDetailedStatus(order);
    const tableStatus = getSellerTableStatus(order);
    return {
      id: order.order_no || order.id,
      orderId: order.id,
      product: order.items?.length > 1 
        ? "Multiple items" 
        : (order.items?.[0]?.product_name || "Not set"),
      date: order.created_at ? new Date(order.created_at).toLocaleDateString() : "Not set",
      realStatus,
      tableStatus,
      status: tableStatus,
      payment: order.payout_status || "Not set",
      country: order.shipping_address?.country || "Not set",
      accepted_quantity: order.accepted_quantity || 0,
      rejected_quantity: order.rejected_quantity || 0,
      sku: order.items?.[0]?.variation_sku || "Not set",
      stock: order.items?.[0]?.quantity || 0,
      perc: 0, // Placeholder if percentage is needed
    };
  });

  // ✅ Apply filters
  let filteredRows = allRows;

  if (filters.search) {
    const term = filters.search.trim().toLowerCase();
    filteredRows = filteredRows.filter(
      (row: any) =>
        String(row.orderId ?? "").toLowerCase().includes(term) ||
        String(row.product ?? "").toLowerCase().includes(term) ||
        String(row.date ?? "").toLowerCase().includes(term) ||
        String(row.tableStatus ?? "").toLowerCase().includes(term) ||
        String(row.realStatus ?? "").toLowerCase().includes(term) ||
        String(row.payment ?? "").toLowerCase().includes(term)
    );
  }

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row: any) => row.date >= filters.date!.start && row.date <= filters.date!.end
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

  // ✅ Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);
  const allPageSelected =
    currentRows.length > 0 &&
    currentRows.every((row: any) => selectedRows.includes(row.id));

  useEffect(() => {
    const selectedOrders = isMobile
      ? filteredRows
      : filteredRows.filter((row: any) => selectedRows.includes(row.id));
    const signature = JSON.stringify(selectedOrders);
    if (signature === lastSelectionSignature.current) return;
    lastSelectionSignature.current = signature;
    onSelectionChange?.(selectedOrders);
  }, [filteredRows, isMobile, onSelectionChange, selectedRows]);

  const togglePage = () => {
    if (allPageSelected) {
      setSelectedRows((previous) =>
        previous.filter((id) => !currentRows.some((row: any) => row.id === id)),
      );
      return;
    }
    setSelectedRows((previous) => [
      ...previous,
      ...currentRows.map((row: any) => row.id).filter((id: string) => !previous.includes(id)),
    ]);
  };

  return (
    <div className="mt-c32 w-full  text-wrap">
      <table className="w-full border-collapse">
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff w-full h-12">
          <tr>
            <th className="hidden lg:table-cell px-3 text-center">
              <input
                type="checkbox"
                aria-label="Select all orders on this page"
                checked={allPageSelected}
                onChange={togglePage}
              />
            </th>
            <th className="text-center max-w-21">ID</th>
            <th className="w-18">Date</th>
            <th className="w-24 hidden md:table-cell">Country</th>
            <th className="px-4 w-fit max-w-69.25 text-left">Product</th>
            <th className="w-37.75 text-center ">Order status</th>
            <th className="w-33.5">Payment status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 && !isIncomplete  ? (
            currentRows.map((order: any, i: number) => (
              <tr
                key={i}
                className="h-c48 border-b text-sm font-MontserratNormal text-nowrap border-b-000000/10"
              >
                <td className="hidden lg:table-cell px-3 text-center">
                  <input
                    type="checkbox"
                    aria-label={`Select order ${order.orderId}`}
                    checked={selectedRows.includes(order.id)}
                    onChange={() =>
                      setSelectedRows((previous) =>
                        previous.includes(order.id)
                          ? previous.filter((id) => id !== order.id)
                          : [...previous, order.id],
                      )
                    }
                  />
                </td>
                <td className="text-center max-w-40 px-4 text-wrap">{order.id}</td>
                <td className="px-2 text-center">{order.date}</td>
                <td className="px-2 text-center hidden md:table-cell">{order.country}</td>
                <td className="px-4 w-fit max-w-69.25">
                  <div className="w-full h-full  flex items-center gap-2">
                    <div className="flex flex-col">
                      <span>{order.product}</span>
                      {order.realStatus.toLowerCase() === "partially accepted" && (
                        <span className="text-[10px] text-gray-400">
                          (Acc: {order.accepted_quantity}, Rej: {order.rejected_quantity})
                        </span>
                      )}
                    </div>
                    <button className="ml-2">
                      <Image
                        src={CaretDown}
                        alt="choose"
                        width={11}
                        height={6}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-4">
                  <div className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize ${getStatusClass(order.tableStatus)}`}>
                    {order.tableStatus}
                  </div>
                </td>
                <td className="px-4">
                  <div className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize ${getPayoutStatusClass(order.payment)}`}>
                    {order.payment}
                  </div>
                </td>
                <td className="relative">
                  <button
                    className="w-6 h-6 flex-shrink-0"
                    onClick={() =>
                      setActiveRowId((prev) => (prev === order.id ? null : order.id))
                    }
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
                    {activeRowId === order.id && (
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
                          onClick={() => handleViewDetails(order.orderId)}
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
                          onClick={() => handleExport(order)}
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
             <tr className="h-64.5 ">
              <td
                colSpan={8}
                className="text-center py-6 text-gray-500 text-sm"
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={18} width={18} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/10">No data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
