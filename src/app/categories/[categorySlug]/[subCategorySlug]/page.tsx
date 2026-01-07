"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import navright from "@/assets/icons/CaretRight.svg";
import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import SubCategoryPageSkeleton from "@/components/reloadSpinner/SubcategoryPageSkeleton";
import adBanner1 from "@/assets/images/adbanner1.svg";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setsubCategoryProducts } from "@/store/user-data/products/subCategoryProductsSlice";
import { setTopDeals } from "@/store/user-data/products/topDealsSlice";
import { setCategoryProducts } from "@/store/user-data/products/categoryProductsSlice";
import { AnimatePresence, motion } from "framer-motion";
import AdSlider from "@/components/Ads";


export default function SubCategoryPage() {
  const { categorySlug, subCategorySlug } = useParams<{
    categorySlug: string;
    subCategorySlug: string;
  }>();


  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();

  const [pendingRequests, setPendingRequests] = useState(3); // 👈 3 API calls
  const [error, setError] = useState("");



  const subCatproducts = useSelector(
    (state: RootState) => state.subCategoryProducts.items
  );
  const topDeals = useSelector((state: RootState) => state.topDeals.items);

  const isLoading = pendingRequests > 0;

  /* ---------------- DATA DERIVATIONS ---------------- */
  const subCategoryTopDeals = topDeals.filter(
    (product) => product.category?.subcategory?.slug === subCategorySlug
  );

  const subCategory = subCatproducts.find(
    (p) => p.category?.subcategory?.slug === subCategorySlug
  )?.category?.subcategory;

  const category = subCatproducts.find(
    (p) => p.category?.slug === categorySlug
  )?.category;




  /* ---------------- FETCH SUBCATEGORY PRODUCTS ---------------- */
  useEffect(() => {
    if (!subCategorySlug) return;

    setError("");

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?subcategory=${subCategorySlug}&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        try {
          const products = res?.data?.results ?? [];
          dispatch(setsubCategoryProducts(products));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch subcategory products.");
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
    });
  }, [subCategorySlug, dispatch, sendHttpRequest]);

  /* ---------------- FETCH TOP DEALS ---------------- */
  useEffect(() => {
    if (!subCategorySlug) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?filter=top-selling&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        try {
          const products = res?.data?.results ?? [];
          dispatch(setTopDeals(products));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch top deals.");
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
    });
  }, [subCategorySlug, dispatch, sendHttpRequest]);

  /* ---------------- FETCH CATEGORY PRODUCTS ---------------- */
  useEffect(() => {
    if (!categorySlug) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?category=${categorySlug}&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        try {
          const products = res?.data?.results ?? [];
          dispatch(setCategoryProducts(products));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch category data.");
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
    });
  }, [categorySlug, dispatch, sendHttpRequest]);

  /* ---------------- SKELETON LOADING ---------------- */
  if (isLoading) {
    return <SubCategoryPageSkeleton />;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="md:px-15 px-6 pb-15">
      {/* Breadcrumb */}
      <div className="py-8 flex items-center gap-1 text-sm font-semibold">
        <Link href="/" className="opacity-40">
          Home
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <Link
          href={`/categories/${categorySlug}`}
          className="capitalize text-161616 hover:underline"
        >
          {category?.name}
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <span className="capitalize">{subCategory?.name}</span>
      </div>

      {/* Hero */}
      <div
        className="h-70 flex items-center justify-center text-white text-3xl font-bold rounded-c30 bg-center bg-cover relative"
        style={{
          backgroundImage: `url(${
            subCategory?.image || category?.image || ""
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-c30" />
        <h1 className="relative z-10">{subCategory?.name}</h1>
      </div>

      {/* Products */}
      <div className="pt-c64 flex flex-col gap-12">
        {error && <p className="text-red-500">{error}</p>}

        {subCatproducts.length > 0 && (
          <ProductSection
            title={subCategory?.name || "Products"}
            products={subCatproducts}
          />
        )}

          <AdSlider />

        {subCategoryTopDeals.length > 0 && (
          <ProductSection
            title="Top Deals"
            searchKey="top-selling"
            products={subCategoryTopDeals}
          />
        )}
      </div>
    </div>
  );
}
