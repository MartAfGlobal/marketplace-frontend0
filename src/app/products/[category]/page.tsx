"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Product } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import ProductGridSkeleton from "@/components/reloadSpinner/ProductGridSkeleton";
import AdSlider from "@/components/Ads";

const SYSTEM_FILTERS = [
  "products",
  "created_today=true",
  "trending",
  "top-selling",
  "discounted",
];

export default function CategoryPage() {
  const params = useParams(); // ✅ get dynamic [category] from URL
  const searchParams = useSearchParams();
  const isFetchingRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Get category slug from URL params
  const rawCategory = params.category;
  const categorySlug = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory ?? "unknown";

  const searchKey = searchParams.get("searchKey");
  const searchParam = searchParams.get("search");

  // Determine if this is a custom keyword search
  const isCustomSearchKey = Boolean(
    searchKey && !SYSTEM_FILTERS.includes(searchKey)
  );
  const searchTerm = (searchParam || (isCustomSearchKey ? searchKey : "") || "").trim();

  // ❌ No category = show error
  if (!categorySlug) {
    return (
      <div className="w-full px-4.75 pt-12 text-center">
        <p className="text-lg font-MontserratBold">Category not found</p>
      </div>
    );
  }

  // If no search key, search param, and not "all-products", show error
  if (!searchKey && !searchTerm && categorySlug !== "all-products") {
    return (
      <div className="w-full px-4.75 pt-12 text-center">
        <p className="text-lg font-MontserratBold">Invalid search key</p>
      </div>
    );
  }

  const title = searchTerm
    ? `Search results for "${searchTerm}"`
    : categorySlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const { sendHttpRequest, loading } = useHttp();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(
    (targetPage = 1) => {
      if (isFetchingRef.current || (!hasMore && targetPage !== 1)) return;

      isFetchingRef.current = true;

      let url = `/products/public/products/?page=${targetPage}&page_size=20`;

      if (searchTerm) {
        url = `/products/public/products/?search=${encodeURIComponent(searchTerm)}&page=${targetPage}&page_size=20`;
      } else if (searchKey === "created_today=true") {
        url = `/products/public/products/?${searchKey}&page=${targetPage}&page_size=20`;
      } else if (
        searchKey === "trending" ||
        searchKey === "top-selling" ||
        searchKey === "discounted"
      ) {
        url = `/products/public/products/?filter=${searchKey}&page=${targetPage}&page_size=20`;
      } else if (searchKey === "products" || categorySlug === "all-products") {
        url = `/products/public/products/?page=${targetPage}&page_size=20`;
      }

      sendHttpRequest({
        requestConfig: {
          url: url,
          method: "GET",
        },
        successRes: (res: any) => {
          const newProducts: Product[] = res?.data?.results || [];
          const count = res?.data?.count || 0;

          setTotalCount(count);

          setProducts((prev) => {
            const merged = targetPage === 1 ? newProducts : [...prev, ...newProducts];
            const unique = Array.from(
              new Map(merged.map((p) => [p.id, p])).values()
            );

            setHasMore(unique.length < count);
            return unique;
          });

          setPage(targetPage + 1);
          isFetchingRef.current = false;
          setInitialLoading(false);
        },
        errorRes: () => {
          isFetchingRef.current = false;
          setInitialLoading(false);
        },
      });
    },
    [categorySlug, searchKey, searchTerm, hasMore, sendHttpRequest]
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    isFetchingRef.current = false;
    setInitialLoading(true);

    fetchProducts(1);
  }, [categorySlug, searchKey, searchTerm]);

  return (
    <div className="w-full md:px-15 px-6 pt-12 pb-6">
      <h1 className="text-2xl font-MontserratBold mb-6">{title}</h1>
      <div className="w-full pb-6">
        <AdSlider />
      </div>

      {initialLoading ? (
        <ProductGridSkeleton count={12} />
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-lg">
          {searchTerm
            ? `No products found matching "${searchTerm}".`
            : "No products found."}
        </p>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={() => fetchProducts(page)}
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
