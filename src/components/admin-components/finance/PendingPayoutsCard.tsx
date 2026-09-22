import Link from "next/link";
import { RefreshCw } from "lucide-react";
import StatIcon from "@/components/admin-components/StatIcon";
import { formatDate, formatNaira } from "@/helpers/admin/financeFormat";
import type { FinanceDashboard } from "@/types/finance";

interface PendingPayoutsCardProps {
  pending: FinanceDashboard["pending_payouts"] | undefined;
}

const PRIORITY_COLORS = { High: "text-[#CA0202]", Medium: "text-[#FFAC06]", Normal: "text-000000/68" };

export default function PendingPayoutsCard({ pending }: PendingPayoutsCardProps) {
  return (
    <div className="rounded-2xl border border-000000/8 p-6">
      <div className="flex items-center justify-between pb-4 border-b border-000000/8">
        <h2 className="text-c18 font-MontserratNormal text-000000/68">Pending Payouts</h2>
        <Link href="/dashboard/admin/finances/payouts" className="text-c12 font-MontserratNormal text-[#ff715b]">
          View all
        </Link>
      </div>

      <div className="flex items-center gap-3 my-6">
        <StatIcon tone="warning">
          <RefreshCw className="w-4 h-4" />
        </StatIcon>
        <p className="text-c32 font-MontserratMedium">{pending?.count ?? 0}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-c12 font-MontserratNormal">
          <thead className="text-000000/44">
            <tr>
              {["Transaction ID", "Amount", "Date created", "Source", "Priority"].map((h) => (
                <th key={h} className="pb-3 pr-4 font-MontserratNormal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-000000/68">
            {(pending?.items ?? []).map((item) => (
              <tr key={item.id} className="h-10">
                <td className="pr-4">{item.transaction_id ?? "—"}</td>
                <td className="pr-4">{formatNaira(item.amount, 0)}</td>
                <td className="pr-4">{formatDate(item.created_at)}</td>
                <td className="pr-4 max-w-[140px] truncate">{item.source}</td>
                <td className={PRIORITY_COLORS[item.priority]}>{item.priority}</td>
              </tr>
            ))}
            {(pending?.items.length ?? 0) === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-000000/44">
                  No payouts waiting.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
