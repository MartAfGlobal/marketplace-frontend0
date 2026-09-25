"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useParams } from "next/navigation";

import DetailPageNavbar from "@/components/ui/navigation/detail-page-nav";

import { useHttp } from "@/hooks/use-http";
import { setProduct, clearProduct } from "@/store/productDetails/productDetailsSlice";
import ProductVariation from "@/components/ui/DetailPage/productVariation";
import ProductDetailsSkeleton from "@/components/reloadSpinner/ProductDetailsSkeleton";
import { useSearchParams } from "next/navigation";

export default function ProductPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const slug = params?.slug as string;
  const searchParams = useSearchParams();
  const variationId = searchParams.get("variationId") || undefined;

  const { loading: loadingDetails, sendHttpRequest: fetchDetailsReq } =
    useHttp();

  useEffect(() => {
    if (!slug) return;

    // ✅ Clear old product immediately so stale data never renders
    dispatch(clearProduct());

    fetchDetailsReq({
      requestConfig: {
        url: `/products/public/products/${slug}/`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res) => {
        dispatch(setProduct(res.data));
      },
    });
  }, [slug]);

  const [selectedQty, setSelectedQty] = useState(1);

  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );

  // ✅ Show skeleton while product is null (cleared) or still loading
  if (!productDetails || loadingDetails) {
    return (
      <main className="px-4 md:px-6 lg:pl-c60 lg:pr-[43.95px] pb-c32">
        <ProductDetailsSkeleton />
      </main>
    );
  }

  return (
    <main className="px-4 md:px-6 lg:pl-c60 lg:pr-[43.95px] pb-c32 ">
      <div className="hidden md:flex">
        <DetailPageNavbar
          productName={productDetails?.name || ""}
          categoryName={productDetails?.category?.name || ""}
          subCategoryName={productDetails?.category?.subcategory?.name || ""}
          categorySlug={productDetails?.category?.slug || ""}
          subCategorySlug={productDetails?.category?.subcategory?.slug || ""}
        />
      </div>

      {/* Product main section */}
      <div className="flex flex-col md:flex-row md:gap-c67 justify-center ">
        <div className="flex flex-col gap-c32 w-full ">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12   md:border-b md:border-gray-200 h-fit pb-1.5 ">
            <ProductVariation isModal={false} selectedVariaton={variationId} />
          </div>
        </div>
      </div>
    </main>
  );
}
