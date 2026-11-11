"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  CircleSlash2,
  Download,
  Headphones,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { RootState } from "@/store";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { downloadTableRows } from "@/utils/downloadTableRows";
import {
  formatSupportDate,
  getSupportStatusLabel,
  getSupportStatusStyle,
  parseSupportAgentDetailResponse,
  parseSupportTicketResponse,
  type SupportStaffRow,
  type SupportTicket,
} from "@/components/admin-components/support/supportTickets";
import SupportPriorityLabel from "@/components/admin-components/support/SupportPriorityLabel";

type DetailTab = "Tickets" | "Activity logs";
const ACTIVITY_LOG_PAGE_SIZE = 10;

interface ActivityLog {
  id: string | number;
  action: string;
  createdAt: string;
  actorName: string;
  actorAvatar: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  targetUrl: string;
  serverResult: string;
  modifiedData: { field: string; previousValue: string; newValue: string }[];
  ipAddress: string;
  responseStatus: string;
  endpoint: string;
  userAgent: string;
  raw: Record<string, unknown>;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function valueText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value !== null && typeof value === "object") {
    return JSON.stringify(value);
  }
  return "";
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const text = valueText(value);
    if (text) return text;
  }
  return "";
}

function personName(value: unknown): string {
  const person = asRecord(value);
  if (!person) return valueText(value);
  return (
    firstText(
      person.full_name,
      person.name,
      person.actor_name,
      person.email,
      `${firstText(person.first_name)} ${firstText(person.last_name)}`.trim(),
    ) || "—"
  );
}

function parseModifiedData(value: unknown) {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const change = asRecord(item);
      if (!change) return [];
      return [{
        field: firstText(change.field, change.name, change.key) || `Field ${index + 1}`,
        previousValue: firstText(
          change.previous_value,
          change.old_value,
          change.from,
        ) || "—",
        newValue: firstText(
          change.new_value,
          change.current_value,
          change.to,
        ) || "—",
      }];
    });
  }

  const changes = asRecord(value);
  if (!changes) return [];
  return Object.entries(changes).map(([field, value]) => {
    const change = asRecord(value);
    return {
      field,
      previousValue: change
        ? firstText(change.previous_value, change.old_value, change.from) || "—"
        : "—",
      newValue: change
        ? firstText(change.new_value, change.current_value, change.to) || "—"
        : valueText(value) || "—",
    };
  });
}

