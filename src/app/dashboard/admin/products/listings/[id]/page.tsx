"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import ProductImage from "@/assets/admin/productMainImage.svg";

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
  const images = Array(6).fill(thumbnailImage);
  const [variantIndex, setVariantIndex] = useState(0);
  const variantsScrollRef = useRef<HTMLDivElement>(null);

  const scrollVariants = (direction: "left" | "right") => {
    const newIndex = direction === "left"
      ? Math.max(0, variantIndex - 2)
      : Math.min(variants.length - 1, variantIndex + 2);
    setVariantIndex(newIndex);
  };

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
    {
      id: 3,
      sku: "123PKU6787",
      color: "Blue",
      size: "M",
      quantity: 10,
      material: "Linen",
    },
    {
      id: 4,
      sku: "123PKU6787",
      color: "Blue",
      size: "M",
      quantity: 10,
      material: "Linen",
    },
    {
      id: 5,
      sku: "123PKU6787",
      color: "Blue",
      size: "M",
      quantity: 10,
      material: "Linen",
    },
  ];

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

      <div className="flex flex-col xl:flex-row gap-12 bg-ffffff rounded-c16 p-6 min-w-0">
        {/* Left Side - Images */}
        <div className="w-full max-w-120 min-w-0">
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
                <p className="text-sm font-MontserratSemiBold">Discount Type</p>
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
                    <span className="text-gray-400 mr-1">From:</span> 10-06-2025
                  </p>
                  <p className="text-xs  font-MontserratNormal text-161616 mt-4">
                    <span className="text-gray-400 mr-1">To:</span> 10-07-2025
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
                Product Name
              </h2>
              <p className="h-c32 w-21.25 rounded-c16 bg-ffaco6/12 text-xs font-MontserratSemiBold text-ffaco6 flex items-center justify-center ">
                Pending
              </p>
            </div>
            <div className=" flex justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-14.5 text-base font-MontserratSemiBold">Seller:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#ffac06] rounded-full flex items-center justify-center text-center text-[2.88px] font-MontserratSemiBold ">
                    COMPANY LOGO
                  </div>
                  <span className="text-[#161616] font-MontserratSemiBold">
                    KYZ co. Ltd
                  </span>
                </div>
              </div>
              <div>
                <span>Date: </span>
                <span className="text-[#161616] font-MontserratSemiBold">
                  12/12/2025
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-MontserratSemiBold mb-3">
              Product Description
            </h3>
            <p className="text-xs  font-MontserratNormal">
              Lorem ipsum dolor sit amet consectetur. Et id in non arcu eu elit
              facilisi ut tellus. Habitant pellentesque turpis turpis vel vitae
              vestibulum. Congue nunc tempus eget mi. Placerat laoreet in
              ultricies at. Lorem hac pharetra ullamcorper maecenas purus. Et
              ornare sollicitudin eget est volutpat fames dictumst scelerisque
              mattis. Dui scelerisque fermentum sapien cras id dignissim aenean.
              Etiam ultrices sed diam odio ligula ornare augue posuere.
            </p>
          </div>

          <div className="w-full flex  max-w-132 border border-00000/12 rounded-c8 mb-c32">
            <div className="  w-full max-w-66 px-4 py-3 flex flex-col gap-4 border-r-2 border-r-000000/12">
              <h4 className="text-base font-MontserratSemiBold leading-[24px]">Category</h4>
              <p className="text-c12 font-MontserratNormal leading-[16px]">Fashion</p>
            </div>
            <div className="w-full max-w-66 px-4 py-3 flex flex-col gap-4">
              <h4 className="text-base font-MontserratSemiBold leading-[24px]">Subcategory</h4>
              <p className="text-c12 font-MontserratNormal leading-[16px]">Adult Wears</p>
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
            <div className="grid grid-cols-2 gap-4 w-full">
              {variants.slice(variantIndex, variantIndex + 2).map((variant) => (
                <div
                  key={variant.id}
                  className="flex gap-3 border border-gray-200 rounded-xl p-3 min-w-0 overflow-hidden"
                >
                  <div className="flex-shrink-0">
                    <p className="text-xs font-MontserratSemiBold mb-3 leading-4 truncate max-w-[80px]">
                      Variation Name
                    </p>
                    <Image src={ProductImage} alt="Variant" width={80} height={80} className="rounded-c8 object-cover" />
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

          {/* Action Buttons */}
          <div className="mt-auto pt-6 flex justify-end gap-4 border-t border-gray-100">
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
