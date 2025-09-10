"use client";

import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import CaretDown from "@/assets/Seller/caretDownb.png";
import { useSelector } from "react-redux";
import Empty from "@/assets/Seller/Empty.svg";

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

export default function OrderTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryTableProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const allRows = Array.from({ length: 5 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: `${1000 + i}`,
      product: `Product ${i + 1}`,
      sold,
      stock,
      perc,
      date: (() => {
        const base = new Date(2023, 0, 1);
        base.setDate(base.getDate() + i);
        return base.toISOString().split("T")[0]; // YYYY-MM-DD
      })(),
      status: ["Delivered", "Returned", "In transit"][i % 3],
      payment: ["Full", "Refunded"][i % 2],
    };
  });

  // ✅ Apply filters
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
      row.id.toLowerCase().includes(filters.sku!.toLowerCase())
    );
  }

  if (filters.qty) {
    filteredRows = filteredRows.filter((row) => row.stock >= filters.qty!);
  }

  // ✅ Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // ✅ Status color helper
  const getStatusClass = (status: string) => {
    if (status === "Delivered") return "text-[#2D7565]";
    if (status === "Returned" || status === "Refunded") return "text-[#CA0202]";
    if (status === "In transit") return "text-[#FFAC06]";
    return "";
  };

  return (
    <div className="mt-c32 w-full text-wrap">
      <table className="w-full border-collapse">
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff w-full h-12">
          <tr>
            <th className="text-center w-21">ID</th>
            <th className="w-18">Date</th>
            <th className="px-4 w-69.25 text-left">Product</th>
            <th className="w-37.75 text-center">Order status</th>
            <th className="w-33.5">Payment status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 && !isIncomplete  ? (
            currentRows.map((order, i) => (
              <tr
                key={i}
                className="h-c48 border-b text-sm font-MontserratNormal text-nowrap border-b-000000/10"
              >
                <td className="text-center">{order.id}</td>
                <td className="px-2 text-center">{order.date}</td>
                <td className="px-4">
                  <div className="w-full h-full  flex items-center gap-2">
                    <span>{order.product}</span>
                    <button className="ml-2">
                      <Image
                        src={CaretDown}
                        alt="choose"
                        width={11}
                        height={6}
                      />
                    </button>
                  </div>
                </td>
                <td
                  className={`px-4 text-center font-medium ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </td>
                <td
                  className={`px-4 text-center ${getStatusClass(
                    order.payment
                  )}`}
                >
                  {order.payment}
                </td>
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
