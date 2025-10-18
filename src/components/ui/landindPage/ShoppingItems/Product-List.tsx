"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductSection from "./shoppingItemComponent/ProductSection";
import { LoadingSpinner } from "../../loading-spinner";

export default function ProductListPage() {
  const products = useSelector((state: RootState) => state.products.items);

  if (!products) {<p>Loading products <LoadingSpinner color="border-ff715b"/></p>} else if (products.length === 0) {
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
    <div className="w-full px-4.75 mx-auto pt-12">
      {sectionOrder.map((title) =>
        grouped[title] ? <ProductSection key={title} title={title} products={grouped[title]} /> : null
      )}
    </div>
  );
}
