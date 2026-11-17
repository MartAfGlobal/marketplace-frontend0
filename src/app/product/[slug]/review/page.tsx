"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Caretleft from "@/assets/mobile/CaretLeft.png";
import MoreDetailedPage from "@/components/ui/DetailPage/MoreDetailedPage";
import ProductDetailsSkeleton from "@/components/reloadSpinner/ProductDetailsSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { setProduct } from "@/store/productDetails/productDetailsSlice";

export default function ReviewsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const dispatch = useDispatch();
  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );
  const product = productDetails?.slug === slug ? productDetails : null;
  const { sendHttpRequest: fetchProductReq } = useHttp();

  useEffect(() => {
    if (!slug || productDetails?.slug === slug) return;

    fetchProductReq({
      requestConfig: {
        url: `/products/public/products/${slug}/`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (response) => {
        dispatch(setProduct(response.data));
      },
    });
  }, [slug, productDetails?.slug, dispatch, fetchProductReq]);

  if (!slug) {
    return (
      <div className="py-5 px-6">
        <button onClick={() => router.back()}>
          <Image src={Caretleft} alt="back" width={24} height={24} />
        </button>
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-20 md:px-6 ">
      <div className="flex gap-3 items-center py-5">
        <button onClick={() => router.back()}>
          <Image src={Caretleft} alt="back" width={24} height={24} />
        </button>
        <h1 className="font-MontserratSemiBold text-base">Ratings & Reviews</h1>
      </div>
      {product ? (
        <MoreDetailedPage ProductDetail={product} showOnlyReviews />
      ) : (
        <ProductDetailsSkeleton />
      )}
    </main>
  );
}
