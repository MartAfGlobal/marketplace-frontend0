import { useState } from "react";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Product } from "@/types/global";

export default function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const [visible, setVisible] = useState(6); // Show 6 items by default

  const showMore = () => setVisible((prev) => prev + 6); // Load 6 more per click

  return (
    <section className="  mb-c64">
      {/* Header + View More */}
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
        {products.slice(0, visible).map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
}
