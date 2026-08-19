"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import ProductImage from "@/assets/admin/productMainImage.svg";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminProductDetail } from "@/types/global";

// Using a placeholder for images since it's UI only
const placeholderImage =
  "https://via.placeholder.com/400x400/111111/FFFFFF?text=Product+Image";
const thumbnailImage =
  "https://via.placeholder.com/60x60/111111/FFFFFF?text=Thumb";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const [activeImage, setActiveImage] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const variantsScrollRef = useRef<HTMLDivElement>(null);
  const { fetchAdminSellersProductDetails, loading } = AdminDetails();

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
    const newIndex = direction === "left"
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
        const imgUrl =
          (typeof v.main_image_url === "string" ? v.main_image_url : v.main_image_url?.medium || v.main_image_url?.url || v.main_image_url?.thumbnail) ||
          (typeof v.main_image === "string" ? v.main_image : v.main_image?.medium || v.main_image?.url || v.main_image?.thumbnail) ||
          (typeof v.image === "string" ? v.image : v.image?.medium || v.image?.url || v.image?.thumbnail) ||
          (typeof v.image_url === "string" ? v.image_url : v.image_url?.medium || v.image_url?.url || v.image_url?.thumbnail) ||
          v.thumbnail ||
          (Array.isArray(v.images) && v.images.length > 0 ? (typeof v.images[0] === "string" ? v.images[0] : v.images[0]?.medium || v.images[0]?.url || v.images[0]?.thumbnail || v.images[0]?.image) : null) ||
          (galleryUrls.length > 0 ? galleryUrls[0] : null);

        return {
          id: v.id,
          sku: v.sku || "—",
          name: v.name || v.title || "Variation",
          quantity: v.stock ?? v.inventory ?? v.quantity ?? 0,
          color: colorVal,
          size: sizeVal,
          material: materialVal,
          attributesList: attrList,
          image: imgUrl || (galleryUrls.length > 0 ? galleryUrls[0] : null),
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
          image: null,
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
          image: null,
        },
        {
          id: 3,
          sku: "123PKU6787",
          name: "Variation Name",
          color: "Blue",
          size: "M",
          quantity: 10,
          material: "Linen",
          attributesList: [
            { name: "Colour", value: "Blue" },
            { name: "Size", value: "M" },
            { name: "Material", value: "Linen" },
          ],
          image: null,
        },
        {
          id: 4,
          sku: "123PKU6787",
          name: "Variation Name",
          color: "Blue",
          size: "M",
          quantity: 10,
          material: "Linen",
          attributesList: [
            { name: "Colour", value: "Blue" },
            { name: "Size", value: "M" },
            { name: "Material", value: "Linen" },
          ],
          image: null,
        },
        {
          id: 5,
          sku: "123PKU6787",
          name: "Variation Name",
          color: "Blue",
          size: "M",
          quantity: 10,
          material: "Linen",
          attributesList: [
            { name: "Colour", value: "Blue" },
            { name: "Size", value: "M" },
            { name: "Material", value: "Linen" },
          ],
          image: null,
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
  const approvalStatus = (product?.is_approved ?? "pending").toLowerCase();
  const statusClass =
    approvalStatus === "approved"
      ? "bg-green-100 text-green-700"
      : approvalStatus === "rejected"
      ? "bg-red-100 text-red-600"
      : "bg-ffaco6/12 text-ffaco6";
  const statusLabel =
    approvalStatus === "approved" ? "Approved"
    : approvalStatus === "rejected" ? "Rejected"
    : "Pending";

  // ── Other real values ────────────────────────────────────────────────────────
  const basePrice = product?.base_price !== undefined && product?.base_price !== null
    ? `${currency}${Number(product.base_price).toLocaleString()}`
    : "₦20,000";
  const stock = product?.inventory ?? 200;
  const productName = product?.name ?? "Product Name";
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex itemes-center justify-center">
            <ChevronLeft className="w-5 h-5 text-000000" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">Product Details</h1>
        </button>

        <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 text-[#ff715b]" />
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 min-h-[966.81px] h-auto bg-ffffff rounded-c16 p-6 min-w-0">
        {/* Left Side - Images */}
        <div className="w-full max-w-120 min-w-0">
          {/* Main Image */}
          <div className="rounded-c16 overflow-hidden w-full h-90 relative mb-6">
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
                className={`border-4 transition-all duration-300 ${
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

           <div className="mt-c32 space-y-6 ">
            <h3 className="text-base font-MontserratSemiBold leading-[24px] ">
              Price and Stock
            </h3>
            <div className="    ">
              <div className="w-full flex gap-20">
                <div className=" flex-col flex truncate min-w-18.75 gap-8">
                  <p className="text-sm font-MontserratSemiBold ">Price</p>
                  <p className="text-xs font-MontserratSemiBold text-161616 ">
                    {basePrice}
                  </p>
                </div>
                <div className=" w-full space-y-4">
                  <p className="text-sm font-MontserratSemiBold ">
                    Price Range
                  </p>
                  <div className="flex gap-6 w-full flex-wrap">
                    {priceVariations.slice(0, 3).map((v, i) => (
                      <div key={i} className="space-y-1 w-full text-left max-w-20.5 truncate">
                        <p className="font-MontserratNormal text-xs text-000000/68 truncate" title={v.name}>
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
                <p className="text-xs font-MontserratNormal text-161616 mt-4">
                  {stock}
                </p>
              </div>
              <div className="">
                <p className="text-sm font-MontserratSemiBold">Discount Type</p>
                <p className="text-xs font-MontserratNormal text-161616 mt-4">
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
                    <span className="text-gray-400 mr-1">From:</span> {discountFromDate}
                  </p>
                  <p className="text-xs font-MontserratNormal text-161616 mt-4">
                    <span className="text-gray-400 mr-1">To:</span> {discountToDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="w-full max-w-132 flex flex-col min-w-0">
          <div className="">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-base font-MontserratSemiBold ">
                {productName}
              </h2>
              <p className={`h-c32 w-21.25 rounded-c16 text-xs font-MontserratSemiBold flex items-center justify-center ${statusClass}`}>
                {statusLabel}
              </p>
            </div>
            <div className=" flex justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-14.5 text-base font-MontserratSemiBold">Seller:</span>
                <div className="flex items-center gap-1.5">
                  {sellerLogo ? (
                    <img
                      src={sellerLogo}
                      alt={sellerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-[#ffac06] rounded-full flex items-center justify-center text-center text-[10px] font-MontserratSemiBold text-white">
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[#161616] font-MontserratSemiBold">
                    {sellerName}
                  </span>
                </div>
              </div>
              <div>
                <span>Date: </span>
                <span className="text-[#161616] font-MontserratSemiBold">
                  {createdAt}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
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
          <div className="mb-6">
            <h3 className="text-base font-MontserratSemiBold mb-3">
              Product Specification
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

          <div className="w-full flex max-w-132 border border-000000/12 rounded-c8 mb-c32">
            <div className=" w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12">
              <h4 className="text-base font-MontserratSemiBold leading-[24px]">Category</h4>
              <p className="text-c12 font-MontserratNormal leading-[16px]">{categoryName}</p>
            </div>
            <div className="w-full max-w-66 px-4 py-3 flex flex-col gap-4">
              <h4 className="text-base font-MontserratSemiBold leading-[24px]">Subcategory</h4>
              <p className="text-c12 font-MontserratNormal leading-[16px]">{subcategoryName}</p>
            </div>
          </div>

          {/* Variants */}
          <div className="mb-8 w-full min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-MontserratSemiBold leading-6">Variants ({variants.length})</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {variants.slice(variantIndex, variantIndex + 2).map((variant) => (
                <div
                  key={variant.id}
                  className="flex gap-3 border border-gray-200 rounded-xl p-3 min-w-0 overflow-hidden"
                >
                  <div className="flex-shrink-0">
                    <p className="text-xs font-MontserratSemiBold mb-3 leading-4 truncate max-w-[80px]" title={variant.name}>
                      {variant.name}
                    </p>
                    {variant.image ? (
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-20 h-20 rounded-c8 object-cover"
                      />
                    ) : (
                      <Image src={ProductImage} alt="Variant" width={80} height={80} className="rounded-c8 object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 text-[11px] min-w-0 flex-1">
                    <p className="flex truncate">
                      <span className="text-gray-500 mr-1">SKU:</span>{" "}
                      <span className="font-MontserratSemiBold truncate">
                        {variant.sku}
                      </span>
                    </p>
                    {variant.attributesList && variant.attributesList.length > 0 ? (
                      variant.attributesList.map((attr, idx) => (
                        <p key={idx} className="flex truncate">
                          <span className="text-gray-500 mr-1">{attr.name}:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {attr.value}
                          </span>
                        </p>
                      ))
                    ) : (
                      <>
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
                          <span className="text-gray-500 mr-1">Material:</span>{" "}
                          <span className="font-MontserratSemiBold truncate">
                            {variant.material}
                          </span>
                        </p>
                      </>
                    )}
                    <p className="flex truncate">
                      <span className="text-gray-500 mr-1">Quantity:</span>{" "}
                      <span className="font-MontserratSemiBold truncate">
                        {variant.quantity}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 flex pb-c40 justify-end gap-4 ">
            <Button className="bg-transparent text-[#ff715b] border border-[#ff715b] hover:bg-[#ffe8e8] w-36 h-12">
              Message Seller
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/admin/products/listings/${unwrappedParams.id}/review`,
                )
              }
              className="bg-[#ff9a8a] text-white hover:bg-[#ff8673] w-32 h-12"
            >
              Review
            </Button>
            <Button
              onClick={() =>
                router.push("/dashboard/admin/products?type=listings")
              }
              className="bg-[#d32f2f] text-white hover:bg-[#b71c1c] w-32 h-12"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
