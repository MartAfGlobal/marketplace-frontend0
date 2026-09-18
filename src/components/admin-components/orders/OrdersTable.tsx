import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export interface OrderRow {
  id: string;
  orderId: string;
  trackingNumber?: string;
  buyer: string;
  vendors: string;
  extraVendors?: number;
  amount: string;
  location: string;
  status: string;
  date: string;
  hasDispute?: boolean;
}

export const renderStatus = (status: string) => {
  const s = (status ?? "").trim().toLowerCase();

  // ── Dispute closed (purple) ───────────────────────────────────────────────
  if (
    s === "dispute closed" ||
    s === "dispute_closed" ||
    s === "closed"
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-[#6A0DAD] bg-[#6A0DAD]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <CheckCircle2 size={14} />
        Dispute closed
      </span>
    );
  }

  // ── Delivered (green) ──────────────────────────────────────────────────────
  if (
    s === "delivered" ||
    s === "received by buyer" ||
    s === "received_by_buyer" ||
    s === "completed" ||
    s === "fulfilled" ||
    s === "successful"
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <CheckCircle2 size={14} />
        Delivered
      </span>
    );
  }

  // ── Disputed / Rejected / Cancelled / Return Requested (red) ────────────────
  if (
    s === "disputed" ||
    s === "dispute raised" ||
    s === "dispute ongoing" ||
    s === "return_requested" ||
    s === "return requested" ||
    s === "rejected" ||
    s === "cancelled" ||
    s === "canceled"
  ) {
    const label =
      s === "dispute ongoing"
        ? "Dispute ongoing"
        : s === "disputed" || s === "dispute raised" || s === "return_requested" || s === "return requested"
        ? "Disputed"
        : s === "rejected"
        ? "Rejected"
        : "Cancelled";
    return (
      <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
        <XCircle size={14} />
        {label}
      </span>
    );
  }

  // ── Ongoing (yellow) — everything else ────────────────────────────────────
  return (
    <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3 text-[10px] font-MontserratMedium">
      <Clock3 size={14} />
      Ongoing
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
  onViewDispute?: (row: OrderRow) => void;
}

export default function OrdersTable({
  rows,
  selectedIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onSetActiveRowId,
  onViewDispute,
}: OrdersTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap py-[10.5px]">
            <th className="font-MontserratNormal text-sm text-center  px-3.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-3 w-3 items-center justify-center border duration-200 ${
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
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%]">Date</th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%]">Order ID</th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%] w-[203.4]">
              Buyer
            </th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%] w-[203.4]">
              Business name
            </th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%]">Status</th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%]">Amount</th>

            <th className=" px-3  font-MontserratNormal text-sm leading-[1%]">Location</th>
            <th className=" px-3  font-MontserratNormal text-sm leading-[1%] text-center"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal leading-[21px] text-nowrap truncate">
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
                className="hover:bg-gray-50/50 transition-colors h-c45 py-3"
              >
                <td className="px-3  font-MontserratMedium">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-3 w-3 mx-auto items-center justify-center border transition-all duration-200 cursor-pointer ${
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
                <td className="px-3">
                  <span className="block max-w-[104px] truncate" title={row.date}>
                    {row.date}
                  </span>
                </td>
                <td className="px-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/admin/orders/${row.id}?from=Orders`)}
                    className="block max-w-[111px] truncate text-left font-MontserratMedium cursor-pointer"
                    title={row.orderId}
                  >
                    {row.orderId}
                  </button>
                </td>
                <td className="px-3">
                  <span className="block max-w-[203.4px] truncate" title={row.buyer}>
                    {row.buyer}
                  </span>
                </td>
                <td className="px-3">
                  <span className="block max-w-[203.4px] truncate" title={row.vendors}>
                    {row.vendors}
                  </span>
                </td>
               
                <td className="px-1">
                  {renderStatus(row.status)}
                </td>
                <td className="px-3">
                  <span className="block max-w-[107px] truncate" title={row.amount}>
                    {row.amount}
                  </span>
                </td>
                <td className="px-3">
                  <span className="block max-w-[91px] truncate" title={row.location}>
                    {row.location}
                  </span>
                </td>
                <td
                  className="px-3 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-4 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
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
                            router.push(`/dashboard/admin/orders/${row.id}?from=Orders`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        {row.hasDispute && onViewDispute && (
                          <button
                            onClick={() => {
                              onSetActiveRowId(null);
                              onViewDispute(row);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                          >
                            View dispute
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            const target = row.trackingNumber || row.orderId || row.id;
                            router.push(`/dashboard/admin/orders/${encodeURIComponent(target)}?from=Orders`);
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
