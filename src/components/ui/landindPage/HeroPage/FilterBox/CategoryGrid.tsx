"use client";

const CATEGORIES_CACHE_KEY = "martaf_landing_categories";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

import { Category, subcategory } from "@/types/global";
import CategoryButton from "./CategoryButton";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CategorySkeleton from "@/components/reloadSpinner/CategorySkeleton";
import { X, RotateCw } from "lucide-react";

export default function CategoriesGrid() {
  const router = useRouter();
  const { sendHttpRequest, loading } = useHttp();
  const isFetchingRef = useRef(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [subLoading, setSubLoading] = useState(false);
  const [categorySubcategories, setCategorySubcategories] = useState<Record<string, subcategory[]>>({});

  const fetchSubcategories = useCallback((categoryId: string) => {
    setSubLoading(true);
    sendHttpRequest({
      requestConfig: {
        url: `/products/public/categories/${categoryId}/subcategories/`,
        method: "GET",
      },
      successRes: (res: any) => {
        const subs = res?.data?.subcategories || res?.data?.results || res?.data || [];
        setCategorySubcategories(prev => ({
          ...prev,
          [categoryId]: Array.isArray(subs) ? subs : []
        }));
        setSubLoading(false);
      },
      errorRes: () => {
        setSubLoading(false);
      }
    });
  }, [sendHttpRequest]);

  const handleCategoryClick = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    
    // Check if subcategories already exist in any common field
    const existingSubs = 
      (cat.children && cat.children.length > 0) || 
      ((cat as any).sub_categories && (cat as any).sub_categories.length > 0) ||
      ((cat as any).subcategories && (cat as any).subcategories.length > 0) ||
      (cat.subcategory && (Array.isArray(cat.subcategory) ? cat.subcategory.length > 0 : Object.keys(cat.subcategory).length > 0));
    
    if (!existingSubs && !categorySubcategories[cat.id]) {
      console.log(`Fetching subcategories for category: ${cat.name} (${cat.id})`);
      fetchSubcategories(cat.id);
    }
  }, [categorySubcategories, fetchSubcategories]);

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

  // Extract subcategories for selected category safely
  const subcategories: subcategory[] = (() => {
    if (!selectedCategory) return [];
    
    // Check various common field names for subcategories array from backend
    const possible = 
      selectedCategory.children || 
      (selectedCategory as any).sub_categories || 
      (selectedCategory as any).subcategories || 
      selectedCategory.subcategory ||
      categorySubcategories[selectedCategory.id];

    if (Array.isArray(possible)) return possible;
    // Handle single object response if necessary
    if (possible && typeof possible === "object" && Object.keys(possible).length > 0) {
      return [possible as subcategory];
    }
    return [];
  })();

  return (
    <>
    <div
      id="scrollableDiv"
      className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full max-w-full max-h-134 overflow-y-auto overflow-x-hidden custom-scroll"
    >
      <div className="flex justify-between items-center pr-c32">
        <h1 className="font-MontserratBold text-c20 pb-c24 text-000000 pl-c32">
          Categories
        </h1>
        <button 
          onClick={handleManualRefetch}
          className="pb-c24 hover:text-ff715b transition-colors"
          title="Refresh categories"
        >
          <RotateCw size={18} className={`${loading ? "animate-spin" : ""} text-gray-500`} />
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <CategorySkeleton count={8} />
      ) : categories.length === 0 ? (
        <p className="pl-c32 text-gray-500">No categories available</p>
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
      <AnimatePresence>
        {selectedCategory && (subLoading || subcategories.length > 0) && (
          <motion.div
            className="fixed top-0 inset-0 bg-black/50 flex items-center justify-start z-50 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              className="absolute top-[104px] left-[320px]"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
               <div className="bg-white p-8 shadow-customW w-full max-w-181.75 pointer-events-auto min-h-[200px]">
                {subLoading ? (
                  <div className="flex items-center justify-center h-full w-full py-10">
                    <LoadingSpinner color="border-ff715b" size={40} />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-x-[26px] gap-y-[27px]">
                    {subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() =>
                          router.push(
                            `/categories/${encodeURIComponent(
                              selectedCategory.slug
                            )}/${encodeURIComponent(sub.slug)}`
                          )
                        }
                        className="flex flex-col w-22 items-center cursor-pointer hover:shadow-md"
                      >
                        <span className="w-22 h-22 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                          {sub.image ? (
                            <Image
                              src={sub.image}
                              height={88}
                              width={88}
                              alt={sub.name}
                              className="object-cover h-22 w-22"
                            />
                          ) : (
                            <div className="text-gray-300 text-[10px] text-center px-1">No Image</div>
                          )}
                        </span>
                        <p className="mt-2 text-sm text-center text-c12 font-MontserratNormal">
                          {sub.name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
