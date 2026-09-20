"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FinanceDetails } from "@/helpers/admin/financeHelper";
import { formatDate, formatNaira } from "@/helpers/admin/financeFormat";
import type { Paginated, ThirdPartyProvider, TPPBillingRecord } from "@/types/finance";

interface TppBillingDrawerProps {
  provider: ThirdPartyProvider | null;
  onClose: () => void;
  /** Called after a bill is recorded so the providers table's total refreshes. */
  onRecorded: () => void;
}

/** A provider's billing history plus the form to record a new bill. */
export default function TppBillingDrawer({ provider, onClose, onRecorded }: TppBillingDrawerProps) {
  const { fetchProviderBilling, addBillingRecord, loading } = FinanceDetails();
  const [records, setRecords] = useState<TPPBillingRecord[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [form, setForm] = useState({ amount: "", description: "", invoice_reference: "" });

  const load = () => {
    if (!provider) return;
    setListLoading(true);
    fetchProviderBilling(provider.id, (d: Paginated<TPPBillingRecord>) => setRecords(d?.results ?? []), () => setListLoading(false));
  };

  useEffect(() => {
    if (!provider) return;
    setForm({ amount: "", description: "", invoice_reference: "" });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !form.amount) return;
    addBillingRecord(provider.id, form, () => {
      setForm({ amount: "", description: "", invoice_reference: "" });
      load();
      onRecorded();
    });
  };

  return (
    <DrawerWrapper isOpen={!!provider} onClose={onClose}>
      <button onClick={onClose} className="absolute right-8 top-8 text-000000/44 hover:text-000000 cursor-pointer" aria-label="Close">
        <X className="w-5 h-5" />
      </button>
      <p className="text-[10px] text-000000/44 font-MontserratNormal mb-1">Billing history</p>
      <h2 className="text-lg font-MontserratMedium mb-6">{provider?.name}</h2>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
        <div className="rounded-c8 border border-000000/8 overflow-hidden">
          <div className="flex justify-between px-4 py-3 bg-000000/4 text-sm font-MontserratNormal text-000000/68">
            <span>Bill</span>
            <span>Amount</span>
          </div>
          {listLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size={24} color="border-ff715b" />
            </div>
          ) : records.length ? (
            records.map((r) => (
              <div key={r.id} className="flex justify-between gap-4 px-4 py-3 text-sm font-MontserratNormal text-000000/68">
                <div>
                  <p>{r.description || r.invoice_reference || "Bill"}</p>
                  <p className="text-[10px] text-000000/44">
                    {formatDate(r.billed_at)}
                    {r.invoice_reference && ` · ${r.invoice_reference}`}
                  </p>
                </div>
                <span className="whitespace-nowrap">{formatNaira(r.amount)}</span>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-xs text-000000/44">No bills recorded yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm font-MontserratMedium">Record a bill</p>
          <Input type="number" placeholder="Amount (₦)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Invoice reference" value={form.invoice_reference} onChange={(e) => setForm({ ...form, invoice_reference: e.target.value })} />
          <Button type="submit" loading={loading} disabled={!form.amount}>
            Record bill
          </Button>
        </form>
      </div>
    </DrawerWrapper>
  );
}
