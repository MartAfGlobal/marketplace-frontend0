"use client";

const CATEGORIES_CACHE_KEY = "categories";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

import { Category, subcategory } from "@/types/global";
import CategoryButton from "./CategoryButton";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CategorySkeleton from "@/components/reloadSpinner/CategorySkeleton";
import { X } from "lucide-react";

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

  // Fetch categories with pagination
  const fetchCategories = () => {
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
    });
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

      if (!isExpired) {
        setCategories(parsed.categories);
        setTotalCount(parsed.totalCount);
        setHasMore(parsed.hasMore);
        setPage(parsed.page);
        return; // ✅ use cache
      } else {
        sessionStorage.removeItem(CATEGORIES_CACHE_KEY); // ❌ expired
      }
    }

    fetchCategories(); // 🔄 fetch fresh
  }, []);

  // Extract subcategories for selected category
  const subcategories: subcategory[] = selectedCategory
    ? categories
        .filter((c) => c.id === selectedCategory.id)
        .flatMap((c) => (c.children ? c.children : []))
    : [];

  return (
    <div
      id="scrollableDiv"
      className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full max-w-full max-h-134 overflow-y-auto overflow-x-hidden custom-scroll"
    >
      <h1 className="font-MontserratBold text-c20 pb-c24 text-000000 pl-c32">
        Categories
      </h1>

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
                  onClick={() => setSelectedCategory(cat)}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      )}

      <AnimatePresence>
        {selectedCategory && subcategories.length > 0 && (
          <motion.div
            className="fixed top-0 inset-0 bg-black/50 flex items-center justify-start z-50 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
          >
          
            
           
            <motion.div
              className="w-full h-full absolute top-26 left-91.25"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white p-8 shadow-customW w-full max-w-181.75 pointer-events-auto">
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
                      <span className="w-22 h-22 bg-gray-100 flex items-center justify-center rounded-md">
                        {sub.image && (
                          <Image
                            src={sub.image}
                            height={88}
                            width={88}
                            alt={sub.name}
                            className="object-cover h-22 w-22"
                          />
                        )}
                      </span>
                      <p className="mt-2 text-sm text-center text-c12 font-MontserratNormal">
                        {sub.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
