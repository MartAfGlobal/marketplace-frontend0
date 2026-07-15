import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminBuyerData } from "@/types/global";

interface BuyersTableProps {
  rows: AdminBuyerData[];
  selectedUserIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onRowClick: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
  truncateText: (value: string | number | undefined, maxLength?: number) => string;
  onSuspendClick?: (row: AdminBuyerData) => void;
  onDeleteClick?: (row: AdminBuyerData) => void;
}

export default function BuyersTable({
  rows,
  selectedUserIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onRowClick,
  onSetActiveRowId,
  truncateText,
  onSuspendClick,
  onDeleteClick,
}: BuyersTableProps) {
  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                aria-label={rows.length > 0 ? "Select all visible users" : "No users to select"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 && rows.every((row) => selectedUserIds.includes(String(row.id)))
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
                    rows.length > 0 && rows.every((row) => selectedUserIds.includes(String(row.id)))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Full name</th>
            <th className="p-3 font-MontserratNormal text-sm">Email</th>
            <th className="p-3 font-MontserratNormal text-sm text-nowrap">Phone number</th>
            <th className="p-3 font-MontserratNormal text-sm text-center">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Total orders</th>
            <th className="p-3 font-MontserratNormal text-sm">Location</th>
            <th className="p-3 font-MontserratNormal text-sm">Disputes</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className=" text-sm text-000000/68 font-MontserratNormal">
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
                key={String(row.id)}
                className="transition-colors h-10.5 text-000000/68 cursor-pointer font-MontserratNormal text-sm"
              >
                <td className="py-3 px-4 text-000000/68 font-MontserratMedium">
                  <button
                    type="button"
                    aria-label={`Select ${row.first_name || ""} ${row.last_name || ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(String(row.id));
                    }}
                    className={`group flex h-4 w-4 items-center justify-center border transition-all duration-200 ${
                      selectedUserIds.includes(String(row.id))
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
                        selectedUserIds.includes(String(row.id))
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td onClick={() => onRowClick(String(row.user_id))} className="p-3">
                  <span className="block max-w-[190px] lg:w-[243px]  truncate" title={`${row.first_name || ""} ${row.last_name || ""}`.trim() || row.email}>
                    {`${row.first_name || ""} ${row.last_name || ""}`.trim() || row.user_id}
                  </span>
                </td>
                <td className="p-3 text-000000/68">
                  <span className="block max-w-[12rem]  lg:w-[243px] truncate" title={row.email}>{row.email}</span>
                </td>
                <td className="p-3 text-000000/68 max-w-[137px] text-center">{row.phone || "N/A"}</td>
                <td className="py-2.25  px-1 text-center">
                  <span
                    className={`text-[10px] px-4 py-1 flex items-center justify-center h-6 rounded-c32 text-center ${
                      row.account_status === "Active"
                        ? "text-[#00BE5C] bg-[#00BE5C]/12"
                        : "text-[#CA0202] bg-[#CA0202]/12"
                    }`}
                  >
                    {row.account_status}
                  </span>
                </td>
                <td className="p-3 text-center max-w-[124px] truncate">{row.total_orders ?? 0}</td>
                <td className="py-3 px-4 text-000000/68">
                  <span className="block max-w-[86px] truncate" title={row.state || row.city || ""}>
                    {truncateText(row.state || row.city || "N/A")}
                  </span>
                </td>
                <td className="p-3 text-center max-w-6.25 truncate">{row.disputes ?? 0}</td>
                <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(activeRowId === String(row.id) ? null : String(row.id));
                    }}
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === String(row.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 text-c12 font-MontserratNormal top-full px-4 mt-2 w-39.75 rounded-c8 bg-white shadow-custom border border-000000/4 overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            onRowClick(String(row.user_id));
                          }}
                          className="w-full py-2 text-left flex items-center gap-3"
                        >
                          <span className="text-[#ff715b] hover:text-[#ff715b]/80 transition-colors">More Details</span>
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            if (onSuspendClick) onSuspendClick(row);
                          }}
                          className="w-full py-2 text-left text-000000/68 hover:text-000000 transition-colors flex items-center gap-3"
                        >
                          {row.account_status === "Suspended" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            if (onDeleteClick) onDeleteClick(row);
                          }}
                          className="w-full py-2 text-left text-000000/68 hover:text-000000 transition-colors flex items-center gap-3"
                        >
                          <span className="text-[#CA0202]">Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="py-8 text-center text-000000/68  text-xs">No records found matching your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
