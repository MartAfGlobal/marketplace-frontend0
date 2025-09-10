"use client";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
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

export default function InventoryTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryTableProps) {
  // ✅ dataset simulation
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const allRows = Array.from({ length: 7 }, (_, i) => {
    const sold = Math.floor(Math.random() * 50) + 1;
    const stock = Math.floor(Math.random() * 100) + 20;
    const perc = Math.floor((sold / stock) * 100);

    return {
      id: i + 1,
      sku: `${1000 + i}`,
      product: `Product ${i + 1}`,
      sold,
      stock,
      perc,
      date: (() => {
        const base = new Date(2023, 0, 1);
        base.setDate(base.getDate() + i);
        return base.toISOString().split("T")[0]; // YYYY-MM-DD
      })(),
    };
  });

  // ✅ apply filters
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

  // ✅ pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full mt-c32">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff h-12">
          <tr>
            <th className="px-4 text-center">SKU</th>
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
                <td className="px-4 text-center">{row.sku}</td>
                <td className="px-4 text-left">{row.product}</td>
                <td className="px-4 text-center">{row.sold}</td>
                <td className="px-4 text-center">{row.stock}</td>
                <td className="px-4 text-center">{row.perc}%</td>
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
