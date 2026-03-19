"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Product } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import adBanner1 from "@/assets/images/adbanner1.svg";
import ProductGridSkeleton from "@/components/reloadSpinner/ProductGridSkeleton";
import AdSlider from "@/components/Ads";

const backgrounds = [
  { id: 1, image: adBanner1 },
  { id: 2, image: adBanner1 },
];

export default function CategoryPage() {
  const params = useParams(); // ✅ get dynamic [category] from URL
  const searchParams = useSearchParams();
  const isFetchingRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Handle missing or array case
  // Get category slug from URL params
  const rawCategory = params.category;

  const categorySlug = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory ?? "unknown";

  const searchKey = searchParams.get("searchKey");

  // ❌ No category = show error
  if (!categorySlug) {
    return (
      <div className="w-full px-4.75 pt-12 text-center">
        <p className="text-lg font-MontserratBold">Category not found</p>
      </div>
    );
  }

  const title = categorySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const { sendHttpRequest, loading } = useHttp();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  if (!searchKey) {
    return (
      <div className="w-full px-4.75 pt-12 text-center">
        <p className="text-lg font-MontserratBold">Invalid search key</p>
      </div>
    );
  }

  const fetchProducts = () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    const url =
      searchKey === "created_today=true"
        ? `/products/public/products/?${searchKey}&page=${page}&page_size=20`
        : searchKey === "products"
        ? `/products/public/products/?page=${page}&page_size=20`
        : `/products/public/products/?filter=${searchKey}&page=${page}&page_size=20`;

    sendHttpRequest({
      requestConfig: {
        url: url,
        method: "GET",
      },
      successRes: (res: any) => {
        const newProducts: Product[] = res.data.results;
        const count = res.data.count;

        setTotalCount(count);

        setProducts((prev) => {
          const merged = [...prev, ...newProducts];
          const unique = Array.from(
            new Map(merged.map((p) => [p.id, p])).values()
          );

          setHasMore(unique.length < count);
          return unique;
        });

        setPage((prev) => prev + 1);
        isFetchingRef.current = false;

        // ✅ IMPORTANT
        setInitialLoading(false);
      },
    });
  };

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    isFetchingRef.current = false;
    setInitialLoading(true);

    fetchProducts();
  }, [categorySlug, searchKey]);

  return (
    <div className="w-full md:px-15 px-6 pt-12 pb-6 ">
      <h1 className="text-2xl font-MontserratBold mb-6">{title}</h1>
      <div className="w-full pb-6">
        <AdSlider />
      </div>

      {initialLoading ? (
        <ProductGridSkeleton count={12} />
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-lg">No products found.</p>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchProducts}
          hasMore={hasMore}
          loader={<p className="text-center py-4">Loading more products...</p>}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-c28 w-full md:mx-auto overflow-hidden mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center my-4 text-gray-500">
          Loaded all {totalCount} products
        </p>
      )}

      {!loading && !hasMore && <AdSlider />}
    </div>
  );
}
