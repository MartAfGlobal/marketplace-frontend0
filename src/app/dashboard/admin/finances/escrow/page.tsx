"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CheckCircle2, Hourglass, Play, ShieldCheck } from "lucide-react";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { formatDate, formatNaira } from "@/helpers/admin/financeFormat";
import { Button } from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type { EscrowOrder, EscrowRunResult, EscrowSummary, Paginated } from "@/types/finance";

const PAGE_SIZE = 10;
const FILTERS = ["Releasable", "Held"];

type EscrowList = Paginated<EscrowOrder> & { summary: EscrowSummary };
type Pending =
  | { kind: "all" }
  | { kind: "seller"; order: EscrowOrder }
  | { kind: "order"; order: EscrowOrder };

const COLUMNS: FinanceColumn<EscrowOrder>[] = [
  { header: "Order", cell: (r) => <span className="text-[#ff715b]">{r.order_id}</span> },
  { header: "Seller ID", cell: (r) => r.seller_id },
  { header: "Business name", cell: (r) => r.business_name },
  { header: "Order status", cell: (r) => r.status_label },
  { header: "Seller receives", cell: (r) => formatNaira(r.amount) },
  { header: "Service fee", cell: (r) => formatNaira(r.service_fee) },
  { header: "Release date", cell: (r) => formatDate(r.escrow_release_date) },
  {
    header: "Release",
    cell: (r) => (
      <span title={r.blockers.join(" · ")}>
        <FinanceStatusPill status={r.releasable ? "COMPLETED" : "PENDING"} label={r.releasable ? "Releasable" : "Held"} />
      </span>
    ),
  },
];

export default function AdminEscrowReleasePage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchEscrow, releaseAllEscrow, releaseSellerEscrow, releaseOrderEscrow, loading } = FinanceDetails();

  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<EscrowList | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const load = () => {
    // Exactly one of the two filters selected narrows the list; both/none shows everything.
    const releasable = filters.length === 1 ? String(filters[0] === "Releasable") : "";
    setListLoading(true);
    fetchEscrow({ page, search, releasable }, setData, () => setListLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchVal.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchVal]);

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, filters]);

  const summary = data?.summary;

  const onRun = (result: EscrowRunResult) => {
    setPending(null);
    if (result.failed) toast.error(`${result.failed} order(s) failed to release.`);
    toast.success(
      result.paid ? `${result.paid} order(s) released to sellers' wallets.` : "Nothing was due for release.",
    );
    load();
  };

  const requestOrderRelease = (order: EscrowOrder) => {
    if (!order.releasable) {
      toast.error(order.blockers.join(". ") || "This order can't be released yet.");
      return;
    }
    setPending({ kind: "order", order });
  };

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "all") releaseAllEscrow(onRun);
    else if (pending.kind === "seller") releaseSellerEscrow(pending.order.manufacturer_id, onRun);
    else releaseOrderEscrow(pending.order.id, onRun);
  };

  const confirmCopy = !pending
    ? { title: "", description: "" }
    : pending.kind === "all"
      ? {
          title: "Release all due escrow?",
          description: `${summary?.releasable_count ?? 0} order(s), ${formatNaira(summary?.releasable_amount)} will be credited to sellers' wallets. Sellers with automatic payout off or paused are skipped.`,
        }
      : pending.kind === "seller"
        ? {
            title: `Release ${pending.order.business_name}'s due escrow?`,
            description: "Every order of this seller that is due will be credited to their wallet now, even if their automatic payout is off.",
          }
        : {
            title: `Release order ${pending.order.order_id}?`,
            description: `${formatNaira(pending.order.amount)} will be credited to ${pending.order.business_name}'s wallet now.`,
          };

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Escrow release</h1>
          <p className="text-c12 text-000000/44 font-MontserratNormal mt-0.5 max-w-3xl">
            Sellers are credited automatically every hour once an order&apos;s escrow window has closed and any dispute
            or pending refund is settled. Use these actions to release sooner or for a single seller or order.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto h-10 px-5 text-xs flex items-center gap-2 shrink-0"
          disabled={!summary?.releasable_count}
          onClick={() => setPending({ kind: "all" })}
        >
          <Play className="w-3.5 h-3.5" /> Release all due
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusFrame
          title="Releasable now"
          quantity={(summary?.releasable_count ?? 0).toLocaleString()}
          icon={<StatIcon tone="positive"><CheckCircle2 className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Releasable amount"
          quantity={formatNaira(summary?.releasable_amount, 0)}
          icon={<StatIcon tone="positive"><ShieldCheck className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Orders in escrow"
          quantity={(summary?.in_escrow_count ?? 0).toLocaleString()}
          icon={<StatIcon tone="warning"><Hourglass className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Held in escrow"
          quantity={formatNaira(summary?.in_escrow_amount, 0)}
          icon={<StatIcon tone="neutral"><Hourglass className="w-4 h-4" /></StatIcon>}
        />
      </div>

      <div className="rounded-2xl border border-000000/8 p-6">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Orders in escrow</h2>
        <AdminListHeader
          searchExpandable
          hidePeriod
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search by order, seller ID or business name..."
          filterOptions={FILTERS}
          selectedFilters={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
        <FinanceTable
          rows={data?.results ?? []}
          columns={COLUMNS}
          loading={listLoading}
          rowKey={(r) => r.id}
          actions={[
            { label: "Release order now", onSelect: requestOrderRelease },
            { label: "Release seller's due orders", onSelect: (r) => setPending({ kind: "seller", order: r }) },
          ]}
          emptyMessage="No orders are in escrow."
        />
        {(data?.count ?? 0) > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil((data?.count ?? 0) / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>

      <ConfirmModal
        isOpen={!!pending}
        onClose={() => setPending(null)}
        title={confirmCopy.title}
        description={confirmCopy.description}
        onYes={confirm}
        onNo={() => setPending(null)}
        yesText="Release"
        noText="Cancel"
        loading={loading}
      />
    </div>
  );
}
