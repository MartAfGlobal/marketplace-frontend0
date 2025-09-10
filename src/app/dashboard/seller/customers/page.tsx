// src/app/dashboard/seller/customers/page.tsx
import { Customers } from "@/components/ui/seller-components/body-components/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard Customers | Manage Your Store",
  description:
    "Manage your customers effectively. View customer profiles, track activity, and build strong relationships to grow your business.",
  openGraph: {
    title: "Seller Dashboard Customers | Manage Your Store",
    description:
      "Access customer data, monitor activity, and manage relationships directly from your seller customers dashboard.",
    url: "https://yourdomain.com/dashboard/seller/customers",
    siteName: "Your Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seller Dashboard Customers",
    description:
      "View and manage your customer profiles, activity, and engagement all in one place.",
  },
};

// ✅ Page component remains a Server Component by default
export default function CustomersPage() {
  return <Customers />;
}
