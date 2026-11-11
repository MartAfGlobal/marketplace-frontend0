"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { RootState } from "@/store";
import type { AdminInfo } from "@/store/admin/adminInfoSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button/Button";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import { Label } from "@/components/ui/forms/Label";
import CustomSelect from "@/components/ui/CustomSelect";
import { downloadTableRows } from "@/utils/downloadTableRows";
import {
  getSupportStatusLabel,
  parseSupportAgentResponse,
  parseSupportTicketDetailResponse,
  type SupportStaffRow,
  type SupportTicketDetail,
} from "@/components/admin-components/support/supportTickets";
import SupportTicketDetailView, {
  type ActivityTab,
  type TicketStatusAction,
} from "./SupportTicketDetailView";

// Collect the signed-in admin's name, email, and IDs from common login response shapes.
function getCurrentUserIdentifiers(value: unknown, depth = 0): string[] {
  if (depth > 4 || value === null || typeof value !== "object") return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => getCurrentUserIdentifiers(item, depth + 1));
  }

  const record = value as Record<string, unknown>;
  const identifiers = [
    record.id,
    record.user_id,
    record.admin_id,
    record.email,
    record.full_name,
    record.name,
    [record.first_name, record.last_name]
      .filter((name): name is string => typeof name === "string")
      .join(" "),
  ].filter((identifier): identifier is string => typeof identifier === "string");

  const identityContainers = [
    "admin",
    "user",
    "profile",
    "account",
    "staff",
    "details",
    "data",
  ];
  return [
    ...identifiers.map((identifier) => identifier.trim().toLowerCase()),
    ...identityContainers.flatMap((key) =>
      getCurrentUserIdentifiers(record[key], depth + 1),
    ),
  ].filter(Boolean);
}

// Read the signed-in admin's profile image from common login response shapes.
function getCurrentUserAvatar(value: unknown, depth = 0): string {
  if (depth > 4 || value === null || typeof value !== "object") return "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const avatar = getCurrentUserAvatar(item, depth + 1);
      if (avatar) return avatar;
    }
    return "";
  }

  const record = value as Record<string, unknown>;
  const avatar = [
    record.profile_picture_url,
    record.profile_picture,
    record.profile_image,
    record.avatar_url,
    record.avatar,
    record.image,
  ].find((candidate): candidate is string => typeof candidate === "string");
  if (avatar) return avatar;

  for (const key of [
    "admin",
    "user",
    "profile",
    "account",
    "staff",
    "details",
    "data",
  ]) {
    const nestedAvatar = getCurrentUserAvatar(record[key], depth + 1);
    if (nestedAvatar) return nestedAvatar;
  }
  return "";
}

