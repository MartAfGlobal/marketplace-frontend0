import { redirect } from "next/navigation";

// Reports has no "overview" page of its own -- 11 separate sections, each
// its own route (see the sidebar's Reports subItems). Landing on the bare
// /reports route goes straight to the first one instead of a dead page.
export default function ReportsIndexPage() {
  redirect("/dashboard/admin/reports/sales-orders");
}
