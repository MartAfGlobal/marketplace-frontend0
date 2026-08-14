"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { Button } from "@/components/ui/Button/Button";

import CategoriesTable, {
  CategoryRow,
} from "@/components/admin-components/categories/CategoriesTable";
import SubcategoriesTable, {
  SubcategoryRow,
} from "@/components/admin-components/categories/SubcategoriesTable";
import AttributesTable, {
  AttributeRow,
} from "@/components/admin-components/categories/AttributesTable";
import CategoryStatsCards from "@/components/admin-components/categories/CategoryStatsCards";
import CategoryTabs from "@/components/admin-components/categories/CategoryTabs";
import { mapApiAttribute } from "@/components/admin-components/categories/mapApiAttribute";

import AttributeDetailsModal, {
  AttributeDetailData,
} from "@/components/ui/Modals/admin/AttributeDetailsModal";
import CreateAttributeModal from "@/components/ui/Modals/admin/CreateAttributeModal";
import EditAttributeModal from "@/components/ui/Modals/admin/EditAttributeModal";
import ResultModal from "@/components/ui/forms/resultModal";

import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import type { AdminCategoryListItem } from "@/types/admin";
import { resolveImageUrl } from "@/types/admin";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const router = useRouter();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("All Category");
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // ── Attribute Modal State ─────────────────────────────────────────────────
  const [selectedAttribute, setSelectedAttribute] =
    useState<AttributeDetailData | null>(null);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isFetchingAttribute, setIsFetchingAttribute] = useState(false);
  const [isCreateAttributeModalOpen, setIsCreateAttributeModalOpen] =
    useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] =
    useState(false);

  // ── API Data State ────────────────────────────────────────────────────────
  const [apiSubcategories, setApiSubcategories] = useState<SubcategoryRow[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [subcategoriesTotalCount, setSubcategoriesTotalCount] = useState(0);

  const [apiAttributes, setApiAttributes] = useState<AttributeRow[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);
  const [attributesTotalCount, setAttributesTotalCount] = useState(0);

  // ── Delete / Result Modal State ───────────────────────────────────────────
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    targetId: string;
    targetName: string;
    targetType: "category" | "subcategory" | "attribute";
    isLoading: boolean;
  }>({ isOpen: false, targetId: "", targetName: "", targetType: "attribute", isLoading: false });

  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    result: "success" | "warning" | "error";
  }>({ isOpen: false, title: "", message: "", result: "success" });

  // ── Redux ─────────────────────────────────────────────────────────────────
  const token = useSelector((state: RootState) => state.token?.token);
  const categoryStats = useSelector(
    (state: RootState) => state.adminCategoryStats?.stats
  );
  const adminCategories = useSelector(
    (state: RootState) => state.adminCategories?.adminCategories ?? []
  );
  const categoriesTotalCount = useSelector(
    (state: RootState) => state.adminCategories?.totalCount ?? 0
  );
  const categoriesLoading = useSelector(
    (state: RootState) => state.adminCategories?.loading ?? false
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const {
    fetchAdminCategoryStats,
    fetchAdminCategories,
    fetchAdminSubcategories,
    fetchAdminAttributes,
    fetchAdminAttributeById,
    updateAdminCategory,
    deleteAdminCategory,
    updateAdminAttribute,
    deleteAdminAttribute,
  } = AdminDetails();

  const truncateText = (value: string | number | undefined, maxLength = 10) => {
    const text = String(value ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // ── Derived stats from Redux ──────────────────────────────────────────────
  const totalCategories =
    categoryStats?.total_categories ??
    categoryStats?.totalCategories ??
    categoryStats?.total_category_count ??
    categoryStats?.total ??
    categoriesTotalCount ??
    adminCategories.length;

  const activeCategoriesCount =
    categoryStats?.active_categories ??
    categoryStats?.activeCategories ??
    categoryStats?.active_category_count ??
    categoryStats?.active ??
    0;

  const totalSubcategories =
    categoryStats?.total_subcategories ??
    categoryStats?.totalSubcategories ??
    categoryStats?.total_sub_categories ??
    categoryStats?.subcategories_count ??
    categoryStats?.subcategories ??
    0;

  const hiddenCount =
    categoryStats?.hidden_categories ??
    categoryStats?.hiddenCategories ??
    categoryStats?.inactive_categories ??
    categoryStats?.inactiveCategories ??
    categoryStats?.hidden_count ??
    categoryStats?.hidden ??
    categoryStats?.inactive ??
    0;

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      fetchAdminCategoryStats();
      fetchAdminCategories(currentPage);
    }
  }, [token, currentPage]);

  useEffect(() => {
    if (activeTab === "Subcategories" && token) {
      setSubcategoriesLoading(true);
      fetchAdminSubcategories(currentPage, (data: any) => {
        const rows: SubcategoryRow[] = (data?.results ?? []).map((sub: any) => {
          let attributesStr = "None";
          const summaryStr = sub.attributes_summary ?? sub.attribute_summary;
          if (typeof summaryStr === "string" && summaryStr.trim()) {
            attributesStr = summaryStr.trim();
          } else if (Array.isArray(sub.attributes) && sub.attributes.length > 0) {
            const names = sub.attributes
              .map((a: any) =>
                typeof a === "string" ? a : a.name || a.title
              )
              .filter(Boolean);
            attributesStr = names.length > 0 ? names.join(" • ") : "None";
          } else if (typeof sub.attributes === "string" && sub.attributes.trim()) {
            attributesStr = sub.attributes.trim();
          } else if (
            sub.attribute_count !== undefined &&
            sub.attribute_count !== null &&
            Number(sub.attribute_count) > 0
          ) {
            attributesStr = `${sub.attribute_count} attribute${Number(sub.attribute_count) > 1 ? "s" : ""}`;
          }

          let status: "Active" | "Hidden" = "Active";
          if (sub.status) {
            status =
              String(sub.status).toLowerCase() === "hidden" ||
              String(sub.status).toLowerCase() === "inactive"
                ? "Hidden"
                : "Active";
          } else if (sub.is_hidden !== undefined) {
            status = sub.is_hidden ? "Hidden" : "Active";
          } else if (sub.is_active !== undefined) {
            status = sub.is_active ? "Active" : "Hidden";
          }

          const rawDate = sub.created_at || sub.date_created || sub.date;
          const d = rawDate ? new Date(rawDate) : null;
          const dateStr =
            d && !isNaN(d.getTime())
              ? d.toLocaleDateString("en-GB")
              : "N/A";

          const imageUrl = resolveImageUrl(sub.image_url ?? sub.image);

          return {
            id: String(sub.id ?? sub.pk ?? ""),
            name: sub.name || sub.title || "Unnamed",
            imageUrl,
            image_url: sub.image_url,
            image: sub.image,
            parentCategory:
              sub.parent?.name || sub.parent_name || sub.parent_category || "—",
            attributes: attributesStr,
            attributes_summary: summaryStr ?? undefined,
            attribute_count: sub.attribute_count ?? sub.attributes_count ?? undefined,
            productsCount: Number(sub.products_count ?? sub.product_count ?? 0),
            status,
            date: dateStr,
          };
        });
        setApiSubcategories(rows);
        setSubcategoriesTotalCount(data?.totalCount ?? rows.length);
        setSubcategoriesLoading(false);
      });
    }
  }, [activeTab, token, currentPage]);

  useEffect(() => {
    if (activeTab === "Attributes" && token) {
      setAttributesLoading(true);
      fetchAdminAttributes(currentPage, (data: any) => {
        const rows = (data?.results ?? []).map(mapApiAttribute);
        setApiAttributes(rows);
        setAttributesTotalCount(data?.totalCount ?? rows.length);
        setAttributesLoading(false);
      });
    }
  }, [activeTab, token, currentPage]);

  // Reset page on tab / search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchVal]);

  // Close action menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveRowId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // ── Table data ────────────────────────────────────────────────────────────
  let currentRows: any[] = [];
  let tableType = "category";

  if (activeTab === "All Category") {
    currentRows = adminCategories;
  } else if (activeTab === "Active") {
    currentRows = adminCategories.filter((c) => c.is_active !== false);
  } else if (activeTab === "Hidden") {
    currentRows = adminCategories.filter((c) => c.is_active === false);
  } else if (activeTab === "Subcategories") {
    currentRows = apiSubcategories;
    tableType = "subcategory";
  } else if (activeTab === "Attributes") {
    currentRows = apiAttributes;
    tableType = "attribute";
  }

  const query = searchVal.trim().toLowerCase();
  const filteredData = currentRows.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(query)
  );

  // Calculate total items count from backend depending on tab
  let totalCountForTab = categoriesTotalCount;
  if (tableType === "subcategory") {
    totalCountForTab = subcategoriesTotalCount;
  } else if (tableType === "attribute") {
    totalCountForTab = attributesTotalCount;
  }

  const getHeading = () => {
    if (activeTab === "Subcategories") return "Subcategory Listings";
    if (activeTab === "Attributes") return "Attribute Listings";
    return "Category Listings";
  };

  // ── Selection handlers ────────────────────────────────────────────────────
  const handleSelectAll = () => {
    if (filteredData.length === 0) return;
    const allIds = filteredData.map((row: any) => row.id);
    const allSelected = allIds.every((id: any) =>
      selectedProductIds.includes(id)
    );
    setSelectedProductIds(
      allSelected
        ? selectedProductIds.filter((id) => !allIds.includes(id))
        : Array.from(new Set([...selectedProductIds, ...allIds]))
    );
  };

  const handleToggleRow = (id: string) =>
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );

  // ── Row click ─────────────────────────────────────────────────────────────
  const handleRowClick = (id: string) => {
    if (tableType !== "attribute") {
      router.push(`/dashboard/admin/categories/${id}`);
      return;
    }

    // Open modal immediately, fetch from API
    setSelectedAttribute(null);
    setIsAttributeModalOpen(true);
    setIsFetchingAttribute(true);

    fetchAdminAttributeById(id, (data: any) => {
      console.log("=== Attribute Details API Response ===", data);

      const fmtDate = (raw: string | undefined) => {
        if (!raw) return "N/A";
        const d = new Date(raw);
        return isNaN(d.getTime()) ? raw : d.toLocaleDateString("en-US");
      };

      // Parse values — API may return array of objects or strings
      let valuesArr: string[] = [];
      if (Array.isArray(data?.values)) {
        valuesArr = data.values.map((v: any) =>
          typeof v === "string" ? v : v.name || v.value || String(v)
        );
      } else if (typeof data?.values === "string" && data.values) {
        valuesArr = data.values.split(",").map((v: string) => v.trim()).filter(Boolean);
      }

      console.log("=== Parsed values array ===", valuesArr);

      setSelectedAttribute({
        id: String(data?.id ?? id),
        name: data?.name ?? "",
        isActive: data?.is_active !== false,
        dateCreated: fmtDate(data?.created_at || data?.date_created),
        lastModified: fmtDate(data?.updated_at || data?.last_modified || data?.modified_at || data?.created_at),
        values: valuesArr,
      });
      setIsFetchingAttribute(false);
    });
  };

  // ── Edit Attribute State ──
  const [selectedAttributeCategoryId, setSelectedAttributeCategoryId] = useState<string | undefined>(undefined);
  const [selectedAttributeCategoryValues, setSelectedAttributeCategoryValues] = useState<string[] | undefined>(undefined);

  // ── Attribute CRUD handlers ───────────────────────────────────────────────
  const handleEditAttribute = (
    attr: AttributeDetailData,
    selectedCatId?: string,
    catValues?: string[]
  ) => {
    setIsAttributeModalOpen(false);
    setSelectedAttribute(attr);
    setSelectedAttributeCategoryId(selectedCatId);
    setSelectedAttributeCategoryValues(catValues);
    setIsEditAttributeModalOpen(true);
  };

  const handleAttributeHideToggled = (id: string, newIsActive: boolean) => {
    setApiAttributes((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newIsActive ? "Active" : "Hidden" } : a
      )
    );
    if (selectedAttribute?.id === id) {
      setSelectedAttribute((prev) =>
        prev ? { ...prev, isActive: newIsActive } : prev
      );
    }
  };

  const handleAttributeUpdated = (updated: AttributeDetailData) => {
    setApiAttributes((prev) =>
      prev.map((a) =>
        a.id === updated.id
          ? {
              ...a,
              name: updated.name,
              values: updated.values.join(", "),
              valuesCount: updated.values.length,
            }
          : a
      )
    );
    setSelectedAttribute(updated);
    setResultModalState({
      isOpen: true,
      result: "success",
      title: "Attribute Updated!",
      message: `Attribute "${updated.name}" has been updated successfully.`,
    });
  };

  const handleToggleHideCategory = (
    id: string,
    currentStatus: "Active" | "Hidden",
    name: string,
    itemType: "category" | "subcategory" = "category"
  ) => {
    const newIsActive = currentStatus !== "Active";
    updateAdminCategory(
      id,
      { is_active: newIsActive },
      () => {
        if (itemType === "category") {
          fetchAdminCategories(currentPage);
          fetchAdminCategoryStats();
        } else {
          setApiSubcategories((prev) =>
            prev.map((sub) =>
              sub.id === id ? { ...sub, status: newIsActive ? "Active" : "Hidden" } : sub
            )
          );
          fetchAdminCategoryStats();
        }
        const label = itemType === "subcategory" ? "Subcategory" : "Category";
        setResultModalState({
          isOpen: true,
          title: newIsActive ? `${label} Activated!` : `${label} Hidden!`,
          message: `${label} "${name}" is now ${newIsActive ? "active" : "hidden"}.`,
          result: "success",
        });
      },
      (err: any) => {
        setResultModalState({
          isOpen: true,
          title: "Update Failed",
          message:
            err?.data?.message ||
            err?.message ||
            `Failed to update ${itemType} status.`,
          result: "error",
        });
      }
    );
  };

  const handleToggleHideFromTable = (
    id: string,
    currentStatus: "Active" | "Hidden",
    name: string
  ) => {
    const newIsActive = currentStatus !== "Active";
    updateAdminAttribute(
      id,
      { is_active: newIsActive },
      () => {
        handleAttributeHideToggled(id, newIsActive);
        setResultModalState({
          isOpen: true,
          title: newIsActive ? "Attribute Activated!" : "Attribute Hidden!",
          message: `Attribute "${name}" is now ${newIsActive ? "active" : "hidden"}.`,
          result: "success",
        });
      },
      (err: any) => {
        setResultModalState({
          isOpen: true,
          title: "Update Failed",
          message:
            err?.data?.message ||
            err?.message ||
            "Failed to update attribute status.",
          result: "error",
        });
      }
    );
  };

  const handleRequestDelete = (
    id: string,
    name: string,
    targetType: "category" | "subcategory" | "attribute" = "attribute"
  ) =>
    setDeleteConfirmState({
      isOpen: true,
      targetId: id,
      targetName: name,
      targetType,
      isLoading: false,
    });

  const handleExecuteDelete = () => {
    const { targetId, targetName, targetType } = deleteConfirmState;
    if (!targetId) return;

    setDeleteConfirmState((prev) => ({ ...prev, isLoading: true }));

    if (targetType === "attribute") {
      deleteAdminAttribute(
        targetId,
        () => {
          setApiAttributes((prev) => prev.filter((a) => a.id !== targetId));
          setIsAttributeModalOpen(false);
          setDeleteConfirmState({
            isOpen: false,
            targetId: "",
            targetName: "",
            targetType: "attribute",
            isLoading: false,
          });
          setResultModalState({
            isOpen: true,
            title: "Attribute Deleted!",
            message: `Attribute "${targetName}" has been deleted.`,
            result: "success",
          });
        },
        (err: any) => {
          setDeleteConfirmState((prev) => ({ ...prev, isLoading: false }));
          setResultModalState({
            isOpen: true,
            title: "Delete Failed",
            message:
              err?.data?.message ||
              err?.message ||
              "Failed to delete attribute.",
            result: "error",
          });
        }
      );
    } else {
      deleteAdminCategory(
        targetId,
        () => {
          if (targetType === "category") {
            fetchAdminCategories(currentPage);
            fetchAdminCategoryStats();
          } else {
            setApiSubcategories((prev) => prev.filter((s) => s.id !== targetId));
            fetchAdminCategoryStats();
          }
          setDeleteConfirmState({
            isOpen: false,
            targetId: "",
            targetName: "",
            targetType,
            isLoading: false,
          });
          const label = targetType === "subcategory" ? "Subcategory" : "Category";
          setResultModalState({
            isOpen: true,
            title: `${label} Deleted!`,
            message: `${label} "${targetName}" has been deleted.`,
            result: "success",
          });
        },
        (err: any) => {
          setDeleteConfirmState((prev) => ({ ...prev, isLoading: false }));
          const label = targetType === "subcategory" ? "Subcategory" : "Category";
          setResultModalState({
            isOpen: true,
            title: "Delete Failed",
            message:
              err?.data?.message ||
              err?.message ||
              `Failed to delete ${label.toLowerCase()}.`,
            result: "error",
          });
        }
      );
    }
  };

  const refreshAttributes = () => {
    if (activeTab !== "Attributes" || !token) return;
    setAttributesLoading(true);
    fetchAdminAttributes(currentPage, (data: any) => {
      setApiAttributes((data?.results ?? []).map(mapApiAttribute));
      setAttributesLoading(false);
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-11 mb-6 gap-4">
        <h1 className="text-c18 font-MontserratSemiBold">Category Management</h1>
        <div className="flex items-center gap-6 w-full max-w-83.25">
          <Button
            variant="secondary"
            onClick={() => setIsCreateAttributeModalOpen(true)}
          >
            Create Attribute
          </Button>
          <Button
            onClick={() => router.push("/dashboard/admin/categories/create")}
          >
            Create Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <CategoryStatsCards
        totalCategories={totalCategories}
        activeCategoriesCount={activeCategoriesCount}
        totalSubcategories={totalSubcategories}
        hiddenCount={hiddenCount}
      />

      {/* Main Listing Section */}
      <div className="bg-white rounded-[16px] p-6">
        <h2 className="text-base font-MontserratNormal text-000000/68 leading-c24 mb-6">
          {getHeading()}
        </h2>

        {/* Tabs */}
        <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search / Filter Header */}
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

        {/* Data Tables */}
        {tableType === "category" && (
          <CategoriesTable
            rows={filteredData as CategoryRow[]}
            selectedIds={selectedProductIds}
            activeRowId={activeRowId}
            loading={categoriesLoading}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            onToggleHide={(id, currentStatus, name) =>
              handleToggleHideCategory(id, currentStatus, name, "category")
            }
            onDelete={(id, name) =>
              handleRequestDelete(id, name, "category")
            }
          />
        )}
        {tableType === "subcategory" && (
          <SubcategoriesTable
            truncateText={truncateText}
            selectedProductIds={selectedProductIds}
            rows={filteredData as SubcategoryRow[]}
            activeRowId={activeRowId}
            loading={subcategoriesLoading}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            onToggleHide={(id, currentStatus, name) =>
              handleToggleHideCategory(id, currentStatus, name, "subcategory")
            }
            onDelete={(id, name) =>
              handleRequestDelete(id, name, "subcategory")
            }
          />
        )}
        {tableType === "attribute" && (
          <AttributesTable
            rows={filteredData as AttributeRow[]}
            selectedIds={selectedProductIds}
            activeRowId={activeRowId}
            loading={attributesLoading}
            onSelectAll={handleSelectAll}
            onToggleRow={handleToggleRow}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            onToggleHide={handleToggleHideFromTable}
            onDelete={(id, name) =>
              handleRequestDelete(id, name, "attribute")
            }
          />
        )}

        {/* Pagination */}
        {totalCountForTab > 20 && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCountForTab / 20)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <AttributeDetailsModal
        isOpen={isAttributeModalOpen}
        onClose={() => {
          setIsAttributeModalOpen(false);
          setIsFetchingAttribute(false);
        }}
        attribute={selectedAttribute}
        isLoading={isFetchingAttribute}
        onEdit={handleEditAttribute}
        onDeleteRequest={(id, name) => handleRequestDelete(id, name, "attribute")}
        onHideToggled={(id, newIsActive, name) =>
          handleToggleHideFromTable(id, newIsActive ? "Hidden" : "Active", name)
        }
      />

      <CreateAttributeModal
        isOpen={isCreateAttributeModalOpen}
        onClose={() => setIsCreateAttributeModalOpen(false)}
        onSuccess={(newAttr) => {
          setResultModalState({
            isOpen: true,
            result: "success",
            title: "Attribute Created!",
            message: `Attribute "${newAttr?.name || "New Attribute"}" has been created successfully.`,
          });
          refreshAttributes();
        }}
      />

      <EditAttributeModal
        isOpen={isEditAttributeModalOpen}
        onClose={() => setIsEditAttributeModalOpen(false)}
        attribute={selectedAttribute}
        initialCategoryId={selectedAttributeCategoryId}
        initialCategoryValues={selectedAttributeCategoryValues}
        onSuccess={handleAttributeUpdated}
      />

      {/* Delete Warning */}
      <ResultModal
        isOpen={deleteConfirmState.isOpen}
        result="warning"
        title={`Delete ${
          deleteConfirmState.targetType === "subcategory"
            ? "Subcategory"
            : deleteConfirmState.targetType === "category"
            ? "Category"
            : "Attribute"
        }?`}
        message={`Are you sure you want to delete "${deleteConfirmState.targetName}"?`}
        discRescription="This action is permanent and cannot be undone."
        buttenText="Delete"
        loading={deleteConfirmState.isLoading}
        onConfirm={handleExecuteDelete}
        onCancel={() =>
          setDeleteConfirmState({
            isOpen: false,
            targetId: "",
            targetName: "",
            targetType: "attribute",
            isLoading: false,
          })
        }
      />

      {/* Action Result Feedback */}
      <ResultModal
        isOpen={resultModalState.isOpen}
        result={resultModalState.result}
        title={resultModalState.title}
        message={resultModalState.message}
        buttenText="Okay"
        onConfirm={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onCancel={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
