import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";

import { CheckCircle2, Clock3, XCircle, Truck } from "lucide-react";

export interface OrderRow {
  id: string;
  buyer: string;
  vendors: string;
  extraVendors?: number;
  amount: string;
  location: string;
  status: string;
  date: string;
}

export const renderStatus = (status: string) => {
  const s = (status ?? "").trim().toLowerCase();

  if (
    s === "accepted" ||
    s === "approved" ||
    s === "delivered" ||
    s === "completed" ||
    s === "fulfilled" ||
    s === "successful" ||
    s === "active"
  ) {
    const label =
      s === "accepted"
        ? "Accepted"
        : s === "approved"
        ? "Approved"
        : s === "delivered"
        ? "Delivered"
        : s === "completed"
        ? "Completed"
        : s === "fulfilled"
        ? "Fulfilled"
        : status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Accepted";

    return (
      <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <CheckCircle2 size={14} />
        {label}
      </span>
    );
  }

  if (
    s === "rejected" ||
    s === "cancelled" ||
    s === "canceled" ||
    s === "disputed" ||
    s === "dispute" ||
    s === "returned" ||
    s === "refunded"
  ) {
    const isCancelled = s === "cancelled" || s === "canceled";
    const label = isCancelled
      ? "Cancelled"
      : s === "rejected"
      ? "Rejected"
      : s === "disputed" || s === "dispute"
      ? "Disputed"
      : s === "returned"
      ? "Returned"
      : s === "refunded"
      ? "Refunded"
      : status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Rejected";

    const colorClass = isCancelled
      ? "text-[#807C79] bg-[#807C79]/12"
      : "text-[#CA0202] bg-[#CA0202]/12";

    return (
      <span
        className={`inline-flex items-center gap-1 ${colorClass} h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium`}
      >
        <XCircle size={14} />
        {label}
      </span>
    );
  }

  if (s === "shipped" || s === "in transit" || s === "in_transit") {
    const label = s === "shipped" ? "Shipped" : "In Transit";
    return (
      <span className="inline-flex items-center gap-1 text-[#947FFF] bg-[#947FFF]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <Truck size={14} />
        {label}
      </span>
    );
  }

  if (s === "processing" || s === "processed") {
    return (
      <span className="inline-flex items-center gap-1 text-[#318af7] bg-[#318af7]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <Clock3 size={14} />
        Processing
      </span>
    );
  }

  if (s === "partially accepted" || s === "partially_accepted") {
    return (
      <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <Clock3 size={14} />
        Partially Accepted
      </span>
    );
  }

  // Pending / Ongoing / Default fallback
  const label = status
    ? status
        .split(/[_\s]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Pending";

  return (
    <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
      <Clock3 size={14} />
      {label}
    </span>
  );
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
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap ">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 &&
                  rows.every((row) => selectedIds.includes(row.id))
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
                    rows.length > 0 &&
                    rows.every((row) => selectedIds.includes(row.id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 hover:opacity-100 hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Date</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Order ID</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] w-[203.4]">
              Buyer
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] w-[203.4]">
              Business name
            </th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Status</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Amount</th>

            <th className="p-3 font-MontserratNormal text-sm leading-[1%]">Location</th>
            <th className="p-3 font-MontserratNormal text-sm leading-[1%] text-center"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
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
                className="hover:bg-gray-50/50 transition-colors h-14"
              >
                <td className="py-3 px-4  font-MontserratMedium">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-4 w-4 mx-auto items-center justify-center border transition-all duration-200 cursor-pointer ${
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
                <td className="py-3 px-4">
                  <span className="block max-w-[90px] truncate" title={row.date}>
                    {row.date}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/admin/orders/${row.id}`)}
                    className="block max-w-[120px] truncate text-left font-MontserratMedium cursor-pointer"
                    title={row.id}
                  >
                    {row.id}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[120px] truncate" title={row.buyer}>
                    {row.buyer}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[120px] truncate" title={row.vendors}>
                    {row.vendors}
                  </span>
                </td>
               
                <td className="py-3 px-4">
                  {renderStatus(row.status)}
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[120px] truncate" title={row.amount}>
                    {row.amount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="block max-w-[140px] truncate" title={row.location}>
                    {row.location}
                  </span>
                </td>
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
                            router.push(`/dashboard/admin/orders/${row.id}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            router.push(`/dashboard/admin/orders/track/${row.id}`);
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
                className="py-8 text-center  font-MontserratMedium text-xs"
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
