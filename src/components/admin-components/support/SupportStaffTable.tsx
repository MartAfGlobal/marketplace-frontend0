"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Ticket } from "lucide-react";
import HandBug from "@/assets/Seller/handBug.png";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import {
  formatSupportDate,
  type SupportStaffRow,
} from "./supportTickets";

interface SupportStaffTableProps {
  rows: SupportStaffRow[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPagination: boolean;
  onAssignTicket?: (staff: SupportStaffRow) => void;
}

function formatLastActive(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusStyle(status: string) {
  const value = status.toLowerCase();
  if (value === "available") return "bg-[#e2f8ee] text-[#2ea37d]";
  if (value === "busy") return "bg-[#fff3d8] text-[#d9951d]";
  if (value === "inactive") return "bg-[#ffe7e5] text-[#e96b61]";
  return "bg-[#f1f1f1] text-[#777777]";
}

export default function SupportStaffTable({
  rows,
  loading,
  page,
  totalPages,
  onPageChange,
  showPagination,
  onAssignTicket,
}: SupportStaffTableProps) {
  const router = useRouter();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="h-10 bg-[#947fff] text-white">
              {["Date", "Last active", "Staff name", "Assigned", "In progress", "Closed", "Status", ""].map(
                (heading, index) => (
                  <th
                    key={heading || `actions-${index}`}
                    className="whitespace-nowrap px-3 py-2 text-[10px] font-MontserratMedium"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="text-[11px] font-MontserratNormal text-[#666]">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#999]">
                  Loading support staff...
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((staff) => (
                <tr
                  key={staff.id || staff.name}
                  className="h-11.25 border-[#000000]/5 last:border-0"
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatSupportDate(staff.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{formatLastActive(staff.lastActive)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{staff.name || staff.email}</td>
                  <td className="px-3 py-2">{staff.assignedTickets ?? 0}</td>
                  <td className="px-3 py-2">{staff.inProgressTickets ?? 0}</td>
                  <td className="px-3 py-2">{staff.closedTickets ?? 0}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-1 text-[9px] ${statusStyle(
                        staff.status,
                      )}`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td
                    className="relative px-3 py-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label={`Actions for ${staff.name}`}
                      aria-haspopup="menu"
                      aria-expanded={activeRowId === (staff.id || staff.name)}
                      onClick={() =>
                        setActiveRowId((current) =>
                          current === (staff.id || staff.name)
                            ? null
                            : staff.id || staff.name,
                        )
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <Image src={HandBug} alt="" width={16} height={16} />
                    </button>
                    <AnimatePresence>
                      {activeRowId === (staff.id || staff.name) && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          role="menu"
                          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#eef0f3] bg-white px-6 py-3 shadow-lg"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            disabled={!staff.id}
                            onClick={() => {
                              setActiveRowId(null);
                              if (staff.id) {
                                router.push(
                                  `/dashboard/admin/support-department/staff-management/${encodeURIComponent(
                                    staff.id,
                                  )}`,
                                );
                              }
                            }}
                            className="flex w-full items-center gap-5 py-3 text-left text-base font-MontserratNormal text-[#999] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Eye className="h-6 w-6 text-[#999]" />
                            More details
                          </button>
                          {staff.status.toLowerCase() === "available" &&
                            onAssignTicket && (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setActiveRowId(null);
                                  onAssignTicket(staff);
                                }}
                                className="flex w-full items-center gap-5 py-3 text-left text-base font-MontserratNormal text-[#999] hover:bg-gray-50"
                              >
                                <Ticket className="h-6 w-6 text-[#999]" />
                                Assign ticket
                              </button>
                            )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#999]">
                  No support staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
