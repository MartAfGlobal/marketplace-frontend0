"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Coins, Landmark } from "lucide-react";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { formatNaira, PERIOD_LABELS, PERIOD_OPTIONS, periodFromLabel } from "@/helpers/admin/financeFormat";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import { Button } from "@/components/ui/Button/Button";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceFormDrawer from "@/components/admin-components/finance/FinanceFormDrawer";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import type { Paginated, TaxDashboard, TaxRate } from "@/types/finance";

type CountryOption = { id: string; name: string };

const COUNTRY_COLUMNS: FinanceColumn<TaxDashboard["by_country"][number]>[] = [
  { header: "Country", cell: (r) => r.country },
  { header: "Tax rate", cell: (r) => `${r.rate_percent}%` },
  { header: "Revenue", cell: (r) => formatNaira(r.revenue) },
  { header: "Tax owed", cell: (r) => formatNaira(r.tax_owed) },
];

export default function AdminTaxCompliancePage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchTaxDashboard, fetchTaxRates, saveTaxRate, deleteTaxRate, fetchCountries, loading } = FinanceDetails();

  const [period, setPeriod] = useState("this_month");
  const [dashboard, setDashboard] = useState<TaxDashboard | null>(null);
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [drawer, setDrawer] = useState<{ open: boolean; rate: TaxRate | null }>({ open: false, rate: null });

  const loadRates = () => {
    setListLoading(true);
    fetchTaxRates((d: Paginated<TaxRate>) => setRates(d?.results ?? []), () => setListLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    loadRates();
    fetchCountries((d: Paginated<CountryOption>) => setCountries(d?.results ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) fetchTaxDashboard({ period }, setDashboard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, period]);

  const handleSave = (values: Record<string, string>) => {
    // On edit the country field isn't offered, so `values` is already just the editable fields.
    saveTaxRate({ ...values, is_active: values.is_active !== "false" }, drawer.rate?.id ?? null, () => {
      setDrawer({ open: false, rate: null });
      loadRates();
      fetchTaxDashboard({ period }, setDashboard);
    });
  };

  const rateColumns: FinanceColumn<TaxRate>[] = [
    { header: "Country", cell: (r) => r.country_name },
    { header: "Rate", cell: (r) => `${r.rate_percent}%` },
    {
      header: "Status",
      cell: (r) => <FinanceStatusPill status={r.is_active ? "COMPLETED" : "FAILED"} label={r.is_active ? "Active" : "Inactive"} />,
    },
    { header: "Notes", cell: (r) => <span className="block max-w-[260px] truncate">{r.notes || "—"}</span> },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold mb-8">Tax &amp; compliance</h1>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-MontserratNormal text-000000/68">Tax summary</h2>
        <FilterDropdown
          options={PERIOD_OPTIONS}
          defaultValue={PERIOD_LABELS.this_month}
          onChange={(label) => setPeriod(periodFromLabel(label))}
          className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatusFrame
          title="Revenue in scope"
          quantity={formatNaira(dashboard?.total_revenue, 0)}
          icon={<StatIcon tone="positive"><Coins className="w-4 h-4" /></StatIcon>}
        />
        <StatusFrame
          title="Estimated tax owed"
          quantity={formatNaira(dashboard?.total_tax_owed, 0)}
          icon={<StatIcon tone="negative"><Landmark className="w-4 h-4" /></StatIcon>}
        />
      </div>

      <div className="rounded-2xl border border-000000/8 p-6 mb-8">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Tax by country</h2>
        <FinanceTable
          compact
          rows={dashboard?.by_country ?? []}
          columns={COUNTRY_COLUMNS}
          loading={false}
          rowKey={(r) => r.country_code}
          emptyMessage="No active tax rates yet — add one below."
        />
      </div>

      <div className="rounded-2xl border border-000000/8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-MontserratNormal text-000000/68">Tax rates</h2>
          <Button className="w-auto h-10 px-5 text-xs" onClick={() => setDrawer({ open: true, rate: null })}>
            Add tax rate
          </Button>
        </div>
        <FinanceTable
          compact
          rows={rates}
          columns={rateColumns}
          loading={listLoading}
          rowKey={(r) => r.id}
          actions={[
            { label: "Edit rate", onSelect: (r) => setDrawer({ open: true, rate: r }) },
            { label: "Remove", onSelect: (r) => deleteTaxRate(r.id, loadRates) },
          ]}
          emptyMessage="No tax rates configured."
        />
      </div>

      <FinanceFormDrawer
        isOpen={drawer.open}
        title={drawer.rate ? `Edit ${drawer.rate.country_name} tax rate` : "Add tax rate"}
        submitLabel={drawer.rate ? "Save changes" : "Add tax rate"}
        loading={loading}
        onClose={() => setDrawer({ open: false, rate: null })}
        onSubmit={handleSave}
        initialValues={
          drawer.rate
            ? { rate_percent: drawer.rate.rate_percent, notes: drawer.rate.notes, is_active: String(drawer.rate.is_active) }
            : { is_active: "true" }
        }
        fields={[
          ...(drawer.rate
            ? []
            : [{
                name: "country",
                label: "Country",
                type: "select" as const,
                required: true,
                placeholder: "Select country",
                options: countries.map((c) => ({ value: c.id, label: c.name })),
              }]),
          { name: "rate_percent", label: "Rate (%)", type: "number", required: true, placeholder: "e.g. 7.5" },
          {
            name: "is_active",
            label: "Status",
            type: "select",
            options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }],
          },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional" },
        ]}
      />
    </div>
  );
}
