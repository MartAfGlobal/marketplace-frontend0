"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import { Button } from "@/components/ui/Button/Button";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import RolesTable from "@/components/admin-components/roles/RolesTable";
import RoleDetailModal from "@/components/admin-components/roles/RoleDetailModal";
import CreateRoleModal from "@/components/admin-components/roles/CreateRoleModal";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import type { AdminRoleListItem } from "@/types/admin";

const PAGE_SIZE = 20;

export default function RolesAndPermissionsPage() {
  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailRoleId, setDetailRoleId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const token = useSelector((state: RootState) => state.token?.token);
  const { adminRoles, totalCount, summary } = useSelector((state: RootState) => state.adminRoles);
  const { fetchAdminRoles, duplicateAdminRole, deleteAdminRole, exportAdminRoles } = AdminDetails();
  const { can } = useAdminAccess();
  const canCreate = can("STAFF", "create");
  const canModify = can("STAFF", "modify");
  const canDelete = can("STAFF", "delete");

  // Filter options: how sensitive the role is, then whether it is in use. Both go to the
  // server (as ?access_level= / ?status=), like search, so filters and pages agree.
  const LEVEL_FILTERS: Record<string, string> = { Restricted: "RESTRICTED", High: "HIGH", Standard: "STANDARD" };
  const STATUS_FILTERS: Record<string, string> = { Active: "ACTIVE", Suspended: "SUSPENDED" };
  const listParams = () => ({
    search,
    access_level: filters.filter((f) => LEVEL_FILTERS[f]).map((f) => LEVEL_FILTERS[f]).join(","),
    status: filters.filter((f) => STATUS_FILTERS[f]).map((f) => STATUS_FILTERS[f]).join(","),
  });

  const refetch = () => {
    setListLoading(true);
    fetchAdminRoles({ page, ...listParams() }, () => setListLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchVal.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchVal]);

  useEffect(() => {
    if (!token) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, filters]);

  // Rows come back already filtered and paged by the server.
  const filteredRoles = adminRoles;

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    const allSelected = filteredRoles.length > 0 && filteredRoles.every((r) => selectedIds.includes(r.id));
    setSelectedIds(allSelected ? [] : filteredRoles.map((r) => r.id));
  };

  const handleDuplicate = (role: AdminRoleListItem) => {
    duplicateAdminRole(role.id, () => {
      toast.success(`Duplicated "${role.name}".`);
      refetch();
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    deleteAdminRole(
      deleteTarget.id,
      () => {
        setDeleting(false);
        setDeleteTarget(null);
        refetch();
      },
      () => setDeleting(false),
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Roles & Permissions</h1>
          {canCreate && (
          <div className="w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => setCreateModalOpen(true)}
              className="h-10 px-5 flex items-center justify-center gap-2 rounded-xl text-xs font-MontserratBold w-full sm:w-auto bg-[#FF715B] text-white hover:bg-opacity-90 shadow-md shadow-[#FF715B]/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create new role</span>
            </Button>
          </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-000000/8 mb-8">
          <StatusFrame
            title="Total Roles"
            quantity={summary?.total_roles ?? 0}
            icon={
              <StatIcon tone="neutral">
                <Users className="w-4 h-4" />
              </StatIcon>
            }
          />
          <StatusFrame
            title="Active roles"
            quantity={summary?.active_roles ?? 0}
            icon={
              <StatIcon tone="positive">
                <CheckCircle2 className="w-4 h-4" />
              </StatIcon>
            }
          />
          <StatusFrame
            title="Total staffs assigned"
            quantity={summary?.total_staff_assigned ?? 0}
            icon={
              <StatIcon tone="positive">
                <CheckCircle2 className="w-4 h-4" />
              </StatIcon>
            }
          />
          <StatusFrame
            title="Unused roles"
            quantity={summary?.unused_roles ?? 0}
            icon={
              <StatIcon tone="negative">
                <XCircle className="w-4 h-4" />
              </StatIcon>
            }
          />
        </div>

        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Roles table</h2>

        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search roles by name or description..."
          hidePeriod
          filterOptions={[...Object.keys(LEVEL_FILTERS), ...Object.keys(STATUS_FILTERS)]}
          selectedFilters={filters}
          onFilterChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          onExportClick={() => exportAdminRoles(listParams())}
        />

        <RolesTable
          rows={filteredRoles}
          loading={listLoading}
          selectedIds={selectedIds}
          onToggleRow={handleToggleRow}
          onSelectAll={handleSelectAll}
          onEdit={(role) => setDetailRoleId(role.id)}
          onDuplicate={handleDuplicate}
          onDelete={setDeleteTarget}
          canModify={canModify}
          canCreate={canCreate}
          canDelete={canDelete}
        />

        {totalCount > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={Math.ceil(totalCount / PAGE_SIZE)} onPageChange={setPage} />
        )}
      </div>

      <CreateRoleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={refetch}
      />

      <RoleDetailModal
        isOpen={detailRoleId !== null}
        roleId={detailRoleId}
        onClose={() => setDetailRoleId(null)}
        onChanged={refetch}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete role"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onYes={handleDeleteConfirm}
        onNo={() => setDeleteTarget(null)}
        yesText="Delete"
        noText="Cancel"
        loading={deleting}
      />
    </div>
  );
}
