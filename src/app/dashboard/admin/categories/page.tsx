"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import StatusFrame from "@/components/admin-components/users/status-frame";

import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import { Button } from "@/components/ui/Button/Button";

import TotalCategoryIcon from "@/assets/admin/totalCategoryIcon.svg";
import ActiveCategoryIcon from "@/assets/admin/activeCategoryIcon.svg";
import TotalSubCategoryIcon from "@/assets/admin/totalSubCategoryIcon.svg";
import HiddenCategoryIcon from "@/assets/admin/hiddenCategory.svg";
import { GitFork, StopCircle } from "lucide-react";

import CategoriesTable, {
  CategoryRow,
} from "@/components/admin-components/categories/CategoriesTable";
import SubcategoriesTable, {
  SubcategoryRow,
} from "@/components/admin-components/categories/SubcategoriesTable";
import AttributesTable, {
  AttributeRow,
} from "@/components/admin-components/categories/AttributesTable";
import AttributeDetailsModal from "@/components/ui/Modals/admin/AttributeDetailsModal";
import Image from "next/image";
import { label } from "framer-motion/client";

// Mock Data
const mockCategories: CategoryRow[] = Array.from({ length: 5 }, (_, i) => ({
  id: `CAT-${i}`,
  name: `Fashion`,
  subcategories: "Men's Wear • Women's Wear • +8",
  attributes: "Size • Colour • +1",
  productsCount: 12,
  status: i % 2 === 1 ? "Hidden" : "Active", // Alternating Active/Hidden (Active, Hidden, Active, Hidden, Active)
  date: "18/9/2016",
}));

const mockSubcategories: SubcategoryRow[] = Array.from(
  { length: 25 },
  (_, i) => ({
    id: `SUB-${i}`,
    name: `Subcategory ${i}`,
    parentCategory: "Fashion",
    attributes: "Size - Colour - +1",
    productsCount: Math.floor(Math.random() * 500),
    status: i % 3 === 0 ? "Hidden" : "Active",
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toLocaleDateString("en-GB"),
  }),
);

const getMockValues = (name: string) => {
  if (name === "Colour") return "Blue, Red, Green, Green, Green, Green, Green, Green, Green, Green, Green, Green, Green, Green, Green";
  if (name === "Size") return "XS, S, M, L, XL, XXL, 3XL, 4XL, 5XL, 6XL";
  if (name === "Material") return "Cotton, Polyester, Wool, Silk, Linen, Leather, Denim, Velvet";
  return "Nike, Adidas, Puma, Reebok, Under Armour, New Balance";
};

const mockAttributes: AttributeRow[] = Array.from({ length: 25 }, (_, i) => {
  const name = ["Colour", "Size", "Material", "Brand"][i % 4];
  const values = getMockValues(name);
  return {
    id: `ATTR-${i}`,
    name,
    values,
    valuesCount: values.split(",").length,
    status: i % 4 === 0 ? "Hidden" : "Active",
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toLocaleDateString("en-GB"),
  };
});

