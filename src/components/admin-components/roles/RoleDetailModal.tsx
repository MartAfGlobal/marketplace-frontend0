"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, Pencil, PauseCircle, PlayCircle, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Button } from "@/components/ui/Button/Button";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import PermissionMatrixEditor from "./PermissionMatrixEditor";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type {
  AccessLevel,
  AdminRoleDetail,
  AdminRoleStaffAssignedItem,
  PermissionAction,
  PermissionCategoryKey,
  PermissionMatrix,
} from "@/types/admin";
import { emptyPermissionMatrix } from "./permissionCategories";

type Tab = "Details" | "Permissions" | "Staff assigned";

interface RoleDetailModalProps {
  isOpen: boolean;
  roleId: number | null;
  onClose: () => void;
  onChanged: () => void;
}

const ACCESS_LEVEL_STYLES: Record<AccessLevel, string> = {
  RESTRICTED: "text-[#f44336] bg-[#f44336]/10",
  HIGH: "text-[#FFAC06] bg-[#FFAC06]/10",
  STANDARD: "text-[#4d7cfe] bg-[#4d7cfe]/10",
};

const STAFF_PAGE_SIZE = 20;

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RoleDetailModal({ isOpen, roleId, onClose, onChanged }: RoleDetailModalProps) {
  const [role, setRole] = useState<AdminRoleDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [matrix, setMatrix] = useState<PermissionMatrix>(emptyPermissionMatrix());
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { can } = useAdminAccess();
  const canModify = can("STAFF", "modify");
  const canDelete = can("STAFF", "delete");

  const [staffRows, setStaffRows] = useState<AdminRoleStaffAssignedItem[]>([]);
  const [staffTotal, setStaffTotal] = useState(0);
  const [staffPage, setStaffPage] = useState(1);
  const [staffLoading, setStaffLoading] = useState(false);

  const {
    fetchAdminRoleById,
    updateAdminRolePermissions,
    suspendAdminRole,
    reactivateAdminRole,
    deleteAdminRole,
    fetchAdminRoleStaffAssigned,
  } = AdminDetails();

  const loadDetail = () => {
    if (!roleId) return;
    setDetailLoading(true);
    fetchAdminRoleById(roleId, (data: AdminRoleDetail) => {
      setRole(data);
      setMatrix(data.permissions);
      setDetailLoading(false);
    });
  };

  useEffect(() => {
    if (!isOpen || !roleId) return;
    setActiveTab("Details");
    setEditingPermissions(false);
    setActionMenuOpen(false);
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, roleId]);

  useEffect(() => {
    if (!isOpen || !roleId || activeTab !== "Staff assigned") return;
    setStaffLoading(true);
    fetchAdminRoleStaffAssigned(roleId, { page: staffPage }, (data) => {
      setStaffRows(data?.results ?? []);
      setStaffTotal(data?.count ?? 0);
      setStaffLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, roleId, activeTab, staffPage]);

  const handleTogglePermission = (category: PermissionCategoryKey, action: PermissionAction) => {
    setMatrix((prev) => ({
      ...prev,
      [category]: { ...prev[category], [action]: !prev[category][action] },
    }));
  };

  const handleSavePermissions = () => {
    if (!roleId) return;
    setSavingPermissions(true);
    updateAdminRolePermissions(
      roleId,
      matrix,
      (data: AdminRoleDetail) => {
        setSavingPermissions(false);
        setEditingPermissions(false);
        setRole(data);
        setMatrix(data.permissions);
        toast.success("Permissions updated.");
        onChanged();
      },
      () => setSavingPermissions(false),
    );
  };

  const handleSuspendToggle = () => {
    if (!roleId || !role) return;
    setBusy(true);
    const action = role.status === "ACTIVE" ? suspendAdminRole : reactivateAdminRole;
    action(
      roleId,
      (data: AdminRoleDetail) => {
        setBusy(false);
        setRole(data);
        onChanged();
      },
      () => setBusy(false),
    );
  };

  const handleDelete = () => {
    if (!roleId) return;
    setBusy(true);
    deleteAdminRole(
      roleId,
      () => {
        setBusy(false);
        setDeleteConfirmOpen(false);
        onChanged();
        onClose();
      },
      () => setBusy(false),
    );
  };

  return (
    <>
    <DrawerWrapper isOpen={isOpen} onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="overflow-y-auto">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-MontserratBold text-[#161616]">{role?.name ?? "Role"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!editingPermissions && (canModify || canDelete) && (
            <div className="relative mb-6 w-fit">
              <Button
                variant="primary"
                onClick={() => setActionMenuOpen((prev) => !prev)}
                className="h-10 px-4 flex items-center gap-2 rounded-xl text-xs font-MontserratBold w-fit bg-[#FF715B] text-white"
              >
                Update permissions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${actionMenuOpen ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence>
                {actionMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-12 w-48 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-30 py-2 flex flex-col text-sm font-MontserratMedium overflow-hidden"
                  >
                    {canModify && (<>
                    <button
                      onClick={() => {
                        setActionMenuOpen(false);
                        setActiveTab("Permissions");
                        setEditingPermissions(true);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-[#FF715B] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" /> Update permissions
                    </button>
                    <button
                      onClick={() => {
                        setActionMenuOpen(false);
                        handleSuspendToggle();
                      }}
                      disabled={busy || role?.role_type === "SYSTEM"}
                      title={role?.role_type === "SYSTEM" ? "System roles can't be suspended" : undefined}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-[#FFAC06] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {role?.status === "ACTIVE" ? (
                        <>
                          <PauseCircle className="w-4 h-4" /> Suspend role
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" /> Reactivate role
                        </>
                      )}
                    </button>
                    </>)}
                    {canDelete && (
                    <button
                      onClick={() => {
                        setActionMenuOpen(false);
                        setDeleteConfirmOpen(true);
                      }}
                      disabled={role?.role_type === "SYSTEM"}
                      title={role?.role_type === "SYSTEM" ? "System roles can't be deleted" : undefined}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-red-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" /> Delete role
                    </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
            {(["Details", "Permissions", "Staff assigned"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (editingPermissions) return;
                  setActiveTab(tab);
                }}
                disabled={editingPermissions}
                className={`pb-3 text-sm font-MontserratSemiBold transition-colors relative disabled:cursor-not-allowed disabled:opacity-40 ${
                  activeTab === tab ? "text-[#FF715B]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#FF715B] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {detailLoading || !role ? (
            <div className="py-16 text-center text-xs text-gray-400 font-MontserratMedium">
              Loading role...
            </div>
          ) : (
            <>
              {activeTab === "Details" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Description</p>
                    <p className="text-sm text-[#161616] font-MontserratMedium">{role.description || "—"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Status</p>
                      <span
                        className={`inline-block text-[10px] font-MontserratBold px-2.5 py-1 rounded-full uppercase ${
                          role.status === "ACTIVE" ? "text-[#2ea37d] bg-[#2ea37d]/10" : "text-[#f44336] bg-[#f44336]/10"
                        }`}
                      >
                        {role.status_display}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Access level</p>
                      <span
                        className={`inline-block text-[10px] font-MontserratBold px-2.5 py-1 rounded-full uppercase ${ACCESS_LEVEL_STYLES[role.access_level]}`}
                      >
                        {role.access_level_display}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Role type</p>
                      <p className="text-sm text-[#161616] font-MontserratMedium">{role.role_type_display}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Staff assigned</p>
                      <p className="text-sm text-[#FF715B] font-MontserratBold">{role.assigned_staff}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Date created</p>
                      <p className="text-sm text-[#161616] font-MontserratMedium">{formatDateTime(role.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Created by</p>
                      <p className="text-sm text-[#161616] font-MontserratMedium">{role.created_by_email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Last updated</p>
                      <p className="text-sm text-[#161616] font-MontserratMedium">{formatDateTime(role.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-MontserratMedium mb-1">Updated by</p>
                      <p className="text-sm text-[#161616] font-MontserratMedium">{role.updated_by_email || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-MontserratMedium mb-2">Access areas</p>
                    <div className="flex flex-wrap gap-2">
                      {role.access_areas.length > 0 ? (
                        role.access_areas.map((area) => (
                          <span
                            key={area}
                            className="text-[10px] font-MontserratMedium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500"
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-MontserratMedium">No access granted yet.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Permissions" && (
                <div>
                  <PermissionMatrixEditor
                    matrix={matrix}
                    onToggle={editingPermissions ? handleTogglePermission : undefined}
                    readOnly={!editingPermissions}
                  />
                  {editingPermissions && (
                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingPermissions(false);
                          setMatrix(role.permissions);
                        }}
                        className="w-fit px-5 h-10"
                        disabled={savingPermissions}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePermissions}
                        disabled={savingPermissions}
                        className="w-fit px-5 h-10"
                      >
                        {savingPermissions ? "Saving..." : "Save changes"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Staff assigned" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        disabled
                        placeholder="Search staff assigned to this role"
                        className="h-9 w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-3 text-xs text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                      <thead>
                        <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-MontserratBold uppercase tracking-wider h-10">
                          <th className="py-2 px-3 font-bold">Date added</th>
                          <th className="py-2 px-3 font-bold">Name</th>
                          <th className="py-2 px-3 font-bold">Status</th>
                          <th className="py-2 px-3 font-bold">Last active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm text-gray-700 font-MontserratMedium">
                        {staffLoading ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                              Loading...
                            </td>
                          </tr>
                        ) : staffRows.length > 0 ? (
                          staffRows.map((row) => (
                            <tr key={row.user_id}>
                              <td className="py-2.5 px-3 text-gray-400">{formatDateTime(row.date_added)}</td>
                              <td className="py-2.5 px-3 text-[#161616] font-MontserratSemiBold">{row.name}</td>
                              <td className="py-2.5 px-3 text-gray-500">{row.status ?? "—"}</td>
                              <td className="py-2.5 px-3 text-gray-400">{formatDateTime(row.last_active)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                              No staff hold this role yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {staffTotal > STAFF_PAGE_SIZE && (
                    <Pagination
                      currentPage={staffPage}
                      totalPages={Math.ceil(staffTotal / STAFF_PAGE_SIZE)}
                      onPageChange={setStaffPage}
                    />
                  )}
                </div>
              )}
            </>
          )}
      </div>
    </DrawerWrapper>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete role"
        description={`Are you sure you want to delete "${role?.name}"? This cannot be undone.`}
        onYes={handleDelete}
        onNo={() => setDeleteConfirmOpen(false)}
        yesText="Delete"
        noText="Cancel"
        loading={busy}
      />
    </>
  );
}
