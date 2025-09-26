"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProductSection from "./shoppingItemComponent/ProductSection";

export default function ProductListPage() {
  const products = useSelector((state: RootState) => state.products.items);

  if (!products || products.length === 0) return <p>Loading products...</p>;

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
