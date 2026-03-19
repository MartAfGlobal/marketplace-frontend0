"use client";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import { useSelector } from "react-redux";
import Empty from "@/assets/Seller/Empty.svg";
import { RootState } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/deleteREd.svg";
import EyeIcon from "@/assets/icons/eye.png";
export type InventoryTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: number;
  };
};

export default function InventoryTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryTableProps) {
  // ✅ dataset simulation
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const allRows = useSelector(
        (state: RootState) => state.sellerProduct.product,
      );
const router = useRouter();
 
  // ✅ apply filters
  let filteredRows = allRows;

   if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row) =>
        row.created_at >= filters.date!.start &&
        row.created_at <= filters.date!.end,
    );
  }

  if (filters.perc) {
    filteredRows = filteredRows.filter((row) => row.sales_percentag >= filters.perc!);
  }

  // if (filters.sku) {
  //   filteredRows = filteredRows.filter((row) =>
  //     row.sku.toLowerCase().includes(filters.sku!.toLowerCase())
  //   );
  // }

   if (filters.qty) {
    filteredRows = filteredRows.filter((row) => row.inventory >= filters.qty!);
  }
  // ✅ pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
    router.push(`/dashboard/seller/products/product-details/${id}`)
  }

  return (
    <div className="w-full mt-c32">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff h-12">
          <tr>
            <th className="px-4 text-center">Stock code</th>
            <th className="px-4 text-left">Product name</th>
            <th className="px-4 text-center">Q.sold</th>
            <th className="px-4 text-center">Q. in stock</th>
            <th className="px-4 text-center">Sales %</th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {currentRows.length > 0 && !isIncomplete ? (
            currentRows.map((row) => (
              <tr
                key={row.id}
                className="h-c48 border-b border-b-000000/10 text-sm font-MontserratNormal"
              >
                <td className="px-4 text-center">{row.stockcode}</td>
                <td className="px-4 text-left">{row.name}</td>
                <td className="px-4 text-center">{row.sold}</td>
                <td className="px-4 text-center">{row.inventory}</td>
                <td className="px-4 text-center">{row.sales_percentag}%</td>
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
                                      onClick={() => {
                                        console.log("Edit", row.id);
                                        setActiveRowId(null);
                                      }}
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
            ))
          ) : (
            <tr className="h-64.5 ">
              <td
                colSpan={6}
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
