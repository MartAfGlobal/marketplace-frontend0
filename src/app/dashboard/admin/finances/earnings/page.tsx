"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Hourglass, Landmark, PiggyBank, TrendingUp } from "lucide-react";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import {
  downloadCsv,
  formatDate,
  formatNaira,
  PERIOD_LABELS,
  PERIOD_OPTIONS,
  periodFromLabel,
} from "@/helpers/admin/financeFormat";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceTrendCard from "@/components/admin-components/finance/FinanceTrendCard";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type { EarningsSummary, Paginated, ServiceChargeEntry } from "@/types/finance";

const PAGE_SIZE = 10;

const COLUMNS: FinanceColumn<ServiceChargeEntry>[] = [
  { header: "Date", cell: (r) => formatDate(r.date) },
  { header: "Transaction ID", cell: (r) => r.transaction_id },
  { header: "Order", cell: (r) => <span className="text-[#ff715b]">{r.order_id}</span> },
  { header: "Seller ID", cell: (r) => r.seller_id ?? "—" },
  { header: "Business name", cell: (r) => r.business_name ?? "—" },
  { header: "Order subtotal", cell: (r) => (r.order_subtotal ? formatNaira(r.order_subtotal) : "—") },
  { header: "Service fee", cell: (r) => <span className="text-[#00BE5C]">{formatNaira(r.amount)}</span> },
];

export default function AdminEarningsPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchEarnings, fetchEarningsEntries } = FinanceDetails();

  const [period, setPeriod] = useState("this_month");
  const [summary, setSummary] = useState<EarningsSummary | null>(null);

  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState<Paginated<ServiceChargeEntry> | null>(null);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (token) fetchEarnings({ period }, setSummary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, period]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchVal.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchVal]);

  useEffect(() => {
    if (!token) return;
    setListLoading(true);
    fetchEarningsEntries({ page, search, period }, setEntries, () => setListLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, period]);

  const netProfit = Number(summary?.net_profit ?? 0);

  const handleExport = () =>
    downloadCsv(
      `martaf-earnings-${period}.csv`,
      ["Date", "Transaction ID", "Order", "Seller ID", "Business name", "Order subtotal", "Service fee"],
      (entries?.results ?? []).map((r) => [
        formatDate(r.date), r.transaction_id, r.order_id, r.seller_id ?? "", r.business_name ?? "", r.order_subtotal ?? "", r.amount,
      ]),
    );

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Martaf earnings</h1>
      <p className="text-c12 text-000000/44 font-MontserratNormal mt-0.5 mb-8 max-w-3xl">
        What Martaf keeps, as opposed to money it moves for buyers and sellers. The service fee is recognised when an
        order&apos;s escrow is released to the seller; net profit is that fee less provider bills, taxes and refunds
        Martaf absorbs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusFrame
          title="Service fee earned"
          quantity={formatNaira(summary?.service_fee_earned, 0)}
          icon={<StatIcon tone="positive"><PiggyBank className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Pending in escrow"
          quantity={formatNaira(summary?.service_fee_pending, 0)}
          icon={<StatIcon tone="warning"><Hourglass className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Total costs"
          quantity={formatNaira(summary?.total_costs, 0)}
          icon={<StatIcon tone="negative"><Landmark className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Net profit"
          quantity={`${netProfit < 0 ? "-" : ""}${formatNaira(Math.abs(netProfit), 0)}`}
          icon={<StatIcon tone={netProfit < 0 ? "negative" : "positive"}><TrendingUp className="w-4 h-4" /></StatIcon>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <FinanceTrendCard
          key={period}
          title="Service fee earned"
          figure={
            summary
              ? { total: summary.service_fee_earned, change_percent: summary.service_fee_earned_change_percent, series: summary.series, sources: [] }
              : undefined
          }
          color="#3F6F5A"
          period={period}
          onPeriodChange={(label) => {
            setPeriod(periodFromLabel(label));
            setPage(1);
          }}
        />

        <div className="rounded-2xl border border-000000/8 p-6">
          <h2 className="text-c18 font-MontserratNormal mb-6">Costs</h2>
          <div className="space-y-4 text-sm font-MontserratNormal text-000000/68">
            {(summary?.costs ?? []).map((cost) => (
              <div key={cost.label} className="flex justify-between gap-4">
                <span>{cost.label}</span>
                <span>{formatNaira(cost.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-4 border-t border-000000/8 text-000000 font-MontserratMedium">
              <span>Total costs</span>
              <span>{formatNaira(summary?.total_costs)}</span>
            </div>
            <div className={`flex justify-between gap-4 text-c18 font-MontserratMedium ${netProfit < 0 ? "text-[#CA0202]" : "text-[#00BE5C]"}`}>
              <span>Net profit</span>
              <span>{netProfit < 0 ? "-" : ""}{formatNaira(Math.abs(netProfit))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-000000/8 p-6">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Service fees by order</h2>
        <AdminListHeader
          key={period}
          searchExpandable
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search by order, seller or transaction ID..."
          periodOptions={PERIOD_OPTIONS}
          selectedMonth={PERIOD_LABELS[period as keyof typeof PERIOD_LABELS] ?? PERIOD_LABELS.this_month}
          onMonthChange={(label) => {
            setPeriod(periodFromLabel(label));
            setPage(1);
          }}
          onExportClick={handleExport}
        />
        <FinanceTable
          rows={entries?.results ?? []}
          columns={COLUMNS}
          loading={listLoading}
          rowKey={(r) => r.id}
          emptyMessage="No service fees recognised in this period yet — they appear when an order's escrow is released."
        />
        {(entries?.count ?? 0) > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil((entries?.count ?? 0) / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
