"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import HandBug from "@/assets/Seller/handBug.png";
import ProductImage from "@/assets/Seller/productImage.png";
import Empty from "@/assets/Seller/Empty.svg";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { sellerProduct } from "@/types/global";
import { AnimatePresence, motion } from "framer-motion";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/deleteREd.svg";
import EyeIcon from "@/assets/icons/eye.png";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// ✅ helper for approval badge
const getApprovalClass = (approval: string) => {
  switch (approval.toLowerCase()) {
    case "approved":
      return "bg-[#2D7565]/10 text-[#2D7565] px-3 py-1 rounded-full text-xs font-semibold";
    case "pending":
      return "bg-[#FFAC06]/10 text-[#FFAC06] px-3 py-1 rounded-full text-xs font-semibold";
    case "rejected":
      return "bg-[#CA0202]/10 text-[#CA0202] px-3 py-1 rounded-full text-xs font-semibold";
    default:
      return "";
  }
};

// ✅ props from parent
 export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    date?: { start: string; end: string };
    perc?: { from?: number; to?: number };
    sku?: string;
    qty?: { min?: number; max?: number };
    timeFilter?: string;
  };
  onFilteredCount?: (count: number) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  togglingId?: string | null;
};

export default function InventoryFullTable({
  currentPage,
  rowsPerPage,
  filters = {},
  onFilteredCount,
  onToggleActive,
  togglingId,
}: InventoryFullTableProps) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // ✅ dataset (95 rows)
    const allRows = useSelector(
      (state: RootState) => state.sellerProduct.product,
    ) || [];
    const router = useRouter();

  console.log("all rows in table", allRows);

  let filteredRows = allRows;


  const percentageSold = (row: sellerProduct) => {
    const total = row.inventory;
    return total > 0 ? (row.sold / total) * 100 : 0;
  };

if (filters.perc) {
  const from = filters.perc.from ?? 0;
  const to = filters.perc.to ?? 100;

  filteredRows = filteredRows.filter((row) => {
    const pct = percentageSold(row);
    return pct >= from && pct <= to;
  });
}
  
  if (filters.timeFilter && filters.timeFilter !== "All Time") {
    const now = new Date();
    filteredRows = filteredRows.filter((row) => {
      if (!row.created_at) return false;
      const rowDate = new Date(row.created_at);
      
      if (filters.timeFilter === "This Week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return rowDate >= startOfWeek;
      } else if (filters.timeFilter === "This Month") {
        return rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
      } else if (filters.timeFilter === "This Year") {
        return rowDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/product-details/${id}?isPublish=true`)
  }
    const handleEditDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/add-product/updateProduct/${id}`)
  }

  if (filters.date?.start && filters.date?.end) {
    const start = new Date(filters.date.start).getTime();
    const end = new Date(filters.date.end).getTime();
    filteredRows = filteredRows.filter((row) => {
      if (!row.created_at) return false;
      const rowTime = new Date(row.created_at).getTime();
      return rowTime >= start && rowTime <= end;
    });
  }

  if (filters.sku) {
    filteredRows = filteredRows.filter((row) =>
      row.stockcode?.toLowerCase().includes(filters.sku!.toLowerCase())
    );
  }

  if (filters.qty?.min !== undefined || filters.qty?.max !== undefined) {
    filteredRows = filteredRows.filter((row) => {
      const min = filters.qty!.min ?? 0;
      const max = filters.qty!.max ?? Infinity;
      return (row.inventory || 0) >= min && (row.inventory || 0) <= max;
    });
  }

  // ✅ report filtered count to parent
  useEffect(() => {
    onFilteredCount?.(filteredRows.length);
  }, [filteredRows.length, onFilteredCount]);

  // ✅ page slice logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ selected row state (per table, not pagination)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const allPageSelected = currentRows.every((r) => selectedRows.includes(r.id));

  const togglePage = () => {
    if (allPageSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentRows.some((r) => r.id === id)),
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...currentRows.map((r) => r.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="mt-c32 w-full">
      <table className="w-full">
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff w-full h-12">
          <tr>
            <th className="w-8 text-center">
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
            <th className="px-4 text-center  text-nowrap">Stock code</th>
            <th className="px-4 text-left">Product name</th>
            <th className="px-4  text-center">Q.sold</th>
            <th className="px-4 text-center">Q. in stock</th>
            <th className="px-4 text-center">Status</th>
            <th className="px-4 text-center">Approval</th>
            <th className="px-4 text-center">Price</th>
            <th className="px-4 text-center">Sales %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
              <tr
                key={row.id}
                className="h-c64 border-b text-sm font-MontserratNormal border-b-000000/10"
              >
                <td className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="sr-only" // hides native checkbox
                    />
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center ${
                        selectedRows.includes(row.id)
                          ? "bg-ff715b border-0"
                          : "bg-white"
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
  
                <td className="px-4 text-left">{row.stockcode}</td>
                <td className="px-4 max-w-70 align-middle">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={row.main_image?.medium || ProductImage}
                        alt="Product image"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="px-4 text-center">{row.sold}</td>
                <td className="px-4 text-center">{row.inventory}</td>
                <td
                  className={`px-4 text-center ${row.is_active ? "text-2d7565" : "text-000000/50"}`}
                >
                  {row.is_active ? "Live" : "Inactive"}
                </td>
                <td className="px-4 text-center">
                  <span className={getApprovalClass(row.is_approved)}>
                    {row.is_approved}
                  </span>
                </td>
                <td className="px-4 text-center">₦{row.base_price}</td>
                <td className="px-4 text-center">
                  {row.sales_percentag > 0 ? row.sales_percentag : 0}%
                </td>
                <td className="px-4 text-center relative">
                  <button
                    className="w-6 h-6 flex-shrink-0"
                    onClick={() =>
                      setActiveRowId((prev) => (prev === row.id ? null : row.id))
                    }
                  >
                    <Image
                      src={HandBug}
                      alt="side button"
                      width={24}
                      height={24}
                    />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute -right-12 mt-2 w-37.75 text-nowrap text-000000/65 text-c12 flex flex-col gap-3 py-2.5 px-4 font-MontserratNormal bg-white rounded-xl shadow-lg border z-40 "
                      >
                        {/* More Details */}
                        <button
                          className="flex items-center gap-3 w-full  text-ff715b hover:bg-gray-100 "
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
                        {/* Edit */}
                       { row.is_approved === "approved" && <button
                          className="flex items-center gap-3 w-full  hover:bg-gray-100 "
                        onClick={() => handleEditDetails(row.id)}
                        >
                          <Image
                            src={EditIcon}
                            alt="edit"
                            width={12.5}
                            height={12.5}
                          />
                          Edit Product
                        </button>}
  
                        {/* Toggle Active status */}
                        {row.is_approved?.toLowerCase() === "approved" && (
                          <button
                            className={`flex items-center justify-center gap-3 w-full ${row.is_active ? "hover:bg-red-50 text-ca0202" : "hover:bg-green-50 text-2d7565"}`}
                            disabled={togglingId === row.id}
                            onClick={() => {
                              if (togglingId !== row.id) {
                                onToggleActive?.(row.id, row.is_active);
                              }
                            }}
                          >
                            {togglingId === row.id ? (
                              <LoadingSpinner  color="border-ff715b "/>
                            ) : (
                              <span>{row.is_active ? "Deactivate Product" : "Activate Product"}</span>
                            )}
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-64.5">
              <td
                colSpan={10}
                className="text-center py-6 text-gray-500 text-sm"
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={18} width={18} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/10">No live products available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
