import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in Nigerian Naira with proper locale formatting
 * @param price - The price as a number or string
 * @returns Formatted price string with ₦ symbol
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a price with decimal places (for exact amounts)
 * @param price - The price as a number or string
 * @returns Formatted price string with ₦ symbol and decimals
 */
export function formatNairaWithDecimals(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return '₦0.00';
  
  return `₦${numericPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Convert UUID to a shorter numeric ID for URLs
 * Uses a simple hash function to create a consistent short ID from UUID
 */
export function uuidToShortId(uuid: string): number {
  // Remove hyphens and convert to lowercase
  const cleanUuid = uuid.replace(/-/g, '').toLowerCase();
  
  // Simple hash function - sum character codes with position multiplier
  let hash = 0;
  for (let i = 0; i < cleanUuid.length; i++) {
    const char = cleanUuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive number and make it reasonably short (5-6 digits)
  return Math.abs(hash) % 999999 + 10000;
}

/**
 * Create a product URL with short ID and slug
 */
export function createProductUrl(uuid: string, slug: string): string {
  const shortId = uuidToShortId(uuid);
  return `/product/${shortId}-${slug}`;
}

/**
 * Parse product URL to extract short ID and slug
 */
export function parseProductUrl(urlPath: string): { shortId: number; slug: string } | null {
  // Remove /product/ prefix if present
  const path = urlPath.replace(/^\/product\//, '');
  
  // Match pattern: number-slug
  const match = path.match(/^(\d+)-(.+)$/);
  
  if (!match) {
    return null;
  }
  
  return {
    shortId: parseInt(match[1], 10),
    slug: match[2]
  };
}

/**
 * Find UUID from short ID by checking all products
 * This requires fetching products to find the matching UUID
 */
export async function shortIdToUuid(shortId: number, products: any[]): Promise<string | null> {
  for (const product of products) {
    if (uuidToShortId(product.id) === shortId) {
      return product.id;
    }
  }
  return null;
}


export const getStatusDisplay = (status: string) => {
  switch (status) {
    case "Out for Delivery":
      return { text: "Order on its way", color: "text-blue-600" };
    case "dispute":
      return { text: "In dispute", color: "text-red-600" };
    case "Delivered":
      return { text: "Completed", color: "text-green-600" };
    case "Awaiting Confirmation":
      return { text: "Awaiting Confirmation", color: "text-orange-600" };
    case "Processing":
      return { text: "Ready to ship", color: "text-purple-600" };
    case "Shipped":
      return { text: "Shipped", color: "text-blue-600" };
    default:
      return { text: "Unknown", color: "text-gray-600" };
  }
};