"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { AdminSettingsDetails } from "@/helpers/admin/adminSettingsHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ChecklistItem {
  id: string;
  key: string;
  section_index: number;
  section_title: string;
  item_index: number;
  item_text: string;
  is_active: boolean;
}

export default function ChecklistEditor() {
  const { can } = useAdminAccess();
  const canModify = can("PRODUCTS", "modify");
  const { fetchChecklist, updateChecklistItem } = AdminSettingsDetails();
  const checklist = useSelector((state: RootState) => state.adminSettings.checklist) as ChecklistItem[];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    fetchChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    acc[item.section_title] = acc[item.section_title] || [];
    acc[item.section_title].push(item);
    return acc;
  }, {});

  const startEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setDraftText(item.item_text);
  };

  const saveEdit = (item: ChecklistItem) => {
    if (draftText.trim() && draftText !== item.item_text) {
      updateChecklistItem(item.id, { item_text: draftText.trim() }, () => fetchChecklist());
    }
    setEditingId(null);
  };

  const toggleActive = (item: ChecklistItem) => {
    updateChecklistItem(item.id, { is_active: !item.is_active }, () => fetchChecklist());
  };

  if (!can("PRODUCTS", "view")) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4">
      <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-1">
        Product review checklist
      </h3>
      <p className="text-c12 text-000000/50 mb-5 max-w-xl">
        The checklist admins use when approving or rejecting a product. Disabling an item removes it from new reviews without affecting past ones.
      </p>

      <div className="space-y-6">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section}>
            <p className="text-c12 font-MontserratSemiBold text-000000/68 mb-2">{section}</p>
            <div className="space-y-2">
              {items
                .sort((a, b) => a.item_index - b.item_index)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-000000/4 last:border-0"
                  >
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          className="h-9 px-3 flex-1 rounded-c8 border border-efefef text-c14 outline-none focus:border-ff715b"
                        />
                        <button onClick={() => saveEdit(item)} className="text-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-000000/40">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className={`text-c14 flex-1 ${item.is_active ? "text-161616" : "text-000000/30 line-through"}`}>
                        {item.item_text}
                      </p>
                    )}

                    {canModify && editingId !== item.id && (
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={() => startEdit(item)} className="text-000000/40 hover:text-6a0dad">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5">
                          <span className="text-c10 text-000000/40 w-10 text-right">
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                          <ToggleSwitch checked={item.is_active} onChange={() => toggleActive(item)} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
