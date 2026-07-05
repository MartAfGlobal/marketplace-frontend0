"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import StatusFrame from "@/components/admin-components/users/status-frame";
import BuyersTable from "@/components/admin-components/users/BuyersTable";
import SellersTable from "@/components/admin-components/users/SellersTable";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import suspendedUserIcon from "@/assets/admin/suspend.svg";

interface UserRow {
  id: string;
  name?: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  totalOrders: number;
  repeatRate?: string;
  state: string;
  date: string;
  disputes?: number;
  totalProducts?: number;
  kycStatus?: "pending" | "verified" | "rejected";
  businessType?: "individual" | "registered";
}

const sellerMockData: UserRow[] = Array.from(
  { length: 20 },
  (_, i) => {
    const id = `S-${String(i + 1).padStart(3, "0")}`;

    return {
      id,
      name: `Seller ${id}`,
      email: `seller${id.toLowerCase()}@example.com`,
      phone: `+234-800000${String(i + 1).padStart(4, "0")}`,
      status: i % 2 === 0 ? "Active" : "Inactive",
      totalProducts: Math.floor(Math.random() * 500),
      totalOrders: Math.floor(Math.random() * 1000),
      businessType: i % 2 === 0 ? "individual" : "registered",
      state: ["Lagos", "Abuja", "Kano", "Rivers"][i % 4],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toLocaleDateString("en-GB"),
      kycStatus: ["pending", "verified", "rejected"][
        i % 3
      ] as UserRow["kycStatus"],
    };
  }
);


const mockData: UserRow[] = Array.from({ length: 20 }, (_, i) => {
  const id = `U-${String(i + 1).padStart(3, "0")}`;
  return {
    id,
    name: `User ${id}`,
    email: `user${id.toLowerCase()}@example.com`,
    phone: `+234-800000${String(i + 1).padStart(4, "0")}`,
    status: i % 2 === 0 ? "Active" : "Inactive",
    totalOrders: Math.floor(Math.random() * 100),
    repeatRate: `${Math.floor(Math.random() * 100)}%`,
    state: ["Lagos", "Abuja", "Kano", "Rivers"][i % 4],
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toLocaleDateString("en-GB"),
    disputes: Math.floor(Math.random() * 10),
  };
});



export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  

  // Default to buyers if no type param exists
  const type = searchParams.get("type") || "buyers";
  const isBuyers = type === "buyers";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.token?.token);
  const loading = false;

  // Reset page when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchVal]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const query = searchVal.trim().toLowerCase();
    const sourceData = isBuyers ? mockData : sellerMockData;

    const filteredData = sourceData.filter((item) => {
      const haystack = [item.id, item.name, item.email, item.phone, item.state, item.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    const pageSize = 20;
    const start = (currentPage - 1) * pageSize;
    const pagedData = filteredData.slice(start, start + pageSize);

    const mapped = pagedData.map((item) => ({
      id: item.id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      phone: item.phone || "N/A",
      status: item.status,
      totalOrders: item.totalOrders || 0,
      repeatRate: item.repeatRate || "0%",
      state: item.state || "N/A",
      date: item.date || "N/A",
      disputes: item.disputes,
      totalProducts: item.totalProducts,
      kycStatus: item.kycStatus,
    }));

    setRows(mapped);
    setTotalCount(filteredData.length);
  }, [isBuyers, currentPage, searchVal]);

  const handleRowClick = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}`);
  };

  const truncateText = (value: string | number | undefined, maxLength = 10) => {
    const text = String(value ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedUserIds((prev) => {
      const allVisibleIds = rows.map((row) => row.id);
      const allSelected = allVisibleIds.every((id) => prev.includes(id));

      return allSelected
        ? prev.filter((id) => !allVisibleIds.includes(id))
        : [...new Set([...prev, ...allVisibleIds])];
    });
  };

  return (
    <div className="space-y-8 bg-ffffff p-6 rounded-c16">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-c20 font-MontserratMedium py-2">
          {isBuyers ? "Buyers" : "Sellers"}
        </h1>
      </div>

      {/* Top Stats Graph Card (Reusable) */}
      <div className="justify-between flex items-center w-full">
        <StatusFrame
          title={isBuyers ? "Total buyers" : "Total sellers"}
          quantity={isBuyers ? totalCount : totalCount}
          icon={activeUserIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title={isBuyers ? "Active buyers" : "Active sellers"}
          quantity={isBuyers ? 200 : 200}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Inactive buyers" : "Inactive sellers"}
          quantity={isBuyers ? 250 : 250}
          icon={inActiveIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Suspended buyers" : "Suspended sellers"}
          quantity={isBuyers ? 50 : 50}
          icon={suspendedUserIcon}
          width={18}
          height={26}
        />
      </div>

      {/* Main Listing Section */}
      <div className="">
        <h2 className="text-base font-MontserratNormal text-000000 mb-6">
          {type === "buyers" ? "Buyer's" : "Seller's"} table
        </h2>

        {/* Filters Header (Reusable) */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search ${type} by ID, name or email...`}
          searchExpandable={true}
          filterOptions={["Date", "Status", "Country", "Quantity"]}
          onFilterChange={(filters) => console.log("Selected filters:", filters)}
        />

        {/* Data Table */}
        {isBuyers ? (
          <BuyersTable
            rows={rows}
            selectedUserIds={selectedUserIds}
            activeRowId={activeRowId}
            loading={loading}
            onSelectAll={toggleSelectAll}
            onToggleRow={toggleUserSelection}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            truncateText={truncateText}
          />
        ) : (
          <SellersTable
            rows={rows}
            selectedUserIds={selectedUserIds}
            activeRowId={activeRowId}
            loading={loading}
            onSelectAll={toggleSelectAll}
            onToggleRow={toggleUserSelection}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            truncateText={truncateText}
          />
        )}

        {/* Pagination Section */}
        {totalCount > 20 && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / 20)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
