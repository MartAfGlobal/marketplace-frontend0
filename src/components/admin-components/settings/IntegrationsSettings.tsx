"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Activity } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { AdminIntegrationsDetails } from "@/helpers/admin/adminIntegrationsHelper";

// Provider logos (supplied in the design), hosted on Cloudinary.
const ICON_BASE = "https://res.cloudinary.com/martaf/image/upload/martaf/integration_icons";
const PROVIDER_ICONS: Record<string, string> = {
  paystack: `${ICON_BASE}/paystack.png`,
  flutterwave: `${ICON_BASE}/flutterwave.png`,
  google: `${ICON_BASE}/google.png`,
  redstar: `${ICON_BASE}/redstar.png`,
  verification_tpp: `${ICON_BASE}/redstar.png`,
  speedaf: `${ICON_BASE}/speedaf.png`,
  zoho_mail: `${ICON_BASE}/zoho_mail.png`,
  whatsapp: `${ICON_BASE}/whatsapp.png`,
};

const thCls = "text-c12 font-MontserratMedium text-white/90 text-left px-4 py-3";
const tdCls = "px-4 py-4 text-c14 text-161616 align-middle";

const CATEGORY_META: Record<string, { title: string; note: string }> = {
  payment: { title: "Payment integration", note: "Minimum of one provider must be live." },
  signin: { title: "Sign-in", note: "Minimum of one provider must be live." },
  shipping: { title: "Shipping", note: "Minimum of one provider must be selected." },
  verification: { title: "Verification", note: "" },
  messaging: { title: "Messaging", note: "" },
};
const ORDER = ["payment", "signin", "shipping", "verification", "messaging"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    connected: "bg-[#e7f6ec] text-[#1a8f3c]",
    test_mode: "bg-[#fef3e2] text-[#b7791f]",
    error: "bg-[#fdeaea] text-[#CA0202]",
    disconnected: "bg-000000/5 text-000000/50",
    unknown: "bg-000000/5 text-000000/50",
  };
  const label: Record<string, string> = {
    connected: "Connected", test_mode: "Test mode", error: "Error",
    disconnected: "Not connected", unknown: "Unknown",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-c12 ${map[status] || map.unknown}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" /> {label[status] || status}
    </span>
  );
}

function ModeToggle({ mode, onPick }: { mode: string; onPick: (m: string) => void }) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-000000/10">
      {["test", "live"].map((m) => (
        <button key={m} onClick={() => onPick(m)}
          className={`px-4 py-1.5 text-c13 font-MontserratMedium capitalize ${
            mode === m ? (m === "live" ? "bg-[#1a8f3c] text-white" : "bg-[#f0a84b] text-white") : "bg-white text-000000/60"
          }`}>{m}</button>
      ))}
    </div>
  );
}

