"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import HandBug from "@/assets/Seller/handBug.png";
import ProductImage from "@/assets/Seller/productImage.png";
import Empty from "@/assets/Seller/Empty.svg";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/deleteREd.svg";
import EyeIcon from "@/assets/icons/eye.png";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export type DraftProductDataTableProps = {
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
  onDelete?: (id: string) => void;
  deletingId?: string | null;
};

export function getDraftImageUrl(row: any): string | null {
  if (!row) return null;

  // 1. first_image
  if (typeof row.first_image === "string" && row.first_image.trim()) {
    return row.first_image.trim();
  }
  if (row.first_image && typeof row.first_image === "object") {
    const candidate =
      row.first_image.url ||
      row.first_image.original ||
      row.first_image.medium ||
      row.first_image.thumbnail ||
      row.first_image.image;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  // 2. main_image_url
  if (typeof row.main_image_url === "string" && row.main_image_url.trim()) {
    return row.main_image_url.trim();
  }

  // 3. main_image
  if (typeof row.main_image === "string" && row.main_image.trim()) {
    return row.main_image.trim();
  }
  if (row.main_image && typeof row.main_image === "object") {
    const candidate =
      row.main_image.medium ||
      row.main_image.original ||
      row.main_image.url ||
      row.main_image.thumbnail ||
      row.main_image.image ||
      row.main_image.image_urls?.original ||
      row.main_image.image_urls?.thumbnail;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  // 4. images array
  if (Array.isArray(row.images) && row.images.length > 0) {
    const first = row.images[0];
    if (typeof first === "string" && first.trim()) {
      return first.trim();
    }
    if (first && typeof first === "object") {
      const candidate =
        first.url ||
        first.image ||
        first.original ||
        first.medium ||
        first.thumbnail;
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  // 5. image
  if (typeof row.image === "string" && row.image.trim()) {
    return row.image.trim();
  }

  return null;
}

const DraftItemImage = ({
  row,
  width = 48,
  height = 48,
}: {
  row: any;
  width?: number;
  height?: number;
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getDraftImageUrl(row);

  if (imageUrl && !hasError) {
    return (
      <Image
        src={imageUrl}
        alt={row?.name || "Product image"}
        width={width}
        height={height}
        unoptimized
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <Image
      src={ProductImage}
      alt={row?.name || "Product image"}
      width={width}
      height={height}
      className="w-full h-full object-cover"
    />
  );
};

export default function DraftProductDataTable({
  currentPage,
  rowsPerPage,
  filters = {},
  onFilteredCount,
  onDelete,
  deletingId,
}: DraftProductDataTableProps) {
  // ✅ generate mock data

  const draft = useSelector((state: RootState) => state.draft.draft);
  const allRows = draft || [];
const router = useRouter()
  // ✅ selected row state (per table, not pagination)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { fetchdDraft } = useFetchProducts();
  const token = useSelector((state: RootState) => state.token?.token);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  useEffect(() => {
    fetchdDraft();
  }, [token]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  // ✅ apply filters
  let filteredRows = allRows;

  if (filters.perc) {
    const from = filters.perc.from ?? 0;
    const to = filters.perc.to ?? 100;

    filteredRows = filteredRows.filter((row) => {
      // Drafts have 0 sales, so percentage is 0.
      const pct = 0;
      return pct >= from && pct <= to;
    });
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
    const term = filters.sku.toLowerCase();
    filteredRows = filteredRows.filter((row) => {
      const stockcode = (row as any).stockcode as string | undefined;
      return stockcode?.toLowerCase().includes(term) || row.name?.toLowerCase().includes(term);
    });
  }

  if (filters.qty?.min !== undefined || filters.qty?.max !== undefined) {
    filteredRows = filteredRows.filter((row) => {
      const min = filters.qty!.min ?? 0;
      const max = filters.qty!.max ?? Infinity;
      return (row.quantity || 0) >= min && (row.quantity || 0) <= max;
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
    router.push(`/dashboard/seller/products/product-details/${id}`)
  }
    const handleEditDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/add-product/updateProduct/${id}?isPublish=false`);
  }

  // ✅ report filtered count to parent
  useEffect(() => {
    onFilteredCount?.(filteredRows.length);
  }, [filteredRows.length, onFilteredCount]);

  // ✅ pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ checkbox (select all on current page)
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-100">
                    <DraftItemImage row={row} width={40} height={40} />
                  </div>
                  <button
                    className="font-MontserratSemiBold text-sm text-[#000000] cursor-pointer text-left"
                    onClick={(e) => { e.stopPropagation(); handleViewDetails(row.id); }}
                  >
                    {row.name}
                  </button>
                </div>
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
                      <button
                        className="flex items-center gap-3 w-full text-000000/65 text-c12"
                        onClick={() => handleEditDetails(row.id)}
                      >
                        <Image src={EditIcon} alt="edit" width={12.5} height={12.5} />
                        Edit Product
                      </button>

                      {/* Delete */}
                      <button
                        className="flex items-center gap-3 w-full text-ca0202 text-c12"
                        disabled={deletingId === row.id}
                        onClick={() => onDelete?.(row.id)}
                      >
                        {deletingId === row.id ? (
                          <LoadingSpinner  color="border-ca0202" />
                        ) : (
                          <>
                            <Image src={DeleteIcon} alt="delete" width={12} height={13} />
                            Delete Product
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Stock</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">{row.quantity || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Price</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">₦{row.base_price || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8F8F8] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Category</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">
                    {row.category_info?.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#ffffff] px-4 py-2.5">
                  <span className="text-00000 font-MontserratNormal text-c12">Subcategory</span>
                  <span className="font-MontserratSemiBold text-000000 text-sm">
                    {row.category_info?.subcategory?.name || "N/A"}
                  </span>
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
            <th className="px-4 text-center w-21">S/N</th>
            <th className="px-4 text-left w-70">Product name</th>
            <th className="px-4 w-25 text-center">Stock</th>
            <th className="px-4 w-25 text-center">Price</th>
            <th className="px-4 w-33.5 text-center">Category</th>
            <th className="px-4 text-center">Subcategory</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
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
                      className="sr-only"
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
                <td className="px-4 text-center">{index + 1}</td>
                <td className="px-4 max-w-70 align-middle">
                  <div className="inline-flex items-center gap-3 max-w-70">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-100">
                      <DraftItemImage row={row} width={48} height={48} />
                    </div>
                    <button
                      className="max-w-40 truncate text-000000 font-MontserratNormal cursor-pointer text-left"
                      title={row.name}
                      onClick={() => handleViewDetails(row.id)}
                    >
                      {row.name}
                    </button>
                  </div>
                </td>
                <td className="px-4 text-center">{row.quantity || 0}</td>
                <td className="px-4 text-center">{row.base_price || 0}</td>
                <td className="px-4 text-center">
                  {row.category_info?.category?.name || "N/A"}
                </td>
                <td className="px-4 text-center">
                  {row.category_info?.subcategory?.name || "N/A"}
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
                        <button
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
                        </button>
  
                        {/* Delete */}
                        <button
                          className="flex items-center gap-3 justify-center w-full text-ca0202 hover:bg-red-50"
                          disabled={deletingId === row.id}
                          onClick={() => {
                            if (deletingId !== row.id) {
                              onDelete?.(row.id);
                            }
                            // Do not close dropdown immediately so spinner is visible
                          }}
                        >
                          {deletingId === row.id ? (
                            <LoadingSpinner  color="border-ca0202 "/>
                          ) : (
                            <>
                              <Image
                                src={DeleteIcon}
                                alt="edit"
                                width={12}
                                height={13}
                              />
                              Delete Product
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr className="h-64.5">
              <td
                colSpan={8}
                className="text-center py-6 text-gray-500 text-sm"
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={18} width={18} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/10">No draught products available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
