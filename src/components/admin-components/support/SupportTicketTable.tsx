import { MoreVertical } from "lucide-react";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import {
  formatSupportDate,
  getSupportPriorityStyle,
  getSupportStatusStyle,
  type SupportTicket,
} from "./supportTickets";

const STATUS_FILTERS = [
  "Open",
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
}: SupportTicketTableProps) {
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
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="h-10 bg-[#947fff] text-white">
              {[
                "Date",
                "Ticket ID",
                "Ticket subject",
                "Category",
                "Status",
                "Priority",
                "Assigned to",
                "",
              ].map((heading) => (
                <th
                  key={heading || "actions"}
                  className="whitespace-nowrap px-3 py-2 text-[10px] font-MontserratMedium"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[11px] font-MontserratNormal text-[#666]">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#999]">
                  Loading support tickets...
                </td>
              </tr>
            ) : tickets.length ? (
              tickets.map((ticket, index) => (
                <tr
                  key={`${ticket.id}-${index}`}
                  className="h-10 border-b border-[#000000]/5 last:border-0"
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatSupportDate(ticket.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {ticket.reference}
                  </td>
                  <td
                    className="max-w-44 truncate px-3 py-2"
                    title={ticket.subject}
                  >
                    {ticket.subject}
                  </td>
                  <td className="px-3 py-2">{ticket.category}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-1 text-[9px] ${getSupportStatusStyle(
                        ticket.status,
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-2 ${getSupportPriorityStyle(
                      ticket.priority,
                    )}`}
                  >
                    {ticket.priority}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {ticket.assignee}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onCopyReference(ticket.reference)}
                      title="Copy ticket ID"
                      aria-label={`Copy ticket ID ${ticket.reference}`}
                      className="rounded p-1 text-[#999] hover:bg-gray-50 hover:text-[#ff715b]"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#999]">
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
