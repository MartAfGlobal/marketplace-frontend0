import type { PermissionCategoryKey, PermissionMatrix } from "@/types/admin";

// Fixed order/labels mirroring accounts.models.PermissionCategory — a
// code-defined enum on the backend (not admin-editable), so hardcoding it
// here avoids an extra round trip to /departments/permission-categories/
// just to render the matrix's row labels.
export const PERMISSION_CATEGORIES: { key: PermissionCategoryKey; label: string }[] = [
  { key: "USERS", label: "Users" },
  { key: "VERIFICATIONS", label: "Verifications" },
  { key: "PRODUCTS", label: "Products" },
  { key: "ORDERS", label: "Orders" },
  { key: "SUPPORT", label: "Support" },
  { key: "FINANCES", label: "Finances" },
  { key: "REPORTS", label: "Reports" },
  { key: "STAFF", label: "Staff" },
];

export const PERMISSION_ACTIONS = ["view", "create", "modify", "delete"] as const;

export function emptyPermissionMatrix(): PermissionMatrix {
  return PERMISSION_CATEGORIES.reduce((matrix, { key }) => {
    matrix[key] = { view: false, create: false, modify: false, delete: false };
    return matrix;
  }, {} as PermissionMatrix);
}
