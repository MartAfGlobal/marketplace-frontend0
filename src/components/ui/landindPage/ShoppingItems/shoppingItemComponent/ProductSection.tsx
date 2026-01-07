"use client";

import { useRouter } from "next/navigation";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Product } from "@/types/global";

interface ProductSectionProps {
  title: string;
  searchKey?: string;
  products: Product[];
}

export default function ProductSection({
  title,
  products,
  searchKey,
}: ProductSectionProps) {
  const router = useRouter();

  // Convert title to URL-safe category slug
  const categorySlug = title.toLowerCase().replace(/\s+/g, "-");

  const goToCategoryPage = () => {
    const params = new URLSearchParams();

    if (searchKey) {
      params.append("searchKey", searchKey);
    }

    const query = params.toString();
    const url = query
      ? `/products/${categorySlug}?${query}`
      : `/products/${categorySlug}`;

    router.push(url);
  };

  if (products.length === 0) {
    return <p className="font-MontserratBold text-base">No product found</p>;
  }

  const previewProducts = products.slice(0, 12);
  const showViewMore = products.length > 12;

  return (
    <section className="mb-c64">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-lg font-MontserratMedium text-161616">
          {title}
        </h2>

        {showViewMore && (
          <button
            onClick={goToCategoryPage}
            className="font-MontserratSemiBold text-ff715b hover:underline text-sm"
          >
            View More
          </button>
        )}
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-c28 w-full md:mx-auto">
          {previewProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