const TABS = [
  { label: "All Category", width: "w-27" },
  { label: "Active", width: "w-21.25" },
  { label: "Hidden", width: "w-21.25" },
  { label: "Subcategories", width: "w-30.25" },
  { label: "Attributes", width: "w-23.75" },
];

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Category");
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
 
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);

  // Stats
  const totalCategories = 100;
  const activeCategoriesCount = 35;
  const totalSubcategories = 500;
  const hiddenCount = 20;




  const truncateText = (value: string | number | undefined, maxLength = 10) => {
    const text = String(value ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchVal]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleCreateAttribute = () => {
    router.push("/dashboard/admin/categories/create-attribute");
  };

  const handleCreateCategory = () => {
    router.push("/dashboard/admin/categories/create");
  };

  // Determine current table data
  let currentRows: any[] = [];
  let tableType = "category"; // "category" | "subcategory" | "attribute"

  if (activeTab === "All Category") {
    currentRows = mockCategories;
  } else if (activeTab === "Active") {
    currentRows = mockCategories.filter((c) => c.status === "Active");
  } else if (activeTab === "Hidden") {
    currentRows = mockCategories.filter((c) => c.status === "Hidden");
  } else if (activeTab === "Subcategories") {
    currentRows = mockSubcategories;
    tableType = "subcategory";
  } else if (activeTab === "Attributes") {
    currentRows = mockAttributes;
    tableType = "attribute";
  }

  // Filter based on search
  const query = searchVal.trim().toLowerCase();
  const filteredData = currentRows.filter((item) => {
    const haystack = Object.values(item).join(" ").toLowerCase();
    return haystack.includes(query);
  });

  const pageSize = 20;
  const start = (currentPage - 1) * pageSize;
  const pagedData = filteredData.slice(start, start + pageSize);

  const getHeading = () => {
    if (activeTab === "Subcategories") return "Subcategory Listings";
    if (activeTab === "Attributes") return "Attribute Listings";
    return "Category Listings";
  };

  const handleSelectAll = () => {
    if (pagedData.length === 0) return;
    const allIds = pagedData.map((row: any) => row.id);
    const allSelected = allIds.every((id: any) => selectedProductIds.includes(id));

    if (allSelected) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => !allIds.includes(id)),
      );
    } else {
      const newSelections = Array.from(new Set([...selectedProductIds, ...allIds]));
      setSelectedProductIds(newSelections);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleRowClick = (id: string) => {
    if (tableType === "attribute") {
      const item = currentRows.find((r: any) => r.id === id) || mockAttributes.find((r) => r.id === id);
      if (!item) return;
      
      const attr = {
        name: item.name,
        isActive: item.status === "Active",
        dateCreated: item.date,
        lastUpdated: item.date,
        values: typeof item.values === "string" 
          ? item.values.split(",").map((v: string) => v.trim()).filter((v: string) => v && !v.startsWith("+"))
          : [],
      };
      setSelectedAttribute(attr);
      setIsAttributeModalOpen(true);
    } else {
      router.push(`/dashboard/admin/categories/${id}`);
    }
  };

  return (
    <div className="">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  h-11 mb-6 gap-4">
        <h1 className="text-c18 font-MontserratSemiBold">
          Category Management
        </h1>
        <div className="flex items-center gap-6 w-full max-w-83.25">
          <Button
            variant="secondary"
            onClick={handleCreateAttribute}
            className=""
          >
            Create Attribute
          </Button>
          <Button onClick={handleCreateCategory} className="">
            Create Category
          </Button>
        </div>
      </div>

      {/* Top Stats Graph Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white w-full max-w-64.5 h-36 rounded-[16px] px-6 py-8  flex flex-col gap-4 justify-center">
          <div className="flex justify-between ">
            <p className="text-base font-MontserratNormal">Total Categories</p>
            <div className="w-10 h-10 rounded-full bg-947fff/10 flex items-center justify-center">
              <Image
                src={TotalCategoryIcon}
                alt="total category"
                width={20.25}
                height={18}
              />
            </div>
          </div>
          <p className="text-c32 font-MontserratNormal">{totalCategories}</p>
        </div>

        <div className="bg-white w-full max-w-64.5 h-36 rounded-[16px] px-6 py-8  flex flex-col gap-4 justify-center">
          <div className="flex justify-between ">
            <p className="text-base font-MontserratNormal">Active Categories</p>
            <div className="w-10 h-10 rounded-full bg-28a745/12 flex items-center justify-center">
              <Image
                src={ActiveCategoryIcon}
                alt="total category"
                width={16.5}
                height={21}
              />
            </div>
          </div>
          <p className="text-c32 font-MontserratNormal">
            {activeCategoriesCount}
          </p>
        </div>

        <div className="bg-white w-full max-w-64.5 h-36 rounded-[16px] px-6 py-8  flex flex-col gap-4 justify-center">
          <div className="flex justify-between ">
            <p className="text-base font-MontserratNormal">
              Total Subcategories
            </p>
            <div className="w-10 h-10 rounded-full bg-ffaco6/12 flex items-center justify-center">
              <Image
                src={TotalSubCategoryIcon}
                alt="total category"
                width={20.25}
                height={18}
              />
            </div>
          </div>
          <p className="text-c32 font-MontserratNormal">{totalSubcategories}</p>
        </div>

        <div className="bg-white w-full max-w-64.5 h-36 rounded-[16px] px-6 py-8  flex flex-col gap-4 justify-center">
          <div className="flex justify-between ">
            <p className="text-base font-MontserratNormal">Hidden</p>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Image
                src={HiddenCategoryIcon}
                alt="total category"
                width={19.5}
                height={19.5}
              />
            </div>
          </div>
          <p className="text-c32 font-MontserratNormal">{hiddenCount}</p>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="bg-white rounded-[16px] p-6 ">
        <h2 className="text-base font-MontserratNormal text-000000/68 leading-c24 mb-6">
          {getHeading()}
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-2   mb-6 ">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`${tab.width} pb-4 h-12 text-c12  font-MontserratSemiBold transition-colors relative ${
                activeTab === tab.label
                  ? "text-6a0dad border-b-6a0dad border-b-3"
                  : "text-000000/68 hover:text-6a0dad border-b border-b-000000/2"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Header */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search ${getHeading().toLowerCase()}...`}
          searchExpandable={true}
          filterOptions={["Date", "Status"]}
          onFilterChange={(filters) =>
            console.log("Selected filters:", filters)
          }
        />

        {/* Data Table */}
        {tableType === "category" && (
          <CategoriesTable
            rows={pagedData as CategoryRow[]}
            selectedIds={selectedProductIds}
            activeRowId={activeRowId}
            loading={false}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
          />
        )}
        {tableType === "subcategory" && (
          <SubcategoriesTable
            truncateText={truncateText}
            selectedProductIds={selectedProductIds}
            rows={pagedData as SubcategoryRow[]}
            activeRowId={activeRowId}
            loading={false}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
          />
        )}
        {tableType === "attribute" && (
          <AttributesTable
            rows={pagedData as AttributeRow[]}
            selectedIds={selectedProductIds}
            activeRowId={activeRowId}
            loading={false}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
          />
        )}

        {/* Pagination Section */}
        {filteredData.length > 20 && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / 20)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      <AttributeDetailsModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
        attribute={selectedAttribute}
        onEdit={() => console.log("Edit attribute")}
        onDelete={() => console.log("Delete attribute")}
        onToggleActive={(val) => console.log("Toggle active:", val)}
      />
    </div>
  );
}
