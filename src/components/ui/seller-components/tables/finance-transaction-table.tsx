"use client";
import React from "react";

export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    status?: string;
    search?: string;
  };
};

export default function FinanceTransactionsTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryFullTableProps) {
  const allRows = Array.from({ length: 95 }, (_, i) => ({
    id: i + 1,
    date: "28/10/2026 5:39PM",
    transactionid: `TX9982345${i}`,
    amount: `N${(30 + i * 5).toLocaleString()}.00`,
    type: i % 2 === 0 ? "Bank Transfer" : "Commission Fee",
    status: (() => {
      switch (i % 3) {
        case 0:
          return "Completed";
        case 1:
          return "Pending";
        case 2:
          return "Failed";
        default:
          return "Completed";
      }
    })(),
  }));

  const filteredRows = allRows.filter((row) => {
    let match = true;
    if (
      filters.status &&
      row.status.toLowerCase() !== filters.status.toLowerCase()
    )
      match = false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!row.transactionid.toLowerCase().includes(searchTerm)) match = false;
    }
    return match;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600 border-green-100";
      case "Pending":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "Failed":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="w-full  overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-[#947FFF] text-ffffff">
          <tr className="text-[10px] font-MontserratBold py-3 text-ffffff ">
            <th className="p-3">Date & time</th>
            <th className="p-3">Transaction ID</th>

            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">cd</th>
            <th className="p-3">Linked entity</th>
            <th className="p-3">Description</th>
          </tr>
        </thead>
        <tbody className="">
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-[#fcfcfc] transition-colors group"
            >
              <td className="p-3 text-[11px] font-MontserratMedium text-[#666666]">
                {row.date}
              </td>
              <td className="p-3 text-[11px] font-MontserratSemiBold text-[#161616]">
                {row.transactionid}
              </td>
              <td className="p-3 text-[11px] font-MontserratMedium text-[#999999]">
                {row.type}
              </td>
              <td className="p-3 text-[11px] font-MontserratBold text-[#161616] font-inter">
                {row.amount}
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-[9px] font-MontserratBold border ${getStatusStyle(row.status)}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentRows.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[11px] font-MontserratMedium text-[#999999]">
            No transactions found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
