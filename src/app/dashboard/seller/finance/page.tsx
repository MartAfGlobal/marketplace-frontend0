// src/app/dashboard/seller/finance/page.tsx
import { Finance } from "@/components/ui/seller-components/body-components/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard Finance | Manage Your Store",
  description:
    "Track your earnings, view payment history, and manage financial transactions with ease from your seller finance dashboard.",
  openGraph: {
    title: "Seller Dashboard Finance | Manage Your Store",
    description:
      "Stay on top of your store’s earnings, withdrawals, and transaction history in your finance dashboard.",
    url: "https://yourdomain.com/dashboard/seller/finance",
    siteName: "Your Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seller Dashboard Finance",
    description:
      "Easily manage earnings, withdrawals, and transactions directly from your finance dashboard.",
  },
};

// ✅ Page component remains a Server Component by default
export default function FinancePage() {
  return <Finance />;
}
