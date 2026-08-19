"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import ApproveProductModal from "@/components/ui/Modals/admin/ApproveProductModal";
import RejectProductModal from "@/components/ui/Modals/admin/RejectProductModal";
import ResultModal from "@/components/ui/forms/resultModal";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminProductDetail } from "@/types/global";

import ProductImage from "@/assets/admin/productMainImage.svg";

// Using a placeholder for images since it's UI only
const placeholderImage =
  "https://via.placeholder.com/400x400/111111/FFFFFF?text=Product+Image";
const thumbnailImage =
  "https://via.placeholder.com/60x60/111111/FFFFFF?text=Thumb";

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
  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    result: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    result: "success",
    title: "",
    message: "",
  });
  const [variantIndex, setVariantIndex] = useState(0);
  const variantsScrollRef = useRef<HTMLDivElement>(null);
  const {
    fetchAdminSellersProductDetails,
    updateAdminProductReviewChecklist,
    approveAdminProduct,
    loading,
  } = AdminDetails();

  const productId = unwrappedParams.id;
  const token = useSelector((state: RootState) => state.token?.token);
  const product = useSelector(
    (state: RootState) =>
      (state as any).adminProductDetail?.product as AdminProductDetail | null
  );

  useEffect(() => {
    if (token) {
      fetchAdminSellersProductDetails(productId);
    }
  }, [token, productId]);

  const scrollVariants = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? Math.max(0, variantIndex - 2)
        : Math.min(variants.length - 1, variantIndex + 2);
    setVariantIndex(newIndex);
  };

  // ── Helper to extract attributes from any variation ─────────────────────────
  const getVariantAttributes = (v: any) => {
    const list: { name: string; value: string }[] = [];
    if (v.attribute_summary && typeof v.attribute_summary === "object") {
      Object.entries(v.attribute_summary).forEach(([key, val]) => {
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          list.push({ name: key, value: String(val) });
        }
      });
    }
    if (list.length === 0 && Array.isArray(v.attributes)) {
      v.attributes.forEach((a: any) => {
        const n = a.name || a.attribute_name || a.title || "Attribute";
        const val = a.value || a.attribute_value || a.val || "—";
        list.push({ name: n, value: String(val) });
      });
    }
    if (list.length === 0 && v.variation_values && typeof v.variation_values === "object") {
      Object.entries(v.variation_values).forEach(([key, val]) => {
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          list.push({ name: key, value: String(val) });
        }
      });
    }
    return list;
  };

  // ── Real images (fallback to 6 placeholders if not loaded yet) ──────────────
  const galleryUrls: string[] = [];
  if (product?.main_image) galleryUrls.push(product.main_image);
  product?.images?.forEach((img: any) => {
    const url = typeof img === "string" ? img : img.medium || img.large || img.thumbnail || img.url || img.image || "";
    if (url && !galleryUrls.includes(url)) galleryUrls.push(url);
  });
  const images = galleryUrls.length > 0 ? galleryUrls : Array(6).fill(thumbnailImage);

  // ── Real variants (fallback to mock while loading) ───────────────────────────
  const variants = product?.variations?.length
    ? product.variations.map((v: any) => {
        const attrList = getVariantAttributes(v);
        const colorVal = v.attribute_summary?.["Color"] ?? v.attribute_summary?.["Colour"] ?? "—";
        const sizeVal = v.attribute_summary?.["Size"] ?? "—";
        const materialVal = v.attribute_summary?.["Material"] ?? "—";
        const imgUrl = v.main_image || v.image || v.thumbnail || (Array.isArray(v.images) ? v.images[0]?.thumbnail || v.images[0]?.url : null);
        return {
          id: v.id,
          sku: v.sku || "—",
          name: v.name || v.title || "Variation",
          quantity: v.stock ?? v.inventory ?? v.quantity ?? 0,
          color: colorVal,
          size: sizeVal,
          material: materialVal,
          attributesList: attrList,
          thumb: imgUrl,
        };
      })
    : [
        {
          id: 1,
          sku: "123PKU6785",
          name: "Variation Name",
          color: "Black",
          size: "XS",
          quantity: 20,
          material: "Silk",
          attributesList: [
            { name: "Colour", value: "Black" },
            { name: "Size", value: "XS" },
            { name: "Material", value: "Silk" },
          ],
          thumb: null,
        },
        {
          id: 2,
          sku: "123PKU6786",
          name: "Variation Name",
          color: "Red",
          size: "S",
          quantity: 15,
          material: "Cotton",
          attributesList: [
            { name: "Colour", value: "Red" },
            { name: "Size", value: "S" },
            { name: "Material", value: "Cotton" },
          ],
          thumb: null,
        },
      ];

  // ── Real price range variations ──────────────────────────────────────────────
  const currency = product?.price_range?.currency ?? "₦";
  const priceVariations = product?.variation_options && Object.keys(product.variation_options).length > 0
    ? Object.entries(product.variation_options).flatMap(([attrName, opt]: [string, any]) =>
        (opt.values ?? []).map((val: any) => ({
          name: `${val.value || val.name || "Option"}`,
          price: `${currency}${Number(val.min_price || val.price || product.base_price || 0).toLocaleString()}`,
        }))
      )
    : [
        { name: "Variation Name", price: "₦18,000" },
        { name: "Variation Name", price: "₦18,000" },
        { name: "Variation Name", price: "₦18,000" },
      ];

  // ── Status badge ─────────────────────────────────────────────────────────────
  const isFlagged = Boolean(product?.is_flagged);
  const isRejected = (product?.is_approved ?? "").toLowerCase() === "rejected";
  const approvalStatus = (product?.is_approved ?? "pending").toLowerCase();
  const statusClass =
    isFlagged
      ? "bg-amber-100 text-amber-700"
      : approvalStatus === "approved"
      ? "bg-green-100 text-green-700"
      : approvalStatus === "rejected"
      ? "bg-red-100 text-red-600"
      : "bg-ffaco6/12 text-ffaco6";
  const statusLabel =
    isFlagged ? "Flagged"
    : approvalStatus === "approved" ? "Approved"
    : approvalStatus === "rejected" ? "Rejected"
    : "Pending";

  // ── Other real values ────────────────────────────────────────────────────────
  const basePrice = product?.base_price !== undefined && product?.base_price !== null
    ? `${currency}${Number(product.base_price).toLocaleString()}`
    : "₦20,000";
  const stock = product?.inventory ?? 200;
  const productName = product?.name ?? "Product Name";
  const getPersonName = (person: any, fallback = "Admin Reviewer") => {
    if (!person) return fallback;
    if (typeof person === "string") return person;
    if (typeof person === "object") {
      return person.name || person.full_name || person.first_name || person.email || person.username || fallback;
    }
    return fallback;
  };

  const sellerRaw =
    product?.manufacturer_name ||
    (product as any)?.seller_name ||
    (product as any)?.company_name ||
    (product as any)?.seller ||
    "KYZ co. Ltd";
  const sellerName =
    typeof sellerRaw === "string"
      ? sellerRaw
      : typeof sellerRaw === "object"
      ? sellerRaw?.name || sellerRaw?.company_name || sellerRaw?.shop_name || sellerRaw?.email || "KYZ co. Ltd"
      : "KYZ co. Ltd";

  const sellerLogo =
    (product as any)?.manufacturer_logo ||
    (product as any)?.seller_logo ||
    (product as any)?.company_logo ||
    null;
  const createdAt = product?.created_at
    ? new Date(product.created_at).toLocaleDateString("en-GB")
    : "12/12/2025";
  const categoryName =
    product?.category?.name ||
    (typeof product?.category === "string" ? product.category : "") ||
    (product as any)?.category_name ||
    "Fashion";
  const subcategoryName =
    product?.category?.subcategory?.name ||
    (typeof product?.category?.subcategory === "string" ? product.category.subcategory : "") ||
    (typeof (product as any)?.subcategory === "object" ? (product as any)?.subcategory?.name : "") ||
    (typeof (product as any)?.subcategory === "string" ? (product as any)?.subcategory : "") ||
    (product as any)?.subcategory_name ||
    "Adult Wears";

  const reviewerName = getPersonName(
    (product as any)?.moderation_performed_by || (product as any)?.review_checklist_updated_by,
    "Admin Reviewer"
  );

  const salesPercentage =
    product?.sales_percentage !== undefined && product.sales_percentage !== null && product.sales_percentage > 0
      ? `${product.sales_percentage}%`
      : "20%";

  const discountFromDate = (product as any)?.discount_start_date
    ? new Date((product as any).discount_start_date).toLocaleDateString("en-GB")
    : "10-06-2025";

  const discountToDate = (product as any)?.discount_end_date
    ? new Date((product as any).discount_end_date).toLocaleDateString("en-GB")
    : "10-07-2025";

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
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        checklistSections.flatMap((section, sectionIndex) =>
          section.items.map((_, itemIndex) => [
            `${sectionIndex + 1}-${itemIndex + 1}`,
            false,
          ]),
        ),
      ),
  );

  const handleCheck = (itemKey: string) => {
    const previousItems = checkedItems;
    const nextItems = {
      ...previousItems,
      [itemKey]: !previousItems[itemKey],
    };

    setCheckedItems(nextItems);
    updateAdminProductReviewChecklist(
      productId,
      nextItems,
      undefined,
      () => setCheckedItems(previousItems),
    );
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const percentage = Math.round((completedCount / totalItems) * 100) || 0;
  const allItemsChecked = completedCount === totalItems;

  const handleApprove = (notes: string) => {
    if (!allItemsChecked) return;

    // First save review checklist
    updateAdminProductReviewChecklist(
      productId,
      checkedItems,
      () => {
        // Post approval to POST /products/admin/products/{id}/approve/
        approveAdminProduct(
          productId,
          notes,
          () => {
            setIsApproveModalOpen(false);
            setResultModalState({
              isOpen: true,
              result: "success",
              title: isFlagged
                ? "Flag Cleared & Product Reactivated"
                : "Product Approved Successfully",
              message: isFlagged
                ? "The flagged product has been resolved and is now live on the marketplace."
                : "The product has been reviewed and approved. It is now live on the marketplace.",
            });
          },
          (err: any) => {
            const statusCode = err?.response?.status || err?.status;
            const errorMessage =
              err?.response?.data?.detail ||
              err?.response?.data?.message ||
              err?.message;

            if (
              statusCode === 403 ||
              (errorMessage && errorMessage.toLowerCase().includes("super admin"))
            ) {
              setIsApproveModalOpen(false);
              setResultModalState({
                isOpen: true,
                result: "error",
                title: "Super Admin Required",
                message:
                  "Re-approving a previously rejected product requires super admin privileges (403 Forbidden).",
              });
            } else {
              toast.error(errorMessage || "Failed to approve product.");
            }
          }
        );
      },
      () => {
        toast.error("Failed to update product review checklist before approval.");
      }
    );
  };

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
              {galleryUrls.length > 0 ? (
                <Image
                  src={galleryUrls[0]}
                  alt="Product"
                  width={120}
                  height={120}
                  className="rounded-c8 h-30 w-30 object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={ProductImage}
                  alt="Product"
                  width={120}
                  height={120}
                  className="rounded-c8 h-30 w-30 object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-between h-35 text-base font-MontserratSemiBold py-2">
              <h2 className="text-c20 font-MontserratSemiBold ">
                {productName}
              </h2>

              <div className="flex items-center gap-2">
                <span>Seller:</span>
                <div className="flex items-center gap-1.5">
                  {sellerLogo ? (
                    <img
                      src={sellerLogo}
                      alt={sellerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-[#ffac06] rounded-full flex items-center justify-center text-[10px] text-center font-MontserratSemiBold text-white">
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className=" font-MontserratSemiBold text-000000/68">
                    {sellerName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <span className={`w-25 flex items-center justify-center h-8 px-2 py-0.5 rounded-c16 text-[12px] font-MontserratSemiBold ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
          <div className=" gap-x-8 gap-y-5.5 py-2 text-base  flex flex-col items-end font-MontserratSemiBold">
            <div className="flex items-center gap-2">
              <span>Category: </span>
              <span className="text-000000/68">{categoryName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Date: </span>
              <span className="text-000000/68">{createdAt}</span>
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
              {reviewerName}{" "}
              <span className="text-000000/68">(Admin Role)</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 min-w-0 items-start relative">
          {/* Left Side - Product Details (Same as details page, but narrower) */}
          <div className="w-full xl:w-[50%] min-w-0 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar pb-6">
            {/* Main Image */}
            <div className="rounded-c16  overflow-hidden w-full h-90 relative mb-6">
              {galleryUrls.length > 0 ? (
                <Image
                  src={galleryUrls[activeImage] ?? galleryUrls[0]}
                  alt="Main Product"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image src={ProductImage} alt="Main Product" fill />
              )}
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
                />
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
                  {galleryUrls.length > 0 ? (
                    <Image
                      src={img}
                      alt={`Thumb ${idx}`}
                      width={66.81}
                      height={66.81}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={ProductImage}
                      alt={`Thumb ${idx}`}
                      width={66.81}
                      height={66.81}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6 mt-8">
              <h3 className="text-base font-MontserratSemiBold mb-3">
                Product Description
              </h3>
              {product?.description_html ? (
                <div
                  className="text-xs font-MontserratNormal"
                  dangerouslySetInnerHTML={{ __html: product.description_html }}
                />
              ) : product?.description ? (
                <p className="text-xs font-MontserratNormal">
                  {product.description}
                </p>
              ) : (
                <p className="text-xs font-MontserratNormal">
                  No description available for this product.
                </p>
              )}
            </div>
            <div className="mb-6 mt-8">
              <h3 className="text-base font-MontserratSemiBold mb-3">
                Product Specifications
              </h3>
              {product?.specifications_html ? (
                <div
                  className="text-xs font-MontserratNormal"
                  dangerouslySetInnerHTML={{ __html: product.specifications_html }}
                />
              ) : product?.specifications_text ? (
                <p className="text-xs font-MontserratNormal whitespace-pre-line">
                  {product.specifications_text}
                </p>
              ) : Array.isArray(product?.specifications) && product.specifications.length > 0 ? (
                <div className="space-y-1">
                  {product.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="flex text-xs font-MontserratNormal">
                      <span className="font-MontserratMedium mr-2">{spec.name || spec.key}:</span>
                      <span>{spec.value || spec.val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-MontserratNormal">
                  No specifications available for this product.
                </p>
              )}
            </div>
            <div className="w-full flex  max-w-132 border border-00000/12 rounded-c8 mb-c32">
              <div className="  w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12">
                <h4 className="text-base font-MontserratSemiBold leading-[24px]">
                  Category
                </h4>
                <p className="text-c12 font-MontserratNormal leading-[16px]">
                  {categoryName}
                </p>
              </div>
              <div className="w-full max-w-66 px-4 py-3 flex flex-col gap-4">
                <h4 className="text-base font-MontserratSemiBold leading-[24px]">
                  Subcategory
                </h4>
                <p className="text-c12 font-MontserratNormal leading-[16px]">
                  {subcategoryName}
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
                    <ChevronLeft className="w-4 h-4 text-000000/68" />
                  </button>
                  <button
                    onClick={() => scrollVariants("right")}
                    disabled={variantIndex + 2 >= variants.length}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-000000/68" />
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
                          {variant.name || "Variation Name"}
                        </p>
                        {variant.thumb ? (
                          <div className="w-[80px] h-[80px] relative rounded-c8 overflow-hidden">
                            <Image
                              src={variant.thumb}
                              alt={variant.name || "Variant"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <Image
                            src={ProductImage}
                            alt="Variant"
                            width={80}
                            height={80}
                            className="rounded-c8 object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 text-[11px] min-w-0 flex-1">
                        <p className="flex truncate">
                          <span className="text-000000/68 mr-1">SKU:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.sku}
                          </span>
                        </p>
                        {variant.attributesList && variant.attributesList.length > 0 ? (
                          variant.attributesList.map((attr: any, idx: number) => (
                            <p key={idx} className="flex truncate">
                              <span className="text-000000/68 mr-1">{attr.name}:</span>{" "}
                              <span className="font-MontserratSemiBold truncate">
                                {attr.value}
                              </span>
                            </p>
                          ))
                        ) : (
                          <>
                            <p className="flex truncate">
                              <span className="text-000000/68 mr-1">Colour:</span>{" "}
                              <span className="font-MontserratSemiBold truncate">
                                {variant.color}
                              </span>
                            </p>
                            <p className="flex truncate">
                              <span className="text-000000/68 mr-1">Size:</span>{" "}
                              <span className="font-MontserratSemiBold truncate">
                                {variant.size}
                              </span>
                            </p>
                            <p className="flex truncate">
                              <span className="text-000000/68 mr-1">Material:</span>{" "}
                              <span className="font-MontserratSemiBold truncate">
                                {variant.material}
                              </span>
                            </p>
                          </>
                        )}
                        <p className="flex truncate">
                          <span className="text-000000/68 mr-1">Quantity:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.quantity}
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
                      {basePrice}
                    </p>
                  </div>
                  <div className="  w-full space-y-4">
                    <p className="text-sm font-MontserratSemiBold ">
                      Price Range
                    </p>
                    <div className="flex gap-6 w-full flex-wrap">
                      {priceVariations.slice(0, 3).map((v, i) => (
                        <div key={i} className="space-y-1 text-left w-full max-w-20.5 truncate">
                          <p className="font-MontserratNormal text-xs text-000000/68">
                            {v.name}
                          </p>
                          <p className="text-xs font-MontserratSemiBold text-161616 ">
                            {v.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-20 ">
                <div className="w-ful truncate w-18.75">
                  <p className="text-sm font-MontserratSemiBold">Stock</p>
                  <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                    {stock}
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
                  <p className="text-xs font-MontserratNormal text-161616 mt-4">
                    {salesPercentage}
                  </p>
                </div>
                <div className=" w-full">
                  <p className="text-sm font-MontserratSemiBold">
                    Discount Duration
                  </p>
                  <div className="flex justify-between w-full">
                    <p className="text-xs font-MontserratNormal text-161616 mt-4">
                      <span className="text-gray-400 mr-1">From:</span>{" "}
                      {discountFromDate}
                    </p>
                    <p className="text-xs font-MontserratNormal text-161616 mt-4">
                      <span className="text-gray-400 mr-1">To:</span> {discountToDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Review Checklist */}
          <div className="w-full xl:w-[50%] flex flex-col min-w-0 sticky top-6 h-[calc(100vh-3rem)] pb-6">
            <div className="flex-1 overflow-y-auto pr-4 c64 no-scrollbar">
              {checklistSections.map((section, sIdx) => (
                <div key={sIdx} className="mb-6">
                  <h3 className="text-sm font-MontserratSemiBold  mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, iIdx) => {
                      const itemKey = `${sIdx + 1}-${iIdx + 1}`;

                      return (
                      <label
                            key={itemKey}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            checkedItems[itemKey]
                              ? "bg-[#ff715b] border-[#ff715b]"
                              : "border-gray-300 group-hover:border-[#ff715b]"
                          }`}
                        >
                          {checkedItems[itemKey] && (
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
                          checked={!!checkedItems[itemKey]}
                          onChange={() => handleCheck(itemKey)}
                        />
                      </label>
                  );
                })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto  flex justify-end gap-4  ">
              <Button className="bg-transparent text-[#ff715b] border border-[#ff715b] hover:bg-[#ffe8e8] w-36 h-12">
                Message Seller
              </Button>
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                disabled={!allItemsChecked || loading}
                className="bg-ff715b text-white  w-32"
              >
                Approve
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                className=" w-32 "
              >
                Reject
              </Button>
            </div>
          </div>
        </div>

        <ApproveProductModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={handleApprove}
          loading={loading}
          isFlagged={isFlagged}
          isRejected={isRejected}
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
        <ResultModal
          isOpen={resultModalState.isOpen}
          result={resultModalState.result}
          title={resultModalState.title}
          message={resultModalState.message}
          buttenText={resultModalState.result === "success" ? "Go to Products" : "Close"}
          onConfirm={() => {
            const isSuccess = resultModalState.result === "success";
            setResultModalState((prev) => ({ ...prev, isOpen: false }));
            if (isSuccess) {
              router.push("/dashboard/admin/products?type=listings");
            }
          }}
          onCancel={() => {
            setResultModalState((prev) => ({ ...prev, isOpen: false }));
          }}
        />
      </div>
    </div>
  );
}
