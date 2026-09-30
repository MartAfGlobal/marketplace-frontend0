"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Clock3, Truck } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatNaira, formatDate, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;

interface TxRow {
  id: string;
  date: string;
  transaction_id: string;
  entity_ref: string;
  amount: string | number;
  type: "CREDIT" | "DEBIT";
  status: string;
  status_label: string;
  fees: string | number;
}

export default function PaymentsRevenueSection() {
  const { getAbsolute, fetchPaymentsOverview, fetchPaymentMethodBreakdown } = ReportsDetails();

  const [overview, setOverview] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(false);
  const [methodBreakdown, setMethodBreakdown] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [txns, setTxns] = useState<{ count: number; results: TxRow[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setOverviewLoading(true);
    setOverviewError(false);
    fetchPaymentsOverview({ period: "month" }, (d: any) => { setOverview(d); setOverviewLoading(false); }, () => { setOverviewError(true); setOverviewLoading(false); });
    fetchPaymentMethodBreakdown({}, (d: any) => setMethodBreakdown(d?.breakdown ?? []));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    getAbsolute(
      "/commission/admin/finance/transactions/",
      { search, page, page_size: PAGE_SIZE },
      (d: any) => { setTxns({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const columns: FinanceColumn<TxRow>[] = [
    { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + txns.results.indexOf(r) + 1 },
    { header: "Date", cell: (r) => formatDate(r.date) },
    { header: "Transaction ID", cell: (r) => r.transaction_id },
    { header: "Entity", cell: (r) => <span className="text-[#ff715b]">{r.entity_ref}</span> },
    { header: "Amount", cell: (r) => formatNaira(r.amount) },
    { header: "Type", cell: (r) => (r.type === "CREDIT" ? "Credit" : "Debit") },
    { header: "Status", cell: (r) => <FinanceStatusPill status={r.status} label={r.status_label} /> },
  ];

  const exportHeaders = ["S/N", "Date", "Transaction ID", "Entity", "Amount", "Type", "Status"];
  const exportRows = () =>
    txns.results.map((r, i) => [
      (page - 1) * PAGE_SIZE + i + 1,
      formatDate(r.date), r.transaction_id, r.entity_ref, String(r.amount), r.type, r.status_label,
    ]);
  const handleExportCsv = () => downloadCsv("payments.csv", exportHeaders, exportRows());
  const handleExportPdf = () => downloadPdf("Payments & Revenue Report", "payments.pdf", exportHeaders, exportRows());

  return (
    <div className="space-y-6">
      {overviewLoading ? (
        <ReportLoadingSkeleton />
      ) : overviewError || !overview ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusFrame title="GMV (this month)" quantity={formatNaira(overview.total_gmv, 0)} icon={<StatIcon tone="neutral"><Wallet className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Platform Revenue" quantity={formatNaira(overview.net_revenue, 0)} icon={<StatIcon tone="positive"><TrendingUp className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Pending Seller Payouts" quantity={formatNaira(overview.pending_seller_payouts, 0)} icon={<StatIcon tone="warning"><Clock3 className="w-4 h-4" /></StatIcon>} />
            <StatusFrame title="Logistics Cost" quantity={formatNaira(overview.logistics_cost, 0)} icon={<StatIcon tone="neutral"><Truck className="w-4 h-4" /></StatIcon>} />
          </div>
          <p className="text-[10px] text-000000/44 font-MontserratNormal -mt-2">
            &quot;Taxes Collected&quot; is intentionally left out here -- checkout doesn&apos;t populate that field yet, so it would always read ₦0 and mislead rather than inform.
          </p>

          {methodBreakdown.length > 0 && (
            <div className="rounded-2xl border border-000000/8 p-6">
              <h3 className="text-base font-MontserratNormal text-000000/68 mb-4">By payment method</h3>
              <div className="flex flex-wrap gap-4">
                {methodBreakdown.map((m) => (
                  <div key={m.payment_method} className="flex-1 min-w-[160px] rounded-c8 bg-gray-50 p-4">
                    <p className="text-c12 text-000000/68 font-MontserratNormal">{m.payment_method}</p>
                    <p className="text-c18 font-MontserratSemiBold mt-1">{formatNaira(m.total_amount, 0)}</p>
                    <p className="text-[10px] text-000000/44 mt-1">{m.count} transactions</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <h3 className="text-base font-MontserratNormal text-000000/68 mb-6">Transactions</h3>
        <AdminListHeader searchExpandable searchVal={search} setSearchVal={(v) => { setSearch(v); setPage(1); }} placeholder="Search by transaction ID or entity..." hidePeriod onExportClick={handleExportCsv} onExportPdfClick={handleExportPdf} />
        <FinanceTable rows={txns.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id} emptyMessage="No transactions found." />
        {txns.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(txns.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
