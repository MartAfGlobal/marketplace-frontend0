"use client";

import Image from "next/image";
import Heart from "@/assets/icons/heart.svg";
import LoveIconFilled from "@/assets/images/wishlist.svg";
import Share from "@/assets/icons/share.svg";
import { ProductDetail, ProductVariation } from "@/types/global";

interface ProductSummaryProps {
  productDetails: ProductDetail | null;
  selectedVariation: ProductVariation | null;
  isInWishlist: boolean;
  loadingWishlist: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
}

export default function ProductSummary({
  productDetails,
  selectedVariation,
  isInWishlist,
  loadingWishlist,
  onToggleWishlist,
  onShare,
}: ProductSummaryProps) {
  // Keep the mobile and desktop action groups separate to match their layouts.
  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-MontserratMedium text-base mb-3">
          {productDetails?.name}
        </h1>
        <div className="md:hidden flex gap-c19 md:mt-c24 items-center">
          <button
            type="button"
            onClick={onToggleWishlist}
            disabled={loadingWishlist}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-60"
          >
            <Image
              src={isInWishlist ? LoveIconFilled : Heart}
              alt={isInWishlist ? "Liked" : "Like"}
              height={22.93}
              width={28}
              className="w-5.25 h-4.5"
            />
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share product"
            className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Image
              src={Share}
              alt="Share"
              height={24}
              width={28.01}
              className="h-5.25 w-4.5"
            />
          </button>
        </div>
      </div>

      <p className="text-c20 font-MontserratSemiBold">
        {productDetails?.price_range?.currency}
        {selectedVariation?.base_price ?? productDetails?.base_price}
      </p>

      <span className="text-sm font-MontserratSemiBold text-2d7565">
        {selectedVariation
          ? `${selectedVariation.stock} in stock`
          : "Select options"}{" "}
      </span>
      <div className="mt-3 flex items-center gap-3">
        {" "}
        <div className="flex items-center">
          {" "}
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`text-base ${
                i < Math.round(productDetails?.rating_average || 0)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            >
              {" "}
              ★{" "}
            </span>
          ))}{" "}
        </div>{" "}
        <p className="font-MontserratMedium text-sm text-161616">
          {" "}
          {productDetails?.rating_average}/5{" "}
        </p>{" "}
      </div>

      <div className="hidden md:flex gap-c19 md:mt-c24 items-center">
        <button
          type="button"
          onClick={onToggleWishlist}
          disabled={loadingWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-60"
        >
          <Image
            src={isInWishlist ? LoveIconFilled : Heart}
            alt={isInWishlist ? "Liked" : "Like"}
            height={22.93}
            width={28}
            className="w-5.25 h-4.5"
          />
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label="Share product"
          className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Image
            src={Share}
            alt="Share"
            height={24}
            width={28.01}
            className="h-5.25 w-4.5"
          />
        </button>
      </div>
    </>
  );
}
