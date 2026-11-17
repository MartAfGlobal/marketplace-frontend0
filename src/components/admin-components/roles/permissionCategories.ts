import type { PermissionAction, PermissionCategoryKey, PermissionMatrix } from "@/types/admin";

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

export const PERMISSION_ACTIONS = ["view", "view_all", "create", "modify", "delete"] as const;

// Categories where "view_all" (see all records vs. only your own) is a real
// choice. Only SUPPORT today — ticket queue visibility. Everywhere else the
// editor renders the view_all cell as N/A so the grid stays rectangular
// without implying a capability that does nothing.
export const VIEW_ALL_CATEGORIES: ReadonlySet<PermissionCategoryKey> = new Set<PermissionCategoryKey>([
  "SUPPORT",
]);

export function emptyPermissionMatrix(): PermissionMatrix {
  return PERMISSION_CATEGORIES.reduce((matrix, { key }) => {
    matrix[key] = { view: false, view_all: false, create: false, modify: false, delete: false };
    return matrix;
  }, {} as PermissionMatrix);
}

// Flip one (category, action) and return a new matrix, keeping the
// view_all ⟹ view invariant (the backend enforces the same rule on save):
//   - granting view_all also grants view (you must be able to reach the list)
//   - revoking view also revokes view_all (can't see all without view)
export function togglePermission(
  matrix: PermissionMatrix,
  category: PermissionCategoryKey,
  action: PermissionAction
): PermissionMatrix {
  const current = matrix[category];
  const next = { ...current, [action]: !current[action] };

  if (action === "view_all" && next.view_all) {
    next.view = true;
  } else if (action === "view" && !next.view) {
    next.view_all = false;
  }

  return { ...matrix, [category]: next };
}
