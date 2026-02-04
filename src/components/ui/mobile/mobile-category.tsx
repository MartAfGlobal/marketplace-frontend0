"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { Category, subcategory } from "@/types/global";
import CategorySkeleton from "@/components/reloadSpinner/CategorySkeleton";
import Electricity from "@/assets/mobile/electricals.png";
import ArrowRight from "@/assets/mobile/arrow-pointer.png";
import { MobileCategorySkeleton } from "@/components/reloadSpinner/mobile-category-skeleton";
import { Button } from "../Button/Button";
import { openMobileMenu } from "@/store/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const CATEGORIES_CACHE_KEY = "mobile_categories";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export default function MobileCategory() {
  const router = useRouter();
  const { sendHttpRequest, loading } = useHttp();
  const isFetchingRef = useRef(false);
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.token?.token);

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
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

        setCategories((prev) => {
          const merged = [...prev, ...newCategories];
          const unique = Array.from(
            new Map(merged.map((c) => [c.id, c])).values(),
          );
          setHasMore(unique.length < count);

          // Save to sessionStorage
          sessionStorage.setItem(
            CATEGORIES_CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              categories: unique,
              page: page + 1,
              hasMore: unique.length < count,
            }),
          );

          return unique;
        });

        setPage((prev) => prev + 1);
        isFetchingRef.current = false;
      },
    });
  };

  // On mount, try to load from cache first
  useEffect(() => {
    const cached = sessionStorage.getItem(CATEGORIES_CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

      if (!isExpired) {
        setCategories(parsed.categories);
        setPage(parsed.page);
        setHasMore(parsed.hasMore);
        return; // ✅ use cached data
      } else {
        sessionStorage.removeItem(CATEGORIES_CACHE_KEY);
      }
    }

    fetchCategories(); // fetch fresh if no cache or expired
  }, [sendHttpRequest]);

  const subcategories: subcategory[] = selectedCategory
    ? categories
        .filter((c) => c.id === selectedCategory.id)
        .flatMap((c) => (c.children ? c.children : []))
    : [];

  const getVariants = (index: number): Variants => {
    switch (index % 4) {
      case 0:
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
        };
      case 1:
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
        };
      case 2:
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
        };
      case 3:
        return {
          hidden: { scale: 1.2, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6 } },
        };
    }
  };

  return (
    <div className="w-full overflow-hidden px-6.75">
      <motion.div
        className="text-center mb-c32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {token?<h1 className="font-MontserratSemiBold text-left text-161616 text-c16">
          Explore popular categories
        </h1>: <h1 className="font-MontserratSemiBold text-161616 text-c16">
          Explore Our Categories
        </h1>}
        {!token && <p className="font-MontserratSemiBold text-sm text-161616">
          Explore Our Categories. Find the perfect products that suit your
          needs.
        </p>}
      </motion.div>

      {loading && categories.length === 0 ? (
        <div className="w-full mb-c40">
          <MobileCategorySkeleton count={4} />
        </div>
        
      ) : (
        <>
          {token ? (
            <>
              <div className="w-full flex gap-2  overflow-x-auto no-scrollbar  overflow-y-hidden gap-y-c32 my-c32  items-center">
                {categories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    className="relative flex-shrink-0  w-[87.75px] h-30.5 cursor-pointer  overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={getVariants(index)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex flex-col  items-center">
                      <div className=" w-[78.75px] h-[78.75px] rounded-full bg-e9eafd flex justify-center items-center">
                        <Image
                          src={cat.image || Electricity}
                          alt={cat.name}
                          width={56.25}
                          height={56.25}
                          className="rounded-full flex-shrink-0"
                          priority
                        />
                      </div>

                      <div className="w-full h-15  flex items-center justify-center">
                        <p className="text-161616 text-base font-MontserratMedium text-center text-nowrap">
                          {cat.name.trim().split(/\s+/)[0]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-c32 mt-c32 justify-center items-center">
                {categories.slice(0, 4).map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    className="relative w-full h-40 cursor-pointer rounded-lg overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={getVariants(index)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={cat.image || Electricity}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="w-full h-15 bg-000000 absolute bottom-0 flex items-center justify-center">
                      <p className="text-ffffff text-base font-MontserratMedium text-center ">
                        {cat.name.replace(/products/i, "").trim()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-3.75 mt-c32 mb-c48"
                onClick={() => dispatch(openMobileMenu())}
              >
                <span>Browse All categories</span>
                <Image
                  src={ArrowRight}
                  width={24.15}
                  height={24.15}
                  alt="browse"
                />
              </Button>{" "}
            </>
          )}
        </>
      )}
    </div>
  );
}
