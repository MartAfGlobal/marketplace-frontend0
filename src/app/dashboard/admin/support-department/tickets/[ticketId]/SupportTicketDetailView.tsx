"use client";

import type {
  ChangeEventHandler,
  FormEventHandler,
  RefObject,
} from "react";
import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Download,
  Plus,
  Send,
} from "lucide-react";
import {
  DocumentFileIcon,
  getFileExtension,
} from "@/components/admin-components/orders/OrderDocumentsCard";
import {
  getSupportPriorityStyle,
  getSupportStatusLabel,
  type SupportTicketActivity,
  type SupportTicketDetail,
} from "@/components/admin-components/support/supportTickets";
import { Textarea } from "@/components/ui/forms/auth/text-area";

export type ActivityTab = "All" | "Comments" | "History";
export type TicketStatusAction =
  | "open"
  | "in_progress"
  | "under_review"
  | "resolved"
  | "closed";

type TicketStatusOption = {
  value: TicketStatusAction;
  label: string;
};

type ActivityListItem = {
  activity: SupportTicketActivity;
  isHistory: boolean;
};

type SupportTicketDetailViewProps = {
  ticket: SupportTicketDetail;
  currentUserAvatar: string;
  statusOptions: TicketStatusOption[];
  onStatusChange: (status: TicketStatusAction) => void;
  isUpdatingStatus: boolean;
  canReassignTicket: boolean;
  isReassigningTicket: boolean;
  onReassignTicket: () => void;
  onDownload: () => void;
  activities: ActivityListItem[];
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
  currentUserIdentifiers: string[];
  canAddNotes: boolean;
  canUploadAttachments: boolean;
  comment: string;
  onCommentChange: (value: string) => void;
  onSubmitComment: FormEventHandler<HTMLFormElement>;
  isSubmittingComment: boolean;
  attachmentInputRef: RefObject<HTMLInputElement | null>;
  onUploadAttachment: ChangeEventHandler<HTMLInputElement>;
  isUploadingAttachment: boolean;
};

// Keep date formatting consistent across the ticket header, attachments, and activity.
function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${year}-${day}-${month}`;
}

// Show recent activity as a relative time and fall back to a date for older items.
function formatTimeAgo(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;
  return formatDate(value);
}

// Show a profile image when present and fall back to initials if it is missing or unavailable.
function PersonAvatar({
  name,
  imageUrl,
  className,
}: {
  name: string;
  imageUrl?: string;
  className: string;
}) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f0edff] font-MontserratMedium text-[#7544bf] ${className}`}
      aria-hidden="true"
    >
      <span>{initials}</span>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="36px"
          unoptimized
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

// Render one customer comment or ticket-history event in the activity feed.
function ActivityItem({
  activity,
  isHistory,
  currentUserIdentifiers,
  currentUserAvatar,
}: {
  activity: SupportTicketActivity;
  isHistory: boolean;
  currentUserIdentifiers: string[];
  currentUserAvatar: string;
}) {
  const isCurrentUser = [
    activity.authorId,
    activity.authorEmail,
    activity.author,
  ]
    .map((value) => value.trim().toLowerCase())
    .some((value) => value && currentUserIdentifiers.includes(value));

  const authorName = activity.author;
  const authorLabel = isCurrentUser
    ? `${authorName} (you)`
    : activity.authorRole
    ? `${authorName} (${activity.authorRole})`
    : authorName;
  const avatarName = isCurrentUser ? authorName : activity.author;

  return (
    <li className="flex gap-3">
      <PersonAvatar
        name={avatarName}
        imageUrl={
          activity.authorAvatar || (isCurrentUser ? currentUserAvatar : "")
        }
        className="h-9 w-9 text-xs"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-baseline gap-x-2 gap-y-0.5 text-xs">
          <span className="text-sm font-MontserratNormal leading-[21px] text-000000">
            {authorLabel}
          </span>
          {activity.createdAt && (
            <time
              dateTime={activity.createdAt}
              className="text-[12px] font-MontserratNormal text-000000/44"
            >
              {formatTimeAgo(activity.createdAt)}
            </time>
          )}
        </div>
        {activity.content && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 font-MontserratNormal  text-000000/44">
            {activity.content}
          </p>
        )}
        {isHistory && (activity.oldValue || activity.newValue) && (
          <p className="mt-2 text-xs text-[#777]">
            {activity.oldValue || "—"} <span aria-hidden="true">→</span>{" "}
            {activity.newValue || "—"}
          </p>
        )}
      </div>
    </li>
  );
}

