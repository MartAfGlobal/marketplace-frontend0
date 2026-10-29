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
  name: string;
  assignedTickets: number;
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
    reference: textValue(ticket.ticket_ref, ticket.ticket_id, ticket.id) || "—",
    subject: textValue(ticket.subject, ticket.title, ticket.ticket_subject) || "—",
    category:
      textValue(
        ticket.category_display,
        ticket.category_name,
        ticket.category,
        ticket.ticket_type,
      ) || "—",
    status: rawStatus ? normalizeLabel(rawStatus) : "—",
    priority: rawPriority ? normalizeLabel(rawPriority) : "—",
    assignee:
      textValue(ticket.assigned_to_name, ticket.assignee_name) ||
      displayName(ticket.assigned_to ?? ticket.assignee) ||
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
    : page?.results ?? page?.tickets ?? page?.items;
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

export function formatSupportDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
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
  if (value.includes("high") || value.includes("urgent")) return "text-[#2ea37d]";
  if (value.includes("medium")) return "text-[#e7a22a]";
  if (value.includes("low")) return "text-[#ff715b]";
  return "text-[#777777]";
}
