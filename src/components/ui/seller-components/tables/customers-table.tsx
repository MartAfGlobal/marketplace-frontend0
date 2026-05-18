"use client";

import Image from "next/image";
import { useState } from "react";
import HandBug from "@/assets/Seller/handBug.png";
import Empty from "@/assets/Seller/Empty.svg";
import { ChevronRight } from "lucide-react";
import Custermer1 from "@/assets/Seller/customer1.png";

const mockCustomers = [
  { id: 1, sn: "01", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Active" },
  { id: 2, sn: "02", name: "Timothy Brown", orders: 20, spend: "₦400,000", date: "Aug 28, 2025", status: "Active" },
  { id: 3, sn: "03", name: "Fred Barth", orders: 25, spend: "₦250,000", date: "Aug 28, 2025", status: "Active" },
  { id: 4, sn: "04", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Inactive" },
  { id: 5, sn: "05", name: "Kenneth Young", orders: 25, spend: "₦350,000", date: "Aug 28, 2025", status: "Active" },
  { id: 6, sn: "06", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Active" },
  { id: 7, sn: "07", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Inactive" },
  { id: 8, sn: "08", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Inactive" },
  { id: 9, sn: "09", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Active" },
  { id: 10, sn: "10", name: "Kenneth Young", orders: 25, spend: "₦25,000", date: "Aug 28, 2025", status: "Active" },
];

export default function CustomersTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const currentRows = mockCustomers;

  const toggleRow = (id: number) => {
    setSelectedRows((prev: number[]) =>
      prev.includes(id) ? prev.filter((r: number) => r !== id) : [...prev, id]
    );
  };

  const allPageSelected = currentRows.every((r: any) => selectedRows.includes(r.id));

  const togglePage = () => {
    if (allPageSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentRows.map((r: any) => r.id));
    }
  };

  const getStatusClass = (status: string) => {
    if (status.toLowerCase() === "active") {
      return "text-[#2D7565] bg-[#2D7565]/20";
    }
    return "text-[#CA0202] bg-[#CA0202]/10";
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      {/* Table Section */}
      <div className="min-w-[800px]">
        <table className="w-full border-collapse">
          <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
            <tr>
              <th className="w-12 text-center rounded-l-md">
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
              <th className="px-3 text-left">S/N</th>
              <th className="px-3 text-left">Customer name</th>
              <th className="px-3 text-center">Total Orders</th>
              <th className="px-3 text-left">Total Spend</th>
              <th className="px-3 text-left">Last Order Date</th>
              <th className="px-3 text-left">Status</th>
              <th className="px-3 text-center rounded-r-md"></th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row: any) => (
                <tr
                  key={row.id}
                  className="h-16 text-sm font-MontserratMedium text-[#161616] border-b border-gray-50 hover:bg-gray-50/50"
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
                            : "bg-white border-gray-300"
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
                  <td className="px-3 text-left text-gray-500">{row.sn}</td>
                  <td className="px-3 text-left">
                    <div className="flex items-center gap-3">
                      <Image src={Custermer1} alt="avatar" width={32} height={32} className="rounded-full" />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="px-3 text-center">{row.orders}</td>
                  <td className="px-3 text-left">{row.spend}</td>
                  <td className="px-3 text-left">{row.date}</td>
                  <td className="px-3">
                    <div className={`font-MontserratSemiBold text-[10px] sm:text-c12 capitalize px-3 py-1 rounded-full w-fit ${getStatusClass(row.status)}`}>
                      {row.status}
                    </div>
                  </td>
                  <td className="px-3 text-center">
                    <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <Image src={HandBug} alt="actions" width={16} height={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-64.5">
                <td colSpan={8} className="text-center py-10">
                  <div className="flex flex-col justify-center items-center gap-3">
                    <Image src={Empty} height={48} width={48} alt="empty" />
                    <p className="text-base font-MontserratNormal text-000000/20">
                      No customers found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