// Display the ticket's metadata in a compact definition list.
function TicketDetails({
  ticket,
  assigneeAvatar,
}: {
  ticket: SupportTicketDetail;
  assigneeAvatar: string;
}) {
  const rows = [
    { label: "Assigned to", value: ticket.assignee },
    { label: "Date created", value: formatDate(ticket.createdAt) },
    { label: "Customer's name", value: ticket.customerName },
    { label: "Ticket source", value: ticket.source },
    { label: "Priority", value: ticket.priority },
    { label: "Category", value: ticket.category },
  ];

  return (
    <aside className="rounded-c8 border-[0.5px] border-000000/12 p-6">
      <h2 className="mb-4 text-base font-MontserratSemiBold leading-6 text-000000">
        Ticket details
      </h2>
      <dl className="space-y-3">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-wrap items-center justify-between gap-2 text-sm font-MontserratNormal h-9 leading-[21px] text-000000"
          >
            <dt className=" text-000000/44">{label}</dt>
            <dd className="text-right ">
              {label === "Assigned to" && ticket.assignee !== "—" ? (
                <span className="inline-flex items-center gap-2">
                  <PersonAvatar
                    name={ticket.assignee}
                    imageUrl={assigneeAvatar}
                    className="h-9 w-9 text-base"
                  />
                  <span>{ticket.assignee}</span>
                </span>
              ) : (
                <span
                  className={
                    label === "Priority"
                      ? getSupportPriorityStyle(ticket.priority)
                      : ""
                  }
                >
                  {value || "—"}
                </span>
              )}
            </dd>
          </div>
        ))}
        {ticket.customerEmail && (
          <div className="flex flex-wrap justify-between gap-2 text-xs">
            <dt className="text-[#999]">Customer&apos;s email</dt>
            <dd className="break-all text-right text-[#444]">
              {ticket.customerEmail}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

// Present ticket content and pass user actions back to the data-owning page.
export default function SupportTicketDetailView({
  ticket,
  statusOptions,
  onStatusChange,
  isUpdatingStatus,
  canReassignTicket,
  isReassigningTicket,
  onReassignTicket,
  onDownload,
  activities,
  activeTab,
  onTabChange,
  currentUserIdentifiers,
  currentUserAvatar,
  canAddNotes,
  canUploadAttachments,
  comment,
  onCommentChange,
  onSubmitComment,
  isSubmittingComment,
  attachmentInputRef,
  onUploadAttachment,
  isUploadingAttachment,
}: SupportTicketDetailViewProps) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const assigneeIsCurrentUser = currentUserIdentifiers.includes(
    ticket.assignee.trim().toLowerCase(),
  );
  const assigneeAvatar =
    ticket.assigneeAvatar ||
    (assigneeIsCurrentUser ? currentUserAvatar : "");

  return (
    <div className="space-y-8.25 rounded-2xl border  bg-white p-5 md:p-8">
      {/* Show ticket identity and keep status and download actions at the top right. */}
      <div className="flex  items-center h-c48 justify-between gap-4 ">
        <div className ="space-y-1 h-full flex flex-col justify-between">
          <h1 className="text-lg font-MontserratMedium  ">
            {ticket.subject}
          </h1>
          <p className=" text-[12px] font-MontserratNormal text-000000/68">
            Date created: {formatDate(ticket.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canReassignTicket && (
            <button
              type="button"
              onClick={onReassignTicket}
              disabled={isReassigningTicket}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#ff715b] px-4 text-xs font-MontserratMedium text-white transition-colors hover:bg-[#e05d4a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reassign ticket
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isStatusMenuOpen}
              disabled={isUpdatingStatus || statusOptions.length === 0}
              onClick={() => setIsStatusMenuOpen((open) => !open)}
              className={`flex min-w-28 font-MontserratMedium items-center  justify-between gap-3 rounded-full px-5 py-3 h-c48 text-sm text-000000/44 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isStatusMenuOpen
                  ? "bg-ca0202 text-ffffff"
                  : "bg-000000/4 text-000000/44 hover:bg-[#777777]"
              }`}
            >
              {getSupportStatusLabel(ticket.status)}
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {isStatusMenuOpen && (
              <div
                role="menu"
                aria-label="Update ticket status"
                className="absolute right-0 top-full z-30 mt-3 min-w-40 rounded-lg border border-[#eeeeee] bg-white p-2 shadow-lg"
              >
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitem"
                    disabled={
                      isUpdatingStatus ||
                      ticket.status.toLowerCase().replace(/[\s-]+/g, "_") ===
                        option.value
                    }
                    onClick={() => {
                      setIsStatusMenuOpen(false);
                      onStatusChange(option.value);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs text-[#666] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Download ticket details"
            title="Download ticket details"
            onClick={onDownload}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ff715b] text-[#ff715b] transition-colors hover:bg-[#fff5f3]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid h-fit gap-c48 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <div className="space-y-7">
          {/* Show the customer's original description. */}
          <section aria-labelledby="ticket-description">
            <h2
              id="ticket-description"
              className="text-base font-MontserratSemiBold pb-4 text-000000"
            >
              Description
            </h2>
            <p className="whitespace-pre-wrap break-words text-base font-MontserratNormal leading-7 text-000000/44">
              {ticket.description || "No description provided."}
            </p>
          </section>

          {/* List existing documents and expose upload controls to permitted staff. */}
          <section aria-labelledby="ticket-attachments">
            <h2
              id="ticket-attachments"
              className="mb-4 text-base font-MontserratSemiBold text-000000"
            >
              Attachments
            </h2>
            {canUploadAttachments && (
              <>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={onUploadAttachment}
                  disabled={isUploadingAttachment}
                  aria-label="Upload ticket attachment"
                />
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={isUploadingAttachment}
                  className="flex min-h-34.25 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#cccccc] text-sm text-[#ff715b] transition-colors hover:border-[#ff715b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-2 text-sm font-MontserratNormal">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {isUploadingAttachment ? "Uploading..." : "Add attachment"}
                  </span>
                  <span className="text-[10px] text-[#999]">
                    JPEG, PNG, or PDF
                  </span>
                </button>
              </>
            )}
            {ticket.attachments.length > 0 && (
              <ul className="mt-3 max-h-[380px] space-y-2 overflow-y-auto">
                {ticket.attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <div className="flex min-h-[56px] items-center justify-between gap-2 rounded-c8 border-[0.5px] border-000000/12 bg-white px-3 py-2 transition-colors hover:border-[#D0D5DD]">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <DocumentFileIcon
                          type={getFileExtension(
                            attachment.name || attachment.url,
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-xs leading-[18px] text-000000/80"
                            title={attachment.name}
                          >
                            {attachment.name}
                          </p>
                          {attachment.uploadedAt && (
                            <p className="text-c10 leading-[16px] text-000000/68">
                              {formatDate(attachment.uploadedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {attachment.url && (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 px-1 py-1 text-c10 text-[#FF6D5B] hover:text-[#e05a49] hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Filter activity, accept internal notes, and show comments/history. */}
          <section aria-labelledby="ticket-activity">
            <h2
              id="ticket-activity"
              className="mb-3 text-base font-MontserratSemiBold text-000000"
            >
              Activity
            </h2>
            <div className="mb-6 flex ">
              {(["All", "Comments", "History"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={activeTab === tab}
                  onClick={() => onTabChange(tab)}
                  className={`py-2 px-4  text-sm font-MontserratNormal ${
                    activeTab === tab
                      ? "border-b-2 border-[#7544bf] text-[#7544bf]"
                      : "text-[#999] hover:text-[#555]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {canAddNotes && activeTab ==="Comments" && (
              <form onSubmit={onSubmitComment} className="mb-6 flex items-center gap-3">
                <PersonAvatar
                  name="You"
                  imageUrl={currentUserAvatar}
                  className="h-9 w-9 text-xs"
                />
                <Textarea
                  
                  value={comment}
                  onChange={(event) => onCommentChange(event.target.value)}
                  placeholder="Add a comment..."
                  aria-label="Add a comment"
                  disabled={isSubmittingComment}
                  className="h-22.5 min-w-0 flex-1 "
                />
                {/* <button
                  type="submit"
                  aria-label="Submit comment"
                  disabled={!comment.trim() || isSubmittingComment}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#7544bf] transition-colors hover:bg-[#f0edff] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button> */}
              </form>
            )}
            {activities.length > 0 ? (
              <ul className="space-y-6">
                {activities.map(({ activity, isHistory }) => (
                  <ActivityItem
                    key={`${isHistory ? "history" : "comment"}-${activity.id}`}
                    activity={activity}
                    isHistory={isHistory}
                    currentUserIdentifiers={currentUserIdentifiers}
                    currentUserAvatar={currentUserAvatar}
                  />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-base text-000000/44">
                No {activeTab === "All" ? "activity" : activeTab.toLowerCase()}{" "}
                available.
              </p>
            )}
          </section>
        </div>

        {/* Keep ticket metadata and the assigned support agent beside the activity. */}
        <div className="space-y-4">
          <TicketDetails ticket={ticket} assigneeAvatar={assigneeAvatar} />
         
        </div>
      </div>
    </div>
  );
}
