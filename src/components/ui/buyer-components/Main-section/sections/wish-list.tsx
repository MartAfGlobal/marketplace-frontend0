import ProductCard from "@/components/ui/cards/ProductCard";

import { useState } from "react";

import { dummyProducts } from "@/store/data/products";

export default function Wishlist() {
  const [visible, setVisible] = useState(10); // Show 6 items by default

  const showMore = () => setVisible((prev) => prev + 10);

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-lg font-MontserratMedium text-[#161616]">
          <p>Wishlist</p>
        </h2>
        {visible < fashionProducts.length && (
          <button
            onClick={showMore}
            className="font-MontserratSemiBold text-[#FF715B] hover:underline text-sm"
          >
            View More
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 ">
        {fashionProducts.slice(0, visible).map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
