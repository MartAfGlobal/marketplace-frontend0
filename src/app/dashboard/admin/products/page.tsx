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

const mockProducts: ProductRow[] = Array.from({ length: 25 }, (_, i) => {
  const id = `PRD-${String(i + 1).padStart(3, "0")}`;
  const statuses: ("Pending" | "Approved" | "Rejected")[] = ["Pending", "Approved", "Rejected"];
  return {
    id,
    name: `Product ${id}`,
    seller: `Seller ${Math.floor(Math.random() * 10) + 1}`,
    category: ["Fashion", "Electronics", "Home", "Beauty"][i % 4],
    price: `₦${(Math.random() * 50000 + 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    stock: Math.floor(Math.random() * 500),
    status: statuses[i % 3],
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString("en-GB"),
  };
});

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") || "listings";
  const isListings = type === "listings";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const loading = false;

  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchVal]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const query = searchVal.trim().toLowerCase();
    
    // In a real app we would have category mock data too
    const sourceData = isListings ? mockProducts : mockProducts;

    const filteredData = sourceData.filter((item) => {
      const haystack = [item.id, item.name, item.seller, item.category, item.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    const pageSize = 20;
    const start = (currentPage - 1) * pageSize;
    const pagedData = filteredData.slice(start, start + pageSize);

    setRows(pagedData);
    setTotalCount(filteredData.length);
  }, [isListings, currentPage, searchVal]);

  const handleRowClick = (routeSuffix: string) => {
    // routeSuffix is either the id or id/review
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
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedProductIds((prev) => {
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
          {isListings ? "Product Listings" : "Categories"}
        </h1>
      </div>

      {/* Top Stats Graph Card */}
      <div className="justify-between flex items-center w-full">
        <StatusFrame
          title="Total products"
          quantity={totalCount}
          icon={activeUserIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title="Approved"
          quantity={mockProducts.filter(p => p.status === "Approved").length}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Pending"
          quantity={mockProducts.filter(p => p.status === "Pending").length}
          icon={inActiveIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Rejected"
          quantity={mockProducts.filter(p => p.status === "Rejected").length}
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
          rows={rows}
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