function getActivityLogs(data: unknown): {
  logs: ActivityLog[];
  count: number;
  pageSize: number;
} {
  let payload = data;
  for (let depth = 0; depth < 3; depth += 1) {
    const envelope = asRecord(payload);
    if (!envelope || envelope.data === undefined) break;
    payload = envelope.data;
  }

  const body = asRecord(payload);
  const items = Array.isArray(payload)
    ? payload
    : body?.results ?? body?.logs ?? body?.activity_logs ?? body?.items;

  if (!Array.isArray(items)) {
    return { logs: [], count: 0, pageSize: ACTIVITY_LOG_PAGE_SIZE };
  }

  const logs = items.flatMap((item, index): ActivityLog[] => {
    const log = asRecord(item);
    if (!log) return [];
    const actor = log.initiated_by ?? log.actor ?? log.admin ?? log.user;
    const actorRecord = asRecord(actor);
    const targetValue = log.target_entity ?? log.target ?? log.entity;
    const target = asRecord(targetValue);
    const targetId = firstText(
      log.target_entity_id,
      log.entity_id,
      target?.id,
      target?.reference,
      typeof targetValue === "string" ? targetValue : undefined,
    );
    const rawResult =
      log.server_result ??
      log.result ??
      log.outcome ??
      log.success ??
      log.is_success;
    const resultValue =
      rawResult === true
        ? "Success"
        : rawResult === false
          ? "Error"
          : firstText(
              rawResult,
              log.response_status,
              log.status_code,
              log.response_code,
            );
    return [
      {
        id:
          typeof log.id === "string" || typeof log.id === "number"
            ? log.id
            : index,
        action:
          firstText(log.action, log.event, log.event_name, log.description) || "—",
        createdAt: firstText(
          log.created_at,
          log.timestamp,
          log.event_time,
          log.created,
        ),
        actorName: personName(actor) || firstText(log.actor_name) || "—",
        actorAvatar: firstText(
          actorRecord?.profile_picture,
          actorRecord?.profile_picture_url,
          actorRecord?.avatar,
          log.actor_avatar,
        ),
        actorRole: firstText(
          log.actor_role,
          log.initiator_role,
          actorRecord?.role,
          log.role,
        ) || "—",
        targetType:
          firstText(
            log.target_entity_type,
            log.entity_type,
            target?.type,
            target?.entity_type,
          ) || "—",
        targetId,
        targetLabel:
          firstText(
            log.target_description,
            log.target_name,
            target?.name,
            target?.title,
            typeof targetValue === "string" ? targetValue : undefined,
          ) || targetId || "—",
        targetUrl: firstText(log.target_url, log.entity_url, target?.url),
        serverResult: /success|successful|\bok\b|complete|\b2\d{2}\b/i.test(
          resultValue,
        )
          ? "Success"
          : /error|fail|denied|\b[45]\d{2}\b/i.test(resultValue)
            ? "Error"
            : resultValue || "—",
        modifiedData: parseModifiedData(
          log.modified_data ?? log.changes ?? log.changed_fields,
        ),
        ipAddress: firstText(log.ip_address, log.ip),
        responseStatus: firstText(
          log.response_status,
          log.status_code,
          log.response_code,
        ),
        endpoint: firstText(log.api_endpoint, log.endpoint, log.path),
        userAgent: firstText(log.user_agent, log.device),
        raw: log,
      },
    ];
  });

  const reportedCount = Number(
    body?.count ?? body?.total_count ?? body?.total ?? logs.length,
  );
  const reportedPageSize = Number(
    body?.page_size ?? body?.per_page ?? ACTIVITY_LOG_PAGE_SIZE,
  );
  return {
    logs,
    count:
      Number.isFinite(reportedCount) && reportedCount >= 0
        ? reportedCount
        : logs.length,
    pageSize:
      Number.isFinite(reportedPageSize) && reportedPageSize > 0
        ? reportedPageSize
        : ACTIVITY_LOG_PAGE_SIZE,
  };
}

