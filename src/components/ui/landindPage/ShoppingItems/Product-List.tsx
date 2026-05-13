"use client";

const CACHE_KEY = "home_products_cache";
const CACHE_TTL = 30 * 60 * 1000; // ✅ 30 minutes in milliseconds


import { useEffect, useState } from "react";
import ProductSection from "./shoppingItemComponent/ProductSection";
import ProductSectionSkeleton from "@/components/reloadSpinner/ProductSectionSkeleton";
import { useHttp } from "@/hooks/use-http";
import { Product } from "@/types/global";

export default function ProductListPage() {
  const { sendHttpRequest } = useHttp();

  const [isLoading, setIsLoading] = useState(true);

  const [todayProduct, setTodayProduct] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [discount, setDiscount] = useState<Product[]>([]);
  const [allProduct, setAllProduct] = useState<Product[]>([]);

  const fetchWithPromise = (url: string) => {
    return new Promise<any>((resolve) => {
      sendHttpRequest({
        requestConfig: {
          url,
          method: "GET",
        },
        successRes: (res) => {
          console.log(`📡 Fetched data from ${url}:`, res);
          resolve(res);
        },
      });
    });
  };

  

  const fetchProducts = async (updateCache = true) => {
    console.log("🛒 fetchProducts: Starting to fetch data from API...");
    setIsLoading(true);

    try {
      const [todayRes, trendingRes, topSellingRes, discountRes, allRes] =
        await Promise.all([
          fetchWithPromise(
            "/products/public/products/?created_today=true&page=1&page_size=20"
          ),
          fetchWithPromise(
            "/products/public/products/?filter=trending&days=30&page=1&page_size=20"
          ),
          fetchWithPromise(
            "/products/public/products/?filter=top-selling&page=1&page_size=10"
          ),
          fetchWithPromise(
            "/products/public/products/?filter=discounted&page=1&page_size=20"
          ),
          fetchWithPromise("/products/public/products/?page=1&page_size=20"),
        ]);

      const payload = {
        timestamp: Date.now(),
        todayProduct: todayRes?.data?.results ?? [],
        trending: trendingRes?.data?.results ?? [],
        topSelling: topSellingRes?.data?.results ?? [],
        discount: discountRes?.data?.results ?? [],
        allProduct: allRes?.data?.results ?? [],
      };

      console.log("📦 Final combined products payload:", payload);
      console.log("🌐 [NETWORK] All products response:", payload.allProduct);

      setTodayProduct(payload.todayProduct);
      setTrending(payload.trending);
      setTopSelling(payload.topSelling);
      setDiscount(payload.discount);
      setAllProduct(payload.allProduct);

      if (updateCache) {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🛒 ProductListPage Mounted! Checking for cached products...");
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      console.log("🛒 Found cached products in sessionStorage!");
      const data = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_TTL;

     
      setTodayProduct(data.todayProduct);
      setTrending(data.trending);
      setTopSelling(data.topSelling);
      setDiscount(data.discount);
      setAllProduct(data.allProduct);
      setIsLoading(false);

      console.log("📦 [CACHE] All products response:", data.allProduct);

      
      if (isExpired) {
        fetchProducts(true);
      }

      return;
    }

    fetchProducts(true);
  }, []);

  const isEmpty =
    !isLoading &&
    todayProduct.length === 0 &&
    trending.length === 0 &&
    topSelling.length === 0 &&
    discount.length === 0 &&
    allProduct.length === 0;

  if (isEmpty) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <svg
          width="140"
          height="140"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff715b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>

        <p className="font-MontserratBold text-base text-center text-161616">
          No product found
        </p>
      </div>
    );
  }

  

  return (
    <div className="w-full px-4.75 md:px-10 lg:px-4.75 pt-12">
      {isLoading ? (
        <>
          <ProductSectionSkeleton />
          <ProductSectionSkeleton />
          <ProductSectionSkeleton />
        </>
      ) : (
        <>
          {todayProduct.length > 0 && (
            <ProductSection
              title="Today’s deals"
              products={todayProduct}
              searchKey="created_today=true"
            />
          )}

          {trending.length > 0 && (
            <ProductSection
              title="Trending"
              products={trending}
              searchKey="trending"
            />
          )}


          {topSelling.length > 0 && (
            <ProductSection
              title="Top selling"
              products={topSelling}
              searchKey="top-selling"
            />
          )}

          {discount.length > 0 && (
            <ProductSection
              title="Discount items"
              products={discount}
              searchKey="discounted"
            />
          )}

          {allProduct.length > 0 && (
            <ProductSection
              title="All Products"
              products={allProduct}
              searchKey="products"
            />
          )}
        </>
      )}
    </div>
  );
}
