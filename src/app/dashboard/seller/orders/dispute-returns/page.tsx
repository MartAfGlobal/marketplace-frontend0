import SelleOrderspage from "@/components/ui/seller-components/body-components/Order-management/seller-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Orders Disputes & Returns | Manage Your Store",
  description:
    "Manage and track disputes and return requests from buyers for your store orders.",
};

export default function OrdersDisputeReturnsPage() {
  return <SelleOrderspage initialSection="dispute/Returns" />;
}
