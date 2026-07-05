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

interface VerificationRow {
  id: string;
  submissionDate: string;
  businessName: string;
  businessType: string;
  status: "Verified" | "Pending" | "Rejected";
  businessLocation: string;
  timeInQueue: string;
}

const mockData: VerificationRow[] = [
  {
    id: "V01",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Individual",
    status: "Verified",
    businessLocation: "Abuja",
    timeInQueue: "Completed",
  },
  {
    id: "V02",
    submissionDate: "2023-08-23",
    businessName: "Ekara Co.",
    businessType: "Registered",
    status: "Pending",
    businessLocation: "Lagos",
    timeInQueue: "1 hrs",
  },
  {
    id: "V03",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Individual",
    status: "Verified",
    businessLocation: "Anambra",
    timeInQueue: "Completed",
  },
  {
    id: "V04",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Registered",
    status: "Rejected",
    businessLocation: "Abia",
    timeInQueue: "5 hrs",
  },
  {
    id: "V05",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Registered",
    status: "Verified",
    businessLocation: "Osun",
    timeInQueue: "5 hrs",
  },
  {
    id: "V06",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Individual",
    status: "Pending",
    businessLocation: "Anambra",
    timeInQueue: "5 hrs",
  },
  {
    id: "V07",
    submissionDate: "2023-08-23",
    businessName: "Ekara Co.",
    businessType: "Individual",
    status: "Verified",
    businessLocation: "Ogun",
    timeInQueue: "Completed",
  },
  {
    id: "V08",
    submissionDate: "2023-08-23",
    businessName: "Isolated PLC",
    businessType: "Individual",
    status: "Pending",
    businessLocation: "Ekiti",
    timeInQueue: "5 hrs",
  },
  {
    id: "V09",
    submissionDate: "2023-08-23",
    businessName: "Emeka & sons",
    businessType: "Individual",
    status: "Rejected",
    businessLocation: "Anambra",
    timeInQueue: "5 hrs",
  },
  {
    id: "V10",
    submissionDate: "2023-08-23",
    businessName: "Ankara Co.",
    businessType: "Registered",
    status: "Verified",
    businessLocation: "Anambra",
    timeInQueue: "Completed",
  },
];

export default function AdminVerificationsPage() {
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<VerificationRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = searchVal.trim().toLowerCase();

    const filteredData = mockData.filter((item) => {
      const haystack = [
        item.businessName,
        item.businessType,
        item.status,
        item.businessLocation,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    const pageSize = 10;
    const start = (currentPage - 1) * pageSize;
    const pagedData = filteredData.slice(start, start + pageSize);

    setTimeout(() => {
      setRows(pagedData);
      setTotalCount(filteredData.length);
      setLoading(false);
    }, 300);
  }, [currentPage, searchVal]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/admin/verifications/${id}`);
  };

  const handleSelectAll = () => {
    if (rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))) {
      setSelectedIds(
        selectedIds.filter((id) => !rows.some((r) => r.id === id)),
      );
    } else {
      const newIds = new Set(selectedIds);
      rows.forEach((row) => newIds.add(row.id));
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
            quantity={500}
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
        rows={rows}
        selectedIds={selectedIds}
        activeRowId={activeRowId}
        loading={loading}
        onSelectAll={handleSelectAll}
        onToggleRow={handleToggleRow}
        onRowClick={handleRowClick}
        onSetActiveRowId={setActiveRowId}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / 10)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
