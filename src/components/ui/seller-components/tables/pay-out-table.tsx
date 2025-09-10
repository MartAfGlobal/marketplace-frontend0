"use client";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import { useEffect } from "react";
export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  statusFilter?: string;
  onFilteredCountChange?: (count: number) => void;
  filters?: {
    date?: { start: string; end: string };
    perc?: number;
    sku?: string;
    qty?: { min?: number; max?: number };
  };
};

export default function PayOutTable({
  currentPage,
  rowsPerPage,
  filters = {},
  statusFilter: externalFilter = "all",
  onFilteredCountChange = () => {},
}: InventoryFullTableProps) {
  // dataset
  const allRows = Array.from({ length: 95 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      dateTime: "28/10/2012 5:39PM",
      transactionid: `TX998234523-${i + 1}`,
      amount: `N${30000 + i * 5000}`,
      status: [
        "Completed",
        "Pending",
        "Failed",
        "Reversed",
        "In Progress",
        "Awaiting Approval",
        "On Hold",
        "Under Review",
        "Cancelled",
      ][i % 9],
      perc,
      withdrawnTo: "Bank account - 074******324",
      description: `${10 + (i % 20)}% fee on ₦${(5000 + i * 1000).toLocaleString()}`,
      sku: `SKU${i + 100}`,
      stock,
    };
  });

  // apply filters
  let filteredRows = allRows;

  if (filters.date?.start && filters.date?.end) {
    filteredRows = filteredRows.filter((row) => {
      const rowDate = new Date(row.dateTime);
      return (
        rowDate >= new Date(filters.date!.start) &&
        rowDate <= new Date(filters.date!.end)
      );
    });
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

  // status filter
  if (externalFilter !== "all") {
    filteredRows = filteredRows.filter(
      (row) => row.status.toLowerCase() === externalFilter.toLowerCase()
    );
  }

  // notify parent
  useEffect(() => {
    onFilteredCountChange(filteredRows.length);
  }, [filteredRows, onFilteredCountChange]);

  // pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);


  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
          <tr className="h-13">
            <th className="px-1 text-left">Date & time</th>
            <th className="px-1 text-left">Transaction ID</th>
            <th className="px-1 text-left">Amount</th>
            <th className="px-1 text-left">Status</th>
            <th className="px-1 text-left">Withdrawn to</th>
            <th className="px-1 text-left">Description</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="mt-3">
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className="h-10  text-c12 font-MontserratSemiBold  text-000000/60"
            >
              <td className="px-1 text-left">{row.dateTime}</td>
              <td className="px-1 text-left">{row.transactionid}</td>
              <td className="px-1 text-left">{row.amount}</td>
              <td className="px-1 text-left text-2d7565">{row.status}</td>
              <td className="px-1 text-left">{row.withdrawnTo}</td>

              <td className="px-1">{row.description}</td>
              <td>
                <button className="w-6 h-6 flex-shrink-0">
                  <Image
                    src={HandBug}
                    alt="side button"
                    width={24}
                    height={24}
                    className="flex-shrink-0"
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
