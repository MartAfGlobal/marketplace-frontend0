// ---------------------------------------------------------------------------
// Admin API Types
// ---------------------------------------------------------------------------

// ── Attribute ──────────────────────────────────────────────────────────────

export interface AdminAttributeItem {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  extra_fields: {
    name: string;
    label: string;
    default?: string;
  }[];
  values_count?: number;
  values_summary?: string;
  created_at: string;
  updated_at: string;
}

// ── Category ───────────────────────────────────────────────────────────────

export interface AdminCategoryListItem {
  id: string;
  name: string;
  slug?: string;

  image_url?: {
    thumbnail: string ;
  }

  image?: string | null;

  parent_name?: string | null;

  subcategories_summary?: string | null;
  subcategory_count?: number;

  attributes_summary?: string | null;
  attribute_count?: number;

  products_count?: number;

  is_active?: boolean;

  created_at: string;
  updated_at?: string;
}

// ── Category detail (single fetch) ────────────────────────────────────────

export interface AdminCategoryDetail extends AdminCategoryListItem {
  attributes?: AdminAttributeItem[];
  subcategories?: AdminCategoryListItem[];
  description?: string | null;
}

// ── Paginated list response ────────────────────────────────────────────────

export interface AdminCategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminCategoryListItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function resolveImageUrl(imageUrlField: any): string | undefined {
  if (typeof imageUrlField === "string" && imageUrlField.trim()) {
    return imageUrlField.trim();
  }
  if (imageUrlField && typeof imageUrlField === "object") {
    const candidate =
      imageUrlField.thumbnail ||
      imageUrlField.medium ||
      imageUrlField.url ||
      imageUrlField.full;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return undefined;
}

// ── Roles & Permissions (RBAC) ─────────────────────────────────────────────
// Mirrors departments/serializers_rbac.py + accounts/models.py on the backend.

export type PermissionAction = "view" | "create" | "modify" | "delete";

export type PermissionCategoryKey =
  | "USERS"
  | "VERIFICATIONS"
  | "PRODUCTS"
  | "ORDERS"
  | "SUPPORT"
  | "FINANCES"
  | "REPORTS"
  | "STAFF";

export type AccessLevel = "RESTRICTED" | "HIGH" | "STANDARD";
export type RoleStatus = "ACTIVE" | "SUSPENDED";
export type RoleType = "SYSTEM" | "CUSTOM";

export type PermissionMatrix = Record<
  PermissionCategoryKey,
  Record<PermissionAction, boolean>
>;

export interface AdminRoleListItem {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  status_display: string;
  access_level: AccessLevel;
  access_level_display: string;
  role_type: RoleType;
  role_type_display: string;
  access_areas: string[];
  assigned_staff: number;
  updated_at: string;
}

export interface AdminRoleDetail extends AdminRoleListItem {
  permissions: PermissionMatrix;
  created_at: string;
  created_by_email: string | null;
  updated_by_email: string | null;
}

export interface AdminRoleStaffAssignedItem {
  user_id: string;
  staff_ref: string | null;
  name: string;
  status: string | null;
  date_added: string;
  last_active: string | null;
}

export interface AdminRolesSummary {
  total_roles: number;
  active_roles: number;
  total_staff_assigned: number;
  unused_roles: number;
}

export interface PermissionCategoryOption {
  key: PermissionCategoryKey;
  label: string;
}

// ── Staff Management ───────────────────────────────────────────────────────

export type StaffStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface AdminStaffListItem {
  user_id: string;
  staff_ref: string;
  full_name: string;
  email: string;
  role: string | null;
  location: string | null;
  status: StaffStatus;
  status_display: string;
  last_active: string | null;
}

export interface AdminStaffDetail {
  user_id: string;
  staff_ref: string;
  status: StaffStatus;
  status_display: string;
  email: string;
  role: string | null;
  role_id: number | null;
  profile_picture_url: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  dob: string | null;
  gender: string | null;
  marital_status: string | null;
  phone: string;
  nationality: string | null;
  residential_address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;
  location: string | null;
  means_of_identification: string | null;
  id_issue_date: string | null;
  id_expiration_date: string | null;
  identification_document_url: string | null;
  invited_at: string | null;
  activated_at: string | null;
  created_at: string;
}

export interface AdminStaffSummary {
  total_staff: number;
  active_staff: number;
  inactive_staff: number;
}

export interface AdminStaffByRole {
  role: string;
  count: number;
}

export interface AdminStaffActivityLogItem {
  id: number;
  actor_name: string;
  category: "STAFF" | "ROLE" | "KYC" | "TICKET" | "OTHER";
  action: string;
  target_description: string | null;
  created_at: string;
}

export interface AdminStaffTicketItem {
  id: number;
  ticket_ref: string;
  subject: string;
  status: "OPEN" | "PENDING" | "CLOSED";
  created_at: string;
  closed_at: string | null;
}

// The reason codes accepted by both the suspend and security-logout
// endpoints (accounts.models.SuspensionReason).
export const SUSPENSION_REASONS: { value: string; label: string }[] = [
  { value: "FRAUDULENT_ACTIVITY", label: "Fraudulent activity" },
  { value: "MALICIOUS_PAYMENT_INFO", label: "Malicious payment information" },
  { value: "POLICY_VIOLATION", label: "Policy violation" },
  { value: "MULTIPLE_DISPUTES", label: "Multiple unresolved disputes" },
  { value: "SUSPICIOUS_BEHAVIOR", label: "Suspicious behavior" },
  { value: "COUNTERFEIT_PRODUCTS", label: "Counterfeit or prohibited products" },
  { value: "NON_COMPLIANCE", label: "KYC/KYB non-compliance" },
  { value: "OTHER", label: "Other" },
];

// ── Admin Disputes & Returns ───────────────────────────────────────────────

export interface AdminDisputeStats {
  total_disputes?: number;
  total?: number;
  count?: number;
  requested?: number;
  requested_count?: number;
  open?: number;
  open_count?: number;
  escalated?: number;
  escalated_count?: number;
  resolved?: number;
  resolved_count?: number;
  rejected?: number;
  rejected_count?: number;
  cancelled?: { count: number; formatted_amount?: string; amount?: number } | number;
  disputed?: { count: number; formatted_amount?: string; amount?: number } | number;
  returned?: { count: number; formatted_amount?: string; amount?: number } | number;
  total_amount?: string;
  total_refund_amount?: string | number;
  [key: string]: any;
}

export interface AdminDisputeItem {
  id: string;
  order_id?: string;
  order_number?: string;
  order_no?: string;
  order?: any;
  status: string;
  status_display?: string;
  dispute_type?: string;
  dispute_type_display?: string;
  type?: string;
  reason?: string;
  cancellation_reason_title?: string;
  reason_title?: string;
  more_details?: string;
  more_information?: string;
  description?: string;
  return_method?: string;
  delivery_station_address?: string;
  requested_refund_amount?: number;
  amount?: string | number;
  total_amount?: string | number;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
  item_returned_at?: string;
  buyer?: any;
  seller?: any;
  vendor?: any;
  buyer_name?: string;
  seller_name?: string;
  vendor_name?: string;
  dispute_number?: string;
  affected_quantity?: number;
  product_name?: string;
  product_image?: string;
  product_slug?: string;
  variant_name?: string;
  [key: string]: any;
}

export interface DisputeTableRow {
  id: string;
  disputeNumber?: string;
  refundType?: string;
  orderId: string;
  buyer: string;
  buyerEmail?: string;
  vendor: string;
  vendorEmail?: string;
  disputeType: string;
  reason: string;
  amount: string;
  status: string;
  date: string;
  quantity?: number;
  raw: AdminDisputeItem;
}
