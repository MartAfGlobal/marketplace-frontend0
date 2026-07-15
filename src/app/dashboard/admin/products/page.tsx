"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import StatusFrame from "@/components/admin-components/users/status-frame";
import ProductsTable, { ProductRow } from "@/components/admin-components/products/ProductsTable";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import suspendedUserIcon from "@/assets/admin/suspend.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") || "listings";
  const isListings = type === "listings";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.token?.token);
  const adminProducts = useSelector(
    (state: RootState) => state.adminProducts?.adminProducts ?? []
  );
  const apiTotalCount = useSelector(
    (state: RootState) => state.adminProducts?.totalCount ?? 0
  );
  const { fetchAdminSellersProductsList, loading } = AdminDetails();

  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchVal]);

  useEffect(() => {
    if (token) {
      fetchAdminSellersProductsList(currentPage);
    }
  }, [token, currentPage]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Client-side search filter over the current page results from Redux
  const PAGE_SIZE = 20;
  const query = searchVal.trim().toLowerCase();
  const filteredRows: ProductRow[] = adminProducts.filter((item) => {
    if (!query) return true;
    const haystack = [
      item.id,
      item.name,
      item.manufacturer_name,
      item.category?.name,
      item.stockcode,
      item.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const handleRowClick = (routeSuffix: string) => {
    router.push(`/dashboard/admin/products/listings/${routeSuffix}`);
  };

  const truncateText = (value: string | number | undefined, maxLength = 10) => {
    const text = String(value ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProductIds((prev) => {
      const allVisibleIds = filteredRows.map((row) => row.id);
      const allSelected = allVisibleIds.every((id) => prev.includes(id));
      return allSelected
        ? prev.filter((id) => !allVisibleIds.includes(id))
        : [...new Set([...prev, ...allVisibleIds])];
    });
  };

  // Stats derived from current page results
  const approvedCount = adminProducts.filter(
    (p) => (p.status ?? "").toUpperCase() === "APPROVED"
  ).length;
  const pendingCount = adminProducts.filter(
    (p) => (p.status ?? "").toUpperCase() === "PENDING"
  ).length;
  const rejectedCount = adminProducts.filter(
    (p) => (p.status ?? "").toUpperCase() === "REJECTED"
  ).length;

  return (
    <div className="space-y-8 bg-ffffff p-6 rounded-c16">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-c20 font-MontserratMedium py-2">
          {isListings ? "Product Listings" : "Categories"}
        </h1>
      </div>

      {/* Top Stats Graph Card */}
      <div className="justify-between flex items-center w-full">
        <StatusFrame
          title="Total products"
          quantity={apiTotalCount}
          icon={activeUserIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title="Approved"
          quantity={approvedCount}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Pending"
          quantity={pendingCount}
          icon={inActiveIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Rejected"
          quantity={rejectedCount}
          icon={suspendedUserIcon}
          width={18}
          height={26}
        />
      </div>

      {/* Main Listing Section */}
      <div>
        <h2 className="text-base font-MontserratNormal text-000000 mb-6">
          {isListings ? "Products table" : "Categories table"}
        </h2>

        {/* Filters Header */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search ${isListings ? "products" : "categories"} by ID, name or seller...`}
          searchExpandable={true}
          filterOptions={["Date", "Status", "Category", "Price"]}
          onFilterChange={(filters) => console.log("Selected filters:", filters)}
        />

        {/* Data Table */}
        <ProductsTable
          rows={filteredRows}
          selectedProductIds={selectedProductIds}
          activeRowId={activeRowId}
          loading={loading}
          onSelectAll={toggleSelectAll}
          onToggleRow={toggleProductSelection}
          onRowClick={handleRowClick}
          onSetActiveRowId={setActiveRowId}
          truncateText={truncateText}
        />

        {/* Pagination Section */}
        {apiTotalCount > PAGE_SIZE && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(apiTotalCount / PAGE_SIZE)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
