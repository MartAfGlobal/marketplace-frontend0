// src/components/ui/landindPage/ShoppingItems/Product-List.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setProducts } from "@/store/user-data/products/product-slice";
import { dummyProducts } from "@/store/data/products";
import ProductSection from "./shoppingItemComponent/ProductSection";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);

  // Populate dummy product data on load
  useEffect(() => {
    dispatch(setProducts(dummyProducts));
  }, [dispatch]);

  // Group products by section
  const grouped = products.reduce((acc: Record<string, typeof products>, product) => {
    if (!product) return acc; // skip undefined
    if (!acc[product.section]) acc[product.section] = [];
    acc[product.section].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const sectionOrder = ["Today", "Trending", "Popular Search", "Discount"];

  return (
    <div className="w-full px-4.75 mx-auto pt-12">
      {sectionOrder.map((title) =>
        grouped[title] ? (
          <ProductSection key={title} title={title} products={grouped[title]} />
        ) : null
      )}
    </div>
  );
}
