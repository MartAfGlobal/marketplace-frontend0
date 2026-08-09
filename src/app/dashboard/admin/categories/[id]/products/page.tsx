"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import StatusFrame from "@/components/admin-components/users/status-frame";
import ProductsTable, { ProductRow } from "@/components/admin-components/products/ProductsTable";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import suspendedUserIcon from "@/assets/admin/suspend.svg";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();

  // params.id receives the slug value (e.g. "agricultural-products")
  // because the "View all" button navigates with category.slug
  const categorySlug = params.id as string;

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");

  const token = useSelector((state: RootState) => state.token?.token);
  const adminProducts = useSelector(
    (state: RootState) => state.adminProducts?.adminProducts ?? []
  );
  const apiTotalCount = useSelector(
    (state: RootState) => state.adminProducts?.totalCount ?? 0
  );

  const { fetchAdminProductsByCategory, fetchAdminCategoryById, loading } =
    AdminDetails();

  // Fetch category name for the breadcrumb
  useEffect(() => {
    if (token && categorySlug) {
      fetchAdminCategoryById(categorySlug, (data: any) => {
        setCategoryName(data?.name || data?.title || "Category");
      });
    }
  }, [token, categorySlug]);

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchVal]);

  // Calls: GET /products/admin/products?category=agricultural-products&page=1
  useEffect(() => {
    if (token && categorySlug) {
      fetchAdminProductsByCategory(categorySlug, currentPage);
    }
  }, [token, categorySlug, currentPage]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveRowId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

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

  const approvedCount = adminProducts.filter(
    (p) => (p.status ?? p.is_approved ?? "").toUpperCase() === "APPROVED"
  ).length;
  const pendingCount = adminProducts.filter(
    (p) => (p.status ?? p.is_approved ?? "").toUpperCase() === "PENDING"
  ).length;
  const rejectedCount = adminProducts.filter(
    (p) => (p.status ?? p.is_approved ?? "").toUpperCase() === "REJECTED"
  ).length;

  return (
    <div className="space-y-8 bg-ffffff p-6 rounded-c16">
      {/* Back + Title */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-MontserratMedium">Back to Category</span>
        </button>
        <h1 className="text-c20 font-MontserratMedium py-2">
          {categoryName ? `Products in "${categoryName}"` : "Category Products"}
        </h1>
        {loading && !adminProducts.length && (
          <div className="flex items-center gap-2 text-gray-400 mt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-MontserratNormal">Loading products...</span>
          </div>
        )}
      </div>

      {/* Stats */}
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

      {/* Table Section */}
      <div>
        <h2 className="text-base font-MontserratNormal text-000000 mb-6">
          Products table
        </h2>

        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search products by ID, name or seller..."
          searchExpandable={true}
          filterOptions={["Date", "Status", "Price"]}
          onFilterChange={(filters) => console.log("Selected filters:", filters)}
        />

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
