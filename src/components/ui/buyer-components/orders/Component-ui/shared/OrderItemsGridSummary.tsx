"use client";

import Image from "next/image";
import { ReactNode } from "react";

export interface OrderPreviewItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
}

interface OrderItemsGridSummaryProps {
  products: OrderPreviewItem[];
  sellerName?: ReactNode;
  itemCount: ReactNode;
  mobileItemCount?: ReactNode;
  totalPrice: number;
  desktopImageClassName?: string;
  mobileImageClassName?: string;
  itemCountClassName?: string;
  mobileItemCountClassName?: string;
  desktopPriceClassName?: string;
  mobilePriceClassName?: string;
  mobileExtra?: ReactNode;
}

export default function OrderItemsGridSummary({
  products,
  sellerName,
  itemCount,
  mobileItemCount = itemCount,
  totalPrice,
  desktopImageClassName = "w-24 h-24 object-cover",
  mobileImageClassName = "w-24 h-24",
  itemCountClassName = "rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60",
  mobileItemCountClassName = itemCountClassName,
  desktopPriceClassName = "font-MontserratSemiBold text-c16 pt-3",
  mobilePriceClassName = "font-MontserratSemiBold text-c16 pt-2",
  mobileExtra,
}: OrderItemsGridSummaryProps) {
  return (
    <>
      <div className="hidden sm:flex gap-4">
        <div
          className={`grid gap-4 ${
            products.length === 1
              ? "grid-cols-1"
              : products.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <div className="w-24 h-24 relative">
                <Image
                  src={product.productImage || "/placeholder.png"}
                  alt={product.productName || "Product Image"}
                  width={96}
                  height={96}
                  className={desktopImageClassName}
                />
                <p className="absolute bottom-2 left-8.5 rounded-c12 bg-000000 px-2 py-1 text-white text-c12 font-MontserratNormal">
                  x{product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="font-MontserratSemiBold text-base mb-2 flex flex-wrap gap-1">
            {products.slice(0, 3).map((product, index) => (
              <span key={product.id} className="flex items-center">
                <span
                  className="max-w-[110px] truncate inline-block align-middle"
                  title={product.productName}
                >
                  {product.productName}
                </span>
                {index < Math.min(products.length, 3) - 1 && (
                  <span>,&nbsp;</span>
                )}
              </span>
            ))}
            {products.length > 3 && <span>...</span>}
          </p>

          <p className="text-c12 font-MontserratMedium mb-3">{sellerName}</p>
          <p className={itemCountClassName}>
            {itemCount} <span className="pl-0.5">Items</span>
          </p>
          <p className={desktopPriceClassName}>
            ₦{totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex sm:hidden w-full items-start gap-4">
        {products[0] && (
          <div className="relative h-24 w-24 shrink-0">
            <Image
              src={products[0].productImage || "/placeholder.png"}
              alt={products[0].productName || "Product Image"}
              width={96}
              height={96}
              className={mobileImageClassName}
            />
            <span className="absolute bottom-2 left-8.5 rounded-c12 bg-000000 px-2 py-1 text-white text-c12 font-MontserratNormal">
              x{products[0].quantity}
            </span>
          </div>
        )}
        <div className="w-full ">
          <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
            {products[0]?.productName}
          </p>
          <p className="text-c12 font-MontserratMedium mb-2">{sellerName}</p>
          <p className={mobileItemCountClassName}>
            {mobileItemCount} <span className="pl-0.5">Items</span>
          </p>
          <p className={mobilePriceClassName}>
            ₦{totalPrice.toLocaleString()}
          </p>
          {mobileExtra}
        </div>
      </div>
    </>
  );
}
