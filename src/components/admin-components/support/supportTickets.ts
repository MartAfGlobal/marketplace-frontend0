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
  staff_status: string;
};

export type SupportTicketActivity = {
  id: string;
  authorId: string;
  authorEmail: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
  oldValue: string;
  newValue: string;
};

export type SupportTicketAttachment = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
};

export type SupportTicketDetail = SupportTicket & {
  description: string;
  customerName: string;
  customerEmail: string;
  source: string;
  assigneeEmail: string;
  assigneeAvatar: string;
  attachments: SupportTicketAttachment[];
  comments: SupportTicketActivity[];
  history: SupportTicketActivity[];
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
    staff.staff_status,
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

function unwrapSupportData(data: unknown): unknown {
  let payload = data;
  for (let depth = 0; depth < 3; depth += 1) {
    const body = asRecord(payload);
    if (!body || body.data === undefined) break;
    payload = body.data;
  }
  return payload;
}

function mapSupportActivity(value: unknown, index: number): SupportTicketActivity | null {
  const activity = asRecord(value);
  if (!activity) return null;

  const author = activity.author ?? activity.user ?? activity.created_by;
  const authorRecord = asRecord(author);
  return {
    id: textValue(activity.id, activity.activity_id, activity.note_id) || String(index),
    authorId: textValue(activity.author_id, activity.user_id, authorRecord?.id),
    authorEmail: textValue(activity.author_email, authorRecord?.email),
    author: displayName(author) || textValue(activity.author_name, activity.name) || "—",
    authorRole: textValue(activity.author_role, activity.role, authorRecord?.role),
    authorAvatar: textValue(
      activity.author_avatar,
      authorRecord?.profile_image,
      authorRecord?.avatar,
    ),
    createdAt: textValue(activity.created_at, activity.timestamp, activity.date),
    content: textValue(
      activity.body,
      activity.message,
      activity.content,
      activity.comment,
      activity.note,
    ),
    oldValue: textValue(activity.old_value, activity.from_value),
    newValue: textValue(activity.new_value, activity.to_value),
  };
}

function mapSupportActivities(value: unknown): SupportTicketActivity[] {
  return Array.isArray(value)
    ? value.flatMap((item, index) => {
        const activity = mapSupportActivity(item, index);
        return activity ? [activity] : [];
      })
    : [];
}

export function parseSupportTicketDetailResponse(
  data: unknown,
): SupportTicketDetail | null {
  const payload = unwrapSupportData(data);
  const body = asRecord(payload);
  if (!body) return null;

  const ticket =
    asRecord(body.ticket) ??
    asRecord(body.result) ??
    body;
  const assignedAgent =
    ticket.assigned_agent ?? ticket.assigned_to ?? ticket.assignee;
  const assignedRecord = asRecord(assignedAgent);
  const attachments = ticket.attachments;

  return {
    ...mapSupportTicket(ticket),
    description: textValue(ticket.description, ticket.details),
    customerName:
      textValue(ticket.customer_name, ticket.requester_name) ||
      displayName(ticket.customer ?? ticket.requester),
    customerEmail:
      textValue(ticket.customer_email, ticket.requester_email) ||
      textValue(asRecord(ticket.customer)?.email, asRecord(ticket.requester)?.email),
    source: textValue(ticket.source_display, ticket.source, ticket.channel) || "—",
    assigneeEmail:
      textValue(ticket.assignee_email, ticket.assigned_to_email) ||
      textValue(assignedRecord?.email),
    assigneeAvatar:
      textValue(ticket.assignee_avatar, ticket.assigned_to_avatar) ||
      textValue(assignedRecord?.profile_image, assignedRecord?.avatar),
    attachments: Array.isArray(attachments)
      ? attachments.flatMap((value, index): SupportTicketAttachment[] => {
          const attachment = asRecord(value);
          if (!attachment) return [];
          const url = textValue(
            attachment.url,
            attachment.file_url,
            attachment.attachment,
          );
          return [{
            id: textValue(attachment.id, attachment.attachment_id) || `${index}`,
            name: textValue(attachment.name, attachment.filename, attachment.file_name) || url,
            url,
            uploadedAt: textValue(attachment.uploaded_at, attachment.created_at),
          }];
        })
      : [],
    comments: mapSupportActivities(ticket.comments ?? ticket.notes),
    history: mapSupportActivities(
      ticket.history ?? ticket.status_history ?? ticket.events,
    ),
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
    const status = supportAgentStatus(staff);

    return [
      {
        id: textValue(staff.user_id, staff.id, staff.staff_id, staff.agent_id),
        date: textValue(staff.date),
        name,
        avatar: textValue(staff.profile_picture, staff.profile_image, staff.avatar),
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
        status,
        staff_status: status,
      },
    ];
  });
}

export function parseSupportAgentDetailResponse(
  data: unknown,
): SupportStaffRow | null {
  const payload = unwrapSupportData(data);
  const body = asRecord(payload);
  if (!body) return null;
  const staff =
    asRecord(body.agent) ??
    asRecord(body.support_agent) ??
    asRecord(body.staff) ??
    asRecord(body.result) ??
    body;
  return parseSupportAgentResponse([staff])?.[0] ?? null;
}

export function getSupportStatusLabel(status: string) {
  const normalized = status.trim().toLowerCase().replace(/[_-]+/g, " ");
  if (!normalized) return "—";
  if (normalized === "open" || normalized === "todo" || normalized === "to do") {
    return "To Do";
  }
  if (normalized === "in progress") return "In progress";
  if (normalized === "under review" || normalized === "resolved") {
    return "Under review";
  }
  return normalizeLabel(normalized);
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
