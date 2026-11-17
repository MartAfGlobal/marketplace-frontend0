export interface ProductImageSource {
  id?: string;
  alt_text?: string;
  image_urls?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    thumbnail?: string;
    url?: string;
  };
  original?: string;
  large?: string;
  medium?: string;
  small?: string;
  image?: string;
  url?: string;
  thumbnail?: string;
  main_image_url?: string;
}

export type ProductImageValue = string | ProductImageSource;

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#0080FF",
  red: "#D32F2F",
  green: "#2E7D32",
  brown: "#5D4037",
  yellow: "#FBC02D",
  orange: "#F57C00",
  purple: "#7B1FA2",
  pink: "#E91E63",
  gray: "#757575",
  grey: "#757575",
  beige: "#F5F5DC",
  navy: "#000080",
  cream: "#FFFDD0",
  gold: "#FFD700",
  silver: "#C0C0C0",
  maroon: "#800000",
  teal: "#008080",
  olive: "#808000",
};

export const getColorHex = (
  value: string,
  extraData?: Record<string, string>
): string => {
  if (extraData?.hex_code) return extraData.hex_code;
  if (extraData?.hex) return extraData.hex;
  if (extraData?.color) return extraData.color;
  if (value.startsWith("#")) return value;
  const normalized = value.toLowerCase().trim();
  return COLOR_MAP[normalized] || normalized;
};

export const getImageUrl = (
  img: ProductImageValue | null | undefined
): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  // Prefer higher-resolution sources for the main product image.
  return (
    img.image_urls?.original ||
    img.image_urls?.large ||
    img.image_urls?.medium ||
    img.image_urls?.url ||
    img.image_urls?.thumbnail ||
    img.original ||
    img.large ||
    img.medium ||
    img.image ||
    img.url ||
    img.thumbnail ||
    img.main_image_url ||
    ""
  );
};

export const getThumbUrl = (
  thumb: ProductImageValue | null | undefined
): string => {
  if (!thumb) return "";
  if (typeof thumb === "string") return thumb;
  // Thumbnails prioritize smaller variants to keep the gallery lightweight.
  return (
    thumb.image_urls?.thumbnail ||
    thumb.image_urls?.medium ||
    thumb.image_urls?.small ||
    thumb.image_urls?.original ||
    thumb.image_urls?.large ||
    thumb.image_urls?.url ||
    thumb.thumbnail ||
    thumb.medium ||
    thumb.image ||
    thumb.url ||
    thumb.large ||
    thumb.main_image_url ||
    ""
  );
};
