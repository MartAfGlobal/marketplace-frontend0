"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Product } from "@/types/global";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  const [visible, setVisible] = useState(6);

  const showMore = () => setVisible(prev => prev + 6);

  return (
    <section className="mb-c64">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-lg font-MontserratMedium text-161616">{title}</h2>
        {visible < products.length && (
          <button
            onClick={showMore}
            className="font-MontserratSemiBold text-ff715b hover:underline text-sm"
          >
            View More
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-c28">
        {products.slice(0, visible).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
