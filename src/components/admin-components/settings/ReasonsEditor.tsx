"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Check, X, Trash2, Plus } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import type { PermissionCategoryKey } from "@/types/admin";

interface Reason {
  id: string;
  code: string;
  title: string;
  category: string;
  user_type: string;
  is_active: boolean;
  requires_additional_info: boolean;
}

type Tab = {
  label: string;
  group: "cancellation" | "account" | "refund" | "support";
  category: PermissionCategoryKey;
  reasonCategory?: string; // for groups that need an explicit category on create
  codePrefixHint?: boolean;
};

type Audience = { key: "buyer" | "seller" | "admin"; label: string; tabs: Tab[] };

const BUYER_SELLER_TABS = (): Tab[] => [
  { label: "Order cancellation", group: "cancellation", category: "ORDERS", codePrefixHint: true },
  { label: "Dispute/returns", group: "refund", category: "FINANCES" },
  { label: "Account", group: "account", category: "USERS", reasonCategory: "ACCOUNT_DELETION" },
];

const AUDIENCES: Audience[] = [
  { key: "buyer", label: "Buyers", tabs: BUYER_SELLER_TABS() },
  { key: "seller", label: "Sellers", tabs: BUYER_SELLER_TABS() },
  {
    key: "admin",
    label: "Admin",
    tabs: [
      { label: "Orders", group: "cancellation", category: "ORDERS", codePrefixHint: true },
      { label: "Dispute/returns", group: "refund", category: "FINANCES" },
      { label: "Support/tickets", group: "support", category: "SUPPORT", reasonCategory: "SUPPORT_TICKET" },
    ],
  },
];

