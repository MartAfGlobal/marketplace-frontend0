import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";

export interface OrderRow {
  id: string;
  buyer: string;
  vendors: string;
  extraVendors?: number;
  amount: string;
  payment: string;
  status: "Delivered" | "Processing" | "Processed" | "Cancelled" | "Approved" | "Pending" | "Rejected";
  date: string;
}

const statusStyles: Record<string, string> = {
  Delivered: "text-[#2ea37d] bg-[#28A745]/12",
  Processing: "text-[#FFAC06] bg-[#FFAC06]/12",
  Processed: "text-[#0070E9] bg-[#0070E9]/12",
  Cancelled: "text-[#CC0000] bg-[#CC0000]/12",
  Approved: "text-[#2ea37d] bg-[#28A745]/12",
  Pending: "text-[#FFAC06] bg-[#FFAC06]/12",
  Rejected: "text-[#CC0000] bg-[#CC0000]/12",
};

interface OrdersTableProps {
  rows: OrderRow[];
  selectedIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
}

export default function OrdersTable({
  rows,
  selectedIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onSetActiveRowId,
}: OrdersTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
                    ? "border-[#ff715b] bg-[#ff715b]"
                    : "border-white hover:border-[#ff715b]"
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
                    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 hover:opacity-100 hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Order ID</th>
            <th className="p-3 font-MontserratNormal text-sm">Buyer</th>
            <th className="p-3 font-MontserratNormal text-sm">Vendors</th>
            <th className="p-3 font-MontserratNormal text-sm">Amount</th>
            <th className="p-3 font-MontserratNormal text-sm">Payment</th>
            <th className="p-3 font-MontserratNormal text-sm">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Date</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-[11px] text-gray-700 font-MontserratMedium">
          {loading ? (
            <tr>
              <td colSpan={9} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-[#ff715b]" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
              >
                <td className="py-3 px-4 text-gray-400 font-MontserratMedium">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-4 w-4 mx-auto items-center justify-center border transition-all duration-200 ${
                      selectedIds.includes(row.id)
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
                        selectedIds.includes(row.id)
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td className="py-3 px-4 text-gray-500 font-MontserratMedium">
                  {row.id}
                </td>
                <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">
                  {row.buyer}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {row.vendors}
                  {row.extraVendors && row.extraVendors > 0 ? (
                    <span className="text-[#0070E9] ml-1">
                      +{row.extraVendors} more
                    </span>
                  ) : null}
                </td>
                <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">
                  {row.amount}
                </td>
                <td className="py-3 px-4 text-gray-500">{row.payment}</td>
                <td className="py-3 px-4">
                  <div
                    className={`inline-flex items-center justify-center text-[10px] font-MontserratMedium px-2.5 py-1 rounded-full uppercase w-fit ${
                      statusStyles[row.status] ||
                      "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {row.status}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{row.date}</td>
                <td
                  className="py-3 px-4 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(activeRowId === row.id ? null : row.id);
                    }}
                  >
                    <Image
                      src={HandBug}
                      alt="actions"
                      width={16}
                      height={16}
                    />
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
                            router.push(`/dashboard/admin/orders/${row.id}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            toast.info(`Tracking order: ${row.id}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            toast.error(`Cancelling order: ${row.id}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[#f44336] transition-colors cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={9}
                className="py-8 text-center text-gray-400 font-MontserratMedium text-xs"
              >
                No orders found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
