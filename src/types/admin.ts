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
