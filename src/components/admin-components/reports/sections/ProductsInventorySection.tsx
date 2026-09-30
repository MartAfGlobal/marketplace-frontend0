"use client";

import { useEffect, useState } from "react";
import { Package, PackageCheck, Clock3, XCircle, PackageX, AlertTriangle } from "lucide-react";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { ReportLoadingSkeleton, ReportErrorState, DataAsOf } from "@/components/admin-components/reports/ReportStates";
import { ReportsDetails } from "@/helpers/admin/reportsHelper";
import { formatNaira, downloadCsv, downloadPdf } from "@/helpers/admin/reportsFormat";

const PAGE_SIZE = 100;
const VIEWS = [
  { key: "top_selling", label: "Top selling" },
  { key: "top_revenue", label: "Highest revenue" },
  { key: "no_sales", label: "No sales" },
  { key: "by_category", label: "Best categories" },
  { key: "by_variant", label: "Variants" },
];

export default function ProductsInventorySection() {
  const { fetchProductInventorySummary, fetchProductPerformance } = ReportsDetails();

  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  const [view, setView] = useState("top_selling");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<{ count: number; results: any[] }>({ count: 0, results: [] });
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setSummaryLoading(true);
    setSummaryError(false);
    fetchProductInventorySummary((d) => { setSummary(d); setSummaryLoading(false); }, () => { setSummaryError(true); setSummaryLoading(false); });
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableLoading(true);
    fetchProductPerformance(
      { view, search, page, page_size: PAGE_SIZE },
      (d: any) => { setRows({ count: d?.count ?? 0, results: d?.results ?? [] }); setTableLoading(false); },
      () => setTableLoading(false),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, search, page]);

  const isByCategory = view === "by_category";
  const isByVariant = view === "by_variant";
  const snColumn: FinanceColumn<any> = { header: "S/N", cell: (r) => (page - 1) * PAGE_SIZE + rows.results.indexOf(r) + 1 };
  const columns: FinanceColumn<any>[] = isByCategory
    ? [
        snColumn,
        { header: "Category", cell: (r) => r.category ?? "—" },
        { header: "Quantity Sold", cell: (r) => r.quantity_sold },
        { header: "Revenue", cell: (r) => formatNaira(r.revenue) },
      ]
    : isByVariant
    ? [
        snColumn,
        { header: "Product", cell: (r) => r.product_name },
        { header: "Variant", cell: (r) => r.variant_name },
        { header: "SKU", cell: (r) => r.sku },
        { header: "Seller", cell: (r) => r.manufacturer_name ?? "—" },
        { header: "Stock", cell: (r) => r.stock },
        {
          header: "Stock Health",
          cell: (r) => (r.is_low_stock ? <span className="text-[#CA0202] font-MontserratSemiBold">Low stock</span> : "OK"),
        },
        { header: "Price", cell: (r) => formatNaira(r.base_price) },
        { header: "Quantity Sold", cell: (r) => r.quantity_sold },
        { header: "Revenue", cell: (r) => formatNaira(r.revenue) },
      ]
    : [
        snColumn,
        { header: "Product", cell: (r) => r.name },
        { header: "SKU", cell: (r) => r.sku },
        { header: "Category", cell: (r) => r.category ?? "—" },
        { header: "Seller", cell: (r) => r.manufacturer_name ?? "—" },
        { header: "Quantity Sold", cell: (r) => r.quantity_sold },
        { header: "Revenue", cell: (r) => formatNaira(r.revenue) },
        { header: "In Stock", cell: (r) => r.inventory },
      ];

  const exportRows = () => rows.results.map((r) => columns.map((c) => String((c.cell(r) as any) ?? "")));
  const handleExportCsv = () => downloadCsv(`products-${view}.csv`, columns.map((c) => c.header), exportRows());
  const handleExportPdf = () => downloadPdf("Products & Inventory Report", `products-${view}.pdf`, columns.map((c) => c.header), exportRows());

  return (
    <div className="space-y-6">
      {summaryLoading ? (
        <ReportLoadingSkeleton />
      ) : summaryError || !summary ? (
        <ReportErrorState onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusFrame title="Total Products" quantity={summary.total} icon={<StatIcon tone="neutral"><Package className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Active" quantity={summary.active} icon={<StatIcon tone="positive"><PackageCheck className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Pending" quantity={summary.pending} icon={<StatIcon tone="warning"><Clock3 className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Rejected" quantity={summary.rejected} icon={<StatIcon tone="negative"><XCircle className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Out of Stock" quantity={summary.out_of_stock} icon={<StatIcon tone="negative"><PackageX className="w-4 h-4" /></StatIcon>} />
          <StatusFrame title="Low Stock" quantity={summary.low_stock} icon={<StatIcon tone="warning"><AlertTriangle className="w-4 h-4" /></StatIcon>} />
        </div>
      )}

      <div className="rounded-2xl border border-000000/8 p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-base font-MontserratNormal text-000000/68">Product performance</h3>
          <div className="flex gap-2 flex-wrap">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => { setView(v.key); setPage(1); }}
                className={`text-c12 font-MontserratSemiBold px-3 py-2 rounded-c8 transition-colors cursor-pointer ${
                  view === v.key ? "bg-[#947FFF] text-white" : "bg-gray-100 text-000000/68"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        {!isByCategory && (
          <AdminListHeader
            searchExpandable
            searchVal={search}
            setSearchVal={(v) => { setSearch(v); setPage(1); }}
            placeholder={isByVariant ? "Search by product or SKU..." : "Search products..."}
            hidePeriod
            onExportClick={handleExportCsv}
            onExportPdfClick={handleExportPdf}
          />
        )}
        <FinanceTable rows={rows.results} columns={columns} loading={tableLoading} rowKey={(r) => r.id ?? r.category_id} emptyMessage="No products found for this view." />
        {rows.count > PAGE_SIZE && <Pagination currentPage={page} totalPages={Math.ceil(rows.count / PAGE_SIZE)} onPageChange={setPage} />}
      </div>

      <DataAsOf at={new Date()} />
    </div>
  );
}
