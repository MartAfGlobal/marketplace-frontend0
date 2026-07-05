"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { Button } from "@/components/ui/Button/Button";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);
  const [categoryType, setCategoryType] = useState<"main" | "sub">("main");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    "Colour",
  ]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const [selectedParentCategory, setSelectedParentCategory] = useState<any>(null);

  const parentCategories = [
    { id: "fashion", name: "Fashion" },
    { id: "electronics", name: "Electronics" },
    { id: "home", name: "Home & Kitchen" },
  ];

  const attributes = [
    "Colour",
    "Size",
    "Material",
    "Weight",
    "Warranty",
    "Storage Capacity",
  ];

  const handleAttributeToggle = (attr: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr],
    );
  };

  return (
    <div className="  space-y-6 min-h-screen pb-12">
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
            Create Category
          </h1>
        </button>
      </div>

      {/* Main Form */}
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
                onClick={() => setIsHidden(!isHidden)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${isHidden ? "bg-gray-300" : "bg-gray-100"}`}
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
              <Input type="text" className="rounded-xl" />
            </div>

            <div>
              <Label className="block mb-2 text-sm text-gray-700">
                Category Description
              </Label>
              <Textarea
                placeholder="input"
                className="min-h-[120px] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Category Image */}
        <div className="mb-8">
          <h2 className="text-sm font-MontserratMedium text-000000/68 mb-2  ">
            Category Image
          </h2>
          <div className="flex flex-col md:flex-row border border-000000/12 h-70 rounded-xl overflow-hidden">
            {/* Upload Area */}
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-000000/12  bg-white">
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
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full px-6 bg-[#6a0dad]  text-white flex items-center gap-2.5 font-MontserratSemiBold text-base whitespace-nowrap hover:bg-purple-800 transition-colors"
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
                      onClick={handleRemoveFile}
                      className="bg-000000/44 rounded-full flex items-center justify-center w-4 h-4"
                    >
                      <X className=" w-3 h-3 text-ffffff" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-4 bg-white">
              <p className="text-c12 font-MontserratMedium  text-000000/68 mb-6">
                Preview
              </p>
              <div className="w-full  max-w-75 mx-auto h-50 bg-ffffff shadow-[0px_3px_8px_0px_#6A0DAD14] rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
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
          <label className="block text-C12 font-MontserratMedium  mb-2">
            Choose Category or Subcategory
          </label>
          <div className="border border-000000/12 rounded-c8 p-4 flex items-center gap-4 mb-4">
            <label className="flex items-center gap-3 cursor-pointer w-40">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${categoryType === "main" ? "border-[#df6b62] bg-[#df6b62]" : "border-gray-300"}`}
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
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${categoryType === "sub" ? "border-[#df6b62] bg-[#df6b62]" : "border-gray-300"}`}
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
                loading={false}
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
              onClick={() =>
                router.push("/dashboard/admin/categories/create-attribute")
              }
              variant="secondary"
              className="max-w-40"
            >
              Create Attribute
            </Button>
          </div>

          <div className="border border-000000/12 rounded-c8  p-4">
            <div className="flex flex-col gap-4">
              {attributes.map((attr) => {
                const isChecked = selectedAttributes.includes(attr);
                return (
                  <label
                    key={attr}
                    className="flex items-center gap-2 cursor-pointer  "
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-[#df6b62] border-[#df6b62]" : "border-gray-300 group-hover:border-gray-400"}`}
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
                      {attr}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={() => handleAttributeToggle(attr)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={() => router.back()}
            className="max-w-40 "
            variant="secondary"
          >
            Cancel
          </Button>
          <Button className="max-w-40">
            Create Category
          </Button>
        </div>
      </div>
    </div>
  );
}
