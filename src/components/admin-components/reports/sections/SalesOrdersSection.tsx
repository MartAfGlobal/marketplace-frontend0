"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, PackageCheck, Clock3, XCircle } from "lucide-react";
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

const PAYOUT_LABELS: Record<string, string> = {
  PENDING: "Pending",
  ESCROWED: "Escrowed",
  RELEASED: "Released",
};

interface OrderRow {
  id: string;
  order_id?: string;
  status: string;
  total_amount?: string | number;
  created_at?: string;
  payout_status?: string;
  has_dispute?: boolean;
  items?: { id: string }[];
  buyer?: { first_name?: string; last_name?: string; email?: string } | null;
  seller_name?: string;
}

const buyerName = (r: OrderRow) => {
  const name = `${r.buyer?.first_name ?? ""} ${r.buyer?.last_name ?? ""}`.trim();
  return name || r.buyer?.email || "—";
};

export default function SalesOrdersSection() {
  const { getAbsolute, fetchSalesSummary, fetchSalesTrend } = ReportsDetails();

  const [period, setPeriod] = useState<"today" | "week" | "month" | "year" | "total">("month");
  const [summary, setSummary] = useState<any>(null);
  const [summaryError, setSummaryError] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [trendRange, setTrendRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [trend, setTrend] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<{ count: number; results: OrderRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const loadSummary = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchSalesSummary({ range: period }, (d: any) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
  };

  useEffect(loadSummary, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSalesTrend({ range: trendRange }, (d: any) => setTrend(d?.trend ?? []));
  }, [trendRange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    getAbsolute(
      "/orders/admin/orderslist/",
      { search, status, page, page_size: PAGE_SIZE },
      (d: any) => { setOrders({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  const columns: FinanceColumn<OrderRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + orders.results.indexOf(r) + 1 },
    { header: "Order ID", cell: (r) => r.order_id ?? r.id },
    { header: "Buyer", cell: (r) => buyerName(r) },
    { header: "Seller", cell: (r) => r.seller_name ?? "—" },
    { header: "Items", cell: (r) => r.items?.length ?? "—" },
    { header: "Amount", cell: (r) => formatNaira(r.total_amount) },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} /> },
    {
      header: "Payout Status",
      cell: (r) => (r.payout_status ? <ReportStatusPill status={r.payout_status} label={PAYOUT_LABELS[r.payout_status] ?? r.payout_status} /> : "—"),
    },
    {
      header: "Dispute",
      cell: (r) => (r.has_dispute ? <span className="text-[#CA0202] font-MontserratSemiBold">Yes</span> : "—"),
    },
    { header: "Date", cell: (r) => formatDate(r.created_at) },
  ];

  const exportHeaders = ["S/N", "Order ID", "Buyer", "Seller", "Items", "Amount", "Status", "Payout Status", "Dispute", "Date"];
  const exportRows = () =>
    orders.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      r.order_id ?? r.id,
      buyerName(r),
      r.seller_name ?? "",
      String(r.items?.length ?? ""),
      String(r.total_amount ?? ""),
      r.status,
      r.payout_status ? PAYOUT_LABELS[r.payout_status] ?? r.payout_status : "",
      r.has_dispute ? "Yes" : "No",
      formatDate(r.created_at),
    ]);

  const handleExportCsv = () => downloadCsv(`sales-orders-${period}.csv`, exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Sales & Orders Report", `sales-orders-${period}.pdf`, exportHeaders, exportRows());

  const s = summary?.summary;

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !s ? (
        <ReportErrorState onRetry={loadSummary} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusFrame title="Total Orders" quantity={s.total_orders.count.toLocaleString()} icon={<StatIcon tone="neutral"><ShoppingBag className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Total Sales/GMV" quantity={formatNaira(s.total_orders.amount, 0)} icon={<StatIcon tone="positive"><PackageCheck className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Pending" quantity={s.pending.count.toLocaleString()} icon={<StatIcon tone="warning"><Clock3 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Cancelled" quantity={s.cancelled.count.toLocaleString()} icon={<StatIcon tone="negative"><XCircle className="w-4 h-4" /></StatIcon>} />
          </div>

          <ReportTrendCard
            title="Revenue over time"
            series={[{ label: "Revenue", color: "#3F6F5A", points: trend.map((t) => ({ x: formatDate(t.period), value: Number(t.revenue) })) }]}
            rangeOptions={["This week", "This month", "This year"]}
            selectedRange={trendRange === "weekly" ? "This week" : trendRange === "yearly" ? "This year" : "This month"}
            onRangeChange={(label) => setTrendRange(label === "This week" ? "weekly" : label === "This year" ? "yearly" : "monthly")}
            emptyMessage="No revenue recorded yet."
            valueFormatter={(v) => formatNaira(v, 0)}
          />
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Orders</h3>
        <AdminListHeader
          searchExpandable
          searchVal={search}
          setSearchVal={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by order ID, buyer, or seller..."
          filterOptions={["PENDING", "ACCEPTED", "DELIVERED", "COMPLETED", "CANCELLED"]}
          selectedFilters={status ? [status] : []}
          onFilterChange={(f) => { setStatus(f[0] ?? ""); setPage(1); }}
          periodOptions={["This week", "This month", "This year"]}
          selectedMonth="This month"
          onMonthChange={(label) => setPeriod(label === "This week" ? "week" : label === "This year" ? "year" : "month")}
          onExportClick={handleExportCsv}
          onExportPdfClick={handleExportPdf}
        />
        <FinanceTable
          rows={orders.results}
          columns={columns}
          loading={tableLoading}
          rowKey={(r) => r.id}
          emptyMessage="No orders found."
        />
        {orders.count > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil(orders.count / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
