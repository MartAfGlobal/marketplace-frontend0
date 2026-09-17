"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AdminRowCheckbox from "@/components/admin-components/AdminRowCheckbox";
import type { AccessLevel, AdminRoleListItem } from "@/types/admin";

interface RolesTableProps {
  rows: AdminRoleListItem[];
  loading: boolean;
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onSelectAll: () => void;
  onEdit: (role: AdminRoleListItem) => void;
  onDuplicate: (role: AdminRoleListItem) => void;
  onDelete: (role: AdminRoleListItem) => void;
}

const ACCESS_LEVEL_STYLES: Record<AccessLevel, string> = {
  RESTRICTED: "text-[#CA0202] bg-[#CA0202]/12",
  HIGH: "text-[#FFAC06] bg-[#FFAC06]/12",
  STANDARD: "text-[#4d7cfe] bg-[#4d7cfe]/12",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RolesTable({
  rows,
  loading,
  selectedIds,
  onToggleRow,
  onSelectAll,
  onEdit,
  onDuplicate,
  onDelete,
}: RolesTableProps) {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <div className="mx-auto flex">
                <AdminRowCheckbox checked={allSelected} onClick={onSelectAll} ariaLabel="Select all roles" />
              </div>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Role name</th>
            <th className="p-3 font-MontserratNormal text-sm">Access level</th>
            <th className="p-3 font-MontserratNormal text-sm">Access areas</th>
            <th className="p-3 font-MontserratNormal text-sm">Assigned staff</th>
            <th className="p-3 font-MontserratNormal text-sm">Last updated</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={7} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-ff715b" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((role) => {
              const visibleAreas = role.access_areas.slice(0, 3);
              const extraCount = role.access_areas.length - visibleAreas.length;

              return (
                <tr key={role.id} className="transition-colors">
                  <td className="p-3 align-top">
                    <AdminRowCheckbox
                      checked={selectedIds.includes(role.id)}
                      onClick={() => onToggleRow(role.id)}
                      ariaLabel={`Select ${role.name}`}
                    />
                  </td>
                  <td className="p-3 align-top max-w-72" onClick={() => onEdit(role)}>
                    <p className="text-000000 cursor-pointer">{role.name}</p>
                    <p className="text-c12 text-000000/44 font-MontserratNormal mt-0.5 line-clamp-2">
                      {role.description}
                    </p>
                  </td>
                  <td className="p-3 align-top">
                    <span
                      className={`text-[10px] px-4 py-1 inline-flex items-center justify-center h-6 rounded-c32 whitespace-nowrap ${ACCESS_LEVEL_STYLES[role.access_level]}`}
                    >
                      {role.access_level_display}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {visibleAreas.map((area) => (
                        <span
                          key={area}
                          className="text-[10px] font-MontserratNormal px-2 py-0.5 rounded-c32 bg-000000/4 text-000000/44 whitespace-nowrap"
                        >
                          {area}
                        </span>
                      ))}
                      {extraCount > 0 && (
                        <span className="text-[10px] font-MontserratNormal px-2 py-0.5 rounded-c32 bg-000000/4 text-000000/44">
                          +{extraCount}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 align-top text-000000">{role.assigned_staff}</td>
                  <td className="p-3 align-top">{formatDate(role.updated_at)}</td>
                  <td className="p-3 align-top text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={() => setActiveRowId(activeRowId === role.id ? null : role.id)}
                    >
                      <Image src={HandBug} alt="actions" width={16} height={16} />
                    </button>
                    <AnimatePresence>
                      {activeRowId === role.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-4 text-c12 font-MontserratNormal top-full px-4 mt-2 w-39.75 rounded-c8 bg-white shadow-custom border border-000000/4 overflow-hidden z-50"
                        >
                          <button
                            onClick={() => {
                              setActiveRowId(null);
                              onEdit(role);
                            }}
                            className="w-full py-2 text-left flex items-center gap-3 text-[#ff715b] hover:text-[#ff715b]/80 transition-colors"
                          >
                            Edit role
                          </button>
                          <button
                            onClick={() => {
                              setActiveRowId(null);
                              onDuplicate(role);
                            }}
                            className="w-full py-2 text-left flex items-center gap-3 text-000000/68 hover:text-000000 transition-colors"
                          >
                            Duplicate role
                          </button>
                          <button
                            onClick={() => {
                              setActiveRowId(null);
                              onDelete(role);
                            }}
                            disabled={role.role_type === "SYSTEM"}
                            className="w-full py-2 text-left flex items-center gap-3 text-[#CA0202] hover:text-[#CA0202]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete role
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="py-8 text-center text-000000/68 text-xs">
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
