// src/app/dashboard/seller/overview/page.tsx
import { Overview } from "@/components/ui/seller-components/body-components/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard Overview | Manage Your Store",
  description:
    "Get a quick snapshot of your seller performance. View sales insights, monitor orders, track product performance, and keep your business growth on track in the overview dashboard.",
  openGraph: {
    title: "Seller Dashboard Overview | Manage Your Store",
    description:
      "Quick insights into your sales, orders, products, and customers — all in one overview dashboard.",
    url: "https://martarf.com/dashboard/seller/overview",
    siteName: "Your Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seller Dashboard Overview",
    description:
      "Track sales, orders, and product performance in your seller overview dashboard.",
  },
};

// ✅ Page component remains a Server Component by default
export default function OverviewPage() {
  return <Overview />; 
}
