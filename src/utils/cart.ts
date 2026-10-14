import { CartItem } from "@/store/cart/cartSlice";

interface BackendCartItem {
  id?: string;
  product_id?: string;
  variation_id?: string | null;
  product_name?: string;
  name?: string;
  price?: string | number;
  unit_price?: string | number;
  price_at_purchase?: string | number;
  quantity?: number;
  product_slug?: string;
  variation_display?: string;
  variation_name?: string;
  product_image?: CartItem["product_image"];
  image?: CartItem["product_image"];
  checked?: boolean;
}

export const mapBackendCartItems = (items: BackendCartItem[]): CartItem[] =>
  items.map((item) => ({
    id: item.id || item.product_id || "",
    product_id: item.product_id || item.id || "",
    variation_id: item.variation_id || null,
    product_name: item.product_name || item.name || "",
    price: item.price || item.unit_price || 0,
    price_at_purchase:
      item.price_at_purchase || item.price || item.unit_price || 0,
    quantity: item.quantity ?? 1,
    product_slug: item.product_slug || "",
    variation_display: (
      item.variation_display || item.variation_name || ""
    ).toLowerCase(),
    product_image: item.product_image || item.image || "/placeholder.png",
    checked: typeof item.checked === "boolean" ? item.checked : true,
  }));
