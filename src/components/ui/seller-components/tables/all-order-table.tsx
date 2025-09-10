"use client";

import Image from "next/image";
import { useState } from "react";
import HandBug from "@/assets/Seller/handBug.png";

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "fulfilled":
      return "text-[#0070E9] bg-[#0070E9]/10 p-1 rounded-c16";
    case "unprocessed":
      return "text-[#FFAC06] bg-[#FFAC06]/10 p-1 rounded-c16";
    case "processed":
      return "text-[#FFAC06] bg-[#FFAC06]/10 p-1 rounded-c16";
    case "cancelled":
      return "text-[#CA0202] bg-[#CA0202]/10 p-1 rounded-c16";
    case "delivered":
      return "text-[#2D7565] bg-[#2D7565]/20 p-1 rounded-c16";
    default:
      return "";
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
  };
};

export default function AllOrderTable({
  currentPage,
  rowsPerPage,
  statusFilter: externalFilter = "all",
  filters = {},
}: InventoryFullTableProps) {
  // dataset
  const allRows = Array.from({ length: 95 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      orderId: `ORD-${1000 + i}`,
      date: `15/08/201${i % 10}`,
      sku: i % 2 === 0 ? "Multiple SKU" : "AP-51270",
      items: i % 2 === 0 ? "Multiple items" : "Fedora hat",
      amount: "#3200",
      perc,
      stock, // ✅ added so qty filter works
      status: (() => {
        switch (i % 5) {
          case 0:
            return "fulfilled";
          case 1:
            return "processed";
          case 2:
            return "cancelled";
          case 3:
            return "delivered";
          default:
            return "unprocessed";
        }
      })(),
      country: i % 2 === 0 ? "Nigeria" : "Ghana",
    };
  });

  // ✅ status filter
  let filteredRows =
    externalFilter === "all"
      ? allRows
      : allRows.filter(
          (row) => row.status.toLowerCase() === externalFilter.toLowerCase()
        );

  // ✅ other filters
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

  // ✅ pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ selected rows
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
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
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
            <th className="px-3 text-left">Order ID</th>
            <th className="px-3 text-left">Date</th>
            <th className="px-3 text-left">Items</th>
            <th className="px-3 text-left">SKU</th>
            <th className="px-3 text-left">Country</th>
            <th className="px-3 text-left">Amount</th>
            <th className="px-3 text-left">Status</th>
            <th className="px-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className="h-10 text-c12 font-MontserratSemiBold text-000000/60"
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
              <td className="px-3 text-left">{row.orderId}</td>
              <td className="px-3 text-left">{row.date}</td>
              <td className="px-3 text-left">{row.items}</td>
              <td className="px-3 text-left">{row.sku}</td>
              <td className="px-3 text-left">{row.country}</td>
              <td className="px-3 text-left">{row.amount}</td>
              <td className="px-3 w-36">
                <p className={`text-center ${getStatusClass(row.status)}`}>
                  {row.status}
                </p>
              </td>
              <td className="px-3 text-center">
                <button className="w-6 h-6 flex-shrink-0">
                  <Image src={HandBug} alt="actions" width={24} height={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
