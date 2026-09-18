import { redirect } from "next/navigation";

export default function MyOrdersRedirectPage() {
  redirect("/dashboard/seller/orders");
}
