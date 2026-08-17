"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import navright from "@/assets/icons/CaretRight.svg";
import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import SubCategoryPageSkeleton from "@/components/reloadSpinner/SubcategoryPageSkeleton";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setsubCategoryProducts } from "@/store/user-data/products/subCategoryProductsSlice";
import { setTopDeals } from "@/store/user-data/products/topDealsSlice";
import { setCategoryProducts } from "@/store/user-data/products/categoryProductsSlice";
import AdSlider from "@/components/Ads";

export default function SubCategoryPage() {
  const { categorySlug, subCategorySlug } = useParams<{
    categorySlug: string;
    subCategorySlug: string;
  }>();

  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();

  const [pendingRequests, setPendingRequests] = useState(4);
  const [error, setError] = useState("");
  const [subCategoryDetails, setSubCategoryDetails] = useState<{
    id?: string;
    name?: string;
    slug?: string;
    image?: string | null;
  } | null>(null);

  const subCatproducts = useSelector(
    (state: RootState) => state.subCategoryProducts.items,
  );
  const categoryProducts = useSelector(
    (state: RootState) => state.categoryProducts.items,
  );
  const topDeals = useSelector((state: RootState) => state.topDeals.items);

  const category =
    categoryProducts.find((p) => p.category?.slug === categorySlug)?.category ||
    subCatproducts.find((p) => p.category?.slug === categorySlug)?.category;

  const subcat =
    subCategoryDetails ||
    subCatproducts.find((p) => p.category?.subcategory?.slug === subCategorySlug)
      ?.category?.subcategory ||
    categoryProducts.find(
      (p) => p.category?.subcategory?.slug === subCategorySlug,
    )?.category?.subcategory;

  const isLoading = pendingRequests > 0;

  /* ---------------- FETCH SUBCATEGORY DETAILS (FOR IMAGE & INFO) ---------------- */
  useEffect(() => {
    if (!categorySlug || !subCategorySlug) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/categories/subcategories/?parent=${encodeURIComponent(categorySlug)}`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        try {
          const subs: any[] =
            res?.data?.results ||
            res?.data?.subcategories ||
            (Array.isArray(res?.data) ? res?.data : []) ||
            (Array.isArray(res) ? res : []);

          const matchedSub = subs.find(
            (s) =>
              s.slug === subCategorySlug ||
              s.id === subCategorySlug ||
              s.name?.toLowerCase().replace(/\s+/g, "-") ===
                subCategorySlug.toLowerCase(),
          );

          if (matchedSub) {
            setSubCategoryDetails(matchedSub);
          }
        } catch (err) {
          console.error("Failed to parse subcategory details:", err);
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
      errorRes: (err: any) => {
        console.error("Failed to fetch subcategory details:", err);
        setPendingRequests((prev) => prev - 1);
      },
    });
  }, [categorySlug, subCategorySlug, sendHttpRequest]);

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
          console.error("Failed to fetch subcategory products:", err);
          setError("Failed to fetch subcategory products.");
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
      errorRes: (err: any) => {
        console.error("Failed to fetch subcategory products:", err);
        setError("Failed to fetch subcategory products.");
        setPendingRequests((prev) => prev - 1);
      },
    });
  }, [subCategorySlug, dispatch, sendHttpRequest]);

  /* ---------------- FETCH TOP DEALS ---------------- */
  useEffect(() => {
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
          console.error("Failed to fetch top deals:", err);
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
      errorRes: (err: any) => {
        console.error("Failed to fetch top deals:", err);
        setPendingRequests((prev) => prev - 1);
      },
    });
  }, [dispatch, sendHttpRequest]);

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
          console.error("Failed to fetch category data:", err);
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
      errorRes: (err: any) => {
        console.error("Failed to fetch category data:", err);
        setPendingRequests((prev) => prev - 1);
      },
    });
  }, [categorySlug, dispatch, sendHttpRequest]);

  /* ---------------- DERIVE TOP DEALS FOR SUBCATEGORY ---------------- */
  const subCategoryTopDeals = topDeals.filter(
    (product) => product.category?.subcategory?.slug === subCategorySlug,
  );

  const heroImage =
    (subcat as any)?.image ||
    (subcat as any)?.icon ||
    (subcat as any)?.cover_image ||
    (subcat as any)?.category_image ||
    (category as any)?.image ||
    (category as any)?.cover_image ||
    "";

  /* ---------------- SKELETON LOADING ---------------- */
  if (isLoading) {
    return <SubCategoryPageSkeleton />;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="md:px-15  pb-15">
      {/* Breadcrumb */}
      <div className="py-8 flex items-center gap-1 text-nowrap text-sm font-semibold px-6 overflow-hidden">
        <Link href="/" className="opacity-40">
          Home
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <Link
          href={`/categories/${category?.slug || categorySlug}`}
          className="capitalize text-161616 hover:underline opacity-40"
        >
          {category?.name || categorySlug}
        </Link>
        <Image src={navright} alt="nav" width={16} height={16} />
        <span className="capitalize">
          {subcat?.name || subCategorySlug}
        </span>
      </div>
      <div className="md:hidden px-6 mb-c32">
        <AdSlider />
      </div>
      {/* Hero */}
      <div
        className="md:h-70 h-22 flex items-center justify-center text-white text-3xl font-bold md:rounded-c30 bg-center bg-cover bg-neutral-800 relative overflow-hidden"
        style={
          heroImage ? { backgroundImage: `url(${heroImage})` } : undefined
        }
      >
        <div className="absolute inset-0 bg-black/40 md:rounded-c30" />
        <h1 className="relative z-10 text-c20 md:text-5xl font-MontserratSemiBold">
          {subcat?.name || subCategorySlug}
        </h1>
      </div>

      {/* Products */}
      <div className="md:pt-c64 pt-c32 flex flex-col gap-8 md:gap-12 px-6">
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && subCatproducts.length === 0 && !error && (
          <p>No products found in this Subcategory.</p>
        )}

        {subCatproducts.length > 0 && (
          <ProductSection
            title={subcat?.name || "Products"}
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
