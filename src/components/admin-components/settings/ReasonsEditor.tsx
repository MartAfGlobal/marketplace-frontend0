"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Check, X, Trash2, Plus } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { PermissionCategoryKey } from "@/types/admin";

interface Reason {
  id: string;
  code: string;
  title: string;
  category: string;
  category_display: string;
  is_active: boolean;
  requires_additional_info: boolean;
}

type ReasonGroup = "cancellation" | "account" | "product" | "verification" | "refund";

const GROUPS: { key: ReasonGroup; label: string; category: PermissionCategoryKey; categoryOptions?: { value: string; label: string }[] }[] = [
  { key: "cancellation", label: "Order cancellation", category: "ORDERS" },
  {
    key: "account",
    label: "Accounts",
    category: "USERS",
    categoryOptions: [
      { value: "BUYER_SUSPENSION", label: "Buyer/Seller suspension" },
      { value: "ACCOUNT_DELETION", label: "Account deletion" },
      { value: "SECURITY_LOGOUT", label: "Security logout" },
      { value: "CUSTOMER_DEACTIVATION", label: "Customer deactivation" },
    ],
  },
  {
    key: "product",
    label: "Products",
    category: "PRODUCTS",
    categoryOptions: [
      { value: "PRODUCT_REJECTION", label: "Product rejection" },
      { value: "PRODUCT_SUSPENSION", label: "Product suspension" },
    ],
  },
  { key: "verification", label: "Verification", category: "VERIFICATIONS" },
  { key: "refund", label: "Returns", category: "FINANCES" },
];

export default function ReasonsEditor() {
  const { can } = useAdminAccess();
  const { fetchReasons, createReason, updateReason, deleteReason } = AdminSettingsDetails();
  const allReasons = useSelector((state: RootState) => state.adminSettings.reasons);

  const visibleGroups = GROUPS.filter((g) => can(g.category, "view"));
  const [activeGroup, setActiveGroup] = useState<ReasonGroup | null>(visibleGroups[0]?.key ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Reason | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const group = GROUPS.find((g) => g.key === activeGroup);
  const canModify = group ? can(group.category, "modify") : false;

  useEffect(() => {
    if (activeGroup) fetchReasons(activeGroup as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup]);

  useEffect(() => {
    if (group?.categoryOptions?.length) setNewCategory(group.categoryOptions[0].value);
  }, [group]);

  if (visibleGroups.length === 0) return null;

  const reasons = (activeGroup ? allReasons[activeGroup] : []) || [];
  const grouped = reasons.reduce<Record<string, Reason[]>>((acc, r) => {
    acc[r.category_display] = acc[r.category_display] || [];
    acc[r.category_display].push(r);
    return acc;
  }, {});

  const refresh = () => activeGroup && fetchReasons(activeGroup as any);

  const startEdit = (r: Reason) => {
    setEditingId(r.id);
    setDraftTitle(r.title);
  };

  const saveEdit = (r: Reason) => {
    if (!activeGroup) return;
    if (draftTitle.trim() && draftTitle !== r.title) {
      updateReason(activeGroup as any, r.id, { title: draftTitle.trim() }, refresh);
    }
    setEditingId(null);
  };

  const toggleActive = (r: Reason) => {
    if (!activeGroup) return;
    updateReason(activeGroup as any, r.id, { is_active: !r.is_active }, refresh);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || !activeGroup) return;
    setDeleting(true);
    deleteReason(
      activeGroup as any,
      deleteTarget.id,
      () => {
        setDeleting(false);
        setDeleteTarget(null);
        refresh();
      },
      () => setDeleting(false),
    );
  };

  const handleAdd = () => {
    if (!activeGroup || !newCode.trim() || !newTitle.trim()) return;
    const payload: Record<string, any> = {
      code: newCode.trim(),
      title: newTitle.trim(),
    };
    if (group?.categoryOptions) payload.category = newCategory;
    createReason(activeGroup as any, payload, () => {
      setNewCode("");
      setNewTitle("");
      setAdding(false);
      refresh();
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4">
      <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-1">Reasons &amp; lists</h3>
      <p className="text-c12 text-000000/50 mb-5 max-w-xl">
        The reason dropdowns shown across suspension, deletion, rejection and cancellation actions.
      </p>

      <div className="flex gap-2 border-b border-000000/4 mb-5 overflow-x-auto scrollbar-hide">
        {visibleGroups.map((g) => (
          <button
            key={g.key}
            onClick={() => {
              setActiveGroup(g.key);
              setAdding(false);
            }}
            className={`pb-3 px-1 text-c14 font-MontserratMedium whitespace-nowrap transition-colors ${
              activeGroup === g.key
                ? "text-6a0dad border-b-2 border-6a0dad"
                : "text-000000/50 hover:text-161616"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([categoryLabel, items]) => (
          <div key={categoryLabel}>
            {group?.categoryOptions && (
              <p className="text-c12 font-MontserratSemiBold text-000000/68 mb-2">{categoryLabel}</p>
            )}
            <div className="space-y-2">
              {items
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-000000/4 last:border-0"
                  >
                    {editingId === r.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          className="h-9 px-3 flex-1 rounded-c8 border border-efefef text-c14 outline-none focus:border-ff715b"
                        />
                        <button onClick={() => saveEdit(r)} className="text-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-000000/40">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className={`text-c14 ${r.is_active ? "text-161616" : "text-000000/30 line-through"}`}>
                          {r.title}
                        </p>
                        <p className="text-c10 text-000000/35">{r.code}</p>
                      </div>
                    )}

                    {canModify && editingId !== r.id && (
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={() => startEdit(r)} className="text-000000/40 hover:text-6a0dad">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(r)} className="text-000000/40 hover:text-[#CA0202]">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ToggleSwitch checked={r.is_active} onChange={() => toggleActive(r)} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

        {reasons.length === 0 && (
          <p className="text-c12 text-000000/40">No reasons in this list yet.</p>
        )}
      </div>

      {canModify && (
        <div className="mt-5 pt-5 border-t border-000000/4">
          {!adding ? (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-c12 font-MontserratMedium text-6a0dad"
            >
              <Plus className="w-3.5 h-3.5" />
              Add reason
            </button>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              {group?.categoryOptions && (
                <div className="w-full sm:w-48">
                  <label className="text-c10 text-000000/50 mb-1 block">List</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="h-11 px-3 w-full rounded-c8 border border-efefef text-c14 outline-none"
                  >
                    {group.categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex-1 min-w-[160px]">
                <label className="text-c10 text-000000/50 mb-1 block">Code</label>
                <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. WRONG_SIZE" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-c10 text-000000/50 mb-1 block">Title</label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Shown to the admin" />
              </div>
              <Button className="!w-auto px-5" onClick={handleAdd}>
                Add
              </Button>
              <Button variant="secondary" className="!w-auto px-5" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete reason"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This can't be undone.`}
        onYes={handleDeleteConfirm}
        onNo={() => setDeleteTarget(null)}
        yesText="Delete"
        noText="Cancel"
        loading={deleting}
      />
    </div>
  );
}
