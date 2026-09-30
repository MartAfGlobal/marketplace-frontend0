"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, CheckCircle2, Clock3, AlertOctagon } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import ReportStatusPill from "@/components/admin-components/reports/ReportStatusPill";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatNaira, formatDate, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface RefundRow {
  id: string;
  refund_reference: string;
  seller_order_number?: string | null;
  buyer_name?: string;
  seller_name?: string;
  amount: string | number;
  refund_type_display?: string;
  status_display?: string;
  status: string;
  created_at: string;
}

interface DisputeRow {
  id: string;
  dispute_number: string;
  seller_order_number?: string | null;
  buyer_name?: string;
  seller_name?: string;
  dispute_type_display?: string;
  requested_refund_amount?: string | number;
  status_display?: string;
  status: string;
  created_at: string;
}

export default function RefundsDisputesSection() {
  const { getAbsolute, fetchRefundBreakdown } = ReportsDetails();

  const [refundStats, setRefundStats] = useState<any>(null);
  const [disputeStats, setDisputeStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [breakdownView, setBreakdownView] = useState<"by_seller" | "by_product">("by_seller");
  const [breakdown, setBreakdown] = useState<any[]>([]);

  const [refundSearch, setRefundSearch] = useState("");
  const [refundPage, setRefundPage] = useState(1);
  const [refunds, setRefunds] = useState<{ count: number; results: RefundRow[] }>({ count: 0, results: [] });
  const [refundsLoading, setRefundsLoading] = useState(true);

  const [disputeSearch, setDisputeSearch] = useState("");
  const [disputePage, setDisputePage] = useState(1);
  const [disputes, setDisputes] = useState<{ count: number; results: DisputeRow[] }>({ count: 0, results: [] });
  const [disputesLoading, setDisputesLoading] = useState(true);

  const load = () => {
    setStatsLoading(true);
    setStatsError(false);
    getAbsolute("/refunds/admin/stats/", undefined, (d: any) => { setRefundStats(d); setStatsLoading(false); }, () => { setStatsError(true); setStatsLoading(false); });
    getAbsolute("/disputes/admin/stats/", undefined, (d: any) => setDisputeStats(d));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchRefundBreakdown({ view: breakdownView }, (d: any) => setBreakdown(d?.results ?? []));
  }, [breakdownView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRefundsLoading(true);
    getAbsolute(
      "/refunds/admin/",
      { search: refundSearch, page: refundPage, page_size: PAGE_SIZE },
      (d: any) => { setRefunds({ count: d?.count ?? 0, results: d?.results ?? [] }); setRefundsLoading(false); },
      () => setRefundsLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundSearch, refundPage]);

  useEffect(() => {
    setDisputesLoading(true);
    getAbsolute(
      "/disputes/admin/",
      { search: disputeSearch, page: disputePage, page_size: PAGE_SIZE },
      (d: any) => { setDisputes({ count: d?.count ?? 0, results: d?.results ?? [] }); setDisputesLoading(false); },
      () => setDisputesLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeSearch, disputePage]);

  const refundColumns: FinanceColumn<RefundRow>[] = [
    { header: "S/N", cell: (r) => (refundPage - 1) * PAGE_SIZE + refunds.results.indexOf(r) + 1 },
    { header: "Case ID", cell: (r) => r.refund_reference ?? r.id },
    { header: "Order", cell: (r) => r.seller_order_number ?? "—" },
    { header: "Buyer", cell: (r) => r.buyer_name ?? "—" },
    { header: "Seller", cell: (r) => r.seller_name ?? "—" },
    { header: "Amount", cell: (r) => formatNaira(r.amount) },
    { header: "Reason", cell: (r) => r.refund_type_display ?? "—" },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} label={r.status_display} /> },
    { header: "Date", cell: (r) => formatDate(r.created_at) },
  ];

  const refundExportHeaders = ["S/N", "Case ID", "Order", "Buyer", "Seller", "Amount", "Reason", "Status", "Date"];
  const refundExportRows = () =>
    refunds.results.map((r, i) => [
      (refundPage - 1) * PAGE_SIZE + i + 1,
      r.refund_reference ?? r.id, r.seller_order_number ?? "", r.buyer_name ?? "", r.seller_name ?? "",
      String(r.amount ?? ""), r.refund_type_display ?? "", r.status_display ?? r.status, formatDate(r.created_at),
    ]);
  const handleExportRefundsCsv = () => downloadCsv("refunds.csv", refundExportHeaders, refundExportRows());
  const handleExportRefundsPdf = () => downloadPdf("Refunds Report", "refunds.pdf", refundExportHeaders, refundExportRows());

  const disputeColumns: FinanceColumn<DisputeRow>[] = [
    { header: "S/N", cell: (r) => (disputePage - 1) * PAGE_SIZE + disputes.results.indexOf(r) + 1 },
    { header: "Case ID", cell: (r) => r.dispute_number ?? r.id },
    { header: "Order", cell: (r) => r.seller_order_number ?? "—" },
    { header: "Buyer", cell: (r) => r.buyer_name ?? "—" },
    { header: "Seller", cell: (r) => r.seller_name ?? "—" },
    { header: "Type", cell: (r) => r.dispute_type_display ?? "—" },
    { header: "Requested Amount", cell: (r) => formatNaira(r.requested_refund_amount) },
    { header: "Status", cell: (r) => <ReportStatusPill status={r.status} label={r.status_display} /> },
    { header: "Date", cell: (r) => formatDate(r.created_at) },
  ];

  const disputeExportHeaders = ["S/N", "Case ID", "Order", "Buyer", "Seller", "Type", "Requested Amount", "Status", "Date"];
  const disputeExportRows = () =>
    disputes.results.map((r, i) => [
      (disputePage - 1) * PAGE_SIZE + i + 1,
      r.dispute_number ?? r.id, r.seller_order_number ?? "", r.buyer_name ?? "", r.seller_name ?? "", r.dispute_type_display ?? "",
      String(r.requested_refund_amount ?? ""), r.status_display ?? r.status, formatDate(r.created_at),
    ]);
  const handleExportDisputesCsv = () => downloadCsv("disputes.csv", disputeExportHeaders, disputeExportRows());
  const handleExportDisputesPdf = () => downloadPdf("Disputes Report", "disputes.pdf", disputeExportHeaders, disputeExportRows());

  return (
    <div className="space-y-6">
      {statsLoading ? (
        <ReportLoadingSkeleton />
      ) : statsError || !refundStats ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusFrame title="Total Refund Requests" quantity={refundStats.total_refunds ?? 0} icon={<StatIcon tone="neutral"><RefreshCcw className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Total Refunded Amount" quantity={formatNaira(refundStats.total_refunded_amount)} icon={<StatIcon tone="positive"><CheckCircle2 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Open Disputes" quantity={(disputeStats?.pending ?? 0) + (disputeStats?.approved ?? 0)} icon={<StatIcon tone="warning"><Clock3 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Resolved Disputes" quantity={disputeStats?.resolved ?? 0} icon={<StatIcon tone="negative"><AlertOctagon className="w-4 h-4" /></StatIcon>} />
          </div>

          <div className="rounded-2xl border border-000000/8 p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-base font-MontserratNormal text-000000/68">Refund breakdown</h3>
              <div className="flex gap-2">
                {(["by_seller", "by_product"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setBreakdownView(v)}
                    className={`text-c12 font-MontserratSemiBold px-3 py-2 rounded-c8 transition-colors cursor-pointer ${
                      breakdownView === v ? "bg-[#947FFF] text-white" : "bg-gray-100 text-000000/68"
                    }`}
                  >
                    {v === "by_seller" ? "By seller" : "By product"}
                  </button>
                ))}
              </div>
            </div>
            <FinanceTable
              rows={breakdown}
              columns={[
                { header: breakdownView === "by_seller" ? "Seller" : "Product", cell: (r: any) => r.seller ?? r.product ?? "—" },
                { header: "Count", cell: (r: any) => r.count },
                { header: "Total Amount", cell: (r: any) => formatNaira(r.total_amount) },
              ]}
              loading={false}
              rowKey={(r: any) => r.seller_id ?? r.product_id}
              emptyMessage="No refund data yet."
              compact
            />
          </div>
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Refunds</h3>
        <AdminListHeader
          searchExpandable
          searchVal={refundSearch}
          setSearchVal={(v) => { setRefundSearch(v); setRefundPage(1); }}
          placeholder="Search refunds..."
          hidePeriod
          onExportClick={handleExportRefundsCsv}
          onExportPdfClick={handleExportRefundsPdf}
        />
        <FinanceTable rows={refunds.results} columns={refundColumns} loading={refundsLoading} rowKey={(r) => r.id} emptyMessage="No refunds found." />
        {refunds.count > PAGE_SIZE && <Pagination currentPage={refundPage} totalPages={Math.ceil(refunds.count / PAGE_SIZE)} onPageChange={setRefundPage} />}
      </div>

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Disputes</h3>
        <AdminListHeader
          searchExpandable
          searchVal={disputeSearch}
          setSearchVal={(v) => { setDisputeSearch(v); setDisputePage(1); }}
          placeholder="Search disputes..."
          hidePeriod
          onExportClick={handleExportDisputesCsv}
          onExportPdfClick={handleExportDisputesPdf}
        />
        <FinanceTable rows={disputes.results} columns={disputeColumns} loading={disputesLoading} rowKey={(r) => r.id} emptyMessage="No disputes found." />
        {disputes.count > PAGE_SIZE && <Pagination currentPage={disputePage} totalPages={Math.ceil(disputes.count / PAGE_SIZE)} onPageChange={setDisputePage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
