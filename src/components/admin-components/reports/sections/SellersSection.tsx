"use client";

import { useEffect, useState } from "react";
import { Store, CheckCircle2, Clock3, Ban } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatNaira, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface SellerRow {
  id: number;
  company_name: string;
  gmv: string | number;
  orders_count: number;
  products_listed: number;
  products_sold: number;
  average_rating: number | null;
  cancellation_rate: number;
  fulfillment_rate: number;
  underperforming: boolean;
  underperforming_reason: string | null;
}

export default function SellersSection() {
  const { fetchSellerSummary, fetchSellerPerformance } = ReportsDetails();

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [search, setSearch] = useState("");
  const [flag, setFlag] = useState<"" | "underperforming">("");
  const [ordering, setOrdering] = useState("-gmv");
  const [page, setPage] = useState(1);
  const [sellers, setSellers] = useState<{ count: number; results: SellerRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const loadStats = () => {
    setStatsLoading(true);
    setStatsError(false);
    fetchSellerSummary((d: any) => { setStats(d); setStatsLoading(false); }, () => { setStatsError(true); setStatsLoading(false); });
  };

  useEffect(loadStats, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    fetchSellerPerformance(
      { search, flag, ordering, page, page_size: PAGE_SIZE },
      (d: any) => { setSellers({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, flag, ordering, page]);

  const columns: FinanceColumn<SellerRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + sellers.results.indexOf(r) + 1 },
    {
      header: "Seller",
      cell: (r) => (
        <span className="flex items-center gap-2">
          {r.company_name}
          {r.underperforming && (
            <span title={r.underperforming_reason ?? undefined} className="text-[10px] px-2 py-0.5 rounded-full bg-[#CA0202]/10 text-[#CA0202] font-MontserratSemiBold">
              Underperforming
            </span>
          )}
        </span>
      ),
    },
    { header: "GMV", cell: (r) => formatNaira(r.gmv) },
    { header: "Orders", cell: (r) => r.orders_count },
    { header: "Products Listed", cell: (r) => r.products_listed },
    { header: "Products Sold", cell: (r) => r.products_sold },
    { header: "Avg Rating", cell: (r) => (r.average_rating != null ? r.average_rating.toFixed(1) : "No reviews yet") },
    { header: "Cancellation %", cell: (r) => `${r.cancellation_rate}%` },
    { header: "Fulfillment %", cell: (r) => `${r.fulfillment_rate}%` },
  ];

  const exportHeaders = ["S/N", "Seller", "GMV", "Orders", "Products Listed", "Products Sold", "Avg Rating", "Cancellation %", "Fulfillment %"];
  const exportRows = () =>
    sellers.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      r.company_name, String(r.gmv), r.orders_count, r.products_listed, r.products_sold,
      r.average_rating != null ? r.average_rating.toFixed(1) : "No reviews yet", r.cancellation_rate, r.fulfillment_rate,
    ]);

  const handleExportCsv = () => downloadCsv("sellers.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Sellers Report", "sellers.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {statsLoading ? (
        <ReportLoadingSkeleton />
      ) : statsError || !stats ? (
        <ReportErrorState onRetry={loadStats} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusFrame title="Total Sellers" quantity={stats.total.toLocaleString()} icon={<StatIcon tone="neutral"><Store className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Approved" quantity={stats.approved.toLocaleString()} icon={<StatIcon tone="positive"><CheckCircle2 className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Pending" quantity={stats.pending.toLocaleString()} icon={<StatIcon tone="warning"><Clock3 className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Suspended" quantity={stats.suspended.toLocaleString()} icon={<StatIcon tone="negative"><Ban className="w-4 h-4" /></StatIcon>} />
        </div>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-base font-MontserratNormal text-000000/68">Seller performance</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setFlag(flag === "underperforming" ? "" : "underperforming"); setPage(1); }}
              className={`text-c12 font-MontserratSemiBold px-3 py-2 rounded-c8 transition-colors cursor-pointer ${
                flag === "underperforming" ? "bg-[#CA0202]/10 text-[#CA0202]" : "bg-gray-100 text-000000/68"
              }`}
            >
              Underperforming only
            </button>
            <select
              value={ordering}
              onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
              className="text-c12 font-MontserratNormal border border-000000/8 rounded-c8 px-3 py-2 bg-white cursor-pointer"
            >
              <option value="-gmv">Top by GMV</option>
              <option value="-products_sold">Top by products sold</option>
              <option value="-cancellation_rate">Highest cancellation rate</option>
              <option value="-fulfillment_rate">Highest fulfillment rate</option>
            </select>
          </div>
        </div>
        <AdminListHeader searchExpandable searchVal={search} setSearchVal={(v) => { setSearch(v); setPage(1); }} placeholder="Search sellers..." hidePeriod onExportClick={handleExportCsv} onExportPdfClick={handleExportPdf} />
        <FinanceTable rows={sellers.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id} emptyMessage="No sellers found." />
        {sellers.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(sellers.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
