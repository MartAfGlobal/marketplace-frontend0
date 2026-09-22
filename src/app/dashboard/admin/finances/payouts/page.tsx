"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { downloadCsv, formatDate, formatNaira, PERIOD_OPTIONS, PERIOD_LABELS, periodFromLabel } from "@/helpers/admin/financeFormat";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import LedgerDetailDrawer from "@/components/admin-components/finance/LedgerDetailDrawer";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type { FinancePayout, Paginated } from "@/types/finance";

const PAGE_SIZE = 10;
const STATUS_FILTERS: Record<string, string> = {
  Completed: "COMPLETED",
  Pending: "PENDING,AWAITING_APPROVAL,UNDER_REVIEW,ON_HOLD,APPROVED",
  "In progress": "IN_PROGRESS",
  Failed: "FAILED,REJECTED,CANCELLED,REVERSED",
};

const COLUMNS: FinanceColumn<FinancePayout>[] = [
  { header: "Date", cell: (r) => formatDate(r.created_at) },
  { header: "Seller ID", cell: (r) => <span className="text-[#ff715b]">{r.seller_id}</span> },
  { header: "Business name", cell: (r) => r.business_name },
  { header: "Amount", cell: (r) => formatNaira(r.amount) },
  { header: "Status", cell: (r) => <FinanceStatusPill status={r.status_code} label={r.status} /> },
  { header: "Payout method", cell: (r) => r.payout_method },
  { header: "Balance", cell: (r) => (r.balance == null ? "—" : formatNaira(r.balance)) },
  { header: "Fees", cell: (r) => formatNaira(r.fees ?? 0, 0) },
];

export default function AdminPayoutManagementPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchPayouts } = FinanceDetails();

  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [period, setPeriod] = useState("this_month");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<FinancePayout> | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
    const status = filters.map((f) => STATUS_FILTERS[f]).join(",");
    fetchPayouts({ page, search, period, status }, setData, () => setListLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, period, filters]);

  const handleExport = () =>
    downloadCsv(
      `payouts-${period}.csv`,
      ["Date", "Seller ID", "Business name", "Amount", "Status", "Payout method", "Balance", "Fees"],
      (data?.results ?? []).map((r) => [formatDate(r.created_at), r.seller_id, r.business_name, r.amount, r.status, r.payout_method, r.balance ?? "", r.fees ?? 0]),
    );

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold mb-8">Payout management</h1>

      <div className="rounded-2xl border border-000000/8 p-6">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Payouts</h2>
        <AdminListHeader
          searchExpandable
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search by seller ID, business name or reference..."
          filterOptions={Object.keys(STATUS_FILTERS)}
          selectedFilters={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          periodOptions={PERIOD_OPTIONS}
          selectedMonth={PERIOD_LABELS.this_month}
          onMonthChange={(label) => {
            setPeriod(periodFromLabel(label));
            setPage(1);
          }}
          onExportClick={handleExport}
        />

        <FinanceTable
          rows={data?.results ?? []}
          columns={COLUMNS}
          loading={listLoading}
          rowKey={(r) => r.id}
          actions={[{ label: "More Details", onSelect: (r) => setSelectedId(r.id) }]}
          emptyMessage="No payouts found."
        />

        {(data?.count ?? 0) > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil((data?.count ?? 0) / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>

      <LedgerDetailDrawer payoutId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
