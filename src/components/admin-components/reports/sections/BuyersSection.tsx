"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, UserCheck, Repeat } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import ReportTrendCard from "@/components/admin-components/reports/ReportTrendCard";
import ReportStatusPill from "@/components/admin-components/reports/ReportStatusPill";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatNaira, formatDate, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface BuyerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  total_spent: string | number;
  last_order_date: string | null;
  status: string;
}

export default function BuyersSection() {
  const { fetchBuyerSummary, fetchBuyerTrend, fetchBuyers } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);
  const [trend, setTrend] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [buyers, setBuyers] = useState<{ count: number; results: BuyerRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchBuyerSummary({ period: "year" }, (d) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
    fetchBuyerTrend({ range: "monthly" }, (d: any) => setTrend(d?.trend ?? []));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    fetchBuyers(
      { search, page, page_size: PAGE_SIZE },
      (d: any) => { setBuyers({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const columns: FinanceColumn<BuyerRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + buyers.results.indexOf(r) + 1 },
    { header: "Buyer", cell: (r) => r.name },
    { header: "Email", cell: (r) => r.email },
    { header: "Orders", cell: (r) => r.orders },
    { header: "Total Spend", cell: (r) => formatNaira(r.total_spent) },
    { header: "Last Order", cell: (r) => formatDate(r.last_order_date) },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} /> },
  ];

  const exportHeaders = ["S/N", "Buyer", "Email", "Orders", "Total Spend", "Last Order", "Status"];
  const exportRows = () =>
    buyers.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      r.name, r.email, r.orders, String(r.total_spent ?? ""), formatDate(r.last_order_date), r.status,
    ]);

  const handleExportCsv = () => downloadCsv("buyers.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Buyers Report", "buyers.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !summary ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusFrame title="Total Buyers" quantity={summary.total_buyers.toLocaleString()} icon={<StatIcon tone="neutral"><Users className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="New Buyers (this year)" quantity={summary.new_buyers.toLocaleString()} icon={<StatIcon tone="positive"><UserPlus className="w-4 h-4" /></StatIcon>} />
            <StatusFrame
              title={`Active Buyers (${summary.active_buyer_window_days}d)`}
              quantity={summary.active_buyers.toLocaleString()}
              icon={<StatIcon tone="positive"><UserCheck className="w-4 h-4" /></StatIcon>}
            />
            <StatusFrame title="Returning Buyers" quantity={summary.returning_buyers.toLocaleString()} icon={<StatIcon tone="neutral"><Repeat className="w-4 h-4" /></StatIcon>} />
          </div>

          <ReportTrendCard
            title="Buyer registration & purchase trend"
            series={[
              { label: "New buyers", color: "#3F6F5A", points: trend.map((t) => ({ x: formatDate(t.period), value: t.new_buyers })) },
              { label: "Orders", color: "#947FFF", points: trend.map((t) => ({ x: formatDate(t.period), value: t.orders })) },
            ]}
            rangeOptions={["Monthly"]}
            selectedRange="Monthly"
            onRangeChange={() => {}}
            emptyMessage="No buyer activity recorded yet."
          />

          {summary.top_buyers?.length > 0 && (
            <div className="rounded-2xl border border-000000/8 p-6">
              <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">Top buyers by spend</h3>
              <FinanceTable
                rows={summary.top_buyers}
                columns={[
                  { header: "Buyer", cell: (r: any) => r.name ?? "—" },
                  { header: "Orders", cell: (r: any) => r.order_count },
                  { header: "Total Spend", cell: (r: any) => formatNaira(r.total_spent) },
                ]}
                loading={false}
                rowKey={(r: any) => r.id}
                emptyMessage="No buyers yet."
                compact
              />
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Buyers</h3>
        <AdminListHeader
          searchExpandable
          searchVal={search}
          setSearchVal={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search buyers..."
          hidePeriod
          onExportClick={handleExportCsv}
          onExportPdfClick={handleExportPdf}
        />
        <FinanceTable rows={buyers.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id} emptyMessage="No buyers found." />
        {buyers.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(buyers.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
