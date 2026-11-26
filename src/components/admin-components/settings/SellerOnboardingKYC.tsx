"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Check, Plus, Trash2, ChevronDown } from "lucide-react";
import { RootState } from "@/store";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

type Row = {
  id: string;
  category: string;
  key: string;
  label: string;
  field_group: string;
  required_individual: boolean;
  required_registered: boolean;
  display_order: number;
  is_active: boolean;
};

function SectionTitle({ children }: any) {
  return <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-1">{children}</h3>;
}

/** Orange square checkbox matching the mockup. */
function Box({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-6 h-6 rounded-c6 border flex items-center justify-center transition-colors ${
        checked ? "bg-ff715b border-ff715b" : "bg-white border-000000/20 hover:border-ff715b/50"
      }`}
    >
      {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
    </button>
  );
}

function RequirementTable({
  title,
  firstColHeader,
  category,
  rows,
  onToggle,
  onRename,
  onAdd,
  onDelete,
  grouped = false,
}: {
  title: string;
  firstColHeader: string;
  category: string;
  rows: Row[];
  onToggle: (row: Row, field: "required_individual" | "required_registered") => void;
  onRename: (row: Row, label: string) => void;
  onAdd: (label: string, fieldGroup: string) => void;
  onDelete: (row: Row) => void;
  grouped?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const confirmAdd = () => {
    const label = newLabel.trim();
    if (label) onAdd(label, "");
    setNewLabel("");
    setAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>{title}</SectionTitle>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="flex items-center gap-1.5 text-ff715b text-c14 font-MontserratMedium"
        >
          <Plus className="w-4 h-4" /> Add document
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-000000/5">
        {/* Header */}
        <div className="grid grid-cols-[1fr_140px_160px] bg-[#8b7bf0] text-white text-c14 px-5 py-3">
          <span>{firstColHeader}</span>
          <span className="text-center">Individual</span>
          <span className="text-center">Registered business</span>
        </div>

        {rows.length === 0 && !adding && (
          <div className="px-5 py-4 text-c13 text-000000/40">No rows yet.</div>
        )}

        {rows.map((row) => {
          const isSub = grouped && !!row.field_group;
          return (
            <div
              key={row.id}
              className="group grid grid-cols-[1fr_140px_160px] items-center px-5 py-3 border-t border-000000/5 first:border-t-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <input
                  defaultValue={row.label}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val && val !== row.label) onRename(row, val);
                    else e.target.value = row.label;
                  }}
                  className={`bg-transparent outline-none text-c14 text-161616 truncate border-b border-transparent focus:border-ff715b ${
                    isSub ? "pl-5" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  className="opacity-0 group-hover:opacity-100 text-000000/30 hover:text-ff715b transition-opacity"
                  title="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center">
                <Box checked={row.required_individual} onChange={() => onToggle(row, "required_individual")} />
              </div>
              <div className="flex justify-center">
                <Box checked={row.required_registered} onChange={() => onToggle(row, "required_registered")} />
              </div>
            </div>
          );
        })}

        {adding && (
          <div className="grid grid-cols-[1fr_140px_160px] items-center px-5 py-3 border-t border-000000/5">
            <div className="flex items-center gap-2 pr-3">
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAdd();
                  if (e.key === "Escape") { setNewLabel(""); setAdding(false); }
                }}
                placeholder="New row label"
                className="w-full h-9 px-3 rounded-c8 border border-efefef focus:border-ff715b outline-none text-c14"
              />
              <button type="button" onClick={confirmAdd} className="text-ff715b text-c13 font-MontserratMedium">
                Add
              </button>
            </div>
            <span />
            <span />
          </div>
        )}
      </div>
    </div>
  );
}

