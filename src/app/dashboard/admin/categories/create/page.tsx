"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import CreateAttributeModal from "@/components/ui/Modals/admin/CreateAttributeModal";
import ResultModal from "@/components/ui/forms/resultModal";
import { AdminDetails } from "@/helpers/admin/adminHelper";

function CreateCategoryPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const typeParam = searchParams.get("type");
  const parentIdParam = searchParams.get("parent_id") || searchParams.get("parent");
  const isEditMode = Boolean(editId);

  const token = useSelector((state: RootState) => state.token?.token);
  const {
    createAdminCategory,
    updateAdminCategory,
    fetchAdminCategoryById,
    fetchAdminAttributes,
    fetchAdminCategories,
    fetchAdminParentCategories,
  } = AdminDetails();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [categoryType, setCategoryType] = useState<"main" | "sub">("main");

  useEffect(() => {
    if (!isEditMode) {
      if (typeParam === "sub") {
        setCategoryType("sub");
      }
      if (parentIdParam) {
        setCategoryType("sub");
        setSelectedParentCategory({ id: parentIdParam, name: "Parent Category" });
      }
    }
  }, [isEditMode, typeParam, parentIdParam]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parentCategories, setParentCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<any>(null);
  const [parentCategoriesLoading, setParentCategoriesLoading] = useState(false);

  const [attributesList, setAttributesList] = useState<{ id: string; name: string }[]>([]);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);

  // Map of attributeId → list of values entered for that attribute
  const [attributeValues, setAttributeValues] = useState<Record<string, string[]>>({});
  // Map of attributeId → current input value being typed
  const [attributeInputs, setAttributeInputs] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isCreateAttributeModalOpen, setIsCreateAttributeModalOpen] = useState(false);

  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    result: "success" | "error" | "warning";
    onConfirmRedirect?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    result: "success",
    onConfirmRedirect: false,
  });

  // Fetch attributes and parent categories on load
  useEffect(() => {
    if (token) {
      setAttributesLoading(true);
      fetchAdminAttributes(1, (data: any) => {
        const results = data?.results ?? data?.data?.results ?? data?.data ?? [];
        const attrs = (Array.isArray(results) ? results : []).map((item: any) => ({
          id: String(item.id ?? ""),
          name: item.name || "Unnamed",
        }));
        setAttributesList(attrs);
        setAttributesLoading(false);
      });

      setParentCategoriesLoading(true);
      fetchAdminParentCategories((data: any) => {
        const rawResults = data?.results ?? data?.data?.results ?? data?.data ?? [];
        const results = Array.isArray(rawResults) ? rawResults : [];
        const cats = results
          .map((item: any) => ({
            id: String(item.id ?? ""),
            name: item.name || item.title || "Unnamed",
          }))
          .filter((cat: any) => !isEditMode || cat.id !== editId);
        setParentCategories(cats);
        setParentCategoriesLoading(false);
      });
    }
  }, [token, isEditMode, editId]);

  // In edit mode: fetch the category and pre-fill all fields
  useEffect(() => {
    if (isEditMode && editId && token) {
      setIsLoadingEdit(true);
      fetchAdminCategoryById(editId, (data: any) => {
        if (!data) {
          setIsLoadingEdit(false);
          return;
        }

        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setIsHidden(data.is_active === false);

        const parentObj = typeof data.parent === "object" && data.parent !== null ? data.parent : null;
        const parentId = String(data.parent_id ?? parentObj?.id ?? (typeof data.parent === "string" || typeof data.parent === "number" ? data.parent : ""));
        const parentName = data.parent_name ?? parentObj?.name ?? parentObj?.title ?? data.parent_category ?? "";

        if (parentId && parentId !== "null" && parentId !== "undefined" && parentId.trim() !== "") {
          setCategoryType("sub");
          setSelectedParentCategory({ id: parentId, name: parentName || "Parent Category" });
        } else {
          setCategoryType("main");
          setSelectedParentCategory(null);
        }

        const attrIds: string[] = [];
        const prefilledValues: Record<string, string[]> = {};

        // 1. Process attribute_values_summary from backend
        if (Array.isArray(data.attribute_values_summary) && data.attribute_values_summary.length > 0) {
          data.attribute_values_summary.forEach((item: any) => {
            const attrId = String(item.attribute_id || item.id || "");
            if (attrId) {
              if (!attrIds.includes(attrId)) attrIds.push(attrId);
              const vals = item.values || item.attribute_values || [];
              if (Array.isArray(vals)) {
                prefilledValues[attrId] = vals.map((v: any) => typeof v === "string" ? v : v.name || v.value || String(v)).filter(Boolean);
              } else if (typeof vals === "string" && vals.trim()) {
                prefilledValues[attrId] = vals.split(/[,•]/).map((s) => s.trim()).filter(Boolean);
              }
            }
          });
        }

        // 2. Process data.attributes
        if (Array.isArray(data.attributes) && data.attributes.length > 0) {
          data.attributes.forEach((a: any) => {
            const id = String(a.id ?? a);
            if (id && !attrIds.includes(id)) {
              attrIds.push(id);
            }
            const rawVals = a.values ?? a.attribute_values ?? a.value;
            if (rawVals && (!prefilledValues[id] || prefilledValues[id].length === 0)) {
              if (Array.isArray(rawVals)) {
                prefilledValues[id] = rawVals.map((v: any) => (typeof v === "string" ? v : v.name || v.value || String(v))).filter(Boolean);
              } else if (typeof rawVals === "string" && rawVals.trim()) {
                prefilledValues[id] = rawVals.split(/[,•]/).map((s) => s.trim()).filter(Boolean);
              }
            }
          });
        } else if (Array.isArray(data.attribute_ids)) {
          data.attribute_ids.forEach((id: any) => {
            const sId = String(id);
            if (sId && !attrIds.includes(sId)) attrIds.push(sId);
          });
        }

        // 3. Process data.attribute_values if present as object
        if (data.attribute_values && typeof data.attribute_values === "object" && !Array.isArray(data.attribute_values)) {
          Object.entries(data.attribute_values).forEach(([attrId, rawVals]: [string, any]) => {
            const sId = String(attrId);
            if (sId && !attrIds.includes(sId)) attrIds.push(sId);
            if (!prefilledValues[sId] || prefilledValues[sId].length === 0) {
              if (Array.isArray(rawVals)) {
                prefilledValues[sId] = rawVals.map(String).filter(Boolean);
              } else if (typeof rawVals === "string" && rawVals.trim()) {
                prefilledValues[sId] = rawVals.split(/[,•]/).map((s) => s.trim()).filter(Boolean);
              }
            }
          });
        }

        if (attrIds.length > 0) {
          setSelectedAttributeIds(attrIds);
        }
        if (Object.keys(prefilledValues).length > 0) {
          setAttributeValues(prefilledValues);
        }

        const imgUrl = data.image ?? data.image_url ?? null;
        if (imgUrl) {
          setPreviewUrl(imgUrl);
          const parts = (imgUrl as string).split("/");
          setUploadedFileName(parts[parts.length - 1] || "Existing image");
        }

        setIsLoadingEdit(false);
      });
    }
  }, [isEditMode, editId, token]);

  // Auto-select & synchronize parent category when subcategory is active
  useEffect(() => {
    if (categoryType === "sub" && parentCategories.length > 0) {
      if (selectedParentCategory?.id) {
        const match = parentCategories.find(
          (cat) => String(cat.id) === String(selectedParentCategory.id)
        );
        if (match) {
          if (
            !selectedParentCategory.name ||
            selectedParentCategory.name === "Parent Category" ||
            selectedParentCategory.name !== match.name
          ) {
            setSelectedParentCategory(match);
          }
        }
      } else if (!selectedParentCategory) {
        setSelectedParentCategory(parentCategories[0]);
      }
    }
  }, [categoryType, parentCategories, selectedParentCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      if (img.width < 500 || img.width > 1080 || img.height < 500 || img.height > 1080) {
        toast.error(
          `Image must be between 500x500 and 1080x1080 pixels. Uploaded image is ${img.width}x${img.height}px.`
        );
      }
      setImageFile(file);
      setUploadedFileName(file.name);
      setPreviewUrl(objectUrl);
    };

    img.onerror = () => {
      toast.error("Invalid image file selected.");
    };
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setUploadedFileName(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttributeToggle = (id: string) => {
    setSelectedAttributeIds((prev) => {
      if (prev.includes(id)) {
        // When unchecking, clear its values too
        setAttributeValues((vals) => {
          const copy = { ...vals };
          delete copy[id];
          return copy;
        });
        setAttributeInputs((inputs) => {
          const copy = { ...inputs };
          delete copy[id];
          return copy;
        });
        return prev.filter((aId) => aId !== id);
      }
      return [...prev, id];
    });
  };

  const handleAddAttributeValue = (attrId: string) => {
    const raw = (attributeInputs[attrId] ?? "").trim();
    if (!raw) return;
    const existing = attributeValues[attrId] ?? [];
    if (existing.includes(raw)) {
      setAttributeInputs((prev) => ({ ...prev, [attrId]: "" }));
      return;
    }
    setAttributeValues((prev) => ({ ...prev, [attrId]: [...existing, raw] }));
    setAttributeInputs((prev) => ({ ...prev, [attrId]: "" }));
  };

  const handleRemoveAttributeValue = (attrId: string, val: string) => {
    setAttributeValues((prev) => ({
      ...prev,
      [attrId]: (prev[attrId] ?? []).filter((v) => v !== val),
    }));
  };

  const extractErrorMessage = (err: any, fallbackMsg: string) => {
    const errData = err?.response?.data || err?.data;
    if (!errData) return fallbackMsg;
    if (typeof errData === "string") return errData;
    if (typeof errData.parent_id === "string") return errData.parent_id;
    if (Array.isArray(errData.parent_id)) return errData.parent_id.join(" ");
    if (typeof errData.non_field_errors === "string") return errData.non_field_errors;
    if (Array.isArray(errData.non_field_errors)) return errData.non_field_errors.join(" ");
    if (typeof errData.detail === "string") return errData.detail;
    if (typeof errData.message === "string") return errData.message;
    if (typeof errData.name === "string") return errData.name;
    if (Array.isArray(errData.name)) return errData.name.join(" ");
    if (typeof errData.image === "string") return errData.image;
    if (Array.isArray(errData.image)) return errData.image.join(" ");
    return fallbackMsg;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    if (categoryType === "sub" && !selectedParentCategory?.id) {
      toast.error("Please select a parent category for the subcategory.");
      return;
    }

    // Every category or subcategory must have at least one attribute
    if (selectedAttributeIds.length === 0) {
      setResultModalState({
        isOpen: true,
        title: "Attribute Required",
        message: `Please select and configure at least one attribute for this ${
          categoryType === "sub" ? "subcategory" : "category"
        }. Every category and subcategory must have at least one attribute.`,
        result: "error",
        onConfirmRedirect: false,
      });
      toast.error(`A ${categoryType === "sub" ? "subcategory" : "category"} must have at least one attribute.`);
      return;
    }

    // Auto-commit any typed input into attributeValues before checking
    const updatedAttributeValues = { ...attributeValues };
    selectedAttributeIds.forEach((attrId) => {
      const pendingInput = (attributeInputs[attrId] ?? "").trim();
      if (pendingInput) {
        const existing = updatedAttributeValues[attrId] ?? [];
        if (!existing.includes(pendingInput)) {
          updatedAttributeValues[attrId] = [...existing, pendingInput];
        }
      }
    });

    // Check if any selected attribute has no value added
    const unvaluedAttributes = selectedAttributeIds.filter((attrId) => {
      const values = updatedAttributeValues[attrId] ?? [];
      return values.length === 0;
    });

    if (unvaluedAttributes.length > 0) {
      const attrNames = unvaluedAttributes
        .map((id) => attributesList.find((a) => a.id === id)?.name || "Selected Attribute")
        .join(", ");

      setResultModalState({
        isOpen: true,
        title: "Attribute Value Required",
        message: `Please enter at least one value for each selected attribute. Missing values for: ${attrNames}.`,
        result: "error",
        onConfirmRedirect: false,
      });
      toast.error(`Please enter at least one value for: ${attrNames}`);
      return;
    }

    setAttributeValues(updatedAttributeValues);
    setIsSubmitting(true);
    const parentIdValue = categoryType === "sub" ? selectedParentCategory?.id || "" : "";
    const isSubcategory = categoryType === "sub";

    let payload: FormData | Record<string, any>;

    if (imageFile) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("is_active", String(!isHidden));
      formData.append("parent_id", parentIdValue);
      formData.append("parent", parentIdValue);

      if (isSubcategory) {
        formData.append(
          "inherit_parent_attributes",
          String(selectedAttributeIds.length === 0)
        );
      }

      if (selectedAttributeIds.length > 0) {
        selectedAttributeIds.forEach((attrId) => {
          formData.append("attribute_ids", attrId);
        });
      }

      // Serialize attribute_values as JSON string for FormData
      if (Object.keys(updatedAttributeValues).length > 0) {
        formData.append("attribute_values", JSON.stringify(updatedAttributeValues));
      }

      formData.append("image", imageFile);
      payload = formData;
    } else {
      payload = {
        name: name.trim(),
        description: description.trim(),
        is_active: !isHidden,
        parent_id: parentIdValue,
        attribute_ids: selectedAttributeIds,
        attribute_values: updatedAttributeValues,
        ...(isSubcategory && {
          inherit_parent_attributes: selectedAttributeIds.length === 0,
        }),
      };
    }

    if (isEditMode && editId) {
      updateAdminCategory(
        editId,
        payload,
        (_res: any) => {
          setIsSubmitting(false);
          setResultModalState({
            isOpen: true,
            title: "Category Updated!",
            message: `Category "${name.trim()}" has been updated successfully.`,
            result: "success",
            onConfirmRedirect: true,
          });
        },
        (err: any) => {
          setIsSubmitting(false);
          const errMsg = extractErrorMessage(err, "Failed to update category.");
          setResultModalState({
            isOpen: true,
            title: "Failed to Update Category",
            message: errMsg,
            result: "error",
            onConfirmRedirect: false,
          });
        }
      );
    } else {
      createAdminCategory(
        payload,
        (_res: any) => {
          setIsSubmitting(false);
          setResultModalState({
            isOpen: true,
            title: "Category Created!",
            message: `Category "${name.trim()}" has been created successfully.`,
            result: "success",
            onConfirmRedirect: true,
          });
        },
        (err: any) => {
          setIsSubmitting(false);
          const errMsg = extractErrorMessage(err, "Failed to create category.");
          setResultModalState({
            isOpen: true,
            title: "Failed to Create Category",
            message: errMsg,
            result: "error",
            onConfirmRedirect: false,
          });
        }
      );
    }
  };

  return (
    <div className="space-y-6 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-black" />
          </span>
          <h1 className="text-c18 font-MontserratSemiBold text-black">
            {isEditMode ? "Update Category" : "Create Category"}
          </h1>
        </button>
      </div>

      {/* Loading overlay for edit fetch */}
      {isLoadingEdit && (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size={32} color="border-purple-600" />
        </div>
      )}

      {/* Main Form */}
      {!isLoadingEdit && (
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100">
          {/* Basic Information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-MontserratSemiBold text-black">
                Basic Category Information
              </h2>
              <div className="flex items-center gap-3">
                <span className="font-MontserratSemiBold text-base text-black">
                  Hide
                </span>
                <button
                  type="button"
                  onClick={() => setIsHidden(!isHidden)}
                  className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                    isHidden ? "bg-gray-300" : "bg-gray-100"
                  }`}
                >
                  <motion.div
                    animate={{ x: isHidden ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-[0px_3px_8px_0px_#6A0DAD14]"
                  />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="block mb-2 text-sm text-gray-700">
                  Name of Category
                </Label>
                <Input
                  type="text"
                  className="rounded-xl"
                  placeholder="e.g. Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-2 text-sm text-gray-700">
                  Category Description
                </Label>
                <Textarea
                  placeholder="Enter description..."
                  className="min-h-[120px] rounded-xl"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="mb-8">
            <h2 className="text-sm font-MontserratMedium text-000000/68 mb-2">
              Category Image
            </h2>
            <div className="flex flex-col md:flex-row border border-000000/12 h-70 rounded-xl overflow-hidden">
              {/* Upload Area */}
              <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-000000/12 bg-white">
                <p className="text-c12 font-MontserratMedium text-000000/68 mb-3">
                  Upload Image
                </p>
                <p className="text-xs font-MontserratNormal leading-c16 max-w-114.25 text-000000/68 mb-21">
                  Images need to be between 500x500 and 1080x1080. White
                  backgrounds are advised
                </p>

                <div className="relative flex items-center border border-gray-200 rounded-lg overflow-hidden h-12 w-full max-w-[400px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full px-6 bg-[#6a0dad] text-white flex items-center gap-2.5 font-MontserratSemiBold text-base whitespace-nowrap hover:bg-purple-800 transition-colors"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                    <span>Add File</span>
                  </button>
                  <div className="flex-1 px-4 text-sm font-MontserratMedium text-gray-400 truncate flex items-center justify-between">
                    {uploadedFileName ? (
                      <span className="text-gray-700">{uploadedFileName}</span>
                    ) : (
                      <span>Upload photo</span>
                    )}
                    {uploadedFileName && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="bg-000000/44 rounded-full flex items-center justify-center w-4 h-4"
                      >
                        <X className="w-3 h-3 text-ffffff" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex-1 p-4 bg-white">
                <p className="text-c12 font-MontserratMedium text-000000/68 mb-6">
                  Preview
                </p>
                <div className="w-full max-w-75 mx-auto h-50 bg-ffffff shadow-[0px_3px_8px_0px_#6A0DAD14] rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Choose Main Category or Subcategory */}
          <div className="mb-6">
            <label className="block text-c12 font-MontserratMedium mb-2">
              Choose Category or Subcategory
            </label>
            <div className="border border-000000/12 rounded-c8 p-4 flex items-center gap-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer w-40">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    categoryType === "main"
                      ? "border-[#df6b62] bg-[#df6b62]"
                      : "border-gray-300"
                  }`}
                >
                  {categoryType === "main" && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-3.5 h-3.5 text-white"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-c12 font-MontserratMedium text-000000/68">
                  Main Category
                </span>
                <input
                  type="radio"
                  className="hidden"
                  checked={categoryType === "main"}
                  onChange={() => setCategoryType("main")}
                />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    categoryType === "sub"
                      ? "border-[#df6b62] bg-[#df6b62]"
                      : "border-gray-300"
                  }`}
                >
                  {categoryType === "sub" && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-3.5 h-3.5 text-white"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-c12 font-MontserratMedium text-000000/68">
                  Subcategory
                </span>
                <input
                  type="radio"
                  className="hidden"
                  checked={categoryType === "sub"}
                  onChange={() => setCategoryType("sub")}
                />
              </label>
            </div>

            {/* Conditional Parent Category Dropdown */}
            {categoryType === "sub" && (
              <div className="animate-in fade-in slide-in-from-top-2 pl-6 duration-300">
                <Dropdown
                  label="Select Parent Category"
                  selected={selectedParentCategory?.name}
                  onSelect={(item) => setSelectedParentCategory(item)}
                  fetchItems={() => {}}
                  items={parentCategories}
                  loading={parentCategoriesLoading}
                  placeholder="Select Category"
                />
              </div>
            )}
          </div>

          {/* Select Attribute */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-c12 font-MontserratSemiBold text-black flex items-center gap-1">
                  Select Attribute <span className="text-[#ca0202]">*</span>
                </h2>
                <p className="text-[11px] font-MontserratNormal text-000000/68 mt-0.5">
                  Every category or subcategory must have at least one attribute with at least one value.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setIsCreateAttributeModalOpen(true)}
                variant="secondary"
                className="max-w-40"
              >
                Create Attribute
              </Button>
            </div>

            <div className={`border px-4 rounded-c16 overflow-hidden transition-colors ${
              selectedAttributeIds.length === 0 ? "border-[#ca0202]/30" : "border-000000/12"
            }`}>
              {attributesLoading ? (
                <div className="py-6 flex justify-center">
                  <LoadingSpinner size={24} color="border-ff715b" />
                </div>
              ) : attributesList.length > 0 ? (
                <div className="flex flex-col ">
                  {attributesList.map((attr) => {
                    const isChecked = selectedAttributeIds.includes(attr.id);
                    const values = attributeValues[attr.id] ?? [];
                    const inputVal = attributeInputs[attr.id] ?? "";
                    const isMissingValues = isChecked && values.length === 0 && !inputVal.trim();

                    return (
                      <div key={attr.id} className="">
                        {/* Attribute row */}
                        <label className="flex items-center gap-3 my-4 cursor-pointer select-none">
                          <div
                            className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-[#df6b62] border-[#df6b62]"
                                : "border-gray-300"
                            }`}
                          >
                            {isChecked && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-3 h-3 text-white"
                              >
                                <path
                                  d="M5 12L10 17L20 7"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-c12 tracking-[1%] font-MontserratMedium text-000000/68">
                            {attr.name}
                          </span>
                          {isChecked && values.length > 0 && (
                            <span className="text-[11px] font-MontserratMedium text-[#00BE5C] bg-[#00BE5C]/10 px-2 py-0.5 rounded-full ml-2">
                              {values.length} value{values.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {isMissingValues && (
                            <span className="text-[11px] font-MontserratMedium text-[#ca0202] bg-[#ca0202]/10 px-2 py-0.5 rounded-full ml-2">
                              Value required
                            </span>
                          )}
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isChecked}
                            onChange={() => handleAttributeToggle(attr.id)}
                          />
                        </label>

                        {/* Expanded value entry panel */}
                        <AnimatePresence initial={false}>
                          {isChecked && (
                            <motion.div
                              key="expanded"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className={`px-4 pb-6 pt-4 border rounded-c8 transition-colors ${
                                values.length === 0 ? "border-[#ca0202]/40 bg-[#fff5f5]/30" : "border-000000/12"
                              }`}>
                                {/* Added value chips */}
                                {values.length > 0 && (
                                  <div className="mb-6">
                                    <p className="text-[12px] font-MontserratMedium text-000000/68 mb-4">
                                      Added values
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                      {values.map((val) => (
                                        <span
                                          key={val}
                                          className="flex items-center gap-3 px-4 py-2 border border-ff715b rounded-c8 text-[12px] font-MontserratMedium text-ff715b"
                                        >
                                          {val}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveAttributeValue(attr.id, val)
                                            }
                                            className="flex-shrink-0 flex items-center justify-center"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {values.length === 0 && (
                                  <p className="text-[12px] font-MontserratMedium text-[#ca0202] mb-3">
                                    * Please enter at least one value for {attr.name}
                                  </p>
                                )}

                                {/* Value input */}
                                <div>
                                 <Label>Value</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      placeholder={`e.g. Red, Large…`}
                                      value={inputVal}
                                      onChange={(e) =>
                                        setAttributeInputs((prev) => ({
                                          ...prev,
                                          [attr.id]: e.target.value,
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleAddAttributeValue(attr.id);
                                        }
                                      }}
                                      className="flex-1 max-w-174"
                                    />
                                    <button
                                      type="button"
                                      disabled={!inputVal.trim()}
                                      onClick={() => handleAddAttributeValue(attr.id)}
                                      className="flex items-center gap-1 text-ff715b text-[12px] font-MontserratMedium disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap hover:opacity-80 transition-opacity"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add value
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-c12 text-gray-400 py-4 px-4">No attributes found.</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="max-w-40"
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="max-w-40 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size={18} color="border-white" />
              ) : isEditMode ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </div>
      )}

      <CreateAttributeModal
        isOpen={isCreateAttributeModalOpen}
        onClose={() => setIsCreateAttributeModalOpen(false)}
        onSuccess={(newAttr) => {
          if (token) {
            fetchAdminAttributes(1, (data: any) => {
              const results = data?.results ?? [];
              const attrs = results.map((item: any) => ({
                id: String(item.id ?? ""),
                name: item.name || "Unnamed",
              }));
              setAttributesList(attrs);
              if (newAttr?.name) {
                const created = attrs.find(
                  (a: any) => a.name.toLowerCase() === newAttr.name.toLowerCase()
                );
                if (created && !selectedAttributeIds.includes(created.id)) {
                  setSelectedAttributeIds((prev) => [...prev, created.id]);
                }
              }
            });
          }
        }}
      />

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

export default function CreateCategoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><LoadingSpinner size={32} color="border-purple-600" /></div>}>
      <CreateCategoryPageInner />
    </Suspense>
  );
}
