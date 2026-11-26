"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Check, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { AdminLocalisationDetails } from "@/helpers/admin/adminLocalisationHelper";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";

const thCls = "text-c12 font-MontserratMedium text-white/90 text-left px-4 py-3";
const tdCls = "px-4 py-3 text-c14 text-161616 align-middle";
const inputCls =
  "h-10 px-3 w-full rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14";

function IconBtn({ onClick, title, children, className = "" }: any) {
  return (
    <button onClick={onClick} title={title} className={`p-1.5 rounded-lg hover:bg-000000/5 ${className}`}>
      {children}
    </button>
  );
}

function SectionHeader({ title, actionLabel, onAction, extra }: any) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-c16 font-MontserratSemiBold text-161616">{title}</h3>
      <div className="flex items-center gap-3">
        {extra}
        {actionLabel && (
          <button onClick={onAction} className="flex items-center gap-1.5 text-c13 font-MontserratMedium text-ff715b hover:underline">
            <Plus className="w-4 h-4" /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LocalisationSettings() {
  const { fetchAll, createItem, updateItem, deleteItem, refreshRates } = AdminLocalisationDetails();
  const countries = useSelector((s: RootState) => s.adminLocalisation.countries);
  const currencies = useSelector((s: RootState) => s.adminLocalisation.currencies);
  const languages = useSelector((s: RootState) => s.adminLocalisation.languages);
  const rates = useSelector((s: RootState) => s.adminLocalisation.exchangeRates);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- editing state per table ----
  const [edit, setEdit] = useState<{ table: string; id: string | "new" } | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});

  const startEdit = (table: string, row: any) => {
    setEdit({ table, id: row.id });
    setDraft({ ...row });
  };
  const startAdd = (table: string, defaults: Record<string, any>) => {
    setEdit({ table, id: "new" });
    setDraft(defaults);
  };
  const cancel = () => {
    setEdit(null);
    setDraft({});
  };
  const isEditing = (table: string, id: string) => edit?.table === table && edit?.id === id;
  const isAdding = (table: string) => edit?.table === table && edit?.id === "new";
  const set = (k: string, v: any) => setDraft((p) => ({ ...p, [k]: v }));

  const save = (table: string, resource: any, body: Record<string, any>) => {
    if (edit?.id === "new") createItem(resource, body, cancel);
    else updateItem(resource, edit!.id, body, cancel);
  };

  const activeLangs = languages.filter((l: any) => l.is_active);
  const activeCurrencies = currencies.filter((c: any) => c.is_active);
  const nonBaseCurrencies = currencies.filter((c: any) => !c.is_base);
  const baseCode = (currencies.find((c: any) => c.is_base) || {}).code || "NGN";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-c20 font-MontserratSemiBold text-161616">Localisation</h2>
        <p className="text-c14 text-000000/50 mt-1">
          Countries, languages and exchange rates. Active countries feed every country dropdown across the
          platform; rates convert against {baseCode} (the base currency).
        </p>
      </div>

      {/* ================= COUNTRIES ================= */}
      <div>
        <SectionHeader
          title="Country"
          actionLabel="Add country"
          onAction={() =>
            startAdd("country", {
              name: "", code: "", can_ship_to: true, can_sell_from: true,
              default_language: null, default_currency: null, is_operational: true,
            })
          }
        />
        <div className="overflow-x-auto rounded-xl border border-000000/5">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-[#7b5bd6]">
                <th className={thCls}>Country</th>
                <th className={thCls}>Can ship to</th>
                <th className={thCls}>Can sell from</th>
                <th className={thCls}>Default language</th>
                <th className={thCls}>Default currency</th>
                <th className={thCls}>Active</th>
                <th className={thCls}></th>
              </tr>
            </thead>
            <tbody>
              {isAdding("country") && (
                <CountryRow
                  draft={draft} set={set} editing langs={activeLangs} currencies={activeCurrencies}
                  onSave={() => save("country", "countries", draft)} onCancel={cancel}
                />
              )}
              {countries.map((row: any) =>
                isEditing("country", row.id) ? (
                  <CountryRow
                    key={row.id} draft={draft} set={set} editing langs={activeLangs} currencies={activeCurrencies}
                    onSave={() => save("country", "countries", draft)} onCancel={cancel}
                  />
                ) : (
                  <tr key={row.id} className="border-t border-000000/5">
                    <td className={tdCls}>{row.name}</td>
                    <td className={tdCls}><ToggleSwitch checked={!!row.can_ship_to} onChange={() => updateItem("countries", row.id, { can_ship_to: !row.can_ship_to })} /></td>
                    <td className={tdCls}><ToggleSwitch checked={!!row.can_sell_from} onChange={() => updateItem("countries", row.id, { can_sell_from: !row.can_sell_from })} /></td>
                    <td className={tdCls}>{languages.find((l: any) => l.id === row.default_language)?.name || "—"}</td>
                    <td className={tdCls}>{currencies.find((c: any) => c.id === row.default_currency)?.code || "—"}</td>
                    <td className={tdCls}><ToggleSwitch checked={!!row.is_operational} onChange={() => updateItem("countries", row.id, { is_operational: !row.is_operational })} /></td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-1">
                        <IconBtn title="Edit" onClick={() => startEdit("country", row)}><Pencil className="w-4 h-4 text-000000/50" /></IconBtn>
                        <IconBtn title="Delete" onClick={() => deleteItem("countries", row.id)}><Trash2 className="w-4 h-4 text-[#CA0202]" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= LANGUAGES ================= */}
      <div>
        <SectionHeader
          title="Languages" actionLabel="Add language"
          onAction={() => startAdd("language", { name: "", code: "", is_default: false, is_active: true })}
        />
        <div className="overflow-x-auto rounded-xl border border-000000/5">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr className="bg-[#7b5bd6]">
                <th className={thCls}>Language</th>
                <th className={thCls}>Default</th>
                <th className={thCls}>Active</th>
                <th className={thCls}></th>
              </tr>
            </thead>
            <tbody>
              {isAdding("language") && (
                <LanguageRow draft={draft} set={set} onSave={() => save("language", "languages", draft)} onCancel={cancel} />
              )}
              {languages.map((row: any) =>
                isEditing("language", row.id) ? (
                  <LanguageRow key={row.id} draft={draft} set={set} onSave={() => save("language", "languages", draft)} onCancel={cancel} />
                ) : (
                  <tr key={row.id} className="border-t border-000000/5">
                    <td className={tdCls}>{row.name} <span className="text-000000/40">({row.code})</span></td>
                    <td className={tdCls}>
                      <button onClick={() => updateItem("languages", row.id, { is_default: true })} title="Set default"
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${row.is_default ? "bg-ff715b border-ff715b" : "border-000000/30"}`}>
                        {row.is_default && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </td>
                    <td className={tdCls}><ToggleSwitch checked={!!row.is_active} onChange={() => updateItem("languages", row.id, { is_active: !row.is_active })} /></td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-1">
                        <IconBtn title="Edit" onClick={() => startEdit("language", row)}><Pencil className="w-4 h-4 text-000000/50" /></IconBtn>
                        <IconBtn title="Delete" onClick={() => deleteItem("languages", row.id)}><Trash2 className="w-4 h-4 text-[#CA0202]" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EXCHANGE RATES ================= */}
      <div>
        <SectionHeader
          title="Exchange rates" actionLabel="Currency pair"
          onAction={() => startAdd("rate", { quote_currency: "", source: "manual", manual_rate: "", refresh_interval_minutes: 60, is_active: true })}
          extra={
            <button onClick={() => refreshRates()} className="flex items-center gap-1.5 text-c13 font-MontserratMedium text-6a0dad hover:underline">
              <RefreshCw className="w-4 h-4" /> Refresh auto rates
            </button>
          }
        />
        <p className="text-c12 text-000000/50 mb-3">Each rate is <b>{baseCode} per 1 unit</b> of the paired currency (e.g. 1 USD = ₦1,540).</p>
        <div className="overflow-x-auto rounded-xl border border-000000/5">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-[#7b5bd6]">
                <th className={thCls}>Base</th>
                <th className={thCls}>Pair</th>
                <th className={thCls}>Source</th>
                <th className={thCls}>Refresh (min)</th>
                <th className={thCls}>Rate ({baseCode}/unit)</th>
                <th className={thCls}>Active</th>
                <th className={thCls}></th>
              </tr>
            </thead>
            <tbody>
              {isAdding("rate") && (
                <RateRow draft={draft} set={set} baseCode={baseCode} currencies={nonBaseCurrencies} onSave={() => save("rate", "exchangeRates", draft)} onCancel={cancel} />
              )}
              {rates.map((row: any) =>
                isEditing("rate", row.id) ? (
                  <RateRow key={row.id} draft={draft} set={set} baseCode={baseCode} currencies={nonBaseCurrencies} onSave={() => save("rate", "exchangeRates", draft)} onCancel={cancel} />
                ) : (
                  <tr key={row.id} className="border-t border-000000/5">
                    <td className={tdCls}>{row.base_code}</td>
                    <td className={tdCls}>{row.currency_code}</td>
                    <td className={`${tdCls} capitalize`}>{row.source}</td>
                    <td className={tdCls}>{row.source === "automatic" ? row.refresh_interval_minutes : "—"}</td>
                    <td className={tdCls}>{row.effective_rate ?? "—"}{row.source === "automatic" && <span className="text-000000/40 text-c12"> (auto)</span>}</td>
                    <td className={tdCls}><ToggleSwitch checked={!!row.is_active} onChange={() => updateItem("exchangeRates", row.id, { is_active: !row.is_active })} /></td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-1">
                        <IconBtn title="Edit" onClick={() => startEdit("rate", row)}><Pencil className="w-4 h-4 text-000000/50" /></IconBtn>
                        <IconBtn title="Delete" onClick={() => deleteItem("exchangeRates", row.id)}><Trash2 className="w-4 h-4 text-[#CA0202]" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- editable rows ---------- */
function SaveCancel({ onSave, onCancel }: any) {
  return (
    <div className="flex items-center gap-1">
      <IconBtn title="Save" onClick={onSave}><Check className="w-4 h-4 text-[#1a8f3c]" /></IconBtn>
      <IconBtn title="Cancel" onClick={onCancel}><X className="w-4 h-4 text-[#CA0202]" /></IconBtn>
    </div>
  );
}

function CountryRow({ draft, set, langs, currencies, onSave, onCancel }: any) {
  return (
    <tr className="border-t border-000000/5 bg-ff715b/5">
      <td className={tdCls}>
        <input className={inputCls} placeholder="Country" value={draft.name || ""} onChange={(e) => set("name", e.target.value)} />
        <input className={`${inputCls} mt-1`} placeholder="Code (e.g. NG)" value={draft.code || ""} onChange={(e) => set("code", e.target.value.toUpperCase())} />
      </td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.can_ship_to} onChange={() => set("can_ship_to", !draft.can_ship_to)} /></td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.can_sell_from} onChange={() => set("can_sell_from", !draft.can_sell_from)} /></td>
      <td className={tdCls}>
        <select className={inputCls} value={draft.default_language || ""} onChange={(e) => set("default_language", e.target.value || null)}>
          <option value="">—</option>
          {langs.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </td>
      <td className={tdCls}>
        <select className={inputCls} value={draft.default_currency || ""} onChange={(e) => set("default_currency", e.target.value || null)}>
          <option value="">—</option>
          {currencies.map((c: any) => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
      </td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.is_operational} onChange={() => set("is_operational", !draft.is_operational)} /></td>
      <td className={tdCls}><SaveCancel onSave={onSave} onCancel={onCancel} /></td>
    </tr>
  );
}

function LanguageRow({ draft, set, onSave, onCancel }: any) {
  return (
    <tr className="border-t border-000000/5 bg-ff715b/5">
      <td className={tdCls}>
        <input className={inputCls} placeholder="Language" value={draft.name || ""} onChange={(e) => set("name", e.target.value)} />
        <input className={`${inputCls} mt-1`} placeholder="Code (e.g. en)" value={draft.code || ""} onChange={(e) => set("code", e.target.value.toLowerCase())} />
      </td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.is_default} onChange={() => set("is_default", !draft.is_default)} /></td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.is_active} onChange={() => set("is_active", !draft.is_active)} /></td>
      <td className={tdCls}><SaveCancel onSave={onSave} onCancel={onCancel} /></td>
    </tr>
  );
}

function RateRow({ draft, set, baseCode, currencies, onSave, onCancel }: any) {
  return (
    <tr className="border-t border-000000/5 bg-ff715b/5">
      <td className={tdCls}>{baseCode}</td>
      <td className={tdCls}>
        <select className={inputCls} value={draft.quote_currency || ""} onChange={(e) => set("quote_currency", e.target.value)}>
          <option value="">Select</option>
          {currencies.map((c: any) => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
      </td>
      <td className={tdCls}>
        <select className={inputCls} value={draft.source || "manual"} onChange={(e) => set("source", e.target.value)}>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </td>
      <td className={tdCls}>
        <input className={inputCls} type="number" min={1} disabled={draft.source !== "automatic"} value={draft.refresh_interval_minutes ?? 60} onChange={(e) => set("refresh_interval_minutes", e.target.value)} />
      </td>
      <td className={tdCls}>
        <input className={inputCls} type="number" step="0.000001" placeholder={`${baseCode} per unit`} disabled={draft.source === "automatic"} value={draft.manual_rate ?? ""} onChange={(e) => set("manual_rate", e.target.value)} />
      </td>
      <td className={tdCls}><ToggleSwitch checked={!!draft.is_active} onChange={() => set("is_active", !draft.is_active)} /></td>
      <td className={tdCls}><SaveCancel onSave={onSave} onCancel={onCancel} /></td>
    </tr>
  );
}
