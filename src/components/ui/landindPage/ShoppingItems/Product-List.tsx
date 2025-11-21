"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductSection from "./shoppingItemComponent/ProductSection";
import { LoadingSpinner } from "../../loading-spinner";

export default function ProductListPage(
 
) {
  const products = useSelector((state: RootState) => state.products.items);
  console.log("Products from Redux Store:", products);


 if (products.length === 0) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      <svg
        width="140"
        height="140"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff715b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-4"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>

      <p className="font-MontserratBold text-base text-center text-161616">
        No product found
      </p>
    </div>
  );
}

  

  const grouped = products.reduce((acc: Record<string, typeof products>, product) => {
    const section = product.section|| "Today";
    if (!acc[section]) acc[section] = [];
    acc[section].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const sectionOrder = ["Today", "Trending", "Popular Search", "Discount"];

  return (
    <div className="w-full px-4.75 pt-12 ">
      {sectionOrder.map((title) =>
        grouped[title] ? <ProductSection key={title} title={title} products={grouped[title]} /> : null
      )}
    </div>
  );
}
