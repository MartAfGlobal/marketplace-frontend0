"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import HandBug from "@/assets/Seller/handBug.png";
import ProductImage from "@/assets/Seller/productImage.png";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/deleteREd.svg";
import EyeIcon from "@/assets/icons/eye.png";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// ✅ props from parent
export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: number;
  };
};

export default function DraftProductDataTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryFullTableProps) {
  // ✅ generate mock data

  const draft = useSelector((state: RootState) => state.draft.draft);
  const allRows = draft;
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

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row) =>
        row.created_at >= filters.date!.start &&
        row.created_at <= filters.date!.end,
    );
  }

  // if (filters.perc) {
  //   filteredRows = filteredRows.filter((row) => row. >= filters.perc!);
  // }

  // if (filters.sku) {
  //   filteredRows = filteredRows.filter((row) =>
  //     row.sku.toLowerCase().includes(filters.sku!.toLowerCase()),
  //   );
  // }

  if (filters.qty) {
    filteredRows = filteredRows.filter((row) => row.quantity >= filters.qty!);
  }

    const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/product-details/${id}`)
  }
    const handleEditDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/add-product/updateProduct/${id}?isPublish=false`);
  }

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
          {currentRows.map((row, index) => (
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
                <div className="inline-flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                    {row.first_image? <Image
                      src={row.first_image || ProductImage}
                      alt="Product image"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />: "No image"}
                  </div>
                  <span>{row.name}</span>
                </div>
              </td>
              <td className="px-4 text-center">{row.quantity || 0}</td>
              <td className="px-4 text-center">{row.base_price || 0}</td>
              <td className="px-4 text-center">
                {row.category_info.category.name || "N/A"}
              </td>
              <td className="px-4 text-center">
                {row.category_info.subcategory.name}
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
                        className="flex items-center gap-3 w-full  hover:bg-red-50 "
                        onClick={() => {
                          console.log("Delete", row.id);
                          setActiveRowId(null);
                        }}
                      >
                        <Image
                          src={DeleteIcon}
                          alt="edit"
                          width={12}
                          height={13}
                        />
                        Delete Product
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
