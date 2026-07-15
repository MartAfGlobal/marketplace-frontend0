"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MoreVertical, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";

import { useState } from "react";
import { KycVerificationData } from "@/types/global";

interface VerificationsTableProps {
  rows: KycVerificationData[];
  selectedIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onRowClick: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
}

export default function VerificationsTable({
  rows,
  selectedIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onRowClick,
  onSetActiveRowId,
}: VerificationsTableProps) {
  const [searchVal, setSearchVal] = useState("");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split("T")[0].split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${year}-${day}-${month}`;
      }
      return dateString;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${day}-${month}`;
  };


  return (
    <div className="overflow-x-auto min-h-[250px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className=" mb-4">
        <h2 className="text-base font-MontserratNormal text-000000 mb-6">
          Verifications table table
        </h2>

        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search seller by ID, name or email...`}
          searchExpandable={true}
          filterOptions={["Date", "Status", "Country", "Quantity"]}
          onFilterChange={(filters) =>
            console.log("Selected filters:", filters)
          }
        />
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3 ">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 &&
                  rows.every((row) => selectedIds.includes(String(row.id)))
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
                    rows.every((row) => selectedIds.includes(String(row.id)))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 hover:opacity-100 hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">
              Submission date
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Business name</th>
            <th className="p-3 font-MontserratNormal text-sm">Business type</th>
            <th className="p-3 font-MontserratNormal text-sm">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">
              Business location
            </th>
            <th
              className="p-3 font-MontserratNormal text-sm  text-center"
              colSpan={2}
            >
              Time in queue
            </th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={8} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-[#ff715b]" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(String(row.id))}
                className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer text-000000/68 font-MontserratNormal"
              >
                <td className="p-3  text-000000/68 font-MontserratNormal">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(String(row.id));
                    }}
                    className={`group flex h-4 w-4 mx-auto items-center justify-center border transition-all duration-200 ${
                      selectedIds.includes(String(row.id))
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
                        selectedIds.includes(String(row.user_id))
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td className="p-3  text-000000/68">{formatDate(row.submission_date)}</td>
                <td className="p-3  ">{row.business_name ?? ""}</td>
                <td className="p-3  text-000000/68">{row.business_type}</td>
                <td className="p-3 ">
                  <div className="flex items-center gap-1.5">
                    {(row.status === "VERIFIED" || row.status === "Verified") && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50 text-[10px] font-MontserratMedium w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </div>
                    )}
                    {(row.status === "PENDING" || row.status === "Pending") && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-yellow-200 text-yellow-600 bg-yellow-50 text-[10px] font-MontserratMedium w-fit">
                        <Clock className="w-3 h-3" /> Pending
                      </div>
                    )}
                    {(row.status === "REJECTED" || row.status === "Rejected") && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-200 text-red-600 bg-red-50 text-[10px] font-MontserratMedium w-fit">
                        <XCircle className="w-3 h-3" /> Rejected
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3  text-000000/68">{row.business_location ?? ""}</td>
                <td className="p-3  text-000000/68">
                  <span
                    className={
                      row.time_in_queue_display === "Completed" ? "text-green-500" : ""
                    }
                  >
                    {row.time_in_queue_display}
                  </span>
                </td>
                <td
                  className="p-3  text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(activeRowId === String(row.user_id) ? null : String(row.user_id));
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {activeRowId === String(row.user_id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute -right-3 top-7 mt-2 w-37.5 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(row.user_id);
                            onRowClick(String(row.user_id));
                          }}
                          className="w-full text-left   py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer justify-center flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" /> 
                          <span className="text-ff715b">More details</span>
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
                colSpan={8}
                className="py-8 text-center text-gray-400 font-MontserratMedium text-xs"
              >
                No verifications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
