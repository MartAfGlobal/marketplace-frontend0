export type SupportTicket = {
  id: string;
  reference: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  assignee: string;
  createdAt: string;
  firstResponseAt: string;
  resolvedAt: string;
};

export type SupportStaffRow = {
  id: string;
  date: string;
  email: string;

  name: string;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  assignedTickets: number | null;
  inProgressTickets: number | null;
  closedTickets: number | null;
  status: string;
};

const PAGE_SIZE = 10;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function textValue(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function displayName(value: unknown): string {
  const record = asRecord(value);
  if (!record) return textValue(value);

  return (
    textValue(
      record.full_name,
      record.name,
      record.display_name,
      `${textValue(record.first_name)} ${textValue(record.last_name)}`.trim(),
      record.email,
    ) || "—"
  );
}

function supportStaffName(staff: Record<string, unknown>): string {
  return textValue(
    staff.staff_name,
    staff.full_name,
    staff.name,
    staff.display_name,
    `${textValue(staff.first_name)} ${textValue(staff.last_name)}`.trim(),
  );
}

function countValue(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const count = Number(value);
      if (Number.isFinite(count)) return count;
    }
  }
  return null;
}

function supportAgentStatus(staff: Record<string, unknown>): string {
  const rawStatus = textValue(
    staff.availability_status,
    staff.availability,
    staff.status_display,
    staff.status,
  ).toLowerCase();
  const availableFlag = staff.is_available ?? staff.available;

  if (availableFlag === true) return "Available";
  if (availableFlag === false) return "Inactive";
  if (rawStatus.includes("busy")) return "Busy";
  if (
    rawStatus.includes("inactive") ||
    rawStatus.includes("unavailable") ||
    rawStatus.includes("offline")
  ) {
    return "Inactive";
  }
  if (
    rawStatus.includes("available") ||
    rawStatus.includes("active") ||
    rawStatus.includes("online")
  ) {
    return "Available";
  }
  return rawStatus ? normalizeLabel(rawStatus) : "Inactive";
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mapSupportTicket(value: unknown): SupportTicket {
  const ticket = asRecord(value) ?? {};
  const id = textValue(ticket.id, ticket.ticket_id, ticket.ticket_ref);
  const rawStatus = textValue(ticket.status, ticket.status_display);
  const rawPriority = textValue(ticket.priority, ticket.priority_display);

  return {
    id: id || "—",
    reference:
      textValue(
        ticket.reference,
        ticket.ticket_ref,
        ticket.ticket_id,
        ticket.id,
      ) ||
      "—",
    subject:
      textValue(ticket.subject, ticket.title, ticket.ticket_subject) || "—",
    category:
      textValue(
        ticket.category_display,
        ticket.category_name,
        asRecord(ticket.category)?.name,
        ticket.category,
        ticket.ticket_type,
      ) || "—",
    status: rawStatus ? normalizeLabel(rawStatus) : "—",
    priority: rawPriority ? normalizeLabel(rawPriority) : "—",
    assignee:
      textValue(
        ticket.assigned_to_name,
        ticket.assignee_name,
        ticket.assigned_agent_name,
      ) ||
      displayName(
        ticket.assigned_agent ?? ticket.assigned_to ?? ticket.assignee,
      ) ||
      "—",
    createdAt: textValue(ticket.created_at, ticket.created, ticket.date),
    firstResponseAt: textValue(
      ticket.first_response_at,
      ticket.first_responded_at,
      ticket.first_reply_at,
    ),
    resolvedAt: textValue(
      ticket.resolved_at,
      ticket.closed_at,
      ticket.completed_at,
    ),
  };
}

export function parseSupportTicketResponse(data: unknown): {
  tickets: SupportTicket[];
  count: number;
  pageSize: number;
} | null {
  let payload: unknown = data;
  const outer = asRecord(payload);
  if (outer && outer.data !== undefined) payload = outer.data;

  const body = asRecord(payload);
  if (body && body.data !== undefined) payload = body.data;

  const page = asRecord(payload);
  const rawTickets = Array.isArray(payload)
    ? payload
    : (page?.results ?? page?.tickets ?? page?.items);
  if (!Array.isArray(rawTickets)) return null;

  const countValue = page?.count ?? page?.total_count ?? page?.total;
  const pageSizeValue = page?.page_size ?? page?.per_page;
  const count = Number(countValue);
  const pageSize = Number(pageSizeValue);

  return {
    tickets: rawTickets.map(mapSupportTicket),
    count: Number.isFinite(count) && count >= 0 ? count : rawTickets.length,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : PAGE_SIZE,
  };
}

export function parseSupportAgentResponse(
  data: unknown,
): SupportStaffRow[] | null {
  let payload: unknown = data;
  for (let depth = 0; depth < 3; depth += 1) {
    const body = asRecord(payload);
    if (!body || body.data === undefined) break;
    payload = body.data;
  }

  const body = asRecord(payload);
  const rawStaff = Array.isArray(payload)
    ? payload
    : (body?.results ??
      body?.agents ??
      body?.support_agents ??
      body?.staff ??
      body?.items);
  if (!Array.isArray(rawStaff)) return null;

  return rawStaff.flatMap((value): SupportStaffRow[] => {
    const staff = asRecord(value);
    if (!staff) return [];
    const name = supportStaffName(staff);
    if (!name) return [];

    return [
      {
        id: textValue(staff.user_id, staff.id, staff.staff_id, staff.agent_id),
        date: textValue(staff.date),
        name,
        avatar: textValue(staff.profile_image, staff.avatar),
        email: textValue(staff.email, staff.user_email),
        joinedAt: textValue(
          staff.created_at,
          staff.date_joined,
          staff.joined_at,
          staff.date,
        ),
        lastActive: textValue(
          staff.last_active,
          staff.last_active_at,
          staff.last_seen,
        ),
        assignedTickets: countValue(
          staff.assigned_tickets,
          staff.tickets_assigned,
          staff.assigned_count,
          staff.assigned,
        ),
        inProgressTickets: countValue(
          staff.in_progress_tickets,
          staff.tickets_in_progress,
          staff.in_progress_count,
        ),
        closedTickets: countValue(
          staff.closed_tickets,
          staff.tickets_closed,
          staff.closed_count,
        ),
        status: supportAgentStatus(staff),
      },
    ];
  });
}

export function formatSupportDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB");
}

export function getSupportStatusStyle(status: string) {
  const value = status.toLowerCase();
  if (value.includes("closed") || value.includes("resolved")) {
    return "bg-[#f1f1f1] text-[#777777]";
  }
  if (value.includes("pending") || value.includes("progress")) {
    return "bg-[#fff3d8] text-[#d9951d]";
  }
  if (value.includes("review")) {
    return "bg-[#e2f8ee] text-[#2ea37d]";
  }
  return "bg-[#ffe7e5] text-[#e96b61]";
}

export function getSupportPriorityStyle(priority: string) {
  const value = priority.toLowerCase();
  if (value.includes("high") || value.includes("urgent"))
    return "text-[#2ea37d]";
  if (value.includes("medium")) return "text-[#e7a22a]";
  if (value.includes("low")) return "text-[#ff715b]";
  return "text-[#777777]";
}
