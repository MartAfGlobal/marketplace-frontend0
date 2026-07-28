"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
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
  const isEditMode = Boolean(editId);

  const token = useSelector((state: RootState) => state.token?.token);
  const {
    createAdminCategory,
    updateAdminCategory,
    fetchAdminCategoryById,
    fetchAdminAttributes,
    fetchAdminCategories,
  } = AdminDetails();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [categoryType, setCategoryType] = useState<"main" | "sub">("main");

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
        const results = data?.results ?? [];
        const attrs = results.map((item: any) => ({
          id: String(item.id ?? ""),
          name: item.name || "Unnamed",
        }));
        setAttributesList(attrs);
        setAttributesLoading(false);
      });

      setParentCategoriesLoading(true);
      fetchAdminCategories(1, (data: any) => {
        const results = data?.results ?? [];
        const cats = results.map((item: any) => ({
          id: String(item.id ?? ""),
          name: item.name || "Unnamed",
        }));
        setParentCategories(cats);
        setParentCategoriesLoading(false);
      });
    }
  }, [token]);

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

        // Determine main vs sub
        if (data.parent || data.parent_id) {
          setCategoryType("sub");
          const parentId = String(data.parent_id ?? data.parent ?? "");
          const parentName = data.parent_name ?? "";
          if (parentId) {
            setSelectedParentCategory({ id: parentId, name: parentName });
          }
        } else {
          setCategoryType("main");
        }

        // Pre-fill attributes
        if (Array.isArray(data.attributes) && data.attributes.length > 0) {
          const attrIds = data.attributes.map((a: any) => String(a.id ?? a));
          setSelectedAttributeIds(attrIds);
        } else if (Array.isArray(data.attribute_ids)) {
          setSelectedAttributeIds(data.attribute_ids.map(String));
        }

        // Pre-fill image preview
        const imgUrl = data.image ?? data.image_url ?? null;
        if (imgUrl) {
          setPreviewUrl(imgUrl);
          // Show a friendly filename based on the URL
          const parts = (imgUrl as string).split("/");
          setUploadedFileName(parts[parts.length - 1] || "Existing image");
        }

        setIsLoadingEdit(false);
      });
    }
  }, [isEditMode, editId, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check image dimensions client-side before upload (500x500 to 1080x1080px constraint)
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
    setSelectedAttributeIds((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("is_active", String(!isHidden));

    if (selectedAttributeIds.length > 0) {
      selectedAttributeIds.forEach((attrId) => {
        formData.append("attribute_ids", attrId);
      });
    }

    if (categoryType === "sub" && selectedParentCategory?.id) {
      formData.append("parent", selectedParentCategory.id);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return formData;
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

    setIsSubmitting(true);
    const formData = buildFormData();

    if (isEditMode && editId) {
      // UPDATE
      updateAdminCategory(
        editId,
        formData,
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
          const errData = err?.response?.data || err?.data;
          let errMsg = "Failed to update category.";
          if (errData) {
            if (typeof errData.image === "string") errMsg = errData.image;
            else if (Array.isArray(errData.image)) errMsg = errData.image.join(" ");
            else if (typeof errData.message === "string") errMsg = errData.message;
            else if (typeof errData.detail === "string") errMsg = errData.detail;
          }
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
      // CREATE
      createAdminCategory(
        formData,
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
          const errData = err?.response?.data || err?.data;
          let errMsg = "Failed to create category.";
          if (errData) {
            if (typeof errData.image === "string") errMsg = errData.image;
            else if (Array.isArray(errData.image)) errMsg = errData.image.join(" ");
            else if (typeof errData.message === "string") errMsg = errData.message;
            else if (typeof errData.detail === "string") errMsg = errData.detail;
          }
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-c12 font-MontserratMedium text-black">
                Select Attribute
              </h2>
              <Button
                type="button"
                onClick={() => setIsCreateAttributeModalOpen(true)}
                variant="secondary"
                className="max-w-40"
              >
                Create Attribute
              </Button>
            </div>

            <div className="border border-000000/12 rounded-c8 p-4">
              {attributesLoading ? (
                <div className="py-6 flex justify-center">
                  <LoadingSpinner size={24} color="border-ff715b" />
                </div>
              ) : attributesList.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                  {attributesList.map((attr) => {
                    const isChecked = selectedAttributeIds.includes(attr.id);
                    return (
                      <label
                        key={attr.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#df6b62] border-[#df6b62]"
                              : "border-gray-300 group-hover:border-gray-400"
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
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleAttributeToggle(attr.id)}
                        />
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-c12 text-gray-400 py-2">No attributes found.</p>
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
