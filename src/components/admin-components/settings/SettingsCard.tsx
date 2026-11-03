"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { ToggleSwitch } from "@/components/ui/seller-components/body-components/settings/sections/documents/shared/toggle-switch";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import type { PermissionCategoryKey } from "@/types/admin";

export type SettingsFieldType = "number" | "decimal" | "text" | "boolean" | "select";

export interface SettingsFieldSchema {
  key: string;
  label: string;
  type: SettingsFieldType;
  options?: { value: string; label: string }[];
  helpText?: string;
  step?: string;
  nullable?: boolean;
  min?: number;
}

interface SettingsCardProps {
  title: string;
  description?: string;
  category: PermissionCategoryKey;
  fields: SettingsFieldSchema[];
  data: Record<string, any> | null;
  loading?: boolean;
  onSave: (changed: Record<string, any>) => Promise<void> | void;
}

function displayValue(field: SettingsFieldSchema, value: any) {
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "boolean") return value ? "On" : "Off";
  if (field.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  return String(value);
}

export default function SettingsCard({
  title,
  description,
  category,
  fields,
  data,
  loading,
  onSave,
}: SettingsCardProps) {
  const { can } = useAdminAccess();
  const canView = can(category, "view");
  const canModify = can(category, "modify");

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  if (!canView) return null;

  const startEdit = () => {
    setDraft(data ?? {});
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(data ?? {});
    setEditing(false);
  };

  const handleSave = async () => {
    if (!data) return;
    const changed: Record<string, any> = {};
    for (const field of fields) {
      if (draft[field.key] !== data[field.key]) {
        changed[field.key] = draft[field.key];
      }
    }
    if (Object.keys(changed).length === 0) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(changed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const setField = (key: string, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-000000/4">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-c16 font-MontserratSemiBold text-161616">{title}</h3>
          {description && (
            <p className="text-c12 text-000000/50 mt-1 max-w-xl">{description}</p>
          )}
        </div>
        {canModify && !editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-c12 font-MontserratMedium text-6a0dad hover:underline flex-shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {!data && loading && (
        <p className="text-c12 text-000000/50">Loading…</p>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <Label className="text-c12 text-000000/60 mb-1.5 block">{field.label}</Label>

              {!editing && (
                <p className="text-c14 font-MontserratMedium text-161616">
                  {displayValue(field, data[field.key])}
                </p>
              )}

              {editing && field.type === "boolean" && (
                <ToggleSwitch
                  checked={!!draft[field.key]}
                  onChange={() => setField(field.key, !draft[field.key])}
                />
              )}

              {editing && field.type === "select" && (
                <select
                  value={draft[field.key] ?? ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="h-12 px-3.5 w-full rounded-c8 text-gray-700 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none md:text-sm"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {editing && (field.type === "number" || field.type === "decimal") && (
                <Input
                  type="number"
                  step={field.step ?? (field.type === "decimal" ? "0.0001" : "1")}
                  min={field.min}
                  value={draft[field.key] ?? ""}
                  placeholder={field.nullable ? "No limit" : undefined}
                  onChange={(e) =>
                    setField(
                      field.key,
                      e.target.value === "" ? (field.nullable ? null : 0) : e.target.value,
                    )
                  }
                />
              )}

              {editing && field.type === "text" && (
                <Input
                  type="text"
                  value={draft[field.key] ?? ""}
                  placeholder={field.nullable ? "Not restricted" : undefined}
                  onChange={(e) => setField(field.key, e.target.value)}
                />
              )}

              {field.helpText && (
                <p className="text-c10 text-000000/40 mt-1">{field.helpText}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" className="!w-auto px-6" onClick={cancelEdit} disabled={saving}>
            Cancel
          </Button>
          <Button className="!w-auto px-6" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
}
