"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { AdminIntegrationsDetails } from "@/helpers/admin/adminIntegrationsHelper";

const thCls = "text-c12 font-MontserratMedium text-white/90 text-left px-4 py-3";
const tdCls = "px-4 py-3 text-c14 text-161616";

function Check({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded-c4 border flex items-center justify-center ${
        checked ? "bg-ff715b border-ff715b" : "border-000000/25"
      }`}
    >
      {checked && <span className="text-white text-[11px] leading-none">✓</span>}
    </button>
  );
}

export default function NotificationsSettings() {
  const {
    fetchNotifConfig, updateNotifConfig, fetchNotifCategories, updateNotifCategory,
  } = AdminIntegrationsDetails();

  const [config, setConfig] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifConfig((d) => { setConfig(d); setDraft(d); });
    fetchNotifCategories(setCats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    setSaving(true);
    const changed: any = {};
    ["sender_name", "from_email", "reply_to_email", "sms_sender_id"].forEach((k) => {
      if (draft[k] !== config[k]) changed[k] = draft[k];
    });
    updateNotifConfig(changed, (d) => { setConfig(d); setDraft(d); setEditing(false); setSaving(false); });
  };

  const toggleCat = (cat: any, field: string) => {
    const next = !cat[field];
    setCats((prev) => prev.map((c) => (c.key === cat.key ? { ...c, [field]: next } : c)));
    updateNotifCategory(cat.key, { [field]: next });
  };

  const field = (k: string) => (editing ? draft[k] ?? "" : config?.[k] ?? "");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-c20 font-MontserratSemiBold text-161616">Notifications</h2>
      </div>

      {/* Email template / sender identity */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-c16 font-MontserratSemiBold text-161616">Email template</h3>
          {!editing ? (
            <button onClick={() => { setDraft(config); setEditing(true); }}
              className="flex items-center gap-1.5 text-c12 font-MontserratMedium text-ff715b hover:underline">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" className="!w-auto px-5" onClick={() => { setDraft(config); setEditing(false); }} disabled={saving}>Cancel</Button>
              <Button className="!w-auto px-5" onClick={save} loading={saving}>Save changes</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <Label className="text-c12 text-000000/60 mb-1.5 block">Sender name</Label>
            {editing ? <Input value={field("sender_name")} onChange={(e) => setDraft({ ...draft, sender_name: e.target.value })} />
              : <p className="text-c14 text-161616">{config?.sender_name || "—"}</p>}
          </div>
          <div>
            <Label className="text-c12 text-000000/60 mb-1.5 block">From email</Label>
            <p className="text-c14 text-000000/50">{config?.from_email || "Defaults to the support email"}</p>
          </div>
          <div>
            <Label className="text-c12 text-000000/60 mb-1.5 block">Reply-to email</Label>
            {editing ? <Input value={field("reply_to_email")} onChange={(e) => setDraft({ ...draft, reply_to_email: e.target.value })} />
              : <p className="text-c14 text-161616">{config?.reply_to_email || "—"}</p>}
            <p className="text-c10 text-000000/40 mt-1">Where email user replies go.</p>
          </div>
          <div>
            <Label className="text-c12 text-000000/60 mb-1.5 block">SMS sender ID</Label>
            {editing ? <Input maxLength={11} value={field("sms_sender_id")} onChange={(e) => setDraft({ ...draft, sms_sender_id: e.target.value })} />
              : <p className="text-c14 text-161616">{config?.sms_sender_id || "—"}</p>}
            <p className="text-c10 text-000000/40 mt-1">Name shown on OTP and SMS messages (max 11).</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-3">Categories</h3>
        <div className="overflow-x-auto rounded-xl border border-000000/5">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-[#7b5bd6]">
                <th className={thCls}>Category</th>
                <th className={`${thCls} text-center`}>Email</th>
                <th className={`${thCls} text-center`}>Push</th>
                <th className={`${thCls} text-center`}>SMS</th>
                <th className={`${thCls} text-center`}>Can users turn off</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <tr key={cat.key} className="border-t border-000000/5">
                  <td className={tdCls}>{cat.label}</td>
                  {["email", "push", "sms"].map((ch) => (
                    <td key={ch} className={`${tdCls} text-center`}>
                      <div className="flex justify-center"><Check checked={!!cat[ch]} onChange={() => toggleCat(cat, ch)} /></div>
                    </td>
                  ))}
                  <td className={`${tdCls} text-center`}>
                    <div className="flex justify-center"><ToggleSwitch checked={!!cat.user_can_disable} onChange={() => toggleCat(cat, "user_can_disable")} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