export default function ReasonsEditor() {
  const { can } = useAdminAccess();
  const { fetchReasons, createReason, updateReason, deleteReason } = AdminSettingsDetails();

  // Reasons keyed by `${audience}:${group}` so each (audience, tab) has its own list.
  const [data, setData] = useState<Record<string, Reason[]>>({});
  const [activeTab, setActiveTab] = useState<Record<string, number>>({ buyer: 0, seller: 0, admin: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ reason: Reason; group: Tab["group"] } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const keyOf = (audience: string, group: string) => `${audience}:${group}`;

  const load = (audienceKey: string, tab: Tab) => {
    const k = keyOf(audienceKey, tab.group);
    fetchReasons(tab.group as any, { user_type: audienceKey }, (rows: Reason[]) => {
      // The endpoint filters by user_type server-side; guard client-side too.
      const filtered = rows.filter((r) => (r.user_type || "") === audienceKey || tab.group !== "cancellation");
      setData((d) => ({ ...d, [k]: filtered }));
    });
  };

  // Load the active tab for every audience the viewer can see.
  useEffect(() => {
    AUDIENCES.forEach((a) => {
      const tab = a.tabs[activeTab[a.key] ?? 0];
      if (tab && can(tab.category, "view")) load(a.key, tab);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const refresh = (audienceKey: string, tab: Tab) => load(audienceKey, tab);

  const startEdit = (r: Reason) => { setEditingId(r.id); setDraftTitle(r.title); };
  const saveEdit = (r: Reason, tab: Tab, audienceKey: string) => {
    if (draftTitle.trim() && draftTitle !== r.title) {
      updateReason(tab.group as any, r.id, { title: draftTitle.trim() }, () => refresh(audienceKey, tab));
    }
    setEditingId(null);
  };
  const toggleActive = (r: Reason, tab: Tab, audienceKey: string) =>
    updateReason(tab.group as any, r.id, { is_active: !r.is_active }, () => refresh(audienceKey, tab));

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const audienceKey = deleteTarget.reason.user_type || "admin";
    const tab = AUDIENCES.find((a) => a.key === audienceKey)?.tabs.find((t) => t.group === deleteTarget.group);
    setDeleting(true);
    deleteReason(deleteTarget.group as any, deleteTarget.reason.id, () => {
      setDeleting(false);
      setDeleteTarget(null);
      if (tab) refresh(audienceKey, tab);
    }, () => setDeleting(false));
  };

  const handleAdd = (audienceKey: string, tab: Tab) => {
    if (!newCode.trim() || !newTitle.trim()) return;
    const payload: Record<string, any> = {
      code: newCode.trim(),
      title: newTitle.trim(),
      user_type: audienceKey,
    };
    if (tab.reasonCategory) payload.category = tab.reasonCategory;
    createReason(tab.group as any, payload, () => {
      setNewCode(""); setNewTitle(""); setAddingKey(null);
      refresh(audienceKey, tab);
    });
  };

  const renderList = (audience: Audience, tab: Tab) => {
    const k = keyOf(audience.key, tab.group);
    const rows = (data[k] || []).slice().sort((a, b) => a.title.localeCompare(b.title));
    const canModify = can(tab.category, "modify");
    const isAdding = addingKey === k;

    return (
      <div>
        <div className="rounded-xl overflow-hidden border border-000000/5">
          <div className="grid grid-cols-[1fr_120px] bg-[#8b7bf0] text-white text-c14 px-5 py-3">
            <span>Reason</span>
            <span className="text-right">Status</span>
          </div>
          {rows.length === 0 && !isAdding && (
            <div className="px-5 py-4 text-c13 text-000000/40">No reasons in this list yet.</div>
          )}
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_120px] items-center px-5 py-3 border-t border-000000/5">
              {editingId === r.id ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)}
                    className="h-9 px-3 flex-1 rounded-c8 border border-efefef text-c14 outline-none focus:border-ff715b" />
                  <button onClick={() => saveEdit(r, tab, audience.key)} className="text-green-600"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="text-000000/40"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div>
                  <p className={`text-c14 ${r.is_active ? "text-161616" : "text-000000/30 line-through"}`}>{r.title}</p>
                  <p className="text-c10 text-000000/35">{r.code}</p>
                </div>
              )}
              {canModify && editingId !== r.id && (
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => startEdit(r)} className="text-000000/40 hover:text-6a0dad"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget({ reason: r, group: tab.group })} className="text-000000/40 hover:text-[#CA0202]"><Trash2 className="w-3.5 h-3.5" /></button>
                  <ToggleSwitch checked={r.is_active} onChange={() => toggleActive(r, tab, audience.key)} />
                </div>
              )}
            </div>
          ))}
          {isAdding && (
            <div className="px-5 py-3 border-t border-000000/5 flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[150px]">
                <label className="text-c10 text-000000/50 mb-1 block">Code</label>
                <Input value={newCode} onChange={(e) => setNewCode(e.target.value)}
                  placeholder={tab.codePrefixHint ? `${audience.key.toUpperCase()}_REASON` : "REASON_CODE"} />
                {tab.codePrefixHint && <p className="text-c10 text-000000/35 mt-1">Must start with BUYER_, SELLER_ or ADMIN_.</p>}
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="text-c10 text-000000/50 mb-1 block">Title</label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Shown in the dropdown" />
              </div>
              <Button className="!w-auto px-5" onClick={() => handleAdd(audience.key, tab)}>Add</Button>
              <Button variant="secondary" className="!w-auto px-5" onClick={() => setAddingKey(null)}>Cancel</Button>
            </div>
          )}
        </div>
        {canModify && !isAdding && (
          <button onClick={() => { setAddingKey(k); setNewCode(""); setNewTitle(""); }}
            className="mt-3 flex items-center gap-1.5 text-c13 font-MontserratMedium text-ff715b">
            <Plus className="w-4 h-4" /> Add reason
          </button>
        )}
      </div>
    );
  };

  const visibleAudiences = AUDIENCES.map((a) => ({
    ...a,
    tabs: a.tabs.filter((t) => can(t.category, "view")),
  })).filter((a) => a.tabs.length > 0);

  if (visibleAudiences.length === 0) return null;

  return (
    <div>
      <h2 className="text-c20 font-MontserratSemiBold text-161616 mb-6">Reasons &amp; lists</h2>

      <div className="space-y-10">
        {visibleAudiences.map((audience) => {
          const current = Math.min(activeTab[audience.key] ?? 0, audience.tabs.length - 1);
          const tab = audience.tabs[current];
          return (
            <div key={audience.key}>
              <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-3">{audience.label}</h3>
              <div className="flex gap-5 border-b border-000000/6 mb-4">
                {audience.tabs.map((t, i) => (
                  <button key={t.label} onClick={() => setActiveTab((s) => ({ ...s, [audience.key]: i }))}
                    className={`pb-2.5 text-c14 font-MontserratMedium whitespace-nowrap transition-colors ${
                      i === current ? "text-6a0dad border-b-2 border-6a0dad" : "text-000000/50 hover:text-161616"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              {renderList(audience, tab)}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete reason"
        description={`Are you sure you want to delete "${deleteTarget?.reason.title}"? This can't be undone.`}
        onYes={handleDeleteConfirm}
        onNo={() => setDeleteTarget(null)}
        yesText="Delete"
        noText="Cancel"
        loading={deleting}
      />
    </div>
  );
}
