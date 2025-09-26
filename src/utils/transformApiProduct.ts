import { Product, Variations } from "@/types/global";

/**
 * Map API product shape -> your Product type.
 * - preserves medium image URLs in `image: string[]` (keeps existing usage)
 * - adds `images` with metadata (id, alt, original/medium/thumbnail)
 * - maps `variations_data` -> variations (Variation[])
 * - maps `reviews_data` -> reviews (best-effort shape; keeps raw)
 * - maps `specifications_data` -> specifications (best-effort shape; keeps raw)
 */
export const transformApiProduct = (apiProduct: any): Product => {
  // simple array of medium URLs (keeps previous code)
  const image = apiProduct.images_data?.map((img: any) => img.image_urls?.medium).filter(Boolean) || [];

  // richer images metadata (id, alt_text and all urls)
  const images = apiProduct.images_data?.map((img: any) => ({
    id: img.id ?? null,
    alt: img.alt_text ?? null,
    original: img.image_urls?.original ?? null,
    medium: img.image_urls?.medium ?? null,
    thumbnail: img.image_urls?.thumbnail ?? null,
  })) || [];

  const variations: Variations[] = apiProduct.variations_data?.map((v: any): Variations => ({
    id: v.id,
    sku: v.sku,
    size: v.size ?? null,
    color: v.color ?? null,
    stock: v.stock ?? 0,
    low_stock_threshold: v.low_stock_threshold ?? null,
    low_stock_notified: v.low_stock_notified ?? false,
    product: v.product ?? null,
  })) || [];

  // Best-effort review mapping (keeps original raw object on each review)
  const reviews = apiProduct.reviews_data?.map((r: any) => ({
    id: r.id ?? null,
    // common fallback names used by different APIs
    author: r.name ?? r.user_name ?? r.author ?? null,
    rating: r.rating ?? r.score ?? 0,
    text: r.text ?? r.comment ?? r.review ?? "",
    created_at: r.created_at ?? r.timestamp ?? null,
    raw: r,
  })) || [];

  // Best-effort specifications mapping (keeps original raw object on each spec)
  const specifications = apiProduct.specifications_data?.map((s: any) => ({
    id: s.id ?? null,
    key: s.key ?? s.name ?? s.title ?? null,
    value: s.value ?? s.detail ?? s.spec ?? null,
    raw: s,
  })) || [];

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    price: apiProduct.price,
    discount_price: apiProduct.discount_price,
    discount_percent: apiProduct.discount_percent,
    sku: apiProduct.sku,
    category: apiProduct.gender ?? null,
    inventory: apiProduct.inventory ?? 0,
    sold: apiProduct.sold ?? 0,
    onSale: (apiProduct.discount_percent ?? 0) > 0,
    image,      // simple array of medium urls (backwards compatible)
    images,     // richer image metadata
    variations: apiProduct.variations_data,
    whatsInBox: apiProduct.whatsinbox ?? null,
    rating_average: apiProduct.rating_average ?? 0,
    origin: apiProduct.origin ?? null,
    is_active: apiProduct.is_active ?? false,
    is_draft: apiProduct.is_draft ?? false,
    is_published: apiProduct.is_published ?? false,
    created_at: apiProduct.created_at ?? null,
    updated_at: apiProduct.updated_at ?? null,
    manufacturer: apiProduct.manufacturer ?? null,
    warehouse: apiProduct.warehouse ?? null,
    

    // the new fields you asked for:
    reviews,         // mapped reviews array (best-effort)
    specifications,  // mapped specifications array (best-effort)

    // small extras from API
    age_group: apiProduct.age_group ?? null,
    low_stock_notified: apiProduct.low_stock_notified ?? false,

    // default UI section (you can change logic later)
    section: "Today",
  } as unknown as Product;
};
