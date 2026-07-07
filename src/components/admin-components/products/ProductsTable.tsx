import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle2, Clock, XCircle } from "lucide-react";


export interface ProductRow {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: string;
  stock: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

interface ProductsTableProps {
  rows: ProductRow[];
  selectedProductIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onRowClick: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
  truncateText: (value: string | number | undefined, maxLength?: number) => string;
}

export default function ProductsTable({
  rows,
  selectedProductIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onRowClick,
  onSetActiveRowId,
  truncateText,
}: ProductsTableProps) {
  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                aria-label={rows.length > 0 ? "Select all visible products" : "No products to select"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 && rows.every((row) => selectedProductIds.includes(row.id))
                    ? "border-[#ff715b] bg-[#ff715b]"
                    : "border-[#161616] hover:border-[#ff715b]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-2.5 w-2.5 ${
                    rows.length > 0 && rows.every((row) => selectedProductIds.includes(row.id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Product Name</th>
            <th className="p-3 font-MontserratNormal text-sm">Seller</th>
            <th className="p-3 font-MontserratNormal text-sm">Category</th>
            <th className="p-3 font-MontserratNormal text-sm">Price</th>
            <th className="p-3 font-MontserratNormal text-sm">Stock</th>
            <th className="p-3 font-MontserratNormal text-sm text-center">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Date Added</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-[11px] text-gray-700 font-MontserratMedium">
          {loading ? (
            <tr>
              <td colSpan={9} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-ff715b" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
              >
                <td className="py-3 px-4 text-gray-400 font-MontserratMedium">
                  <button
                    type="button"
                    aria-label={`Select ${row.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-4 w-4 items-center justify-center border transition-all duration-200 ${
                      selectedProductIds.includes(row.id)
                        ? "border-[#ff715b] bg-[#ff715b]"
                        : "border-[#161616] hover:border-[#ff715b]"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-2.5 w-2.5 ${
                        selectedProductIds.includes(row.id)
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">
                  <span className="block max-w-[10rem] truncate" title={row.name}>{row.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-500">
                  <span className="block max-w-[8rem] truncate" title={row.seller}>{row.seller}</span>
                </td>
                <td className="py-3 px-4 text-gray-500">{row.category}</td>
                <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">{row.price}</td>
                <td className="py-3 px-4 text-gray-500">{row.stock}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    {row.status === "Approved" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50 text-[10px] font-MontserratMedium w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </div>
                    )}
                    {row.status === "Pending" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-yellow-200 text-yellow-600 bg-yellow-50 text-[10px] font-MontserratMedium w-fit">
                        <Clock className="w-3 h-3" /> Pending
                      </div>
                    )}
                    {row.status === "Rejected" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-200 text-red-600 bg-red-50 text-[10px] font-MontserratMedium w-fit">
                        <XCircle className="w-3 h-3" /> Rejected
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400">{row.date}</td>
                <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(activeRowId === row.id ? null : row.id);
                    }}
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-4 mt-2 w-36 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            onRowClick(row.id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          More Details
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            onRowClick(`${row.id}/review`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[#6A0DAD] transition-colors cursor-pointer"
                        >
                          Review Product
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            toast.error(`Deleting product: ${row.name}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[#f44336] transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-400 font-MontserratMedium text-xs">No records found matching your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
