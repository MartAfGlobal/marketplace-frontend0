"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { SectionTitle, Row, NumberField } from "./SettingsControls";

const WAREHOUSE_TYPES = [
  { value: "main", label: "Main State Warehouse" },
  { value: "sub", label: "Sub Warehouse" },
  { value: "fulfillment", label: "Fulfillment Center" },
  { value: "store", label: "Retail Store" },
];

type WH = any;

const EMPTY = {
  name: "", code: "", type: "fulfillment", state_id: "", city: "",
  address: "", capacity: "", contact_person: "", contact_phone: "",
  contact_email: "", parent_warehouse: "",
  redstar_city: "", redstar_town_id: "", is_dispatch_origin: false,
};

function zonesServed(w: WH): string {
  if (Array.isArray(w.zones) && w.zones.length) return w.zones.map((z: any) => z.name).join(", ");
  const parts = [w.city, w.state?.name].filter(Boolean);
  return parts.join(", ") || "—";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-c12 text-000000/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function ShippingHubsSettings() {
  const {
    fetchWarehouses, fetchStates, createWarehouse, updateWarehouse, deleteWarehouse,
    fetchSettingsSection, updateSettingsSection,
  } = AdminSettingsDetails();

  const [warehouses, setWarehouses] = useState<WH[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [editing, setEditing] = useState<WH | null>(null); // row being edited, or {} for new
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const ops = useSelector((s: RootState) => s.adminSettings.sections.shippingOperations ?? null);

  const reload = () => fetchWarehouses(setWarehouses);
  useEffect(() => {
    fetchWarehouses(setWarehouses);
    fetchStates(setStates);
    fetchSettingsSection("shippingOperations");
    /* eslint-disable-next-line */
  }, []);

  const openNew = () => { setForm(EMPTY); setEditing({}); setError(""); };
  const openEdit = (w: WH) => {
    setForm({
      name: w.name ?? "", code: w.code ?? "", type: w.type ?? "fulfillment",
      state_id: w.state?.id ?? "", city: w.city ?? "", address: w.address ?? "",
      capacity: w.capacity ?? "", contact_person: w.contact_person ?? "",
      contact_phone: w.contact_phone ?? "", contact_email: w.contact_email ?? "",
      parent_warehouse: w.parent_warehouse ?? "",
      redstar_city: w.redstar_city ?? "", redstar_town_id: w.redstar_town_id ?? "",
      is_dispatch_origin: !!w.is_dispatch_origin,
    });
    setEditing(w); setError("");
  };
  const close = () => { setEditing(null); setError(""); };

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = () => {
    setError("");
    const payload: any = {
      name: form.name, code: form.code, type: form.type,
      state_id: form.state_id, city: form.city, address: form.address,
      capacity: Number(form.capacity) || 0,
      contact_person: form.contact_person, contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      redstar_city: form.redstar_city,
      redstar_town_id: form.redstar_town_id === "" ? null : Number(form.redstar_town_id),
      is_dispatch_origin: !!form.is_dispatch_origin,
    };
    if (form.type === "sub" && form.parent_warehouse) payload.parent_warehouse = form.parent_warehouse;
    setSaving(true);
    const onErr = (e: any) => {
      setSaving(false);
      const d = e?.response?.data ?? e?.data ?? e;
      setError(typeof d === "string" ? d : Object.values(d || {}).flat().join(" ") || "Could not save warehouse.");
    };
    const onOk = () => { setSaving(false); close(); reload(); };
    if (editing && editing.id) updateWarehouse(editing.id, payload, onOk, onErr);
    else createWarehouse(payload, onOk, onErr);
  };

  const remove = (w: WH) => {
    if (!window.confirm(`Remove "${w.name}"?`)) return;
    deleteWarehouse(w.id, reload);
  };

  const d = ops || {};
  const saveOps = (patch: Record<string, any>) => updateSettingsSection("shippingOperations", patch);

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Shipping &amp; Hubs</h2>

      {/* Warehouses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Warehouses</SectionTitle>
          <button onClick={openNew} className="flex items-center gap-1.5 text-ff715b text-c14 font-MontserratMedium">
            <Plus className="w-4 h-4" /> Add warehouse
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-000000/5">
          <div className="grid grid-cols-[1fr_1.4fr_90px] bg-[#8b7bf0] text-white text-c14 px-5 py-3">
            <span>Name</span>
            <span>Zones served</span>
            <span className="text-right">Actions</span>
          </div>
          {warehouses.length === 0 && (
            <div className="px-5 py-4 text-c13 text-000000/40">No warehouses yet.</div>
          )}
          {warehouses.map((w) => (
            <div key={w.id} className="grid grid-cols-[1fr_1.4fr_90px] items-center px-5 py-3 border-t border-000000/5">
              <span className="text-c14 text-161616 truncate">{w.name}</span>
              <span className="text-c14 text-000000/60 truncate">{zonesServed(w)}</span>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => openEdit(w)} className="text-000000/40 hover:text-ff715b"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(w)} className="text-000000/40 hover:text-ff715b"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery rules (ShippingOperationsSettings) */}
      <div className="border-t border-000000/6 pt-5">
        <SectionTitle>Delivery rules</SectionTitle>
        <Row title="Require warehouse package photo" desc="Require a photo of the package when it leaves the hub">
          <ToggleSwitch checked={!!d.warehouse_package_photo_required}
            onChange={() => saveOps({ warehouse_package_photo_required: !d.warehouse_package_photo_required })} />
        </Row>
        <Row title="Max photo size" desc="Largest package photo an admin can upload">
          <NumberField value={d.warehouse_package_photo_max_mb} unit="MB" min={1}
            onSave={(v) => saveOps({ warehouse_package_photo_max_mb: v })} />
        </Row>
      </div>

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={close}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-c16 font-MontserratSemiBold text-161616">{editing.id ? "Edit warehouse" : "Add warehouse"}</h3>
              <button onClick={close} className="text-000000/40 hover:text-161616"><X className="w-5 h-5" /></button>
            </div>

            {error && <p className="mb-3 text-c13 text-ff715b">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <input value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <Field label="Code">
                <input value={form.code} onChange={(e) => set("code", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <Field label="Type">
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef bg-white outline-none text-c14">
                  {WAREHOUSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="State">
                <select value={form.state_id} onChange={(e) => set("state_id", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef bg-white outline-none text-c14">
                  <option value="">Select state</option>
                  {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              {form.type === "sub" && (
                <Field label="Parent warehouse">
                  <select value={form.parent_warehouse} onChange={(e) => set("parent_warehouse", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef bg-white outline-none text-c14">
                    <option value="">Select parent</option>
                    {warehouses.filter((w) => w.id !== editing.id).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </Field>
              )}
              <Field label="City">
                <input value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <Field label="Capacity (m³)">
                <input type="number" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <div className="col-span-2">
                <Field label="Address">
                  <input value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
                </Field>
              </div>
              <Field label="Contact person">
                <input value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <Field label="Contact phone">
                <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <div className="col-span-2">
                <Field label="Contact email">
                  <input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
                </Field>
              </div>

              {/* Delivery-integration origin */}
              <div className="col-span-2 pt-2 mt-1 border-t border-000000/6">
                <p className="text-c13 font-MontserratSemiBold text-161616 mb-1">Delivery origin (Red Star)</p>
                <p className="text-c12 text-000000/45 mb-3">Used to quote delivery fees from this hub. Flag one hub as the dispatch origin.</p>
              </div>
              <Field label="Red Star city">
                <input value={form.redstar_city} onChange={(e) => set("redstar_city", e.target.value)} placeholder="e.g. LAGOS MAINLAND" className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <Field label="Red Star town ID">
                <input type="number" value={form.redstar_town_id} onChange={(e) => set("redstar_town_id", e.target.value)} className="w-full h-10 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14" />
              </Field>
              <div className="col-span-2 flex items-center justify-between py-1">
                <div>
                  <p className="text-c14 text-161616">Use as dispatch origin</p>
                  <p className="text-c12 text-000000/45">Delivery fees are quoted from this hub.</p>
                </div>
                <ToggleSwitch checked={!!form.is_dispatch_origin} onChange={() => set("is_dispatch_origin", !form.is_dispatch_origin)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={close} className="px-5 h-11 rounded-xl border border-000000/10 text-c14 text-000000/60">Cancel</button>
              <button onClick={submit} disabled={saving} className="px-5 h-11 rounded-xl bg-ff715b text-white text-c14 font-MontserratMedium disabled:opacity-50">
                {saving ? "Saving…" : "Save warehouse"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
