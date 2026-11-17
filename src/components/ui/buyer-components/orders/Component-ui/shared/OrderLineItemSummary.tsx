"use client";

import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface OrderLineItemSummaryProps {
  image: string | StaticImageData;
  imageAlt: string;
  productName: string;
  sellerName?: ReactNode;
  details: ReactNode;
  price: ReactNode;
  className?: string;
  imageClassName?: string;
  productNameClassName?: string;
  sellerNameClassName?: string;
  detailsClassName?: string;
  priceClassName?: string;
}

export default function OrderLineItemSummary({
  image,
  imageAlt,
  productName,
  sellerName,
  details,
  price,
  className = "flex gap-4 items-start w-full",
  imageClassName = "h-24 w-24",
  productNameClassName = "font-MontserratSemiBold text-base mb-1",
  sellerNameClassName = "text-c12 font-MontserratMedium mb-3",
  detailsClassName = "rounded-c12 bg-000000/4 text-000000/68 py-2 px-4 w-fit font-MontserratSemiBold text-c10 md:text-c12 justify-center flex items-center",
  priceClassName = "font-MontserratSemiBold text-c16 pt-3",
}: OrderLineItemSummaryProps) {
  return (
    <div className={className}>
      <Image src={image} alt={imageAlt} width={96} height={96} className={imageClassName} />
      <div className="w-full">
        <p className={productNameClassName}>{productName}</p>
        <p className={sellerNameClassName}>{sellerName}</p>
        <p className={detailsClassName}>{details}</p>
        <p className={priceClassName}>{price}</p>
      </div>
    </div>
  );
}
