"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import HandBug from "@/assets/Seller/handBug.png";

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "text-[#0070E9] bg-[#0070E9]/10 p-1 rounded-c16 w-31";
    case "resolved":
      return "text-[#2D7565] bg-[#2D7565]/10 p-1 rounded-c16 w-31";
    case "escalated":
      return "text-[#CA0202] bg-[#CA0202]/10 p-1 rounded-c16 w-31";
    case "pending":
      return "text-[#FFAC06] bg-[#FFAC06]/10 p-1 rounded-c16 w-31";
    default:
      return "";
  }
};

export type DisputeTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: { min?: number; max?: number }; // ✅ support range
    search?: string;
  };
  onFilteredCountChange: (count: number) => void;
};

export default function DisputeTable({
  currentPage,
  rowsPerPage,
  filters = {},
  onFilteredCountChange,
}: DisputeTableProps) {
  const allRows = Array.from({ length: 95 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      orderid: "4857589443",
      date: "2017-08-15", // ✅ use ISO format for comparison
      perc,
      sku: `SKU${i + 1}`,
      stock,
      status:
        i % 4 === 0
          ? "Open"
          : i % 4 === 1
          ? "Resolved"
          : i % 4 === 2
          ? "Escalated"
          : "Pending",
      country: "Kenya",
      "Initiated by": i % 2 === 0 ? "Buyer" : "Seller",
      amount: "₦14,950",
      type: "Refund",
      items: "Multiple items",
    };
  });

  // ✅ apply filters
  let filteredRows = allRows;

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredRows = filteredRows.filter(
      (row) =>
        row.orderid.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term) ||
        row.date.toLowerCase().includes(term)
    );
  }

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter(
      (row) =>
        new Date(row.date) >= new Date(filters.date!.start) &&
        new Date(row.date) <= new Date(filters.date!.end)
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
    filteredRows = filteredRows.filter(
      (row) =>
        (filters.qty!.min ? row.stock >= filters.qty!.min : true) &&
        (filters.qty!.max ? row.stock <= filters.qty!.max : true)
    );
  }

  // ✅ tell parent how many rows remain
  useEffect(() => {
    onFilteredCountChange(filteredRows.length);
  }, [filteredRows, onFilteredCountChange]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ checkbox state
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
    <div className="mt-c32 w-full h-fit">
      <table className="w-full">
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
            <th className="px-3 text-left">Country</th>
            <th className="px-3 text-left">Initiated by</th>
            <th className="px-3 text-left">Amount</th>
            <th className="px-3 text-left">Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className="h-10 text-c12 font-MontserratBold  text-000000/40"
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
              <td className="px-4 text-center">{row.orderid}</td>
              <td className="px-4 text-center">{row.date}</td>
              <td className="px-4 text-center">
                <p className={getStatusClass(row.status)}>{row.status}</p>
              </td>
              <td className="px-4 text-center">{row.country}</td>
              <td className="px-4 text-center">{row["Initiated by"]}</td>
              <td className="px-4 text-center">{row.amount}</td>
              <td className="px-4 text-center">{row.type}</td>
              <td>
                {" "}
                <button className="w-6 h-6 flex-shrink-0">
                  <Image
                    src={HandBug}
                    alt="side button"
                    width={24}
                    height={24}
                    className=" flex-shrink-0"
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
