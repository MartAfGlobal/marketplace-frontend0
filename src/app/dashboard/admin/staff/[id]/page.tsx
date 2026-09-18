"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  User,
  Pencil,
  UserCog,
  PauseCircle,
  Trash2,
  Calendar,
  Phone,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import StaffReasonModal from "@/components/ui/Modals/admin/StaffReasonModal";
import ReassignRoleModal from "@/components/admin-components/staff/ReassignRoleModal";
import type {
  AdminStaffActivityLogItem,
  AdminStaffDetail,
  AdminStaffTicketItem,
  StaffStatus,
} from "@/types/admin";

type Tab = "Personal information" | "Activity logs" | "Tickets";

const STATUS_STYLES: Record<StaffStatus, string> = {
  ACTIVE: "text-[#2ea37d] bg-[#2ea37d]/10",
  PENDING: "text-[#FFAC06] bg-[#FFAC06]/10",
  SUSPENDED: "text-[#f44336] bg-[#f44336]/10",
  DEACTIVATED: "text-000000/44 bg-000000/8",
};

const ID_TYPE_LABELS: Record<string, string> = {
  INTERNATIONAL_PASSPORT: "International passport",
  NATIONAL_ID: "National ID",
  DRIVERS_LICENSE: "Driver's license",
  VOTERS_CARD: "Voter's card",
};

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

const SELECT_ICON = <ChevronDown className="w-4 h-4 text-gray-400" />;

const ID_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "INTERNATIONAL_PASSPORT", label: "International passport" },
  { value: "NATIONAL_ID", label: "National ID" },
  { value: "DRIVERS_LICENSE", label: "Driver's license" },
  { value: "VOTERS_CARD", label: "Voter's card" },
];

type EditableFields = Pick<
  AdminStaffDetail,
  | "first_name"
  | "last_name"
  | "middle_name"
  | "dob"
  | "gender"
  | "marital_status"
  | "phone"
  | "nationality"
  | "residential_address"
  | "country"
  | "state"
  | "city"
  | "postal_code"
  | "means_of_identification"
  | "id_issue_date"
  | "id_expiration_date"
>;

