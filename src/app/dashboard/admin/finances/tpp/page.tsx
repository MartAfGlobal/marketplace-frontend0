"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { formatNaira } from "@/helpers/admin/financeFormat";
import { Button } from "@/components/ui/Button/Button";
import FinanceTable, { type FinanceColumn } from "@/components/admin-components/finance/FinanceTable";
import FinanceFormDrawer from "@/components/admin-components/finance/FinanceFormDrawer";
import FinanceStatusPill from "@/components/admin-components/finance/FinanceStatusPill";
import TppBillingDrawer from "@/components/admin-components/finance/TppBillingDrawer";
import type { Paginated, ThirdPartyProvider } from "@/types/finance";

const SERVICE_OPTIONS = [
  { value: "PAYMENT_PROCESSOR", label: "Payment Processor" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "WAREHOUSING", label: "Warehousing" },
  { value: "FINTECH", label: "Fintech Partner" },
  { value: "OTHER", label: "Other" },
];

const COLUMNS: FinanceColumn<ThirdPartyProvider>[] = [
  { header: "Provider", cell: (r) => r.name },
  { header: "Service", cell: (r) => r.service_type_display },
  { header: "Country", cell: (r) => r.country_name ?? "—" },
  {
    header: "Status",
    cell: (r) => <FinanceStatusPill status={r.is_active ? "COMPLETED" : "FAILED"} label={r.is_active ? "Active" : "Inactive"} />,
  },
  { header: "Total fees paid", cell: (r) => formatNaira(r.total_fees_paid) },
];

export default function AdminTppFinancialsPage() {
  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchProviders, saveProvider, loading } = FinanceDetails();

  const [providers, setProviders] = useState<ThirdPartyProvider[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [drawer, setDrawer] = useState<{ open: boolean; provider: ThirdPartyProvider | null }>({ open: false, provider: null });
  const [billingFor, setBillingFor] = useState<ThirdPartyProvider | null>(null);

  const load = () => {
    setListLoading(true);
    fetchProviders((d: Paginated<ThirdPartyProvider>) => setProviders(d?.results ?? []), () => setListLoading(false));
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = (values: Record<string, string>) =>
    saveProvider({ ...values, is_active: values.is_active !== "false" }, drawer.provider?.id ?? null, () => {
      setDrawer({ open: false, provider: null });
      load();
    });

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
      <h1 className="text-xl md:text-c18 font-MontserratSemiBold mb-8">TPP financials</h1>

      <div className="rounded-2xl border border-000000/8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-MontserratNormal text-000000/68">Third-party providers</h2>
          <Button className="w-auto h-10 px-5 text-xs" onClick={() => setDrawer({ open: true, provider: null })}>
            Add provider
          </Button>
        </div>

        <FinanceTable
          compact
          rows={providers}
          columns={COLUMNS}
          loading={listLoading}
          rowKey={(r) => r.id}
          actions={[
            { label: "Billing history", onSelect: setBillingFor },
            { label: "Edit provider", onSelect: (r) => setDrawer({ open: true, provider: r }) },
          ]}
          emptyMessage="No third-party providers added yet."
        />
      </div>

      <FinanceFormDrawer
        isOpen={drawer.open}
        title={drawer.provider ? `Edit ${drawer.provider.name}` : "Add provider"}
        submitLabel={drawer.provider ? "Save changes" : "Add provider"}
        loading={loading}
        onClose={() => setDrawer({ open: false, provider: null })}
        onSubmit={handleSave}
        initialValues={
          drawer.provider
            ? { name: drawer.provider.name, service_type: drawer.provider.service_type, notes: drawer.provider.notes, is_active: String(drawer.provider.is_active) }
            : { is_active: "true" }
        }
        fields={[
          { name: "name", label: "Provider name", required: true, placeholder: "e.g. Paystack" },
          { name: "service_type", label: "Service", type: "select", required: true, placeholder: "Select service", options: SERVICE_OPTIONS },
          { name: "is_active", label: "Status", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Optional" },
        ]}
      />

      <TppBillingDrawer provider={billingFor} onClose={() => setBillingFor(null)} onRecorded={load} />
    </div>
  );
}
