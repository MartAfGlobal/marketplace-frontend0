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
import DropIcon from "@/assets/admin/whitedropIcon.svg";
import SupportTabs, {
  type SupportTabKey,
} from "@/components/admin-components/support/SupportTabs";
import SupportTicketTable from "@/components/admin-components/support/SupportTicketTable";
import ActiveSupportAgent from "@/assets/admin/support-available.png";
import InactiveSupportAgent from "@/assets/admin/support-inactive.png";
import {
  formatSupportDate,
  getSupportStatusLabel,
  parseSupportAgentResponse,
  parseSupportTicketResponse,
  type SupportStaffRow,
  type SupportTicket,
} from "@/components/admin-components/support/supportTickets";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import {
  ChevronDown,
  Headphones,
} from "lucide-react";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";

const PAGE_SIZE = 10;

function parseAvailability(data: unknown): boolean | null {
  let payload = data;
  for (let depth = 0; depth < 2; depth += 1) {
    if (
      payload === null ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      !("data" in payload)
    ) {
      break;
    }
    payload = payload.data;
  }

  if (
    payload !== null &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "is_available" in payload &&
    typeof payload.is_available === "boolean"
  ) {
    return payload.is_available;
  }
  return null;
}

export default function SupportDepartmentPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { can } = useAdminAccess();
  const {
    fetchAdminSupportAgents,
    fetchAdminSupportAgentAvailability,
    updateAdminSupportAgentAvailability,
    fetchAdminSupportTickets,
  } = AdminDetails();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [supportAgents, setSupportAgents] = useState<SupportStaffRow[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SupportTabKey>("tickets");
  const [searchVal, setSearchVal] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("This month");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [initialAssignedStaffId, setInitialAssignedStaffId] = useState("");
  const [availability, setAvailability] = useState<"Available" | "Inactive">(
    "Available",
  );
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [isAvailabilityMenuOpen, setIsAvailabilityMenuOpen] = useState(false);

  const canViewSupport = can("SUPPORT");
  const canViewStaff = can("STAFF");
  const canCreateTicket = can("SUPPORT", "create");
  const isSupportAgent = canViewSupport && !canViewStaff;
  const canAssignStaff = canViewStaff;

  useEffect(() => {
    if (!canViewStaff) setActiveTab("tickets");
  }, [canViewStaff]);
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

  useEffect(() => {
    if (!token || !canViewStaff) {
      setSupportAgents([]);
      setStaffLoading(false);
      return;
    }

    let active = true;
    setStaffLoading(true);
    fetchAdminSupportAgents(
      (data: unknown) => {
        if (!active) return;
        const agents = parseSupportAgentResponse(data);

        if (!agents) {
          setSupportAgents([]);
          toast.error("The support agents response could not be read.");
        } else {
          setSupportAgents(agents);
        }
        setStaffLoading(false);
      },
      () => {
        if (!active) return;
        setSupportAgents([]);
        setStaffLoading(false);
        toast.error("Could not load support staff. Please try again.");
      },
    );

    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on auth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, canViewStaff]);

  useEffect(() => {
    if (!token || !isSupportAgent) return;

    let active = true;
    fetchAdminSupportAgentAvailability(
      (data: unknown) => {
        if (!active) return;
        const isAvailable = parseAvailability(data);
        if (isAvailable === null) {
          toast.error("The support availability response could not be read.");
          return;
        }
        setAvailability(isAvailable ? "Available" : "Inactive");
      },
      () => {
        if (active) {
          toast.error("Could not load your support availability.");
        }
      },
    );

    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on auth and role.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isSupportAgent]);

  const handleAvailabilityChange = (option: "Available" | "Inactive") => {
    if (availability === option) {
      setIsAvailabilityMenuOpen(false);
      return;
    }

    setAvailabilitySaving(true);
    updateAdminSupportAgentAvailability(
      option === "Available",
      (data: unknown) => {
        const isAvailable = parseAvailability(data);
        setAvailability(
          (isAvailable ?? option === "Available") ? "Available" : "Inactive",
        );
        setIsAvailabilityMenuOpen(false);
        setAvailabilitySaving(false);
      },
      () => {
        setAvailabilitySaving(false);
        toast.error("Could not update your support availability.");
      },
    );
  };

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
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(getSupportStatusLabel(ticket.status));
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
    return supportAgents.map((staff) => ({
      ...staff,
      assignedTickets:
        staff.assignedTickets ??
        filteredTickets.filter(
          (ticket) => ticket.assignee.toLowerCase() === staff.name.toLowerCase(),
        ).length,
      inProgressTickets:
        staff.inProgressTickets ??
        filteredTickets.filter(
          (ticket) =>
            ticket.assignee.toLowerCase() === staff.name.toLowerCase() &&
            ticket.status.toLowerCase().includes("progress"),
        ).length,
      closedTickets:
        staff.closedTickets ??
        filteredTickets.filter(
          (ticket) =>
            ticket.assignee.toLowerCase() === staff.name.toLowerCase() &&
            (ticket.status.toLowerCase().includes("closed") ||
              ticket.status.toLowerCase().includes("resolved")),
        ).length,
    }));
  }, [supportAgents, filteredTickets]);

  const openAssignTicket = (staff: SupportStaffRow) => {
    setInitialAssignedStaffId(staff.id);
    setIsCreateTicketOpen(true);
  };

  const handleExport = () => {
    downloadTableRows(
      filteredTickets.map((ticket) => ({
        date: formatSupportDate(ticket.createdAt),
        ticket_id: ticket.reference,
        subject: ticket.subject,
        category: ticket.category,
        status: getSupportStatusLabel(ticket.status),
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
        <h1 className="text-xl  font-MontserratMedium text-000000">Tickets</h1>

        <div className="flex items-center gap-3">
          {isSupportAgent && (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isAvailabilityMenuOpen}
                aria-busy={availabilitySaving}
                onClick={() =>
                  setIsAvailabilityMenuOpen((isOpen) => !isOpen)
                }
                className={`flex h-10 items-center gap-2 rounded-[64px] border px-4 py-3 text-sm font-MontserratNormal transition-colors ${
                  availability === "Inactive"
                    ? "border-[#e96b61] text-[#e96b61] hover:bg-[#e96b61]/5"
                    : "border-[#2D7565] text-[#2D7565] hover:bg-[#f5faf8]"
                }`}
              >
                {availability === "Available" ? (
                  <Headphones
                    className="h-3.5 w-3.5 text-[#2D7565]"
                    aria-hidden="true"
                  />
                ) : (
                  <Image
                    src={InactiveSupportAgent}
                    alt=""
                    width={14}
                    height={16}
                    className="shrink-0"
                  />
                )}
                {availability}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isAvailabilityMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Availability"
                  className="absolute right-0 top-full z-20 mt-2 min-w-32 h-[96px] w-[184px] rounded-c8 border border-000000/4 bg-white py-1 font-MontserratNormal shadow-lg"
                >
                  {(["Available", "Inactive"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      disabled={availabilitySaving}
                      aria-selected={availability === option}
                      onClick={() => handleAvailabilityChange(option)}
                      className="flex w-full items-center gap-2 rounded py-3 px-6 text-left text-xs hover:bg-gray-50"
                    >
                      <Image
                        src={
                          option === "Available"
                            ? ActiveSupportAgent
                            : InactiveSupportAgent
                        }
                        alt=""
                        width={14}
                        height={16}
                        className="shrink-0"
                      />
                      <span
                        className={
                          option === "Available"
                            ? "text-[#00BE5C]"
                            : "text-[#e96b61]"
                        }
                      >
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {canCreateTicket && (
            <Button
              type="button"
              disabled={isSupportAgent && availability === "Inactive"}
              onClick={() => setIsCreateTicketOpen(true)}
              className="max-w-[167.15px] gap-3 flex items-center justify-center"
            >
              Create ticket
              <Image src={DropIcon} alt="drop" width={16.61} height={9.06} />
            </Button>
          )}
        </div>
      </div>

      <SupportStats
        count={count}
        tickets={tickets}
        isSupportAgent={isSupportAgent}
      />

      <section className="rounded-2xl border border-000000/4 bg-white p-4 md:p-6 mt-2">
        <SupportTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          canViewStaff={canViewStaff}
        />

        {activeTab !== "staff" || !canViewStaff ? (
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
            canViewStaff={canViewStaff}
          />
        ) : (
          <SupportStaffTable
            rows={staffRows}
            loading={staffLoading}
            page={1}
            totalPages={1}
            onPageChange={setPage}
            showPagination={false}
            onAssignTicket={canAssignStaff ? openAssignTicket : undefined}
          />
        )}
      </section>

      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => {
          setIsCreateTicketOpen(false);
          setInitialAssignedStaffId("");
        }}
        onSuccess={() => loadTickets(page)}
        canAssignStaff={canAssignStaff}
        initialAssignedStaffId={initialAssignedStaffId}
      />
    </div>
  );
}
