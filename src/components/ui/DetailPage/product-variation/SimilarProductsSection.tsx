"use client";

import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import { Product } from "@/types/global";

interface SimilarProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export default function SimilarProductsSection({
  products,
  isLoading,
}: SimilarProductsSectionProps) {
  return (
    <section id="similar" className="similar hidden md:block w-full mt-12">
      {isLoading ? (
        <p className="mb-12">Searching for similar products...</p>
      ) : (
        products.length > 0 && (
          <ProductSection title="Related items" products={products} />
        )
      )}
    </section>
  );
}