export default function AdminStaffDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const [activeTab, setActiveTab] = useState<Tab>("Personal information");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditableFields | null>(null);
  const [saving, setSaving] = useState(false);

  const [reassignOpen, setReassignOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [activityLogs, setActivityLogs] = useState<AdminStaffActivityLogItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [tickets, setTickets] = useState<AdminStaffTicketItem[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const { adminStaffDetail: staff } = useSelector((state: RootState) => state.adminStaffDetail);

  const {
    fetchAdminStaffDetail,
    updateAdminStaffProfile,
    suspendAdminStaff,
    deactivateAdminStaff,
    fetchAdminStaffActivityLogs,
    fetchAdminStaffTickets,
  } = AdminDetails();

  useEffect(() => {
    if (!token || !userId) return;
    fetchAdminStaffDetail(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId || activeTab !== "Activity logs") return;
    setActivityLoading(true);
    fetchAdminStaffActivityLogs(userId, 1, (data) => {
      setActivityLogs(data?.results ?? []);
      setActivityLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, activeTab]);

  useEffect(() => {
    if (!token || !userId || activeTab !== "Tickets") return;
    setTicketsLoading(true);
    fetchAdminStaffTickets(userId, 1, (data) => {
      setTickets(data?.results ?? []);
      setTicketsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, activeTab]);

  const startEditing = () => {
    if (!staff) return;
    setForm({
      first_name: staff.first_name,
      last_name: staff.last_name,
      middle_name: staff.middle_name,
      dob: staff.dob,
      gender: staff.gender,
      marital_status: staff.marital_status,
      phone: staff.phone,
      nationality: staff.nationality,
      residential_address: staff.residential_address,
      country: staff.country,
      state: staff.state,
      city: staff.city,
      postal_code: staff.postal_code,
      means_of_identification: staff.means_of_identification,
      id_issue_date: staff.id_issue_date,
      id_expiration_date: staff.id_expiration_date,
    });
    setEditing(true);
  };

  const handleSaveProfile = () => {
    if (!form || !userId) return;
    setSaving(true);
    updateAdminStaffProfile(
      userId,
      form,
      () => {
        setSaving(false);
        setEditing(false);
        toast.success("Profile updated.");
      },
      () => setSaving(false),
    );
  };

  const handleSuspend = (reason: string) => {
    if (!userId) return;
    setActionBusy(true);
    suspendAdminStaff(userId, { reason }, () => {
      setActionBusy(false);
      setSuspendOpen(false);
    });
  };

  const handleDeactivate = () => {
    if (!userId) return;
    setActionBusy(true);
    deactivateAdminStaff(
      userId,
      () => {
        setActionBusy(false);
        setDeactivateOpen(false);
        router.push("/dashboard/admin/staff");
      },
      () => setActionBusy(false),
    );
  };

  if (!staff) {
    return (
      <div className="py-16 text-center text-c12 text-000000/44 font-MontserratNormal">
        Loading staff details...
      </div>
    );
  }

  const fullName = `${staff.first_name} ${staff.last_name}`.trim();
  // Value/onChange bound to `form` in edit mode, or a read-only snapshot of
  // `staff` when just viewing — both render through the same Input so the
  // view and edit states look identical, only interactivity differs.
  const view = editing && form ? form : staff;

  const field = (
    label: string,
    key: keyof EditableFields,
    extra?: { type?: string; icon?: ReactNode; validatePhone?: boolean; span?: boolean; placeholder?: string },
  ) => (
    <div className={extra?.span ? "sm:col-span-2" : undefined}>
      <Label>{label}</Label>
      <Input
        type={extra?.type}
        icon={extra?.icon}
        validatePhone={extra?.validatePhone}
        placeholder={extra?.placeholder}
        value={view[key] ?? ""}
        disabled={!editing}
        onChange={(e) => form && setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 space-y-8">
      {/* Breadcrumb */}
      <div className="text-c12 font-MontserratMedium flex items-center gap-1">
        <Link href="/dashboard/admin/staff" className="text-000000/44 hover:text-000000/68 transition-colors">
          Staff
        </Link>
        <ChevronRight className="text-000000/44 w-4 h-4" />
        <span className="font-MontserratSemiBold text-000000">{fullName}</span>
      </div>

      {/* Title & Update profile dropdown */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Staff details</h1>

        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="h-10 px-4 flex items-center gap-2 w-fit"
          >
            Update profile
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </Button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 rounded-c8 bg-white shadow-custom border border-000000/4 z-30 py-3 px-4 flex flex-col text-c12 font-MontserratNormal overflow-hidden"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab("Personal information");
                    startEditing();
                  }}
                  className="w-full text-left py-2 flex items-center gap-3 text-[#ff715b] hover:text-[#ff715b]/80 transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Update profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setReassignOpen(true);
                  }}
                  className="w-full text-left py-2 flex items-center gap-3 text-000000/68 hover:text-000000 transition-colors"
                >
                  <UserCog className="w-4 h-4" /> Reassign role
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSuspendOpen(true);
                  }}
                  disabled={staff.status === "SUSPENDED"}
                  className="w-full text-left py-2 flex items-center gap-3 text-[#FFAC06] hover:text-[#FFAC06]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <PauseCircle className="w-4 h-4" /> Suspend staff
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setDeactivateOpen(true);
                  }}
                  disabled={staff.status === "DEACTIVATED"}
                  className="w-full text-left py-2 flex items-center gap-3 text-[#CA0202] hover:text-[#CA0202]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" /> Deactivate staff
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Left rail */}
        <div className="flex flex-col items-start">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
            {staff.profile_picture_url ? (
              <Image
                src={staff.profile_picture_url}
                alt={fullName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <h3 className="text-base font-MontserratSemiBold text-000000 mb-1">{fullName}</h3>
          <p className="text-c12 text-000000/44 font-MontserratNormal mb-3">{staff.staff_ref}</p>
          <span
            className={`text-c12 font-MontserratMedium px-4 py-1 rounded-c32 mb-6 ${STATUS_STYLES[staff.status]}`}
          >
            {staff.status_display}
          </span>

          <nav className="flex flex-col gap-4 text-c12 font-MontserratNormal w-full">
            {(["Personal information", "Activity logs", "Tickets"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setEditing(false);
                  setActiveTab(tab);
                }}
                className={`text-left transition-colors ${
                  activeTab === tab ? "text-[#ff715b] font-MontserratMedium" : "text-000000/68 hover:text-000000"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right content */}
        <div>
          {activeTab === "Personal information" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-MontserratNormal text-000000/68">Personal information</h2>
                {editing && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditing(false)} className="w-fit px-4 h-9 text-xs" disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="w-fit px-4 h-9 text-xs" disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {field("First name", "first_name", { placeholder: "Enter first name" })}
                {field("Middle name", "middle_name", { placeholder: "Enter middle name" })}
                {field("Last name", "last_name", { placeholder: "Enter last name" })}
                {field("Date of Birth", "dob", {
                  type: "date-custom",
                  icon: <Calendar className="w-4 h-4 text-gray-400" />,
                  placeholder: "Select date of birth",
                })}
                {field("Gender", "gender", { icon: SELECT_ICON, placeholder: "Select gender" })}
                {field("Phone number", "phone", {
                  icon: <Phone className="w-4 h-4 text-gray-400" />,
                  validatePhone: true,
                  placeholder: "Enter phone number",
                })}
                {field("Marital status", "marital_status", { icon: SELECT_ICON, placeholder: "Select marital status" })}
                {field("Nationality", "nationality", { icon: SELECT_ICON, placeholder: "Select nationality" })}
                {field("Residental address", "residential_address", { span: true, placeholder: "Enter residential address" })}
                {field("Country", "country", { icon: SELECT_ICON, placeholder: "Select country" })}
                {field("State", "state", { placeholder: "Enter state" })}
                {field("City", "city", { placeholder: "Enter city" })}
                {field("Postal code", "postal_code", { placeholder: "Enter postal code" })}

                <div>
                  <Label>Means of identification</Label>
                  {editing ? (
                    <div className="relative">
                      <select
                        value={form?.means_of_identification ?? ""}
                        onChange={(e) => form && setForm({ ...form, means_of_identification: e.target.value })}
                        className="h-12 px-3.5 w-full rounded-c8 text-gray-700 border border-efefef outline-none md:text-sm appearance-none bg-white focus:border-ff715b focus:ring-1 focus:ring-ff715b"
                      >
                        <option value="">Select ID type</option>
                        {ID_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : (
                    <Input
                      disabled
                      icon={SELECT_ICON}
                      placeholder="Select ID type"
                      value={staff.means_of_identification ? ID_TYPE_LABELS[staff.means_of_identification] ?? staff.means_of_identification : ""}
                    />
                  )}
                </div>
                {field("Issue date", "id_issue_date", {
                  type: "date-custom",
                  icon: <Calendar className="w-4 h-4 text-gray-400" />,
                  placeholder: "Select issue date",
                })}
                {field("Expiration date", "id_expiration_date", {
                  type: "date-custom",
                  icon: <Calendar className="w-4 h-4 text-gray-400" />,
                  placeholder: "Select expiration date",
                })}

                <div className="sm:col-span-3">
                  <Label>Uploaded documents</Label>
                  {staff.identification_document_url ? (
                    <a
                      href={staff.identification_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center w-full sm:max-w-xs"
                    >
                      <Input readOnly disabled value="Identification.pdf" className="cursor-pointer" />
                      <Paperclip className="w-4 h-4 text-gray-400 absolute right-3.5" />
                    </a>
                  ) : (
                    <div className="w-full sm:max-w-xs">
                      <Input readOnly disabled placeholder="No document uploaded" icon={<Paperclip className="w-4 h-4 text-gray-400" />} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Activity logs" && (
            <div>
              <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Activity logs</h2>
              {activityLoading ? (
                <p className="text-c12 text-000000/44 font-MontserratNormal">Loading...</p>
              ) : activityLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
                        <th className="font-MontserratNormal text-sm p-3 w-40">Timestamp</th>
                        <th className="font-MontserratNormal text-sm p-3">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-000000/68 font-MontserratNormal">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="h-10.5 border-b border-000000/4 last:border-0">
                          <td className="p-3 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                          <td className="p-3">{log.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-c12 text-000000/44 font-MontserratNormal">No activity recorded yet.</p>
              )}
            </div>
          )}

          {activeTab === "Tickets" && (
            <div>
              <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Tickets</h2>
              {ticketsLoading ? (
                <p className="text-c12 text-000000/44 font-MontserratNormal">Loading...</p>
              ) : tickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
                        <th className="font-MontserratNormal text-sm p-3">Ticket</th>
                        <th className="font-MontserratNormal text-sm p-3">Subject</th>
                        <th className="font-MontserratNormal text-sm p-3">Status</th>
                        <th className="font-MontserratNormal text-sm p-3">Opened</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-000000/68 font-MontserratNormal">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="h-10.5 border-b border-000000/4 last:border-0">
                          <td className="p-3">{ticket.ticket_ref}</td>
                          <td className="p-3">{ticket.subject}</td>
                          <td className="p-3">{ticket.status}</td>
                          <td className="p-3">{formatDate(ticket.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-c12 text-000000/44 font-MontserratNormal">No tickets assigned yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ReassignRoleModal
        isOpen={reassignOpen}
        userId={userId}
        currentRoleId={staff.role_id}
        onClose={() => setReassignOpen(false)}
        onSuccess={() => fetchAdminStaffDetail(userId)}
      />

      <StaffReasonModal
        isOpen={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        onConfirm={handleSuspend}
        loading={actionBusy}
        title="Reason for suspension"
        confirmLabel="Confirm, suspend staff"
      />

      <ConfirmModal
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        title="Deactivate staff"
        description={`Are you sure you want to deactivate ${fullName}? They will immediately lose access.`}
        onYes={handleDeactivate}
        onNo={() => setDeactivateOpen(false)}
        yesText="Deactivate"
        noText="Cancel"
        loading={actionBusy}
      />
    </div>
  );
}
