"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, UserPlus, LogOut, Users, CheckCircle2, XCircle } from "lucide-react";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Button } from "@/components/ui/Button/Button";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import StatusFrame from "@/components/admin-components/users/status-frame";
import StatIcon from "@/components/admin-components/StatIcon";
import StaffActivityDonut from "@/components/admin-components/staff/StaffActivityDonut";
import StaffActivityLogCard from "@/components/admin-components/staff/StaffActivityLogCard";
import StaffTable from "@/components/admin-components/staff/StaffTable";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import InviteStaffModal from "@/components/ui/Modals/admin/InviteStaffModal";
import StaffReasonModal from "@/components/ui/Modals/admin/StaffReasonModal";
import type { AdminStaffListItem } from "@/types/admin";

const PAGE_SIZE = 20;

export default function AdminStaffPage() {
  const [searchVal, setSearchVal] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [bulkLogoutModalOpen, setBulkLogoutModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<AdminStaffListItem | null>(null);
  const [listLoading, setListLoading] = useState(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const { adminStaff, totalCount, summary, staffByRole, recentActivity } = useSelector(
    (state: RootState) => state.adminStaff,
  );

  const {
    fetchAdminStaffList,
    securityLogoutAdminStaffBulk,
    suspendAdminStaff,
    loading,
  } = AdminDetails();

  const refetch = () => {
    setListLoading(true);
    fetchAdminStaffList({ page }, () => setListLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    setListLoading(true);
    fetchAdminStaffList({ page }, () => setListLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  const query = searchVal.trim().toLowerCase();
  const filteredStaff = query
    ? adminStaff.filter((row) =>
        [row.full_name, row.email, row.role, row.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : adminStaff;

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    const allSelected = filteredStaff.length > 0 && filteredStaff.every((r) => selectedIds.includes(r.user_id));
    setSelectedIds(allSelected ? [] : filteredStaff.map((r) => r.user_id));
  };

  const handleBulkSecurityLogout = (reason: string) => {
    if (selectedIds.length === 0) return;
    securityLogoutAdminStaffBulk({ user_ids: selectedIds, reason }, () => {
      setBulkLogoutModalOpen(false);
      setSelectedIds([]);
    });
  };

  const handleSuspendConfirm = (reason: string) => {
    if (!suspendTarget) return;
    suspendAdminStaff(suspendTarget.user_id, { reason }, () => {
      setSuspendTarget(null);
      refetch();
    });
  };

  return (
    <div className="space-y-8">
      {/*
        One continuous card for the whole page — title, the Create New
        Staff action, the stat row, staff activity + activity log, and the
        staff table all live inside this single white panel.
      */}
      <div className="bg-white rounded-2xl p-6 border border-000000/4 animate-in fade-in duration-300">
        {/* Page Title & Create New Staff dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Staff Management</h1>
            <p className="text-c12 text-000000/44 font-MontserratNormal mt-0.5">Manage Staff access and roles</p>
          </div>

          <div className="relative w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => setCreateMenuOpen((prev) => !prev)}
              className="h-10 px-5 flex items-center justify-center gap-2 rounded-xl text-xs font-MontserratBold w-full sm:w-auto bg-[#FF715B] text-white hover:bg-opacity-90 shadow-md shadow-[#FF715B]/10 cursor-pointer"
            >
              <span>Create New Staff</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${createMenuOpen ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
              {createMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-48 rounded-c8 bg-white shadow-custom border border-000000/4 z-30 py-3 px-4 flex flex-col text-c12 font-MontserratNormal overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      setInviteModalOpen(true);
                    }}
                    className="w-full text-left py-2 flex items-center gap-3 text-[#ff715b] hover:text-[#ff715b]/80 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" /> Create New Staff
                  </button>
                  <button
                    onClick={() => {
                      setCreateMenuOpen(false);
                      setBulkLogoutModalOpen(true);
                    }}
                    disabled={selectedIds.length === 0}
                    title={selectedIds.length === 0 ? "Select at least one staff member first" : undefined}
                    className="w-full text-left py-2 flex items-center gap-3 text-000000/68 hover:text-000000 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" /> Security Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-000000/8 mb-8">
          <StatusFrame
            title="Total staff"
            quantity={summary?.total_staff ?? 0}
            icon={
              <StatIcon tone="neutral">
                <Users className="w-4 h-4" />
              </StatIcon>
            }
          />
          <StatusFrame
            title="Active staff"
            quantity={summary?.active_staff ?? 0}
            icon={
              <StatIcon tone="positive">
                <CheckCircle2 className="w-4 h-4" />
              </StatIcon>
            }
          />
          <StatusFrame
            title="Inactive staff"
            quantity={summary?.inactive_staff ?? 0}
            icon={
              <StatIcon tone="negative">
                <XCircle className="w-4 h-4" />
              </StatIcon>
            }
          />
        </div>

        {/* Staff activity + Activity log */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 mb-8">
          <StaffActivityDonut data={staffByRole} />
          <StaffActivityLogCard items={recentActivity} />
        </div>

        {/* Staff's table */}
        <div>
          <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Staff&apos;s table</h2>

          <AdminListHeader
            searchVal={searchVal}
            setSearchVal={setSearchVal}
            placeholder="Search staff members by name, email or role..."
          />

          <StaffTable
            rows={filteredStaff}
            loading={listLoading}
            selectedIds={selectedIds}
            onToggleRow={handleToggleRow}
            onSelectAll={handleSelectAll}
            onSuspendRow={setSuspendTarget}
          />

          {totalCount > PAGE_SIZE && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalCount / PAGE_SIZE)}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <InviteStaffModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={refetch}
      />

      <StaffReasonModal
        isOpen={bulkLogoutModalOpen}
        onClose={() => setBulkLogoutModalOpen(false)}
        onConfirm={handleBulkSecurityLogout}
        loading={loading}
        title="Reason for Security logout"
        confirmLabel="Confirm, Security logout"
      />

      <StaffReasonModal
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        loading={loading}
        title="Reason for suspension"
        confirmLabel="Confirm, suspend user"
      />
    </div>
  );
}
