"use client";

import { Check } from "lucide-react";
import type { PermissionAction, PermissionMatrix } from "@/types/admin";
import { PERMISSION_ACTIONS, PERMISSION_CATEGORIES } from "./permissionCategories";

interface PermissionMatrixEditorProps {
  matrix: PermissionMatrix;
  onToggle?: (category: (typeof PERMISSION_CATEGORIES)[number]["key"], action: PermissionAction) => void;
  readOnly?: boolean;
}

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  modify: "Modify",
  delete: "Delete",
};

export default function PermissionMatrixEditor({
  matrix,
  onToggle,
  readOnly = false,
}: PermissionMatrixEditorProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[420px]">
        <thead>
          <tr className="text-xs text-gray-400 font-MontserratBold h-11">
            <th className="py-2 pr-4 font-bold w-32">Permissions</th>
            {PERMISSION_ACTIONS.map((action) => (
              <th key={action} className="py-2 px-3 font-bold text-center">
                {ACTION_LABELS[action]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {PERMISSION_CATEGORIES.map(({ key, label }) => (
            <tr key={key} className="h-13">
              <td className="py-3 pr-4 text-sm text-[#161616] font-MontserratMedium">{label}</td>
              {PERMISSION_ACTIONS.map((action) => {
                const checked = !!matrix[key]?.[action];
                return (
                  <td key={action} className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => onToggle?.(key, action)}
                      aria-pressed={checked}
                      aria-label={`${label} — ${ACTION_LABELS[action]}`}
                      className={`inline-flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${
                        checked
                          ? readOnly
                            ? "bg-gray-200 border-gray-300 text-gray-400"
                            : "bg-[#FF715B] border-[#FF715B] text-white"
                          : "bg-white border-gray-300"
                      } ${readOnly ? "cursor-default" : "cursor-pointer hover:border-[#FF715B]"}`}
                    >
                      {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
