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
  location: string;
  status: string;
  date: string;
}

const statusConfig: Record<
  string,
  { pill: string; icon: React.ReactNode; label: string }
> = {
  Delivered: {
    pill: "text-[#2ea37d] bg-[#2ea37d]/10",
    label: "Delivered",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#2ea37d" strokeWidth="1.2" />
        <path
          d="M4.5 7l2 2 3-3"
          stroke="#2ea37d"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  Ongoing: {
    pill: "text-[#FFAC06] bg-[#FFAC06]/10",
    label: "Ongoing",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 2h8M3 12h8M4.5 2v2.5C4.5 6.5 7 7 7 7s-2.5.5-2.5 2.5V12M9.5 2v2.5C9.5 6.5 7 7 7 7s2.5.5 2.5 2.5V12"
          stroke="#FFAC06"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  Pending: {
    pill: "text-[#FFAC06] bg-[#FFAC06]/10",
    label: "Pending",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#FFAC06" strokeWidth="1.2" />
        <path
          d="M7 4v3.5l2 1"
          stroke="#FFAC06"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  Processing: {
    pill: "text-[#318af7] bg-[#318af7]/10",
    label: "Processing",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#318af7" strokeWidth="1.2" />
        <path
          d="M7 3.5v3.5h3"
          stroke="#318af7"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  Shipped: {
    pill: "text-[#947FFF] bg-[#947FFF]/10",
    label: "Shipped",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#947FFF" strokeWidth="1.2" />
        <path
          d="M4 7h6M7 4l3 3-3 3"
          stroke="#947FFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  Rejected: {
    pill: "text-[#E8334A] bg-[#E8334A]/10",
    label: "Rejected",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#E8334A" strokeWidth="1.2" />
        <path
          d="M5 5l4 4M9 5l-4 4"
          stroke="#E8334A"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  Cancelled: {
    pill: "text-[#807C79] bg-[#807C79]/10",
    label: "Cancelled",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#807C79" strokeWidth="1.2" />
        <path
          d="M5 5l4 4M9 5l-4 4"
          stroke="#807C79"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  Disputed: {
    pill: "text-[#E8334A] bg-[#E8334A]/10",
    label: "Disputed",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#E8334A" strokeWidth="1.2" />
        <path
          d="M5 5l4 4M9 5l-4 4"
          stroke="#E8334A"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  "Partially Accepted": {
    pill: "text-[#FFAC06] bg-[#FFAC06]/10",
    label: "Partially Accepted",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke="#FFAC06" strokeWidth="1.2" />
        <path
          d="M5 7h4"
          stroke="#FFAC06"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
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
                  {(() => {
                    const cfg = statusConfig[row.status];
                    return cfg ? (
                      <div
                        className={`inline-flex items-center gap-1.5 text-[11px] font-MontserratMedium px-3 py-1 rounded-full w-fit ${cfg.pill}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </div>
                    ) : (
                      <span className=" text-[11px]">
                        {row.status}
                      </span>
                    );
                  })()}
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
