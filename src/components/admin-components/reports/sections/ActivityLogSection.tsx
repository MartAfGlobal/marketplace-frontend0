"use client";

import { useEffect, useState } from "react";
import { LogIn, XCircle, Users } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import ReportTrendCard from "@/components/admin-components/reports/ReportTrendCard";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatDateTime, formatDate, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface LogRow {
  id: string;
  admin: string;
  action: string;
  module: string;
  timestamp: string;
  ip_address: string | null;
  user_agent: string;
  result: "success" | "failure";
}

export default function ActivityLogSection() {
  const { fetchActivitySummary, fetchActivityTrend, fetchActivityList } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);
  const [trend, setTrend] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [result, setResult] = useState<"" | "success" | "failure">("");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<{ count: number; results: LogRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchActivitySummary({ period: "month" }, (d) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
    fetchActivityTrend({ range: "monthly" }, (d: any) => setTrend(d?.trend ?? []));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    fetchActivityList(
      { search, result, page, page_size: PAGE_SIZE },
      (d: any) => { setLogs({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, result, page]);

  const columns: FinanceColumn<LogRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + logs.results.indexOf(r) + 1 },
    { header: "Admin", cell: (r) => r.admin },
    { header: "Action", cell: (r) => r.action },
    { header: "Module/Page", cell: (r) => r.module },
    { header: "Timestamp", cell: (r) => formatDateTime(r.timestamp) },
    { header: "IP / Device", cell: (r) => r.ip_address ?? "—" },
    {
      header: "Result",
      cell: (r) => (
        <span className={r.result === "success" ? "text-[#00BE5C]" : "text-[#CA0202]"}>
          {r.result === "success" ? "Success" : "Failure"}
        </span>
      ),
    },
  ];

  const exportHeaders = ["S/N", "Admin", "Action", "Module/Page", "Timestamp", "IP", "Result"];
  const exportRows = () =>
    logs.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      r.admin, r.action, r.module, formatDateTime(r.timestamp), r.ip_address ?? "", r.result,
    ]);
  const handleExportCsv = () => downloadCsv("activity-log.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Activity Log Report", "activity-log.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !summary ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusFrame title="Total Logins (this month)" quantity={summary.total_logins} icon={<StatIcon tone="positive"><LogIn className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Failed Login Attempts" quantity={summary.failed_login_attempts} icon={<StatIcon tone="negative"><XCircle className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Unique Admins Active" quantity={summary.unique_admins_active} icon={<StatIcon tone="neutral"><Users className="w-4 h-4" /></StatIcon>} />
          </div>

          <ReportTrendCard
            title="Login activity"
            series={[
              { label: "Successful", color: "#00BE5C", points: trend.map((t) => ({ x: formatDate(t.period), value: t.successful_logins })) },
              { label: "Failed", color: "#CA0202", points: trend.map((t) => ({ x: formatDate(t.period), value: t.failed_logins })) },
            ]}
            rangeOptions={["Monthly"]}
            selectedRange="Monthly"
            onRangeChange={() => {}}
            emptyMessage="No login activity recorded yet."
          />
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Activity log</h3>
        <AdminListHeader
          searchExpandable
          searchVal={search}
          setSearchVal={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by admin or action..."
          filterOptions={["success", "failure"]}
          selectedFilters={result ? [result] : []}
          onFilterChange={(f) => { setResult((f[0] as any) ?? ""); setPage(1); }}
          hidePeriod
          onExportClick={handleExportCsv}
          onExportPdfClick={handleExportPdf}
        />
        <FinanceTable rows={logs.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id} emptyMessage="No activity recorded." />
        {logs.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(logs.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
