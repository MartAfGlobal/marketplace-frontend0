"use client";

import { useState } from "react";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import {
  formatSupportDate,
  getSupportStatusLabel,
  getSupportStatusStyle,
  type SupportTicket,
} from "./supportTickets";
import SupportPriorityLabel from "./SupportPriorityLabel";

const STATUS_FILTERS = [
  "To Do",
  "Pending",
  "Closed",
  "In progress",
  "Under review",
  "To do",
];

interface SupportTicketTableProps {
  tickets: SupportTicket[];
  loading: boolean;
  searchVal: string;
  onSearchChange: (value: string) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onExport: () => void;
  onCopyReference: (reference: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPagination: boolean;
  canViewStaff?: boolean;
}

export default function SupportTicketTable({
  tickets,
  loading,
  searchVal,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  selectedMonth,
  onMonthChange,
  onExport,
  onCopyReference,
  page,
  totalPages,
  onPageChange,
  showPagination,
  canViewStaff = true,
}: SupportTicketTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const headings = [
    "Date",
    "Ticket ID",
    "Ticket subject",
    "Category",
    "Status",
    "Priority",
    ...(canViewStaff ? ["Assigned to"] : []),
    "",
  ];
  const columnCount = headings.length;

  return (
    <>
      <AdminListHeader
        searchVal={searchVal}
        setSearchVal={onSearchChange}
        placeholder="Search tickets..."
        searchExpandable
        filterOptions={STATUS_FILTERS}
        selectedFilters={selectedStatuses}
        onFilterChange={onStatusChange}
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        periodOptions={["This week", "This month", "This year", "All time"]}
        onExportClick={onExport}
      />
      <div className="overflow-x-auto">
        <table
          className={`w-full ${
            canViewStaff ? "min-w-[820px]" : "min-w-[650px]"
          } border-collapse text-left`}
        >
          <thead>
            <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
              {headings.map((heading) => (
                <th
                  key={heading || "actions"}
                  className="whitespace-nowrap px-3 font-MontserratNormal text-sm"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-000000/68 font-MontserratNormal leading-[21px] text-nowrap">
            {loading ? (
              <tr>
                <td colSpan={columnCount} className="p-8 text-center text-[#999]">
                  Loading support tickets...
                </td>
              </tr>
            ) : tickets.length ? (
              tickets.map((ticket, index) => {
                const menuId = `${ticket.id}-${index}`;
                const detailHref =
                  ticket.id && ticket.id !== "—"
                    ? `/dashboard/admin/support-department/tickets/${encodeURIComponent(
                        ticket.id,
                      )}`
                    : null;

                return (
                <tr
                  key={menuId}
                  className="h-c45 py-3 transition-colors hover:bg-gray-50/50"
                >
                  <td className="whitespace-nowrap px-3">
                    {formatSupportDate(ticket.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3">
                    {ticket.id && ticket.id !== "—" ? (
                      <Link
                        href={`/dashboard/admin/support-department/tickets/${encodeURIComponent(
                          ticket.id,
                        )}`}
                        className="text-[#673ab7] hover:underline"
                      >
                        {ticket.reference}
                      </Link>
                    ) : (
                      ticket.reference
                    )}
                  </td>
                  <td
                    className="max-w-44 truncate px-3"
                    title={ticket.subject}
                  >
                    {ticket.id && ticket.id !== "—" ? (
                      <Link
                        href={`/dashboard/admin/support-department/tickets/${encodeURIComponent(
                          ticket.id,
                        )}`}
                        className="hover:text-[#673ab7] hover:underline"
                      >
                        {ticket.subject}
                      </Link>
                    ) : (
                      ticket.subject
                    )}
                  </td>
                  <td className="px-3">{ticket.category}</td>
                  <td className="px-3">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-MontserratMedium ${getSupportStatusStyle(
                        ticket.status,
                      )}`}
                    >
                      {getSupportStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3">
                    <SupportPriorityLabel priority={ticket.priority} />
                  </td>
                  {canViewStaff && (
                    <td className="whitespace-nowrap px-3">
                      {ticket.assignee}
                    </td>
                  )}
                  <td
                    className="relative px-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label={`Actions for ticket ${ticket.reference}`}
                      aria-haspopup="menu"
                      aria-expanded={activeMenu === menuId}
                      onClick={() =>
                        setActiveMenu((current) =>
                          current === menuId ? null : menuId,
                        )
                      }
                      className="rounded p-1 text-[#999] hover:bg-gray-50 hover:text-[#ff715b]"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                    {activeMenu === menuId && (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#eeeeee] bg-white p-2 shadow-lg"
                      >
                        {detailHref ? (
                          <Link
                            href={detailHref}
                            role="menuitem"
                            onClick={() => setActiveMenu(null)}
                            className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-xs text-[#666] hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 text-[#999]" />
                            More details
                          </Link>
                        ) : (
                          <span
                            role="menuitem"
                            aria-disabled="true"
                            className="flex items-center gap-3 rounded px-3 py-2 text-xs text-[#aaa]"
                          >
                            <Eye className="h-4 w-4" />
                            More details unavailable
                          </span>
                        )}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setActiveMenu(null);
                            onCopyReference(ticket.reference);
                          }}
                          className="w-full rounded px-3 py-2 text-left text-xs text-[#666] hover:bg-gray-50"
                        >
                          Copy ticket ID
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columnCount} className="p-8 text-center text-[#999]">
                  No support tickets found.
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
