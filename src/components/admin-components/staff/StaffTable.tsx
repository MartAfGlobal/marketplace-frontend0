"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AdminRowCheckbox from "@/components/admin-components/AdminRowCheckbox";
import type { AdminStaffListItem, StaffStatus } from "@/types/admin";

interface StaffTableProps {
  rows: AdminStaffListItem[];
  loading: boolean;
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onSelectAll: () => void;
  onSuspendRow: (row: AdminStaffListItem) => void;
  onResendInvite: (row: AdminStaffListItem) => void;
}

const STATUS_STYLES: Record<StaffStatus, string> = {
  ACTIVE: "text-[#00BE5C] bg-[#00BE5C]/12",
  PENDING: "text-[#FFAC06] bg-[#FFAC06]/12",
  SUSPENDED: "text-[#CA0202] bg-[#CA0202]/12",
  DEACTIVATED: "text-000000/44 bg-000000/8",
};

function formatLastActive(iso: string | null) {
  if (!iso) return "Never";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function StaffTable({
  rows,
  loading,
  selectedIds,
  onToggleRow,
  onSelectAll,
  onSuspendRow,
  onResendInvite,
}: StaffTableProps) {
  const router = useRouter();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.user_id));

  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <div className="mx-auto flex">
                <AdminRowCheckbox checked={allSelected} onClick={onSelectAll} ariaLabel="Select all staff" />
              </div>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Full name</th>
            <th className="p-3 font-MontserratNormal text-sm">Email</th>
            <th className="p-3 font-MontserratNormal text-sm">Role</th>
            <th className="p-3 font-MontserratNormal text-sm">Location</th>
            <th className="p-3 font-MontserratNormal text-sm text-center">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Last active</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={8} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-ff715b" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.user_id} className="transition-colors h-10.5 text-000000/68 font-MontserratNormal text-sm">
                <td className="py-3 px-4">
                  <AdminRowCheckbox
                    checked={selectedIds.includes(row.user_id)}
                    onClick={() => onToggleRow(row.user_id)}
                    ariaLabel={`Select ${row.full_name}`}
                  />
                </td>
                <td className="p-3" onClick={() => router.push(`/dashboard/admin/staff/${row.user_id}`)}>
                  <span className="block max-w-[190px] truncate cursor-pointer" title={row.full_name}>
                    {row.full_name}
                  </span>
                </td>
                <td className="p-3">
                  <span className="block max-w-[12rem] truncate" title={row.email}>
                    {row.email}
                  </span>
                </td>
                <td className="p-3">{row.role ?? "—"}</td>
                <td className="p-3">{row.location ?? "—"}</td>
                <td className="py-2.25 px-1 text-center">
                  <span
                    className={`text-[10px] px-4 py-1 inline-flex items-center justify-center h-6 rounded-c32 text-center ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status_display}
                  </span>
                </td>
                <td className="p-3">{formatLastActive(row.last_active)}</td>
                <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={() => setActiveRowId(activeRowId === row.user_id ? null : row.user_id)}
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.user_id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 text-c12 font-MontserratNormal top-full px-4 mt-2 w-39.75 rounded-c8 bg-white shadow-custom border border-000000/4 overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            setActiveRowId(null);
                            router.push(`/dashboard/admin/staff/${row.user_id}`);
                          }}
                          className="w-full py-2 text-left flex items-center gap-3"
                        >
                          <span className="text-[#ff715b] hover:text-[#ff715b]/80 transition-colors">More Details</span>
                        </button>
                        {row.status === "PENDING" && (
                          <button
                            onClick={() => {
                              setActiveRowId(null);
                              onResendInvite(row);
                            }}
                            className="w-full py-2 text-left text-000000/68 hover:text-000000 transition-colors flex items-center gap-3"
                          >
                            Resend invitation
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveRowId(null);
                            onSuspendRow(row);
                          }}
                          className="w-full py-2 text-left text-000000/68 hover:text-000000 transition-colors flex items-center gap-3"
                        >
                          Suspend
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-8 text-center text-000000/68 text-xs">
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
