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
