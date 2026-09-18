import { redirect } from "next/navigation";

export default function DisputesRedirectPage() {
  redirect("/dashboard/seller/orders/dispute-returns");
}
