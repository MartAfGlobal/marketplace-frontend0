import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { toast } from "sonner";
import HandBug from "@/assets/Seller/handBug.png";
import ViewIcon from "@/assets/admin/eye.svg";
import SuspendIcon from "@/assets/admin/pause.svg";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminSellerData } from "@/types/global";

interface SellersTableProps {
  rows: AdminSellerData[];
  selectedUserIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onRowClick: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
  truncateText: (
    value: string | number | undefined,
    maxLength?: number,
  ) => string;
  onSuspendClick?: (row: AdminSellerData) => void;
  onDeleteClick?: (row: AdminSellerData) => void;
}


const renderKycStatus = (
  status?: string,
) => {
  switch (status) {
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 text-[#00BE5C] bg-[#00BE5C]/12 h-6 rounded-c32 px-3">
          <CheckCircle2 size={14} />
          Verified
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 text-[#FFAC06] bg-[#FFAC06]/12 h-6 rounded-c32 px-3">
          <Clock3 size={14} />
          Pending
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 text-[#CA0202] bg-[#CA0202]/12 h-6 rounded-c32 px-3">
          <XCircle size={14} />
          Rejected
        </span>
      );
    default:
      return null;
  }
};

export default function SellersTable({
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
}: SellersTableProps) {
  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                aria-label={
                  rows.length > 0
                    ? "Select all visible sellers"
                    : "No sellers to select"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 &&
                  rows.every((row) => selectedUserIds.includes(row.user_id))
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
                    rows.length > 0 &&
                    rows.every((row) => selectedUserIds.includes(row.user_id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Business name</th>
            <th className="p-3 font-MontserratNormal text-sm">Business type</th>
            <th className="p-3 font-MontserratNormal text-sm text-center">
              Status
            </th>
            <th className="p-3 font-MontserratNormal text-sm">
              Total products
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Total orders</th>
            <th className="p-3 font-MontserratNormal text-sm">Location</th>
            <th className="p-3 font-MontserratNormal text-sm text-center">
              KYC status
            </th>
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
                key={row.user_id}
                className="transition-colors h-10.5 text-000000/68 cursor-pointer font-MontserratNormal text-sm"
              >
                <td className="py-3 px-4 ">
                  <button
                    type="button"
                    aria-label={`Select ${row.company_name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.user_id);
                    }}
                    className={`group flex h-4 w-4 items-center justify-center border transition-all duration-200 ${
                      selectedUserIds.includes(row.user_id)
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
                        selectedUserIds.includes(row.user_id)
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td
                  onClick={() => {
                    onSetActiveRowId(row.user_id);
                    onRowClick(row.user_id);
                  }}
                  className="p-3 "
                >
                  <span
                    className="block max-w-[190px] truncate"
                    title={row.company_name}
                  >
                    {row.company_name}
                  </span>
                </td>
                <td className="p-3 text-gray-500 capitalize">
                  {row.is_registered_business ? "Registered " : "Individual"}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`text-[10px] px-4 py-1 h-6 rounded-c32 text-center ${
                      row.user_status === "Active"
                        ? "text-[#00BE5C] bg-[#00BE5C]/12"
                        : "text-[#CA0202] bg-[#CA0202]/12"
                    }`}
                  >
                    {row.user_status}
                  </span>
                </td>
                <td className="p-3 text-center">{row.total_products ?? 0}</td>
                <td className="p-3 text-center">{row.total_orders}</td>
                <td className="py-3 px-4 text-gray-400">
                  <span
                    className="block max-w-[8rem] truncate"
                    title={
                      row.location ||
                      row.company_country_name ||
                      "N/A"
                    }
                  >
                    {truncateText(
                      row.location ||
                        row.company_country_name ||
                        "N/A",
                    )}
                  </span>
                </td>
                <td className="py-3 px-4 text-[10px] text-center">
                  {renderKycStatus(row.kyc_status)}
                </td>
                <td
                  className="py-3 px-4 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(
                        activeRowId === row.user_id ? null : row.user_id,
                      );
                    }}
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.user_id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 text-c12 font-MontserratNormal top-full px-4 mt-2 w-39.75 rounded-c8 bg-white shadow-custom border border-000000/4 overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(row.user_id);
                            onRowClick(row.user_id);
                          }}
                          className="w-full py-2 text-left flex items-center gap-3"
                        >
                          <Image
                            src={ViewIcon}
                            alt="View"
                            width={15}
                            height={10}
                          />
                          <span className="text-[#ff715b] hover:text-[#ff715b]/80 transition-colors">
                            More Details
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(row.user_id);
                            if (onSuspendClick) {
                              onSuspendClick(row);
                            } else {
                              toast.info(
                                `${row.user_status === "Suspended" ? "Unsuspending" : "Suspending"} seller: ${row.company_name}`,
                              );
                            }
                          }}
                          className="w-full py-2 text-left text-000000/68 hover:text-000000 transition-colors flex items-center gap-3"
                        >
                          <Image
                            src={SuspendIcon}
                            alt="Suspend"
                            width={11}
                            height={12}
                          />
                          <span>{row.user_status === "Suspended" ? "Unsuspend" : "Suspend"}</span>
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
              <td
                colSpan={9}
                className="py-8 text-center text-gray-400  text-xs"
              >
                No records found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
