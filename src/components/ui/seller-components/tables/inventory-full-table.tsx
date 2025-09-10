"use client";

import Image from "next/image";
import { useState } from "react";

import HandBug from "@/assets/Seller/handBug.png";
import ProductImage from "@/assets/Seller/productImage.png";

// ✅ helper for status text
const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-[#2D7565] font-semibold";
    case "inactive":
      return "text-[#CA0202] font-semibold";
    default:
      return "";
  }
};

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
    perc?: number;
    sku?: string;
    qty?: number;
  };
};

export default function InventoryFullTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryFullTableProps) {
  // ✅ dataset (95 rows)
  const allRows = Array.from({ length: 95 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      sku: `00${i + 1}`,
      sold: i % 2 === 0 ? 25 : 0,
      stock: 30,
      status: i % 2 === 0 ? "Active" : "Inactive",
      approval: i % 3 === 0 ? "Approved" : i % 3 === 1 ? "Pending" : "Rejected",
      price: "#3200",
      sales: i % 2 === 0 ? "60%" : "0",
  
      perc,
      date: (() => {
        const base = new Date(2023, 0, 1);
        base.setDate(base.getDate() + i);
        return base.toISOString().split("T")[0]; // YYYY-MM-DD
      })(),
    };
  });

  let filteredRows = allRows;

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row) => row.date >= filters.date!.start && row.date <= filters.date!.end
    );
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
    filteredRows = filteredRows.filter((row) => row.stock >= filters.qty!);
  }

  // ✅ page slice logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = allRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ selected row state (per table, not pagination)
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const allPageSelected = currentRows.every((r) => selectedRows.includes(r.id));

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
            <th className="px-4 text-center w-21">SKU</th>
            <th className="px-4 text-left w-70">Product name</th>
            <th className="px-4 w-25 text-center">Q.sold</th>
            <th className="px-4 w-33.5 text-center">Q. in stock</th>
            <th className="px-4 text-center">Status</th>
            <th className="px-4 text-center">Approval</th>
            <th className="px-4 text-center">Price</th>
            <th className="px-4 text-center">Sales %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
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
              <td className="px-4 text-center">{row.sku}</td>
              <td className="px-4 max-w-70 align-middle">
                <div className="inline-flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={ProductImage}
                      alt="Product image"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span>Ankara Top and sleeves</span>
                </div>
              </td>
              <td className="px-4 text-center">{row.sold}</td>
              <td className="px-4 text-center">{row.stock}</td>
              <td className={`px-4 text-center ${getStatusClass(row.status)}`}>
                {row.status}
              </td>
              <td className="px-4 text-center">
                <span className={getApprovalClass(row.approval)}>
                  {row.approval}
                </span>
              </td>
              <td className="px-4 text-center">{row.price}</td>
              <td className="px-4 text-center">{row.sales}</td>
              <td className="px-4 text-center">
                <button className="w-6 h-6 flex-shrink-0">
                  <Image
                    src={HandBug}
                    alt="side button"
                    width={24}
                    height={24}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
