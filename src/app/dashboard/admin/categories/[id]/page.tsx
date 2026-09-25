"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { ChevronLeft, Download, MoreVertical, CheckCircle2, EyeOff, Eye, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import ResultModal from "@/components/ui/forms/resultModal";
import { toast } from "sonner";
import { sub } from "framer-motion/client";
import { clearAdminCategoryDetail } from "@/store/admin/categories/adminCategoryDetailSlice";


export default function AdminCategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const token = useSelector((state: RootState) => state.token?.token);
  const dispatch = useDispatch();
  const category = useSelector(
    (state: RootState) => state.adminCategoryDetail?.category
  );

  const { fetchAdminCategoryById, updateAdminCategory, deleteAdminCategory, loading } = AdminDetails();

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    targetId: string;
    targetName: string;
    targetType: "category" | "subcategory";
    isLoading: boolean;
  }>({ isOpen: false, targetId: "", targetName: "", targetType: "category", isLoading: false });

  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    result: "success" | "warning" | "error";
    onConfirmRedirect?: boolean;
  }>({ isOpen: false, title: "", message: "", result: "success", onConfirmRedirect: false });

  useEffect(() => {
    if (token && categoryId) {
      dispatch(clearAdminCategoryDetail());
      fetchAdminCategoryById(categoryId);
    }
  }, [token, categoryId, dispatch]);

  // Derived values from the API category
  const isSubcategory =
    categoryId?.startsWith("SUB") ||
    Boolean(category?.parent || category?.parent_id || category?.parent_name || category?.parent_category);

  const name = category?.name || category?.title || (isSubcategory ? "Subcategory Details" : "Category Details");
  const description = category?.description || category?.category_description || category?.desc || "No description provided.";
  
  const productsCount = category?.products_count ?? category?.productsCount ?? category?.product_count ?? category?.total_products ?? (Array.isArray(category?.products) ? category.products.length : null);

  const [isActiveState, setIsActiveState] = useState<boolean | null>(null);

  const apiIsActive = typeof category?.is_active === "boolean"
    ? category.is_active
    : category?.status
      ? category.status.toLowerCase() === "active"
      : null;
  const isActive = isActiveState ?? apiIsActive;

  const parentName = category?.full_path?.split(">")?.[0]?.trim() || category?.parent_name || "—";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const dateCreated = formatDate(category?.created_at || category?.date_created || category?.created);
  const lastUpdated = formatDate(category?.updated_at || category?.last_updated || category?.updated || category?.created_at);

  const imageUrl = category?.image || category?.category_image || category?.cover_image || category?.icon;

  // Normalize attributes
  const getAttributes = (): { name: string; value: string }[] => {
    // 1. Check attribute_values_summary from backend
    if (Array.isArray(category?.attribute_values_summary) && category.attribute_values_summary.length > 0) {
      return category.attribute_values_summary.map((item: any) => {
        const name = item.attribute_name || item.name || item.title || "Attribute";
        const rawVals = item.values || item.attribute_values || item.value || [];
        const valStr = Array.isArray(rawVals)
          ? rawVals.map((v: any) => (typeof v === "string" ? v : v.name || v.value || String(v))).join(" • ")
          : typeof rawVals === "string" && rawVals.trim()
          ? rawVals
          : "-";
        return { name, value: valStr || "-" };
      });
    }

    // 2. Check attributes array
    if (Array.isArray(category?.attributes) && category.attributes.length > 0) {
      return category.attributes.map((attr: any) => {
        if (typeof attr === "string") return { name: attr, value: "-" };
        const attrName = attr.name || attr.title || attr.attribute_name || "Attribute";
        let val = attr.values || attr.value || attr.attribute_values;
        if (Array.isArray(val)) {
          val = val.map((v: any) => (typeof v === "string" ? v : v.name || v.value || String(v))).join(" • ");
        } else if (!val) {
          val = "-";
        }
        return { name: attrName, value: String(val) };
      });
    }

    // 3. Check attributes object
    if (category?.attributes && typeof category.attributes === "object" && !Array.isArray(category.attributes)) {
      return Object.entries(category.attributes).map(([key, val]) => ({
        name: key,
        value: Array.isArray(val) ? val.join(" • ") : String(val),
      }));
    }

    // 4. Check attribute_values object
    if (category?.attribute_values && typeof category.attribute_values === "object" && !Array.isArray(category.attribute_values)) {
      return Object.entries(category.attribute_values).map(([key, val]) => ({
        name: key,
        value: Array.isArray(val) ? val.join(" • ") : String(val),
      }));
    }

    return [];
  };

  const parsedAttributes = getAttributes();

  // Normalize subcategories list
  const rawSubList: any[] = (() => {
    const s = category as any;
    const candidates = [
      s?.subcategories,
      s?.subcategories?.results,
      s?.sub_categories,
      s?.children,
    ];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length >= 0) return c;
    }
    return [];
  })();

    const subcategoriesList = Array.isArray(rawSubList)
      ? rawSubList.filter((sub: any) => sub?.id || sub?.uuid || sub?.slug).map((sub: any) => ({
          id: sub.id || sub.uuid || sub.slug,
          name: sub.name || sub.title || "—",
        attributes: sub.attributes_summary?.trim()
          ? sub.attributes_summary.trim()
          : sub.attribute_summary?.trim()
          ? sub.attribute_summary.trim()
          : Array.isArray(sub.attributes) && sub.attributes.length > 0
          ? sub.attributes.map((a: any) => typeof a === "string" ? a : a.name || a.title).filter(Boolean).join(" • ")
          : typeof sub.attributes === "string" && sub.attributes.trim()
          ? sub.attributes.trim()
          : sub.attribute_count !== undefined && sub.attribute_count !== null && Number(sub.attribute_count) > 0
          ? `${sub.attribute_count} attribute${Number(sub.attribute_count) > 1 ? "s" : ""}`
          : "None",
        productsCount: sub.products_count ?? sub.productsCount ?? sub.product_count ?? null,
        status: sub.is_active !== undefined ? (sub.is_active ? "Active" : "Hidden") : (sub.status || "Unknown"),
        date: formatDate(sub.created_at || sub.date_created || sub.date),
        image: sub.image || sub.icon || sub.category_image || null
      }))
    : [];

  const handleToggleCategoryHide = () => {
    if (isActive === null) return;
    const newIsActive = !isActive;
    setIsActiveState(newIsActive);
    updateAdminCategory(
      categoryId,
      { is_active: newIsActive },
      () => {
        fetchAdminCategoryById(categoryId);
        setResultModalState({
          isOpen: true,
          title: newIsActive ? "Category Activated!" : "Category Hidden!",
          message: `Category "${name}" is now ${newIsActive ? "active" : "hidden"}.`,
          result: "success",
        });
      },
      (err: any) => {
        setIsActiveState(isActive);
        setResultModalState({
          isOpen: true,
          title: "Update Failed",
          message: err?.data?.message || err?.message || "Failed to update category status.",
          result: "error",
        });
      }
    );
  };

  const handleToggleSubcategoryHide = (subId: string, currentStatus: string, subName: string) => {
    if (currentStatus === "Unknown") return;
    const newIsActive = currentStatus !== "Active";
    updateAdminCategory(
      subId,
      { is_active: newIsActive },
      () => {
        fetchAdminCategoryById(categoryId);
        setResultModalState({
          isOpen: true,
          title: newIsActive ? "Subcategory Activated!" : "Subcategory Hidden!",
          message: `Subcategory "${subName}" is now ${newIsActive ? "active" : "hidden"}.`,
          result: "success",
        });
      },
      (err: any) => {
        setResultModalState({
          isOpen: true,
          title: "Update Failed",
          message: err?.data?.message || err?.message || "Failed to update subcategory status.",
          result: "error",
        });
      }
    );
  };

  const handleRequestDelete = (targetId: string, targetName: string, targetType: "category" | "subcategory") => {
    setDeleteConfirmState({
      isOpen: true,
      targetId,
      targetName,
      targetType,
      isLoading: false,
    });
  };

  const handleExecuteDelete = () => {
    const { targetId, targetName, targetType } = deleteConfirmState;
    if (!targetId) return;

    setDeleteConfirmState((prev) => ({ ...prev, isLoading: true }));
    deleteAdminCategory(
      targetId,
      () => {
        setDeleteConfirmState({
          isOpen: false,
          targetId: "",
          targetName: "",
          targetType: "category",
          isLoading: false,
        });
        const isCurrentCategory = targetId === categoryId;
        setResultModalState({
          isOpen: true,
          title: `${targetType === "subcategory" ? "Subcategory" : "Category"} Deleted!`,
          message: `"${targetName}" has been deleted successfully.`,
          result: "success",
          onConfirmRedirect: isCurrentCategory,
        });
        if (!isCurrentCategory) {
          fetchAdminCategoryById(categoryId);
        }
      },
      (err: any) => {
        setDeleteConfirmState((prev) => ({ ...prev, isLoading: false }));
        setResultModalState({
          isOpen: true,
          title: "Delete Failed",
          message: err?.data?.message || err?.message || "Failed to delete item.",
          result: "error",
          onConfirmRedirect: false,
        });
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors cursor-pointer"
        >
          <span className="h-6 w-6 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-black" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">Category Details</h1>
        </button>
        <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-[#df6b62]">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {loading && !category ? (
        <div className="bg-white p-12 rounded-c16 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#947fff] mb-4" />
          <p className="text-gray-500 font-MontserratMedium">Loading category details...</p>
        </div>
      ) : (
        /* Main Details Card */
        <div className="bg-white p-6 rounded-c16">
          {/* Left Column: Image & View All */}
          <div className={`flex flex-col lg:flex-row gap-8 ${isSubcategory ? "mb-c48" : "mb-6"}`}>
            <div className="w-full lg:w-[50%] flex flex-col gap-8">
              <div className="w-full h-90 max-w-128 overflow-hidden relative rounded-xl border border-gray-100">
                <ImageWithSkeleton
                  src={typeof imageUrl === "string" ? imageUrl : null}
                  alt={name}
                  className="object-cover"
                  isLoading={loading}
                />
              </div>
              <div className="border h-19 border-000000/12 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-MontserratSemiBold leading-5 pb-4">
                    Products Count <span className="text-000000/44">({productsCount ?? "—"})</span>
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    View all products in the category
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="max-w-30"
                  onClick={() => router.push(`/dashboard/admin/categories/${category?.slug || categoryId}/products`)}
                >
                  View all
                </Button>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full lg:w-[50%] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-MontserratSemiBold text-c18">
                    {name}
                  </span>
                  <span
                    className={`px-4 py-1.5 w-20 h-8 flex items-center justify-center rounded-c16 text-xs font-MontserratSemiBold ${
                      isActive === null ? "bg-gray-100 text-gray-500" : isActive ? "bg-2d7565/12 text-2d7565" : "bg-ca0202/12 text-ca0202"
                    }`}
                  >
                    {isActive === null ? "Unknown" : isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-MontserratSemiBold text-base">Hide</span>
                  <button
                    onClick={handleToggleCategoryHide}
                    disabled={isActive === null}
                    className={`w-11.5 h-6 rounded-[64px] flex items-center p-0.5 transition-colors cursor-pointer ${
                      isActive === null ? "bg-gray-200 cursor-not-allowed" : !isActive ? "bg-gray-300" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      animate={{ x: isActive === false ? 24 : 0 }}
                      className="w-5 h-5 bg-white rounded-full shadow-[0px_3px_8px_0px_#6A0DAD14]"
                    />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-MontserratSemiBold text-sm leading-5 text-black mb-3">
                  Category Description
                </h3>
                <p className="text-c12 font-MontserratNormal leading-4 text-gray-700">
                  {description}
                </p>
              </div>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
                {isSubcategory && (
                  <div className="px-4 flex flex-col gap-4 py-3 lg:flex-shrink-0 border-r border-gray-200 max-w-[170.67px]">
                    <h4 className="text-base font-MontserratSemiBold">
                      Parent Category
                    </h4>
                    <p className="text-c12 font-MontserratNormal">{parentName}</p>
                  </div>
                )}

                <div
                  className={`w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12 ${
                    isSubcategory ? "max-w-[170.67px]" : "max-w-66"
                  }`}
                >
                  <h4 className="text-base font-MontserratSemiBold">
                    Date Created
                  </h4>
                  <p className="text-c12 font-MontserratNormal">{dateCreated}</p>
                </div>
                <div
                  className={`w-full px-4 py-3 flex flex-col gap-4 ${
                    isSubcategory ? "max-w-[170.67px]" : "max-w-66"
                  }`}
                >
                  <h4 className="text-base font-MontserratSemiBold">
                    Last Updated
                  </h4>
                  <p className="text-c12 font-MontserratNormal">{lastUpdated}</p>
                </div>
              </div>

              <div className="text-c12 font-MontserratNormal flex border border-000000/12 rounded-c4 mb-5">
                <div className="flex flex-col gap-4 w-full max-w-50 border-r px-4 py-3 border-r-000000/12">
                  <h1 className="font-MontserratSemiBold text-sm leading-5">
                    Attributes
                  </h1>
                  {parsedAttributes.map((attr, idx) => (
                    <p key={idx}>{attr.name}</p>
                  ))}
                </div>
                <div className="w-full px-4 py-3 flex-col flex gap-4">
                  <h1 className="font-MontserratSemiBold text-sm">Value</h1>
                  {parsedAttributes.map((attr, idx) => (
                    <div key={idx}>{attr.value}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isSubcategory && (
            <div className="bg-white rounded-[4px] px-4 py-3 border border-000000/12 max-w-228 mb-c48">
              <h3 className="font-MontserratSemiBold text-lg text-black mb-6">
                Subcategory{" "}
                <span className="text-gray-500 font-MontserratMedium text-base">
                  ({Array.isArray(subcategoriesList) ? subcategoriesList.length : 0})
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
                      <th className="p-3 font-MontserratNormal text-sm">Subcategory Name</th>
                      <th className="p-3 font-MontserratNormal text-sm">Attributes</th>
                      <th className="p-3 font-MontserratNormal text-sm">Products Count</th>
                      <th className="p-3 font-MontserratNormal text-sm">Status</th>
                      <th className="p-3 font-MontserratNormal text-sm">Date Created</th>
                      <th className="p-3 font-MontserratNormal text-sm text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm text-gray-700 font-MontserratMedium">
                    {Array.isArray(subcategoriesList) && subcategoriesList.length > 0 ? (
                      subcategoriesList.map((sub) => (
                        <tr
                          key={sub.id}
                          onClick={() => router.push(`/dashboard/admin/categories/${sub.id}`)}
                          className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
                        >
                          <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">
                            <Link
                              href={`/dashboard/admin/categories/${sub.id}`}
                              className="flex items-center gap-3 hover:text-[#947fff] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                <ImageWithSkeleton
                                  src={typeof sub.image === "string" ? sub.image : null}
                                  alt={sub.name}
                                  className="object-cover"
                                />
                              </div>
                              <span className="block truncate hover:underline" title={sub.name}>
                                {sub.name}
                              </span>
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            <span className="block max-w-[10rem] truncate" title={sub.attributes}>
                              {sub.attributes}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {sub.productsCount ?? "—"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {sub.status === "Active" ? (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50 text-[10px] font-MontserratMedium w-fit">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </div>
                              ) : sub.status === "Hidden" ? (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50 text-[10px] font-MontserratMedium w-fit">
                                  <EyeOff className="w-3 h-3" /> Hidden
                                </div>
                              ) : (
                                <span className="text-gray-400">Unknown</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{sub.date}</td>
                          <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer ml-auto mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRowId(activeRowId === sub.id ? null : sub.id);
                              }}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            <AnimatePresence>
                              {activeRowId === sub.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="absolute right-8 mt-2 w-36 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                                >
                                  <Link
                                    href={`/dashboard/admin/categories/${sub.id}`}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> View Details
                                  </Link>
                                  <button
                                    disabled={sub.status === "Unknown"}
                                    onClick={() => {
                                      setActiveRowId(null);
                                      handleToggleSubcategoryHide(sub.id, sub.status, sub.name);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
                                  >
                                    {sub.status === "Unknown" ? (
                                      <>Status unavailable</>
                                    ) : sub.status === "Active" ? (
                                      <>
                                        <EyeOff className="w-3.5 h-3.5" /> Hide
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3.5 h-3.5" /> Activate
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveRowId(null);
                                      handleRequestDelete(sub.id, sub.name, "subcategory");
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors cursor-pointer flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 font-MontserratNormal">
                          No subcategories available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 justify-end mt-auto">
            < Button
            variant="secondary"
              onClick={() => router.push(`/dashboard/admin/categories/create?edit=${categoryId}`)}
              className=" w-40 "
            >
              Edit
            </Button>
            <Button
            variant="danger"
              onClick={() => handleRequestDelete(categoryId, name, isSubcategory ? "subcategory" : "category")}
              className=" w-40 "
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ResultModal
        isOpen={deleteConfirmState.isOpen}
        result="warning"
        title={`Delete ${deleteConfirmState.targetType === "subcategory" ? "Subcategory" : "Category"}?`}
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
            targetType: "category",
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
        onConfirm={() => {
          const shouldRedirect = resultModalState.onConfirmRedirect;
          setResultModalState((prev) => ({ ...prev, isOpen: false }));
          if (shouldRedirect) {
            router.push("/dashboard/admin/categories");
          }
        }}
        onCancel={() => {
          const shouldRedirect = resultModalState.onConfirmRedirect;
          setResultModalState((prev) => ({ ...prev, isOpen: false }));
          if (shouldRedirect) {
            router.push("/dashboard/admin/categories");
          }
        }}
      />
    </div>
  );
}
