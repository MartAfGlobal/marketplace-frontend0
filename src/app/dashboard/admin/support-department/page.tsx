"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import CreateTicketModal from "@/components/ui/Modals/admin/CreateTicketModal";
import { RootState } from "@/store";
import { downloadTableRows } from "@/utils/downloadTableRows";
import SupportStaffTable from "@/components/admin-components/support/SupportStaffTable";
import SupportStats from "@/components/admin-components/support/SupportStats";
import DropIcon from "@/assets/admin/whitedropIcon.svg"
import SupportTabs, {
  type SupportTabKey,
} from "@/components/admin-components/support/SupportTabs";
import SupportTicketTable from "@/components/admin-components/support/SupportTicketTable";
import {
  formatSupportDate,
  parseSupportTicketResponse,
  type SupportStaffRow,
  type SupportTicket,
} from "@/components/admin-components/support/supportTickets";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";

const PAGE_SIZE = 10;

export default function SupportDepartmentPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchAdminSupportTickets } = AdminDetails();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SupportTabKey>("tickets");
  const [searchVal, setSearchVal] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("This month");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  const loadTickets = useCallback(
    (targetPage: number = page) => {
      if (!token) return;
      setLoading(true);
      fetchAdminSupportTickets(
        targetPage,
        (data: unknown) => {
          const response = parseSupportTicketResponse(data);
          if (!response) {
            setTickets([]);
            setCount(0);
            setLoading(false);
            toast.error("The support tickets response could not be read.");
            return;
          }
          setTickets(response.tickets);
          setCount(response.count);
          setPageSize(response.pageSize);
          setLoading(false);
        },
        () => {
          setTickets([]);
          setCount(0);
          setLoading(false);
        },
      );
    },
    // AdminDetails returns fresh helper functions per render; requests depend on auth and page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, page],
  );

  useEffect(() => {
    loadTickets(page);
  }, [loadTickets, page]);

  const filteredTickets = useMemo(() => {
    const search = searchVal.trim().toLowerCase();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    weekStart.setHours(0, 0, 0, 0);

    return tickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        [
          ticket.reference,
          ticket.subject,
          ticket.category,
          ticket.assignee,
          ticket.status,
        ].some((value) => value.toLowerCase().includes(search));
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(ticket.status);
      const date = ticket.createdAt ? new Date(ticket.createdAt) : null;
      const matchesPeriod =
        selectedMonth === "All time" ||
        !date ||
        Number.isNaN(date.getTime()) ||
        (selectedMonth === "This week" && date >= weekStart) ||
        (selectedMonth === "This month" &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()) ||
        (selectedMonth === "This year" &&
          date.getFullYear() === now.getFullYear());

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [tickets, searchVal, selectedStatuses, selectedMonth]);

  const staffRows = useMemo<SupportStaffRow[]>(() => {
    const totals = new Map<string, number>();
    filteredTickets.forEach((ticket) => {
      if (ticket.assignee !== "—") {
        totals.set(ticket.assignee, (totals.get(ticket.assignee) ?? 0) + 1);
      }
    });
    return Array.from(totals, ([name, assignedTickets]) => ({
      name,
      assignedTickets,
    }));
  }, [filteredTickets]);

  const handleExport = () => {
    downloadTableRows(
      filteredTickets.map((ticket) => ({
        date: formatSupportDate(ticket.createdAt),
        ticket_id: ticket.reference,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assignee,
      })),
      "support-tickets",
    );
  };

  const copyTicketReference = async (reference: string) => {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success("Ticket ID copied.");
    } catch {
      toast.error("Could not copy the ticket ID.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const showPagination = count > pageSize;

  return (
    <div className="space-y-6  rounded-2xl py-6 px-c32  animate-in fade-in duration-300 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl  font-MontserratMedium text-000000">
          Tickets
        </h1>
        <Button
          type="button"
          onClick={() => setIsCreateTicketOpen(true)}
          className="max-w-[167.15px] gap-3 flex items-center justify-center"
        >
          Create ticket
          <Image src={DropIcon} alt="drop" width={16.61} height={9.06} />
        </Button>
      </div>

      <SupportStats count={count} tickets={tickets} />

      <section className="rounded-2xl border border-000000/4 bg-white p-4 md:p-6 mt-2">
        <SupportTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "tickets" ? (
          <SupportTicketTable
            tickets={filteredTickets}
            loading={loading}
            searchVal={searchVal}
            onSearchChange={setSearchVal}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onExport={handleExport}
            onCopyReference={copyTicketReference}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPagination={showPagination}
          />
        ) : (
          <SupportStaffTable
            rows={staffRows}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPagination={showPagination}
          />
        )}
      </section>

      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        onSuccess={() => loadTickets(page)}
        availableStaff={staffRows.map((staff) => ({ name: staff.name }))}
      />
    </div>
  );
}