function formatTimestamp(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

export default function SupportStaffDetailPage() {
  const params = useParams<{ uuid: string }>();
  const router = useRouter();
  const userId = params.uuid;
  const token = useSelector((state: RootState) => state.token?.token);
  const {
    fetchAdminSupportAgentDetail,
    fetchAdminStaffActivityLogs,
    fetchAdminStaffTickets,
  } = AdminDetails();

  const [staff, setStaff] = useState<SupportStaffRow | null>(null);
  const [staffLoading, setStaffLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>("Tickets");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketPageSize, setTicketPageSize] = useState(10);
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activityCount, setActivityCount] = useState(0);
  const [activityPageSize, setActivityPageSize] = useState(
    ACTIVITY_LOG_PAGE_SIZE,
  );
  const [activityPage, setActivityPage] = useState(1);
  const [activityLoading, setActivityLoading] = useState(false);
  const [selectedActivityLog, setSelectedActivityLog] =
    useState<ActivityLog | null>(null);

  useEffect(() => {
    if (!token || !userId) return;
    let active = true;
    setStaffLoading(true);
    fetchAdminSupportAgentDetail(
      userId,
      (data) => {
        if (!active) return;
        console.log("Support staff details endpoint response:", data);
        const detail = parseSupportAgentDetailResponse(data);
        if (!detail) {
          setStaff(null);
          toast.error("The support staff response could not be read.");
        } else {
          setStaff(detail);
        }
        setStaffLoading(false);
      },
      () => {
        if (!active) return;
        setStaff(null);
        setStaffLoading(false);
        toast.error("Could not load support staff details. Please try again.");
      },
    );
    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on auth and route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  const loadTickets = useCallback(
    (page: number) => {
      if (!token || !userId) return;
      setTicketsLoading(true);
      fetchAdminStaffTickets(
        userId,
        page,
        (data) => {
          const response = parseSupportTicketResponse(data);
          if (!response) {
            setTickets([]);
            setTicketCount(0);
            toast.error("The support staff tickets response could not be read.");
          } else {
            setTickets(response.tickets);
            setTicketCount(response.count);
            setTicketPageSize(response.pageSize);
          }
          setTicketsLoading(false);
        },
        () => {
          setTickets([]);
          setTicketCount(0);
          setTicketsLoading(false);
          toast.error("Could not load support staff tickets. Please try again.");
        },
      );
    },
    // AdminDetails returns fresh helper functions per render; requests depend on auth and route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, userId],
  );

  useEffect(() => {
    if (activeTab === "Tickets") loadTickets(ticketPage);
  }, [activeTab, loadTickets, ticketPage]);

  useEffect(() => {
    if (!token || !userId || activeTab !== "Activity logs") return;
    let active = true;
    setActivityLoading(true);
    fetchAdminStaffActivityLogs(
      userId,
      activityPage,
      (data) => {
        if (!active) return;
        const response = getActivityLogs(data);
        setActivityLogs(response.logs);
        setActivityCount(response.count);
        setActivityPageSize(response.pageSize);
        setActivityLoading(false);
      },
      () => {
        if (!active) return;
        setActivityLogs([]);
        setActivityCount(0);
        setActivityLoading(false);
        toast.error("Could not load support staff activity. Please try again.");
      },
    );
    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on auth, route, and tab.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, activeTab, activityPage]);

  const fullName = staff?.name || staff?.email || "Support staff";
  const totalTicketPages = Math.max(1, Math.ceil(ticketCount / ticketPageSize));
  const ticketHeadings = useMemo(
    () => ["Date", "Ticket ID", "Ticket subject", "Category", "Priority", "Status"],
    [],
  );

  const downloadTickets = () => {
    downloadTableRows(
      tickets.map((ticket) => ({
        date: formatSupportDate(ticket.createdAt),
        ticket_id: ticket.reference,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: getSupportStatusLabel(ticket.status),
      })),
      `support-staff-${userId}-tickets`,
    );
  };

  const downloadActivityLog = (log: ActivityLog) => {
    downloadTableRows(
      [
        {
          action: log.action,
          timestamp: formatTimestamp(log.createdAt),
          initiated_by: log.actorName,
          role: log.actorRole,
          target_entity_type: log.targetType,
          target_entity: log.targetLabel,
          target_id: log.targetId,
          modified_data: JSON.stringify(log.modifiedData),
          ip_address: log.ipAddress,
          response_status: log.responseStatus,
          api_endpoint: log.endpoint,
          user_agent: log.userAgent,
        },
      ],
      `activity-log-${log.id}`,
    );
  };

  if (staffLoading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#999]">
        Loading support staff details...
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#999]">
        Support staff details could not be found.
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-2xl border  bg-white p-5 md:p-8">
      <div className="flex items-center gap-1 text-xs font-MontserratMedium">
        <Link
          href="/dashboard/admin/support-department"
          className="text-000000/44 text-xs font-MontserratMedium hover:text-[#000]"
        >
          Staff
        </Link>
        <ChevronRight className="h-4 w-4 text-[#999]" />
        <span className="text-000000 text-xs font-MontserratMedium hover:text-[#000]">{fullName}</span>
      </div>

      <h1 className="text-c20 font-MontserratMedium text-000000">
        Staff details
      </h1>

      <div className="grid gap-8 md:grid-cols-[228px_minmax(0,1fr)]">
        <aside className="flex flex-col items-center border-b border-[#000000]/5 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <div className="mb-4 flex h-49 w-49 items-center justify-center overflow-hidden rounded-full bg-[#f2f2f2]">
            {staff.avatar ? (
              <Image
                src={staff.avatar}
                alt={fullName}
                width={196}
                height={196}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-49 w-49 text-[#bbb]" />
            )}
          </div>
          <h2 className="text-center text-c18 font-MontserratSemiBold text-000000 leading-[26px] tracking-[1%]">
            {fullName}
          </h2>
          <p className=" text-center text-[12px] leading-5 tracking-[2%] font-MontserratNormal text-000000/44">
            Customer support 
          </p>
          <span
            className={`mt-3 inline-flex items-center gap-2 rounded-[64px] px-6 py-2 text-[12px] font-MontserratNormal ${
              staff.staff_status.toLowerCase() === "available"
                ? "bg-[#00BE5C] text-[#FFFFFF]"
                : "bg-[#CA0202]/12 text-[#CA0202]"
            }`}
          >
            {staff.staff_status.toLowerCase() === "available" ? (
              <Headphones className="h-4 w-4 text-ffffff" />
            ) : (
              <CircleSlash2 className="h-4 w-4" aria-hidden="true" />
            )}
            {staff.staff_status}
          </span>

          <nav
            aria-label="Support staff details"
            className="mt-12 text-center justify-center  w-full flex flex-col text-xs"
          >
            {(["Tickets", "Activity logs"] as DetailTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-center h-11 ${
                  activeTab === tab
                    ? "font-MontserratMedium text-[#ff715b] text-center"
                    : "text-[#777] hover:text-[#111]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          {activeTab === "Tickets" ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-MontserratNormal text-[#555]">
                  Tickets
                </h2>
                <button
                  type="button"
                  onClick={downloadTickets}
                  disabled={tickets.length === 0 || ticketsLoading}
                  aria-label="Download tickets"
                  title="Download tickets"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#ff715b] text-white transition-colors hover:bg-[#e05d4a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead>
                    <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
                      {ticketHeadings.map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-3 font-MontserratNormal text-sm"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-000000/68 font-MontserratNormal leading-[21px] text-nowrap">
                    {ticketsLoading ? (
                      <tr>
                        <td colSpan={ticketHeadings.length} className="p-8 text-center">
                          Loading tickets...
                        </td>
                      </tr>
                    ) : tickets.length ? (
                      tickets.map((ticket, index) => (
                        <tr
                          key={`${ticket.id}-${index}`}
                          role="link"
                          tabIndex={ticket.id && ticket.id !== "—" ? 0 : undefined}
                          aria-label={`View ticket ${ticket.reference}`}
                          onClick={() => {
                            if (ticket.id && ticket.id !== "—") {
                              router.push(
                                `/dashboard/admin/support-department/tickets/${encodeURIComponent(ticket.id)}`,
                              );
                            }
                          }}
                          onKeyDown={(event) => {
                            if (
                              (event.key === "Enter" || event.key === " ") &&
                              ticket.id &&
                              ticket.id !== "—"
                            ) {
                              event.preventDefault();
                              router.push(
                                `/dashboard/admin/support-department/tickets/${encodeURIComponent(ticket.id)}`,
                              );
                            }
                          }}
                          className={`h-c45 py-3 transition-colors hover:bg-gray-50/50 ${
                            ticket.id && ticket.id !== "—"
                              ? "cursor-pointer  focus-visible:outline-2 focus-visible:outline-[#ff715b]"
                              : ""
                          }`}
                        >
                          <td className="whitespace-nowrap px-3">
                            {formatSupportDate(ticket.createdAt)}
                          </td>
                          <td className="whitespace-nowrap max-w-[103px] truncate px-3"  title={ticket.reference}>
                            {ticket.reference}
                          </td>
                          <td className="max-w-40 truncate px-3" title={ticket.subject}>
                            {ticket.subject}
                          </td>
                          <td className="px-3">{ticket.category}</td>
                          <td className="whitespace-nowrap px-3">
                            <SupportPriorityLabel priority={ticket.priority} />
                          </td>
                          <td className="px-3">
                            <span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-MontserratMedium ${getSupportStatusStyle(ticket.status)}`}>
                              {getSupportStatusLabel(ticket.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={ticketHeadings.length} className="p-8 text-center text-[#999]">
                          No tickets assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {ticketCount > ticketPageSize && (
                <Pagination
                  currentPage={ticketPage}
                  totalPages={totalTicketPages}
                  onPageChange={setTicketPage}
                />
              )}
            </>
          ) : (
            <>
              <h2 className="mb-4 text-sm font-MontserratNormal text-[#555]">
                Activity logs
              </h2>
              {activityLoading ? (
                <p className="text-xs text-[#999]">Loading activity...</p>
              ) : activityLogs.length ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] table-fixed border-collapse text-left">
                    <thead>
                      <tr className="h-10.5 bg-[#947fff] text-white text-nowrap">
                        <th className="w-[150px] px-3 font-MontserratNormal text-sm">
                          Timestamp
                        </th>
                        <th className="w-[180px] px-3 font-MontserratNormal text-sm">
                          Action
                        </th>
                        <th className="w-[140px] px-3 font-MontserratNormal text-sm">
                          Target entity
                        </th>
                        <th className="w-[110px] px-3 font-MontserratNormal text-sm">
                          Server result
                        </th>
                        <th className="w-[110px] px-3 font-MontserratNormal text-sm">
                          Relative time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-000000/68 font-MontserratNormal leading-[21px]">
                      {activityLogs.map((log) => (
                        <tr
                          key={log.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`View activity log: ${log.action}`}
                          onClick={() => setSelectedActivityLog(log)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedActivityLog(log);
                            }
                          }}
                          className="h-c45 cursor-pointer py-3 transition-colors hover:bg-gray-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff715b]"
                        >
                          <td className="max-w-[150px] px-3">
                            <span
                              className="block truncate"
                              title={formatTimestamp(log.createdAt)}
                            >
                              {formatTimestamp(log.createdAt)}
                            </span>
                          </td>
                          <td className="max-w-[180px] px-3">
                            <span className="block truncate" title={log.action}>
                              {log.action}
                            </span>
                          </td>
                          <td className="max-w-[140px] px-3">
                            <span
                              className="block truncate text-[#ff715b]"
                              title={log.targetLabel}
                            >
                              {log.targetLabel}
                            </span>
                          </td>
                          <td className="px-3">
                            <span
                              className={`inline-flex max-w-full truncate rounded-full px-2 py-1 text-[9px] ${
                                /error|fail|denied/i.test(log.serverResult)
                                  ? "bg-[#CA0202]/12 text-[#CA0202]"
                                  : /success|successful|ok/i.test(log.serverResult)
                                    ? "bg-[#00BE5C]/12 text-[#00BE5C]"
                                    : "bg-[#f1f1f1] text-[#777]"
                              }`}
                              title={log.serverResult}
                            >
                              {log.serverResult}
                            </span>
                          </td>
                          <td className="max-w-[110px] px-3">
                            <span
                              className="block truncate"
                              title={formatTimestamp(log.createdAt)}
                            >
                              {formatRelativeTime(log.createdAt) || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  {activityCount > activityPageSize && (
                    <Pagination
                      currentPage={activityPage}
                      totalPages={Math.ceil(activityCount / activityPageSize)}
                      onPageChange={setActivityPage}
                    />
                  )}
                </>
              ) : (
                <p className="text-xs text-[#999]">No activity recorded yet.</p>
              )}
            </>
          )}
        </section>
      </div>
      <DrawerWrapper
        isOpen={selectedActivityLog !== null}
        onClose={() => setSelectedActivityLog(null)}
        maxWidthClassName="max-w-[360px]"
      >
        {selectedActivityLog && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-start justify-between gap-4 border-b border-[#000000]/8 pb-4">
              <div className="min-w-0">
                <p className="text-[11px] font-MontserratNormal text-[#999]">
                  Logged event
                </p>
                <h2 className="mt-1 break-words text-sm font-MontserratMedium text-[#111]">
                  {selectedActivityLog.action}
                </h2>
                <p className="mt-1 text-[10px] text-[#999]">
                  {formatTimestamp(selectedActivityLog.createdAt)}
                  {selectedActivityLog.createdAt &&
                    ` (${formatRelativeTime(selectedActivityLog.createdAt)})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivityLog(null)}
                aria-label="Close activity log details"
                className="shrink-0 rounded p-1 text-[#999] hover:bg-gray-100 hover:text-[#333]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5 text-[11px]">
              <section className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <h3 className="mb-3 font-MontserratMedium text-[#111]">
                    Action by
                  </h3>
                  <p className="mb-1 text-[10px] text-[#999]">Initiated by</p>
                  <div className="flex items-center gap-2">
                    {selectedActivityLog.actorAvatar ? (
                      <Image
                        src={selectedActivityLog.actorAvatar}
                        alt=""
                        width={24}
                        height={24}
                        unoptimized
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0edff] text-[#7544bf]">
                        <UserRound className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="break-words font-MontserratNormal text-[#444]">
                      {selectedActivityLog.actorName}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] text-[#999]">Role</p>
                  <p className="mt-1 break-words text-[#444]">
                    {selectedActivityLog.actorRole}
                  </p>
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 font-MontserratMedium text-[#111]">
                    Target entity
                  </h3>
                  <p className="mb-1 text-[10px] text-[#999]">Entity type</p>
                  <p className="break-words text-[#444]">
                    {selectedActivityLog.targetType}
                  </p>
                  <p className="mt-3 text-[10px] text-[#999]">Target entity</p>
                  {selectedActivityLog.targetUrl ? (
                    <a
                      href={selectedActivityLog.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-[#ff715b] hover:underline"
                    >
                      {selectedActivityLog.targetLabel}
                    </a>
                  ) : (
                    <p className="mt-1 break-all text-[#ff715b]">
                      {selectedActivityLog.targetLabel}
                    </p>
                  )}
                  {selectedActivityLog.targetId &&
                    selectedActivityLog.targetId !==
                      selectedActivityLog.targetLabel && (
                      <p className="mt-1 break-all text-[#999]">
                        {selectedActivityLog.targetId}
                      </p>
                    )}
                </div>
              </section>

              {selectedActivityLog.modifiedData.length > 0 && (
                <section>
                  <h3 className="mb-3 font-MontserratMedium text-[#111]">
                    Modified data
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px] text-left text-[10px]">
                      <thead>
                        <tr className="bg-[#947fff] text-white">
                          <th className="px-2 py-2 font-MontserratMedium">Field</th>
                          <th className="px-2 py-2 font-MontserratMedium">Previous value</th>
                          <th className="px-2 py-2 font-MontserratMedium">New value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedActivityLog.modifiedData.map((change, index) => (
                          <tr
                            key={`${change.field}-${index}`}
                            className="border-b border-[#000000]/5 text-[#777]"
                          >
                            <td className="px-2 py-2">{change.field}</td>
                            <td className="px-2 py-2">{change.previousValue}</td>
                            <td className="px-2 py-2">{change.newValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section>
                <h3 className="mb-3 font-MontserratMedium text-[#111]">
                  Metadata
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-[10px] text-[#999]">IP address</p>
                    <p className="mt-1 break-all text-[#444]">
                      {selectedActivityLog.ipAddress || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999]">Response status</p>
                    <p className="mt-1 break-all text-[#444]">
                      {selectedActivityLog.responseStatus || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999]">API endpoint</p>
                    <p className="mt-1 break-all text-[#444]">
                      {selectedActivityLog.endpoint || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999]">User agent</p>
                    <p className="mt-1 break-all text-[#444]">
                      {selectedActivityLog.userAgent || "—"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <button
              type="button"
              onClick={() => downloadActivityLog(selectedActivityLog)}
              className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#ff715b] px-4 text-xs font-MontserratMedium text-white transition-colors hover:bg-[#e05d4a]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download log
            </button>
          </div>
        )}
      </DrawerWrapper>
    </div>
  );
}
