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
import { ChevronRight } from "lucide-react";

//  helper for approval badge
const getApprovalClass = (approval: string) => {
  const status = approval?.toLowerCase() || "";
  if (status.includes("approved")) {
    return "bg-[#2D7565]/10 text-[#2D7565] px-3 py-1 rounded-full text-xs font-semibold";
  }
  if (status.includes("pending")) {
    return "bg-[#FFAC06]/10 text-[#FFAC06] px-3 py-1 rounded-full text-xs font-semibold";
  }
  if (status.includes("rejected")) {
    return "bg-[#CA0202]/10 text-[#CA0202] px-3 py-1 rounded-full text-xs font-semibold";
  }
  return "bg-[#FFAC06]/10 text-[#FFAC06] px-3 py-1 rounded-full text-xs font-semibold";
};

const formatApprovalText = (approval: string) => {
  if (!approval) return "Pending";
  const status = approval.toLowerCase();
  if (status.includes("pending")) return "Pending";
  return approval.charAt(0).toUpperCase() + approval.slice(1);
};

//  props from parent
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

  //  dataset (95 rows)
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

  //  report filtered count to parent
  useEffect(() => {
    onFilteredCount?.(filteredRows.length);
  }, [filteredRows.length, onFilteredCount]);

  //  page slice logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  //  selected row state (per table, not pagination)
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

  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);

  return (
    <div className="mt-c32 w-full">
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-6">
        {currentRows.length > 0 && !isIncomplete ? (
          currentRows.map((row) => (
            <div key={row.id} className="py-3 flex flex-col gap-3 justify-center border-b border-gray-100 last:border-0">
              <div 
                className="flex pl-4 items-center justify-between cursor-pointer"
                onClick={() => setActiveRowId(activeRowId === row.id ? null : row.id)}
              >
                <h3 className="font-MontserratSemiBold text-sm text-[#000000]">{row.name}</h3>
                <ChevronRight 
                  size={18} 
                  className={`text-000000/40 transition-transform duration-200 ${activeRowId === row.id ? "rotate-90" : ""}`} 
                />
              </div>
              
              <AnimatePresence>
                {activeRowId === row.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative z-50 px-4"
                  >
                    <div className="flex flex-col gap-3 py-2.5 px-4 font-MontserratNormal bg-white rounded-xl shadow-lg border border-gray-100 mb-4">
                      {/* More Details */}
                      <button
                        className="flex items-center gap-3 w-full text-000000/65 text-c12"
                        onClick={() => handleViewDetails(row.id)}
                      >
                        <Image src={EyeIcon} alt="view details" width={15} height={10} />
                        More Details
                      </button>
                      
                      {/* Edit */}
                      {row.is_approved === "approved" && (
                        <button
                          className="flex items-center gap-3 w-full text-000000/65 text-c12"
                          onClick={() => handleEditDetails(row.id)}
                        >
                          <Image src={EditIcon} alt="edit" width={12.5} height={12.5} />
                          Edit Product
                        </button>
                      )}

                      {/* Deactivate/Activate */}
                      {row.is_approved?.toLowerCase() === "approved" && (
                        <button
                          className={`flex items-center gap-3 w-full text-c12 ${row.is_active ? "text-ca0202" : "text-2d7565"}`}
                          disabled={togglingId === row.id}
                          onClick={() => onToggleActive?.(row.id, row.is_active)}
                        >
                          {togglingId === row.id ? (
                            <LoadingSpinner size={16} color="border-ff715b" />
                          ) : (
                            <>
                              <div className={`w-2.5 h-2.5 rounded-full ${row.is_active ? "bg-ca0202" : "bg-2d7565"}`} />
                              {row.is_active ? "Deactivate Product" : "Activate Product"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Quantity sold</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">{row.sold}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Quantity in stock</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">{row.inventory}</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-MontserratMedium ${
                      row.is_active
                        ? "bg-[#2D7565]/10 text-[#2D7565]"
                        : "bg-[#FF715B]/10 text-[#FF715B]"
                    }`}
                  >
                    {row.is_active ? "Live" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Approval</span>
                  <span className={getApprovalClass(row.is_approved || "pending")}>
                    {formatApprovalText(row.is_approved || "pending")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Price</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">₦{row.base_price}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Sales</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">{row.sales_percentag > 0 ? row.sales_percentag : 0}%</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={18} width={18} alt="empty" />
            <p className="text-base font-MontserratNormal text-000000/10">No data available</p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <table className="hidden lg:table w-full">
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
                    {formatApprovalText(row.is_approved)}
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