/** Business-types dropdown (which categories a seller may pick). */
function BusinessTypesDropdown({
  allowIndividual,
  allowRegistered,
  onToggle,
}: {
  allowIndividual: boolean;
  allowRegistered: boolean;
  onToggle: (field: "allow_individual" | "allow_registered_business") => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = [allowIndividual && "Individual", allowRegistered && "Registered company"]
    .filter(Boolean)
    .join(", ") || "None selected";
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 h-11 px-4 rounded-xl border border-000000/10 bg-[#f4f4f6] text-c14 text-161616"
      >
        <span className="truncate max-w-[200px]">{selected}</span>
        <ChevronDown className="w-4 h-4 text-000000/40" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-000000/8 p-1.5 z-20">
            {[
              { field: "allow_individual" as const, label: "Individual", checked: allowIndividual },
              { field: "allow_registered_business" as const, label: "Registered company", checked: allowRegistered },
            ].map((opt) => (
              <button
                key={opt.field}
                type="button"
                onClick={() => onToggle(opt.field)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-c14 text-left ${
                  opt.checked ? "bg-ff715b/10 text-ff715b" : "text-000000/70 hover:bg-000000/4"
                }`}
              >
                {opt.label}
                {opt.checked && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SellerOnboardingKYC() {
  const {
    fetchSettingsSection,
    updateSettingsSection,
    fetchKycRequirements,
    createKycRequirement,
    updateKycRequirement,
    deleteKycRequirement,
  } = AdminSettingsDetails();

  const settings = useSelector((s: RootState) => s.adminSettings.sections.sellerVerification ?? null);
  const rows = useSelector((s: RootState) => s.adminSettings.kycRequirements ?? []);

  const reload = () => fetchKycRequirements();
  useEffect(() => {
    fetchSettingsSection("sellerVerification");
    fetchKycRequirements();
    /* eslint-disable-next-line */
  }, []);

  const d = settings || {};
  const byCategory = (cat: string): Row[] =>
    [...rows]
      .filter((r: Row) => r.category === cat)
      .sort((a: Row, b: Row) => a.display_order - b.display_order);

  const saveSettings = (patch: Record<string, any>) => updateSettingsSection("sellerVerification", patch);

  const toggleRow = (row: Row, field: "required_individual" | "required_registered") =>
    updateKycRequirement(row.id, { [field]: !row[field] }, reload);
  const renameRow = (row: Row, label: string) => updateKycRequirement(row.id, { label }, reload);
  const deleteRow = (row: Row) => deleteKycRequirement(row.id, reload);
  const addRow = (category: string) => (label: string) => {
    const existing = byCategory(category);
    const nextOrder = existing.length ? Math.max(...existing.map((r) => r.display_order)) + 1 : 0;
    createKycRequirement({ category, label, display_order: nextOrder }, reload);
  };

  return (
    <div className="space-y-9">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Seller onboarding &amp; KYC</h2>

      {/* Business types */}
      <div>
        <SectionTitle>Business types</SectionTitle>
        <div className="flex items-center justify-between py-3 gap-4">
          <div>
            <p className="text-c14 text-161616">Business types</p>
            <p className="text-c12 text-000000/45 mt-0.5">What category of business sellers can choose from</p>
          </div>
          <BusinessTypesDropdown
            allowIndividual={!!d.allow_individual}
            allowRegistered={!!d.allow_registered_business}
            onToggle={(field) => saveSettings({ [field]: !d[field] })}
          />
        </div>
      </div>

      {/* Required documents */}
      <div className="border-t border-000000/6 pt-5">
        <RequirementTable
          title="Required documents"
          firstColHeader="Documents"
          category="required_document"
          rows={byCategory("required_document")}
          onToggle={toggleRow}
          onRename={renameRow}
          onAdd={addRow("required_document")}
          onDelete={deleteRow}
        />
      </div>

      {/* Accepted identification */}
      <div className="border-t border-000000/6 pt-5">
        <RequirementTable
          title="Accepted identification"
          firstColHeader="Documents"
          category="accepted_id"
          rows={byCategory("accepted_id")}
          onToggle={toggleRow}
          onRename={renameRow}
          onAdd={addRow("accepted_id")}
          onDelete={deleteRow}
        />
      </div>

      {/* Allow listing before verification */}
      <div className="border-t border-000000/6 pt-5">
        <div className="flex items-center justify-between py-3 gap-4">
          <div>
            <p className="text-c14 text-161616">Allow sellers list product before verification?</p>
            <p className="text-c12 text-000000/45 mt-0.5">If turned on, unverified sellers can list products and fulfil orders</p>
          </div>
          <ToggleSwitch
            checked={!!d.allow_listing_before_verification}
            onChange={() => saveSettings({ allow_listing_before_verification: !d.allow_listing_before_verification })}
          />
        </div>
      </div>

      {/* Locked fields */}
      <div className="border-t border-000000/6 pt-5">
        <RequirementTable
          title="Locked fields"
          firstColHeader="Fields"
          category="locked_field"
          rows={byCategory("locked_field")}
          onToggle={toggleRow}
          onRename={renameRow}
          onAdd={addRow("locked_field")}
          onDelete={deleteRow}
          grouped
        />
        <p className="text-c12 text-000000/45 mt-2">Locked fields trigger a re-verification when modified.</p>
      </div>
    </div>
  );
}
