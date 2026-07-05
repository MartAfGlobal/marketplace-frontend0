"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import ApproveProductModal from "@/components/ui/Modals/admin/ApproveProductModal";
import RejectProductModal from "@/components/ui/Modals/admin/RejectProductModal";

import ProductImage from "@/assets/admin/productMainImage.svg";

export default function ProductReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const variantsScrollRef = useRef<HTMLDivElement>(null);

  const scrollVariants = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? Math.max(0, variantIndex - 2)
        : Math.min(variants.length - 1, variantIndex + 2);
    setVariantIndex(newIndex);
  };

  const images = Array(6).fill(ProductImage);

  // Mock Variants Data
  const variants = [
    {
      id: 1,
      sku: "123PKU6785",
      color: "Black",
      size: "XS",
      quantity: 20,
      material: "Silk",
    },
    {
      id: 2,
      sku: "123PKU6786",
      color: "Red",
      size: "S",
      quantity: 15,
      material: "Cotton",
    },
  ];

  // Checklist state
  const checklistSections = [
    {
      title: "1. Product Information Accuracy",
      items: [
        "Product title is clear and not misleading",
        "Description matches the actual product",
        "Specifications are complete and accurate",
        "Brand information is accurate",
        "Category selection is correct",
      ],
    },
    {
      title: "2. Images & Media Quality",
      items: [
        "Images clearly show the product.",
        "Images match description",
        "No stock or copyrighted images",
        "No watermarks or promotional text",
        "No inappropriate or offensive visuals",
      ],
    },
    {
      title: "3. Policy & Compliance Check",
      items: [
        "Product is not restricted or banned",
        "Complies with platform rules",
        "No counterfeit or replica claims",
        "No illegal, unsafe, or regulated items",
        "No policy red flags",
      ],
    },
    {
      title: "4. Pricing & Listing Integrity",
      items: [
        "Price is reasonable for the category",
        "No hidden charges",
        "No misleading discounts",
        "Stock quantity looks realistic",
        "Variants are correctly priced",
      ],
    },
    {
      title: "5. Seller Credibility",
      items: [
        "Seller profile is complete",
        "Required documents submitted",
        "Seller status is active",
      ],
    },
  ];

  const totalItems = checklistSections.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const percentage = Math.round((completedCount / totalItems) * 100) || 0;

  // SVG parameters for progress circle
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-000000" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">
            Product Review Checklist
          </h1>
        </button>

        <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 text-[#ff715b]" />
        </button>
      </div>

      {/* Top Banner - Product Details & Progress */}
      <div className="bg-ffffff rounded-c16   p-6">
        <div className="flex items-end w-full bg-ffffff rounded-c12 h-43 justify-between shadow-[0px_3px_8px_0px_#6A0DAD14] p-6 mb-12">
          <div className="flex gap-6 items-center">
            <div className="h-30 fl">
              <Image
                src={ProductImage}
                alt="Product"
                width={120}
                height={120}
                className="rounded-c8 h-30 w-30 object-cover"
              />
            </div>
            <div className="flex flex-col justify-between h-35 text-base font-MontserratSemiBold py-2">
              <h2 className="text-c20 font-MontserratSemiBold ">
                Product Name
              </h2>

              <div className="flex items-center gap-2">
                <span>Seller:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#ffac06] rounded-full flex items-center justify-center text-[2.88px] text-center">
                    COMPANY LOGO
                  </div>
                  <span className=" font-MontserratSemiBold text-000000/68">
                    KYZ co. Ltd
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <span className="bg-[#ffac06]/12 w-25 flex items-center justify-center h-8 text-[#ffac06] px-2 py-0.5 rounded-c16 text-[12px] font-MontserratSemiBold">
                  Pending
                </span>
              </div>
            </div>
          </div>
          <div className=" gap-x-8 gap-y-5.5 py-2 text-base  flex flex-col items-end font-MontserratSemiBold">
            <div className="flex items-center gap-2">
              <span>Category: </span>
              <span className="text-000000/68">Fashion</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Date: </span>
              <span className="text-000000/68">12/12/2025</span>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center ">
            <div className="relative w-24 h-24  flex items-center justify-center mb-4">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-[#D9D9D9]"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-[#6A0DAD] transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6A0DAD]">
                <span className="text-base font-MontserratSemiBold leading-none">
                  {percentage}%
                </span>
                <span className="text-[12px] font-MontserratMedium leading-none">
                  {completedCount}/{totalItems}
                </span>
              </div>
            </div>
            <p className="font-MontserratSemiBold text-base">
              Frank Duke <span className="text-000000/68">(Admin Role)</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 min-w-0 items-start relative">
          {/* Left Side - Product Details (Same as details page, but narrower) */}
          <div className="w-full xl:w-[50%] min-w-0 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar pb-6">
            {/* Main Image */}
            <div className="rounded-c16  overflow-hidden w-full h-90 relative mb-6">
              <Image src={ProductImage} alt="Main Product" fill />
            </div>

            {/* Progress / Image indicator bar */}
            <div className="flex gap-4 mb-8">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`border-4   transition-all duration-300 ${
                    activeImage === idx
                      ? "flex-[2] max-w-36 border-000000/68"
                      : "flex-1 max-w-10 border-000000/4"
                  }`}
                ></div>
              ))}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-[66.81px] h-[66.81px] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? "border-[#ff715b]" : "border-transparent"}`}
                >
                  <Image
                    src={ProductImage}
                    alt={`Thumb ${idx}`}
                    width={66.81}
                    height={66.81}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mb-6 mt-8">
              <h3 className="text-base font-MontserratSemiBold mb-3">
                Product Description
              </h3>
              <p className="text-xs  font-MontserratNormal">
                Lorem ipsum dolor sit amet consectetur. Et id in non arcu eu
                elit facilisi ut tellus. Habitant pellentesque turpis turpis vel
                vitae vestibulum. Congue nunc tempus eget mi. Placerat laoreet
                in ultricies at. Lorem hac pharetra ullamcorper maecenas purus.
                Et ornare sollicitudin eget est volutpat fames dictumst
                scelerisque mattis. Dui scelerisque fermentum sapien cras id
                dignissim aenean. Etiam ultrices sed diam odio ligula ornare
                augue posuere.
              </p>
            </div>
            <div className="w-full flex  max-w-132 border border-00000/12 rounded-c8 mb-c32">
              <div className="  w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12">
                <h4 className="text-base font-MontserratSemiBold leading-[24px]">
                  Category
                </h4>
                <p className="text-c12 font-MontserratNormal leading-[16px]">
                  Fashion
                </p>
              </div>
              <div className="w-full max-w-66 px-4 py-3 flex flex-col gap-4">
                <h4 className="text-base font-MontserratSemiBold leading-[24px]">
                  Subcategory
                </h4>
                <p className="text-c12 font-MontserratNormal leading-[16px]">
                  Adult Wears
                </p>
              </div>
            </div>

            {/* Variants */}
            <div className="mb-8 w-full min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-MontserratSemiBold leading-6">
                  Variants ({variants.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollVariants("left")}
                    disabled={variantIndex === 0}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => scrollVariants("right")}
                    disabled={variantIndex + 2 >= variants.length}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {variants
                  .slice(variantIndex, variantIndex + 2)
                  .map((variant) => (
                    <div
                      key={variant.id}
                      className="flex gap-3 border border-gray-200 rounded-xl p-3 min-w-0 overflow-hidden"
                    >
                      <div className="flex-shrink-0">
                        <p className="text-xs font-MontserratSemiBold mb-3 leading-4 truncate max-w-[80px]">
                          Variation Name
                        </p>
                        <Image
                          src={ProductImage}
                          alt="Variant"
                          width={80}
                          height={80}
                          className="rounded-c8 object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 text-[11px] min-w-0 flex-1">
                        <p className="flex truncate">
                          <span className="text-gray-500 mr-1">SKU:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.sku}
                          </span>
                        </p>
                        <p className="flex truncate">
                          <span className="text-gray-500 mr-1">Colour:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.color}
                          </span>
                        </p>
                        <p className="flex truncate">
                          <span className="text-gray-500 mr-1">Size:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.size}
                          </span>
                        </p>
                        <p className="flex truncate">
                          <span className="text-gray-500 mr-1">Quantity:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.quantity}
                          </span>
                        </p>
                        <p className="flex truncate">
                          <span className="text-gray-500 mr-1">Material:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.material}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Price and Stock */}

            <div className="mt-c32 space-y-6 ">
              <h3 className="text-base font-MontserratSemiBold leading-[24px] ">
                Price and Stock
              </h3>
              <div className="    ">
                <div className="w-full   flex gap-20">
                  <div className=" flex-col flex truncate min-w-18.75 gap-8">
                    <p className="text-sm font-MontserratSemiBold ">Price</p>
                    <p className="text-xs font-MontserratSemiBold text-161616 ">
                      ₦20,000
                    </p>
                  </div>
                  <div className="  w-full space-y-4">
                    <p className="text-sm font-MontserratSemiBold ">
                      Price Range
                    </p>
                    <div className="flex gap-6 w-full flex-wrap">
                      <div className="space-y-1 w-full max-w-23.5 truncate">
                        <p className="font-MontserratNormal text-xs text-000000/68">
                          Variation Name
                        </p>
                        <p className="text-xs font-MontserratSemiBold text-161616 text-center">
                          ₦18,000
                        </p>
                      </div>
                      <div className="space-y-1 w-full max-w-23.5 truncate">
                        <p className="font-MontserratNormal text-xs text-000000/68">
                          Variation Name
                        </p>
                        <p className="text-xs font-MontserratSemiBold text-161616 text-center">
                          ₦18,000
                        </p>
                      </div>
                      <div className="space-y-1 w-full max-w-23.5 truncate">
                        <p className="font-MontserratNormal text-xs text-000000/68">
                          Variation Name
                        </p>
                        <p className="text-xs font-MontserratSemiBold text-161616 text-center">
                          ₦18,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-20 ">
                <div className="w-ful truncate w-18.75">
                  <p className="text-sm font-MontserratSemiBold">Stock</p>
                  <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                    200
                  </p>
                </div>
                <div className="">
                  <p className="text-sm font-MontserratSemiBold">
                    Discount Type
                  </p>
                  <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                    Percentage (%)
                  </p>
                </div>
              </div>
              <div className="flex gap-20 w-full ">
                <div className=" w-full truncate max-w-18.75">
                  <p className="text-sm font-MontserratSemiBold">Discount</p>
                  <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                    20%
                  </p>
                </div>
                <div className="  w-full">
                  <p className="text-sm font-MontserratSemiBold">
                    Discount Duration
                  </p>
                  <div className="flex justify-between w-full">
                    <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                      <span className="text-gray-400 mr-1">From:</span>{" "}
                      10-06-2025
                    </p>
                    <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                      <span className="text-gray-400 mr-1">To:</span> 10-07-2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Review Checklist */}
          <div className="w-full xl:w-[50%] flex flex-col min-w-0 sticky top-6 h-[calc(100vh-3rem)] pb-6">
            <div className="flex-1 overflow-y-auto pr-4 mb-8 no-scrollbar">
              {checklistSections.map((section, sIdx) => (
                <div key={sIdx} className="mb-6">
                  <h3 className="text-sm font-MontserratSemiBold  mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, iIdx) => (
                      <label
                        key={iIdx}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            checkedItems[item]
                              ? "bg-[#ff715b] border-[#ff715b]"
                              : "border-gray-300 group-hover:border-[#ff715b]"
                          }`}
                        >
                          {checkedItems[item] && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <span className="text-xs font-MontserratMedium ">
                          {item}
                        </span>
                        {/* Hidden checkbox for accessibility */}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!checkedItems[item]}
                          onChange={() => handleCheck(item)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4 flex justify-end gap-4 border-t border-gray-100">
              <Button className="bg-transparent text-[#ff715b] border border-[#ff715b] hover:bg-[#ffe8e8] w-36 h-12">
                Message Seller
              </Button>
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                className="bg-[#2ea37d] text-white hover:bg-[#258264] w-32 h-12"
              >
                Approve
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                className="bg-[#d32f2f] text-white hover:bg-[#b71c1c] w-32 h-12"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>

        <ApproveProductModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={(notes) => {
            console.log("Approved with notes:", notes);
            setIsApproveModalOpen(false);
            router.push("/dashboard/admin/products?type=listings");
          }}
        />
        <RejectProductModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={(data) => {
            console.log("Rejected with reason:", data.reason, "and notes:", data.notes);
            setIsRejectModalOpen(false);
            router.push("/dashboard/admin/products?type=listings");
          }}
        />
      </div>
    </div>
  );
}
