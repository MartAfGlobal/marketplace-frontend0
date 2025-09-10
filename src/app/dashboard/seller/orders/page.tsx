// src/app/dashboard/seller/orders/page.tsx
import { Orders } from "@/components/ui/seller-components/body-components/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard Orders | Manage Your Store",
  description:
    "Manage and track all your customer orders in one place. View order status, process shipments, and stay on top of your sales efficiently.",
  openGraph: {
    title: "Seller Dashboard Orders | Manage Your Store",
    description:
      "Easily manage customer orders, track progress, and process shipments directly from your seller dashboard.",
    url: "https://yourdomain.com/dashboard/seller/orders",
    siteName: "Your Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seller Dashboard Orders",
    description:
      "Stay updated with all your customer orders and manage them seamlessly from your seller dashboard.",
  },
};

// ✅ Page component remains a Server Component by default
export default function OrdersPage() {
  return <Orders />;
}
