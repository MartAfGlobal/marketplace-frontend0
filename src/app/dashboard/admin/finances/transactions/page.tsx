"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowDown, ArrowLeftRight, ArrowUp, RefreshCw } from "lucide-react";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import {
  downloadCsv,
  formatDate,
  formatNaira,
  PERIOD_OPTIONS,
  PERIOD_LABELS,
  periodFromLabel,
} from "@/helpers/admin/financeFormat";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import LedgerDetailDrawer from "@/components/admin-components/finance/LedgerDetailDrawer";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type { FinanceMoneyFlow, FinanceTransaction, Paginated } from "@/types/finance";

const PAGE_SIZE = 10;
const FILTERS = ["Credit", "Debit", "Completed", "Pending", "Failed"];
const TYPE_FILTERS = ["Credit", "Debit"];

// "Credit"/"Debit" → ?type=, the rest → ?status=; multi-select, comma-joined.
const filtersToParams = (filters: string[]) => ({
  type: filters.filter((f) => TYPE_FILTERS.includes(f)).join(",").toLowerCase(),
  status: filters.filter((f) => !TYPE_FILTERS.includes(f)).join(",").toLowerCase(),
});

const COLUMNS: FinanceColumn<FinanceTransaction>[] = [
  { header: "Date", cell: (r) => formatDate(r.date) },
  { header: "Transaction ID", cell: (r) => r.transaction_id },
  { header: "Entity", cell: (r) => <span className="text-[#ff715b]">{r.entity_ref}</span> },
  { header: "Amount", cell: (r) => formatNaira(r.amount) },
  {
    header: "Type",
    cell: (r) => (
      <span className={r.type === "CREDIT" ? "text-[#00BE5C]" : "text-[#CA0202]"}>
        {r.type === "CREDIT" ? "Credit" : "Debit"}
      </span>
    ),
  },
  { header: "Status", cell: (r) => <FinanceStatusPill status={r.status} label={r.status_label} /> },
  { header: "Fees", cell: (r) => formatNaira(r.fees, 0) },
];

export default function AdminTransactionsPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchTransactions, fetchMoneyFlow } = FinanceDetails();

  const [flowPeriod, setFlowPeriod] = useState("this_month");
  const [flow, setFlow] = useState<FinanceMoneyFlow | null>(null);

  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [period, setPeriod] = useState("this_month");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<FinanceTransaction> | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchMoneyFlow({ period: flowPeriod }, setFlow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, flowPeriod]);

  // Debounce search so each keystroke isn't a request.
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
    fetchTransactions({ page, search, period, ...filtersToParams(filters) }, setData, () => setListLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, period, filters]);

  const handleExport = () =>
    downloadCsv(
      `transactions-${period}.csv`,
      ["Date", "Transaction ID", "Entity", "Amount", "Type", "Status", "Fees"],
      (data?.results ?? []).map((r) => [formatDate(r.date), r.transaction_id, r.entity_ref, r.amount, r.type, r.status_label, r.fees]),
    );

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold mb-8">Transaction management</h1>

      {/* Money flow */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-MontserratNormal text-000000/68">Money flow</h2>
        <FilterDropdown
          options={PERIOD_OPTIONS}
          defaultValue={PERIOD_LABELS.this_month}
          onChange={(label) => setFlowPeriod(periodFromLabel(label))}
          className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusFrame
          title="Number of transactions"
          quantity={(flow?.number_of_transactions ?? 0).toLocaleString()}
          icon={<StatIcon tone="neutral"><ArrowLeftRight className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Debits"
          quantity={formatNaira(flow?.debits, 0)}
          icon={<StatIcon tone="negative"><ArrowUp className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Credits"
          quantity={formatNaira(flow?.credits, 0)}
          icon={<StatIcon tone="positive"><ArrowDown className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Pending"
          quantity={formatNaira(flow?.pending, 0)}
          icon={<StatIcon tone="warning"><RefreshCw className="w-4 h-4" /></StatIcon>}
        />
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-000000/8 p-6">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Transactions</h2>
        <AdminListHeader
          searchExpandable
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search by transaction ID or entity..."
          filterOptions={FILTERS}
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
          actions={[{ label: "More Details", onSelect: (r) => setSelectedId(r.transaction_id) }]}
          emptyMessage="No transactions found."
        />

        {(data?.count ?? 0) > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil((data?.count ?? 0) / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>

      <LedgerDetailDrawer transactionId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
