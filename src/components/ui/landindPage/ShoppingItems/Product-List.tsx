"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductSection from "./shoppingItemComponent/ProductSection";
import { LoadingSpinner } from "../../loading-spinner";

export default function ProductListPage() {
  const products = useSelector((state: RootState) => state.products.items);

 
  if (!products || products.length === 0) { return <div className="w-full h-30 flex flex-col items-center justify-center gap-8 font-MontserratSemiBold text-base ">Loading products.. <LoadingSpinner color="border-ff715b " size={50}/></div>} else if (products.length === 0) {
    (
      <div>No product found</div>
    )
  };

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
