"use client";

const CATEGORIES_CACHE_KEY = "martaf_landing_categories";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

import { useEffect, useState, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Category, subcategory } from "@/types/global";
import CategoryButton from "./CategoryButton";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CategorySkeleton from "@/components/reloadSpinner/CategorySkeleton";

interface CategoriesGridProps {
  selectedCategory?: Category | null;
  onSelectCategory?: (cat: Category | null) => void;
  onSubcategoriesLoaded?: (subs: subcategory[]) => void;
  onSubLoadingChange?: (loading: boolean) => void;
}

export default function CategoriesGrid({
  selectedCategory = null,
  onSelectCategory,
  onSubcategoriesLoaded,
  onSubLoadingChange,
}: CategoriesGridProps = {}) {
  const { sendHttpRequest, loading } = useHttp();
  const isFetchingRef = useRef(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [categorySubcategories, setCategorySubcategories] = useState<Record<string, subcategory[]>>({});

  const fetchSubcategories = useCallback((parentSlug: string, cacheKey: string) => {
    onSubLoadingChange?.(true);
    sendHttpRequest({
      requestConfig: {
        url: `products/public/categories/subcategories/?parent=${encodeURIComponent(parentSlug)}`,
        method: "GET",
      },
      successRes: (res: any) => {
        const subs =
          res?.data?.results ||
          res?.data?.subcategories ||
          (Array.isArray(res?.data) ? res?.data : []) ||
          (Array.isArray(res) ? res : []);

        const finalSubs: subcategory[] = Array.isArray(subs) ? subs : [];

        setCategorySubcategories((prev) => ({
          ...prev,
          [cacheKey]: finalSubs,
          [parentSlug]: finalSubs,
        }));
        onSubcategoriesLoaded?.(finalSubs);
        onSubLoadingChange?.(false);
      },
      errorRes: () => {
        onSubLoadingChange?.(false);
      },
    });
  }, [sendHttpRequest, onSubLoadingChange, onSubcategoriesLoaded]);

  const handleCategoryClick = useCallback((cat: Category) => {
    // Toggle off if clicking the same category
    if (selectedCategory?.id === cat.id) {
      onSelectCategory?.(null);
      onSubcategoriesLoaded?.([]);
      return;
    }

    onSelectCategory?.(cat);

    const parentSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || cat.id;
    const cacheKey = cat.id || parentSlug;

    // Check if subcategories already exist in cache
    const existingCached = categorySubcategories[cacheKey] || categorySubcategories[parentSlug] || categorySubcategories[cat.id];
    if (existingCached && existingCached.length > 0) {
      onSubcategoriesLoaded?.(existingCached);
      onSubLoadingChange?.(false);
      return;
    }

    // Check if subcategories exist on the category object itself
    const directSubs =
      cat.children ||
      (cat as any).sub_categories ||
      (cat as any).subcategories ||
      cat.subcategory;

    if (Array.isArray(directSubs) && directSubs.length > 0) {
      onSubcategoriesLoaded?.(directSubs);
      onSubLoadingChange?.(false);
      return;
    }

    // Otherwise fetch fresh
    onSubcategoriesLoaded?.([]);
    fetchSubcategories(parentSlug, cacheKey);
  }, [selectedCategory, onSelectCategory, onSubcategoriesLoaded, onSubLoadingChange, categorySubcategories, fetchSubcategories]);

  // Fetch categories with pagination
  const fetchCategories = useCallback(() => {
    console.log("Attempting to fetch categories...", { isFetching: isFetchingRef.current, hasMore });
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/categories/main/?page=${page}&page_size=20`,
        method: "GET",
      },
      successRes: (res: any) => {
        const newCategories: Category[] = res?.data?.results || [];
        const count = res?.data?.count || 0;
        console.log("Successfully fetched categories:", newCategories);

        setTotalCount(count);

        setCategories((prev) => {
          const merged = [...prev, ...newCategories];
          const unique = Array.from(
            new Map(merged.map((c) => [c.id, c])).values()
          );

          const nextPage = page + 1;
          const hasMoreData = unique.length < count;

          sessionStorage.setItem(
            CATEGORIES_CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              categories: unique,
              totalCount: count,
              hasMore: hasMoreData,
              page: nextPage,
            })
          );

          setHasMore(hasMoreData);
          return unique;
        });

        setPage((prev) => prev + 1);
        isFetchingRef.current = false;
      },
      errorRes: (err: any) => {
        console.error("Failed to fetch categories:", err);
        isFetchingRef.current = false;
      }
    });
  }, [page, hasMore, sendHttpRequest]);

  useEffect(() => {
    const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

      // Only use cache if not expired AND has categories
      if (!isExpired && parsed.categories && parsed.categories.length > 0) {
        setCategories(parsed.categories);
        setTotalCount(parsed.totalCount);
        setHasMore(parsed.hasMore);
        setPage(parsed.page);
        return; // ✅ use cache
      } else {
        sessionStorage.removeItem(CATEGORIES_CACHE_KEY); // ❌ expired or empty
      }
    }

    fetchCategories(); // 🔄 fetch fresh
  }, [fetchCategories]);

  const handleManualRefetch = useCallback(() => {
    sessionStorage.removeItem(CATEGORIES_CACHE_KEY);
    setCategories([]);
    setPage(1);
    setHasMore(true);
    // fetchCategories will be called by useEffect since it's a dependency and will be recreated
  }, []);

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full max-w-full max-h-134 overflow-y-auto overflow-x-hidden custom-scroll"
    >
      <div className="">
        <h1 className="font-MontserratSemiBold text-c20 px-c32 pb-c24 text-000000 ">
          Categories
        </h1>
      </div>

      {loading && categories.length === 0 ? (
        <CategorySkeleton count={8} />
      ) : categories.length === 0 ? (
        <p className=" text-000000/64 px-c32">No categories available</p>
      ) : (
        <InfiniteScroll
          dataLength={categories.length}
          next={fetchCategories}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          className="w-full max-w-full overflow-x-hidden"
          loader={
            <div className="flex w-full justify-center py-2 overflow-x-hidden">
              <LoadingSpinner color="border-ff715b" size={20} />
            </div>
          }
        >
          <div className="w-full max-w-full overflow-x-hidden min-w-0">
            {categories.map((cat) => {
              const normalizedName = cat.name.replace("Products", "").trim();
              return (
                <CategoryButton
                  key={cat.id}
                  iconSrc={cat.image || ""}
                  label={normalizedName}
                  isSelected={selectedCategory?.id === cat.id}
                  onClick={() => handleCategoryClick(cat)}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

