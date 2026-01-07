"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import navright from "@/assets/icons/CaretRight.svg";
import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import CategoryPageSkeleton from "@/components/reloadSpinner/CategoryPageSkeleton";

import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { setCategoryProducts } from "@/store/user-data/products/categoryProductsSlice";
import { setTopDeals } from "@/store/user-data/products/topDealsSlice";
import AdSlider from "@/components/Ads";


export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();

  const [pendingRequests, setPendingRequests] = useState(2); // 2 API calls
  const [error, setError] = useState("");

  const categoryProducts = useSelector(
    (state: RootState) => state.categoryProducts.items
  );
  const topDeals = useSelector((state: RootState) => state.topDeals.items);

  const categoryTopDeals = topDeals.filter(
    (p) => p.category?.slug === categorySlug
  );

  const category = categoryProducts.find(
    (p) => p.category?.slug === categorySlug
  )?.category;

  const isLoading = pendingRequests > 0;

  // Fetch category products
  useEffect(() => {
    if (!categorySlug) return;

    setError("");

    const handleCategoryProducts = async (res: any) => {
      try {
        const products = res?.data?.results ?? [];
        dispatch(setCategoryProducts(products));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch category products.");
      } finally {
        setPendingRequests((prev) => prev - 1);
      }
    };

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?category=${categorySlug}&page=1`,
        method: "GET",
        userType: "buyer",
      },
      successRes: handleCategoryProducts,
    });
  }, [categorySlug, dispatch, sendHttpRequest]);

  // Fetch top deals
  useEffect(() => {
    if (!categorySlug) return;

    setError("");

    const handleTopDeals = async (res: any) => {
      try {
        const products = res?.data?.results ?? [];
        dispatch(setTopDeals(products));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch top deals.");
      } finally {
        setPendingRequests((prev) => prev - 1);
      }
    };

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?filter=top-selling&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: handleTopDeals,
    });
  }, [categorySlug, dispatch, sendHttpRequest]);

  // Show skeleton while any request is pending
  if (isLoading) {
    return <CategoryPageSkeleton />;
  }

  return (
    <div className="md:px-16 px-6">
      {/* Breadcrumb */}
      <div className="py-8 flex items-center gap-1 text-sm font-semibold">
        <Link href="/" className="opacity-40">
          Home
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <span className="capitalize">{category?.name}</span>
      </div>

      {/* Hero */}
      <div
        className="h-70 flex items-center justify-center text-white text-3xl font-bold rounded-c30 bg-center bg-cover relative"
        style={{
          backgroundImage: `url(${category?.image || ""})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-c30" />
        <h1 className="relative z-10">{category?.name || "Category"}</h1>
      </div>

      {/* Products */}
      <div className="pt-c64 flex flex-col gap-12">
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && categoryProducts.length === 0 && !error && (
          <p>No products found in this category.</p>
        )}

        {categoryProducts.length > 0 && (
          <ProductSection
            title={category?.name || "Products"}
            products={categoryProducts}
          />
        )}

         <AdSlider />

        {/* Top Deals Section */}
        {categoryTopDeals.length > 0 && (
          <ProductSection
            searchKey="top-selling"
            title="Top Deals"
            products={categoryTopDeals}
          />
        )}
      </div>
    </div>
  );
}