export default function SupportTicketDetailPage() {
  // Read the current ticket route, auth state, and permissions for its controls.
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId;
  const token = useSelector((state: RootState) => state.token?.token);
  const adminInfo = useSelector(
    (state: RootState) => state.adminInfo?.data,
  ) as AdminInfo | null;
  const { can } = useAdminAccess();
  const canAddNotes = can("SUPPORT", "modify");
  const canUploadAttachments = can("SUPPORT", "create");
  const canCloseTicket =
    can("SUPPORT") && can("STAFF") && can("SUPPORT", "modify");
  const canReassignTicket = can("STAFF");
  const {
    fetchAdminSupportTicketDetail,
    createAdminSupportTicketNote,
    uploadAdminSupportTicketAttachment,
    updateAdminSupportTicketStatus,
    resolveAdminSupportTicket,
    closeAdminSupportTicket,
    fetchAdminSupportAgents,
    reassignAdminSupportTicket,
  } = AdminDetails();
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const currentAssigneeEmail = ticket?.assigneeEmail.trim().toLowerCase() ?? "";
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [isReassignDrawerOpen, setIsReassignDrawerOpen] = useState(false);
  const [supportAgents, setSupportAgents] = useState<SupportStaffRow[]>([]);
  const [isLoadingSupportAgents, setIsLoadingSupportAgents] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isReassigningTicket, setIsReassigningTicket] = useState(false);
  const [activeTab, setActiveTab] = useState<ActivityTab>("All");
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Build status options from valid transitions and the current user's role permissions.
  const statusOptions = useMemo(() => {
    if (!ticket || !canAddNotes) return [];
    const status = ticket.status.toLowerCase().replace(/[\s-]+/g, "_");
    const transitions: Record<string, TicketStatusAction[]> = {
      open: ["open", "in_progress", "resolved"],
      in_progress: ["open", "in_progress", "resolved"],
      waiting_customer: ["open", "in_progress", "resolved"],
      waiting_internal: ["open", "in_progress", "resolved"],
      under_review: ["open", "in_progress", "resolved"],
      resolved: ["open", "in_progress"],
      closed: [],
    };
    const labels: Record<TicketStatusAction, string> = {
      open: "To Do",
      in_progress: "In progress",
      under_review: "Under review",
      resolved: "Resolved",
      closed: "Closed",
    };
    const availableStatuses = [
      ...(transitions[status] ?? ["open", "in_progress"]),
    ];
    if (canCloseTicket && status !== "closed") availableStatuses.push("closed");

    return availableStatuses.map((value) => ({
      value,
      label:
        value === "resolved"
          ? "Under review"
          : labels[value],
    }));
  }, [ticket, canAddNotes, canCloseTicket]);

  // Reload ticket data after a note or attachment succeeds.
  const refreshTicket = () => {
    fetchAdminSupportTicketDetail(
      ticketId,
      (data) => {
        const detail = parseSupportTicketDetailResponse(data);
        if (detail) setTicket(detail);
        else toast.error("The updated ticket response could not be read.");
      },
      () => toast.error("The action succeeded, but the ticket could not refresh."),
    );
  };

  // Route each menu action to the dedicated backend endpoint and refresh on success.
  const updateTicketStatus = (status: TicketStatusAction) => {
    if (!ticket || isUpdatingStatus) return;
    if (status === "closed" && !canCloseTicket) {
      toast.error("Only support staff with staff access can close tickets.");
      return;
    }

    if (status === "resolved") {
      setResolutionSummary("");
      setIsResolutionDialogOpen(true);
      return;
    }

    if (status === "closed") {
      const description =
        window.prompt("Enter a reason for closing this ticket:")?.trim();
      if (!description) return;
      setIsUpdatingStatus(true);
      closeAdminSupportTicket(
        ticketId,
        description,
        () => {
          setIsUpdatingStatus(false);
          toast.success("Ticket closed.");
          refreshTicket();
        },
        () => {
          setIsUpdatingStatus(false);
          toast.error("Could not close the ticket. Please try again.");
        },
      );
      return;
    }

    setIsUpdatingStatus(true);
    updateAdminSupportTicketStatus(
      ticketId,
      status,
      `Status updated to ${getSupportStatusLabel(status)}.`,
      () => {
        setIsUpdatingStatus(false);
        toast.success(`Ticket moved to ${getSupportStatusLabel(status)}.`);
        refreshTicket();
      },
      () => {
        setIsUpdatingStatus(false);
        toast.error("Could not update the ticket status. Please try again.");
      },
    );
  };

  const submitResolution = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summary = resolutionSummary.trim();
    if (!ticket || !summary || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    resolveAdminSupportTicket(
      ticketId,
      "resolved_during_contact",
      summary,
      () => {
        setIsUpdatingStatus(false);
        setIsResolutionDialogOpen(false);
        setResolutionSummary("");
        toast.success("Ticket resolved.");
        refreshTicket();
      },
      () => {
        setIsUpdatingStatus(false);
        toast.error("Could not resolve the ticket. Please try again.");
      },
    );
  };

  const closeReassignDrawer = () => {
    if (isReassigningTicket) return;
    setIsReassignDrawerOpen(false);
    setSelectedAgentId("");
    setAssignmentNotes("");
  };

  const submitReassignment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !ticket ||
      !canReassignTicket ||
      !selectedAgentId ||
      isReassigningTicket
    ) {
      return;
    }

    setIsReassigningTicket(true);
    reassignAdminSupportTicket(
      ticketId,
      selectedAgentId,
      assignmentNotes.trim(),
      () => {
        setIsReassigningTicket(false);
        setIsReassignDrawerOpen(false);
        setSelectedAgentId("");
        setAssignmentNotes("");
        toast.success("Ticket reassigned.");
        refreshTicket();
      },
      () => {
        setIsReassigningTicket(false);
        toast.error("Could not reassign the ticket. Please try again.");
      },
    );
  };

  useEffect(() => {
    if (!isReassignDrawerOpen || !token || !canReassignTicket) return;
    let active = true;
    setIsLoadingSupportAgents(true);
    fetchAdminSupportAgents(
      (data) => {
        if (!active) return;
        const agents = parseSupportAgentResponse(data);
        if (!agents) {
          setSupportAgents([]);
          toast.error("The support agents response could not be read.");
        } else {
          const eligibleAgents = agents.filter((agent) => agent.id);
          setSupportAgents(eligibleAgents);
          const nextAssignee = eligibleAgents.find(
            (agent) =>
              !currentAssigneeEmail ||
              agent.email.trim().toLowerCase() !== currentAssigneeEmail,
          );
          setSelectedAgentId(nextAssignee?.id ?? "");
        }
        setIsLoadingSupportAgents(false);
      },
      () => {
        if (!active) return;
        setSupportAgents([]);
        setIsLoadingSupportAgents(false);
        toast.error("Could not load support staff. Please try again.");
      },
    );
    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on access and drawer state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReassignDrawerOpen, token, canReassignTicket, currentAssigneeEmail]);

  // Export the ticket record and its current messages as a CSV download.
  const downloadTicket = () => {
    if (!ticket) return;
    downloadTableRows(
      [
        {
          ticket_id: ticket.reference,
          subject: ticket.subject,
          description: ticket.description,
          status: getSupportStatusLabel(ticket.status),
          priority: ticket.priority,
          category: ticket.category,
          assigned_to: ticket.assignee,
          customer_name: ticket.customerName,
          customer_email: ticket.customerEmail,
          created_at: ticket.createdAt,
          comments: ticket.comments
            .map((activity) => `${activity.author}: ${activity.content}`)
            .join("\n"),
        },
      ],
      `support-ticket-${ticket.reference}`,
    );
  };

  // Submit an internal note independently from the attachment uploader.
  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = comment.trim();
    if (!message || isSubmittingComment) return;

    setIsSubmittingComment(true);
    createAdminSupportTicketNote(
      ticketId,
      message,
      () => {
        setComment("");
        setIsSubmittingComment(false);
        toast.success("Comment added.");
        refreshTicket();
      },
      () => {
        setIsSubmittingComment(false);
        toast.error("Could not add the comment. Please try again.");
      },
    );
  };

  // Validate supported document formats before sending the multipart request.
  const uploadAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      pdf: "application/pdf",
    };
    if (
      !extension ||
      !allowedTypes[extension] ||
      (file.type && file.type !== allowedTypes[extension])
    ) {
      toast.error("Choose a JPEG, PNG, or PDF file.");
      event.target.value = "";
      return;
    }

    setIsUploadingAttachment(true);
    uploadAdminSupportTicketAttachment(
      ticketId,
      file,
      () => {
        setIsUploadingAttachment(false);
        if (attachmentInputRef.current) attachmentInputRef.current.value = "";
        toast.success("Attachment uploaded.");
        refreshTicket();
      },
      () => {
        setIsUploadingAttachment(false);
        if (attachmentInputRef.current) attachmentInputRef.current.value = "";
        toast.error("Could not upload the attachment. Please try again.");
      },
    );
  };

  // Load the selected ticket and ignore responses after the page unmounts.
  useEffect(() => {
    if (!token || !ticketId) return;
    let active = true;
    setLoading(true);
    fetchAdminSupportTicketDetail(
      ticketId,
      (data) => {
        if (!active) return;
        const detail = parseSupportTicketDetailResponse(data);
        if (!detail) {
          setTicket(null);
          toast.error("The support ticket response could not be read.");
        } else {
          setTicket(detail);
        }
        setLoading(false);
      },
      () => {
        if (!active) return;
        setTicket(null);
        setLoading(false);
        toast.error("Could not load ticket details. Please try again.");
      },
    );
    return () => {
      active = false;
    };
    // AdminDetails returns fresh helper functions per render; requests depend on auth and route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, ticketId]);

  // Prepare the selected activity tab, sorting the combined feed newest-first.
  const activities = useMemo(() => {
    if (!ticket) return [];
    if (activeTab === "Comments") {
      return ticket.comments.map((activity) => ({
        activity,
        isHistory: false,
      }));
    }
    if (activeTab === "History") {
      return ticket.history.map((activity) => ({
        activity,
        isHistory: true,
      }));
    }
    return [
      ...ticket.comments.map((activity) => ({ activity, isHistory: false })),
      ...ticket.history.map((activity) => ({ activity, isHistory: true })),
    ].sort((a, b) => {
      const dateA = new Date(a.activity.createdAt).getTime() || 0;
      const dateB = new Date(b.activity.createdAt).getTime() || 0;
      return dateB - dateA;
    });
  }, [activeTab, ticket]);
  const currentUserIdentifiers = useMemo(
    () => getCurrentUserIdentifiers(adminInfo),
    [adminInfo],
  );
  const currentUserAvatar = useMemo(
    () => getCurrentUserAvatar(adminInfo),
    [adminInfo],
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#999]">
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#999]">
        Ticket details could not be found.
      </div>
    );
  }

  // Keep data fetching and mutations here; the child component owns presentation.
  return (
    <>
      <SupportTicketDetailView
        ticket={ticket}
        currentUserAvatar={currentUserAvatar}
        statusOptions={statusOptions}
        onStatusChange={updateTicketStatus}
        isUpdatingStatus={isUpdatingStatus}
        canReassignTicket={canReassignTicket}
        isReassigningTicket={isReassigningTicket}
        onReassignTicket={() => setIsReassignDrawerOpen(true)}
        onDownload={downloadTicket}
        activities={activities}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUserIdentifiers={currentUserIdentifiers}
        canAddNotes={canAddNotes}
        canUploadAttachments={canUploadAttachments}
        comment={comment}
        onCommentChange={setComment}
        onSubmitComment={submitComment}
        isSubmittingComment={isSubmittingComment}
        attachmentInputRef={attachmentInputRef}
        onUploadAttachment={uploadAttachment}
        isUploadingAttachment={isUploadingAttachment}
      />
      <DrawerWrapper
        isOpen={isReassignDrawerOpen}
        onClose={closeReassignDrawer}
        maxWidthClassName="max-w-[426px]"
      >
        <button
          type="button"
          onClick={closeReassignDrawer}
          disabled={isReassigningTicket}
          className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors z-20 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-lg font-MontserratMedium text-000000 leading-[26px]">
            Reassign ticket
          </h2>
          <p className="text-xs font-MontserratNormal text-000000/68 leading-4">
            Select a support staff member and add a handoff note.
          </p>
        </div>
        <form
          onSubmit={submitReassignment}
          className="flex min-h-0 flex-1 flex-col gap-5"
        >
          <div className="space-y-2">
            <Label htmlFor="support-ticket-reassign-agent">Support staff</Label>
            <CustomSelect
              placeholder={
                isLoadingSupportAgents
                  ? "Loading support staff..."
                  : supportAgents.length
                    ? "Select support staff"
                    : "No support staff available"
              }
              options={supportAgents.map((agent) => ({
                label: agent.name,
                value: agent.id,
                disabled:
                  !!currentAssigneeEmail &&
                  agent.email.trim().toLowerCase() === currentAssigneeEmail,
              }))}
              value={selectedAgentId}
              onChange={setSelectedAgentId}
              disabled={
                isLoadingSupportAgents ||
                isReassigningTicket ||
                supportAgents.length === 0
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-ticket-assignment-notes">
              Assignment note
            </Label>
            <Textarea
              id="support-ticket-assignment-notes"
              value={assignmentNotes}
              onChange={(event) => setAssignmentNotes(event.target.value)}
              placeholder="Add a note for the handoff..."
              className="h-32"
              disabled={isReassigningTicket}
            />
          </div>
          <div className="mt-auto flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={closeReassignDrawer}
              disabled={isReassigningTicket}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={isReassigningTicket}
              disabled={
                !selectedAgentId ||
                isLoadingSupportAgents ||
                isReassigningTicket
              }
            >
              Reassign
            </Button>
          </div>
        </form>
      </DrawerWrapper>
      <Dialog
        open={isResolutionDialogOpen}
        onOpenChange={(open) => {
          if (isUpdatingStatus) return;
          setIsResolutionDialogOpen(open);
          if (!open) setResolutionSummary("");
        }}
      >
        <DialogContent
          className="w-[calc(100vw-2rem)] sm:max-w-md"
          style={{ maxWidth: "28rem" }}
        >
          <DialogHeader>
            <DialogTitle>Resolution summary</DialogTitle>
            <DialogDescription>
              Enter a summary of how this ticket was resolved.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitResolution} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="ticket-resolution-summary"
                className="text-sm font-MontserratMedium"
              >
                Summary
              </label>
              <Textarea
                id="ticket-resolution-summary"
                autoFocus
                required
                value={resolutionSummary}
                onChange={(event) => setResolutionSummary(event.target.value)}
                placeholder="Describe how the issue was resolved..."
                className="h-32"
                disabled={isUpdatingStatus}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsResolutionDialogOpen(false)}
                disabled={isUpdatingStatus}
                className="inline-flex h-c44 items-center justify-center rounded-c8 border border-ff715b px-4 text-sm font-MontserratMedium text-ff715b disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <Button
                type="submit"
                loading={isUpdatingStatus}
                disabled={isUpdatingStatus || !resolutionSummary.trim()}
                className="flex-1 w-auto disabled:cursor-not-allowed"
              >
                Confirm resolution
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
