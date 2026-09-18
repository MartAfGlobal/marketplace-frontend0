import SelleOrderspage from "@/components/ui/seller-components/body-components/Order-management/seller-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Orders Analytics | Manage Your Store",
  description:
    "View analytics, order volume by category, and quantity metrics for your store orders.",
};

export default function OrdersAnalyticsPage() {
  return <SelleOrderspage initialSection="analytics" />;
}
