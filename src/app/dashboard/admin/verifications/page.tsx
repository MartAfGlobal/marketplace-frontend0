"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import VerificationsTable from "@/components/admin-components/verifications/VerificationsTable";
import { BadgeCheck, Clock, XCircle, FileText } from "lucide-react";
import PageTitle from "@/components/admin-components/pagetitle";
import StatusFrame from "@/components/admin-components/users/status-frame";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import suspendedUserIcon from "@/assets/admin/suspend.svg";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";



export default function AdminVerificationsPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.token?.token);
  const kycDetails = useSelector((state: RootState) => state.adminKycDetails?.adminKycDetails ?? []);
  const apiTotalCount = useSelector((state: RootState) => state.adminKycDetails?.totalCount ?? 0);
  const { fetchAdminSellersKycList, loading } = AdminDetails();

  useEffect(() => {
    if (token) {
      fetchAdminSellersKycList(currentPage);
    }
  }, [token, currentPage]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/admin/verifications/${id}`);
  };

  const handleSelectAll = () => {
    if (kycDetails.length > 0 && kycDetails.every((row) => selectedIds.includes(String(row.id)))) {
      setSelectedIds(
        selectedIds.filter((id) => !kycDetails.some((r) => String(r.id) === id)),
      );
    } else {
      const newIds = new Set(selectedIds);
      kycDetails.forEach((row) => newIds.add(String(row.id)));
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full py-6 px-8 bg-ffffff">
      <PageTitle title="Verifications" />

      {/* Stats Section */}
      <div className="flex w-full items-center justify-between mt-4">
        <div className="justify-between flex items-center w-full">
          <StatusFrame
            title="Total Verifications"
            quantity={apiTotalCount}
            icon={activeUserIcon}
            width={26}
            height={22}
          />
          <StatusFrame
            title="Verified KYC"
            quantity={200}
            icon={activeIcon}
            width={26}
            height={26}
          />
          <StatusFrame
            title="Rejected KYC"
            quantity={250}
            icon={inActiveIcon}
            width={26}
            height={26}
          />
          <StatusFrame
            title="Suspended KYC"
            quantity={50}
            icon={suspendedUserIcon}
            width={18}
            height={26}
          />
        </div>
      </div>
     
      {/* Table Section */}
      <VerificationsTable
        rows={kycDetails}
        selectedIds={selectedIds}
        activeRowId={activeRowId}
        loading={loading}
        onSelectAll={handleSelectAll}
        onToggleRow={handleToggleRow}
        onRowClick={handleRowClick}
        onSetActiveRowId={setActiveRowId}
      />

      {/* Pagination */}
      {apiTotalCount > 20 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(apiTotalCount / 10)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