export default function IntegrationsSettings() {
  const { fetchProviders, updateProvider, testProvider, fetchFlags, updateFlags } = AdminIntegrationsDetails();
  const [providers, setProviders] = useState<any[]>([]);
  const [flags, setFlags] = useState<any>({ use_manual_verification: false });

  const load = () => fetchProviders(setProviders);
  useEffect(() => { load(); fetchFlags(setFlags); /* eslint-disable-next-line */ }, []);

  const byCategory = useMemo(() => {
    const g: Record<string, any[]> = {};
    providers.forEach((p) => { (g[p.category] ||= []).push(p); });
    Object.values(g).forEach((l) => l.sort((a, b) => a.priority - b.priority));
    return g;
  }, [providers]);

  const patch = (key: string, body: any) => {
    setProviders((prev) => prev.map((p) => (p.key === key ? { ...p, ...body } : p)));
    updateProvider(key, body, () => load());
  };

  const setMode = (p: any, mode: string) => patch(p.key, { mode, enabled: true });
  const toggleEnabled = (p: any) => patch(p.key, { enabled: !p.enabled });
  const runTest = (p: any) => testProvider(p.key, () => load());

  const setPriority = (category: string, primaryKey: string) => {
    (byCategory[category] || []).forEach((p, i) => {
      const pr = p.key === primaryKey ? 0 : i + 1;
      if (p.priority !== pr) updateProvider(p.key, { priority: pr });
    });
    setTimeout(load, 400);
  };

  const warnings = providers.filter((p) => p.status === "test_mode" || p.status === "error");

  return (
    <div className="space-y-10">
      <h2 className="text-c20 font-MontserratSemiBold text-161616">Integrations</h2>

      {ORDER.filter((c) => byCategory[c]?.length).map((category) => {
        const meta = CATEGORY_META[category];
        const list = byCategory[category];
        const testModeProvider = list.find((p) => p.status === "test_mode");
        const errorProvider = list.find((p) => p.status === "error");
        return (
          <div key={category}>
            <h3 className="text-c16 font-MontserratSemiBold text-161616">{meta.title}</h3>
            {meta.note && <p className="text-c12 text-000000/50 mt-0.5">{meta.note}</p>}

            {category === "verification" && (
              <div className="flex items-center justify-between py-4 mt-2 border-b border-000000/6">
                <div>
                  <p className="text-c14 text-161616">Use manual verification</p>
                  <p className="text-c12 text-000000/50">Switch to manual verification for all requests.</p>
                </div>
                <ToggleSwitch checked={!!flags.use_manual_verification}
                  onChange={() => { const v = !flags.use_manual_verification; setFlags({ ...flags, use_manual_verification: v }); updateFlags({ use_manual_verification: v }); }} />
              </div>
            )}

            {testModeProvider && (
              <div className="flex items-center gap-2 bg-[#fef8ed] text-[#b7791f] text-c13 px-4 py-2.5 rounded-lg mt-3">
                <AlertTriangle className="w-4 h-4" /> {testModeProvider.name} is in test mode.
              </div>
            )}
            {errorProvider && (
              <div className="flex items-center gap-2 bg-[#fdeaea] text-[#CA0202] text-c13 px-4 py-2.5 rounded-lg mt-3">
                <AlertTriangle className="w-4 h-4" /> {errorProvider.name} is currently not connected.
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-000000/5 mt-3">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="bg-[#7b5bd6]">
                    <th className={thCls}>Provider</th>
                    <th className={`${thCls} text-right pr-6`}>Status</th>
                    <th className={thCls}></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.key} className="border-t border-000000/5">
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          {PROVIDER_ICONS[p.key] && (
                            <img src={PROVIDER_ICONS[p.key]} alt="" className="w-7 h-7 object-contain flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-MontserratMedium">{p.name}</div>
                            {p.description && <div className="text-c12 text-000000/45">{p.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className={`${tdCls} text-right pr-6`}><StatusBadge status={p.status} /></td>
                      <td className={tdCls}>
                        <div className="flex items-center justify-end gap-2.5">
                          {(p.status === "error" || p.status === "disconnected") ? (
                            <button onClick={() => runTest(p)}
                              className="px-4 py-1.5 rounded-lg border border-ff715b text-ff715b text-c12 font-MontserratMedium hover:bg-ff715b/5">
                              Test API
                            </button>
                          ) : (
                            <>
                              <button onClick={() => runTest(p)} title="Test connection"
                                className="p-1.5 rounded-lg text-000000/35 hover:text-6a0dad hover:bg-000000/5">
                                <Activity className="w-4 h-4" />
                              </button>
                              {p.supports_mode ? (
                                <ModeToggle mode={p.mode} onPick={(m) => setMode(p, m)} />
                              ) : (
                                <ToggleSwitch checked={!!p.enabled} onChange={() => toggleEnabled(p)} />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {category === "payment" && list.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-c14 text-161616">Priority selection</p>
                  <p className="text-c12 text-000000/50">What integration takes priority.</p>
                </div>
                <select
                  value={(list.find((p) => p.priority === 0) || list[0])?.key}
                  onChange={(e) => setPriority(category, e.target.value)}
                  className="h-11 px-4 rounded-xl border border-000000/10 text-c14 bg-[#f4f4f6] outline-none">
                  {list.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
