"use client";

import Image from "next/image";

import ShoeSketch from "@/assets/icons/shoeSketch.svg";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
import CommentBox from "@/assets/icons/commentBox.svg";
import ImPrev from "@/assets/icons/imageprev.svg";
import Flag from "@/assets/icons/flag.svg";
import { useEffect, useState } from "react";
import Overview from "./overview";
import CartButton from "../cart/cartButton";
import { Button } from "../Button/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";
import { ProductDetail } from "@/types/global";
import CartBtn from "@/assets/mobile/cart.png";
import { useHttp } from "@/hooks/use-http";

type RatingKey = 1 | 2 | 3 | 4 | 5;

interface ReviewOverview {
  name: string;
  date: string;
  rating: number;
  text: string;
  country?: string;
}

const getReviewRows = (response: unknown): unknown[] => {
  if (Array.isArray(response)) return response;
  if (typeof response !== "object" || response === null) return [];

  const record = response as Record<string, unknown>;
  for (const key of ["results", "data", "reviews"]) {
    if (record[key] !== undefined) {
      const rows = getReviewRows(record[key]);
      if (rows.length) return rows;
    }
  }

  return [];
};

const mapReview = (value: unknown): ReviewOverview => {
  const review =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const reviewer =
    typeof review.user === "object" && review.user !== null
      ? (review.user as Record<string, unknown>)
      : {};
  const userName =
    typeof review.user === "string"
      ? review.user.split(" (")[0].trim()
      : undefined;
  const firstName =
    typeof reviewer.first_name === "string" ? reviewer.first_name : "";
  const lastName =
    typeof reviewer.last_name === "string" ? reviewer.last_name : "";
  const name =
    review.customer_name ??
    review.buyer_name ??
    review.reviewer_name ??
    review.user_name ??
    review.name ??
    review.author ??
    userName ??
    reviewer.full_name ??
    reviewer.name ??
    reviewer.username ??
    [firstName, lastName].filter(Boolean).join(" ");
  const date = review.created_at ?? review.date ?? review.timestamp;
  const parsedDate =
    typeof date === "string" ? new Date(date) : null;
  const rating = Number(review.rating ?? review.score ?? 0);

  return {
    name: typeof name === "string" && name.trim() ? name : "Customer",
    date:
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : typeof date === "string"
          ? date
          : "",
    rating: Number.isFinite(rating) ? rating : 0,
    text: String(review.comment ?? review.review ?? review.text ?? ""),
    country:
      typeof review.country === "string" ? review.country : undefined,
  };
};

const countReviewsByRating = (
  reviews: ReviewOverview[]
): Record<RatingKey, number> =>
  reviews.reduce(
    (counts, review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        counts[rating as RatingKey] += 1;
      }
      return counts;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

interface ProductProps {
  ProductDetail: ProductDetail | null;
  showOnlyReviews?: boolean;
}

export default function MoreDetailedPage({
  ProductDetail,
  showOnlyReviews = false,
}: ProductProps) {
  const dispatch = useDispatch();
  const [activeRating, setActiveRating] = useState<RatingKey | null>(null);
  const [reviews, setReviews] = useState<ReviewOverview[]>([]);
  const [ratingCounts, setRatingCounts] = useState<Record<RatingKey, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [showAllReviews, setShowAllReviews] = useState(showOnlyReviews);
  const { loading: loadingReviews, sendHttpRequest: fetchReviewsReq } =
    useHttp();

  console.log("products details", ProductDetail)
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!ProductDetail?.id) {
      setReviews([]);
      setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      return;
    }

    let isCurrentRequest = true;
    setReviews([]);
    setShowAllReviews(showOnlyReviews);
    if (activeRating === null) {
      setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    }
    const ratingQuery = activeRating ? `?rating=${activeRating}` : "";

    fetchReviewsReq({
      requestConfig: {
        url: `/products/reviews/${ProductDetail.id}/${ratingQuery}`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (response) => {
        if (isCurrentRequest) {
          const nextReviews = getReviewRows(response).map(mapReview);
          setReviews(nextReviews);
          if (activeRating === null) {
            setRatingCounts(countReviewsByRating(nextReviews));
          }
        }
      },
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [ProductDetail?.id, activeRating, fetchReviewsReq, showOnlyReviews]);

  const filteredReviews = reviews.filter(
    (review) =>
      (activeRating === null ||
        Math.round(review.rating) === activeRating) &&
      (activeCountry === null || review.country === activeCountry)
  );
  const totalRatingCount = Object.values(ratingCounts).reduce(
    (total, count) => total + count,
    0
  );

  if (!ProductDetail) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }


  return (
    <div className="w-full md:pt-8 md:max-w-full  md:mx-auto relative">
      {!showOnlyReviews && (
        <>
          {/* ================= PRODUCT DETAILS ================= */}
          <section id="details" className="mt-8 mb-6 hidden md:flex w-full">
        <div>
          <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-2">
            Product details
          </h2>
          <p className="text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed">
            {ProductDetail.description || "No description available for this product."}
          </p>

          
        </div>
      </section>

      {/* ================= PRODUCT SPECIFICATIONS ================= */}
      <section id="specifications" className="mb-8">
        <h3 className="font-MontserratSemiBold text-base mb-3">
          Product specifications
        </h3>
        {ProductDetail?.specifications_html &&
       
         <div className="mb-6">
            
            {ProductDetail?.specifications_html ? (
              <div
                className="text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ProductDetail.specifications_html }}
              />
            ) : ProductDetail?.specifications_text ? (
              <p className="text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed whitespace-pre-line">
                {ProductDetail.specifications_text}
              </p>
            ) : Array.isArray(ProductDetail?.specifications) && ProductDetail.specifications.length > 0 ? (
              <div className="space-y-1">
                {ProductDetail.specifications.map((spec: any, idx: number) => (
                  <div key={idx} className="flex text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed">
                    <span className="font-MontserratMedium mr-2">{spec.name || spec.key}:</span>
                    <span>{spec.value || spec.val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-MontserratNormal">
                No specifications available for this product.
              </p>
            )}
          </div>}
      </section>
        </>
      )}

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="w-full md:pt-8">
        {/* Header */}
        {!showOnlyReviews && (
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="font-MontserratSemiBold text-base text-1a1a1a">
              Reviews
            </h2>
            {!loadingReviews && filteredReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews((showing) => !showing)}
                className="font-MontserratSemiBold text-sm text-ff715b hover:underline"
                aria-expanded={showAllReviews}
              >
                {showAllReviews ? "view less" : "view more"}
              </button>
            )}
          </div>
        )}

        {/* Average rating + stars */}
        <div className="flex md:flex-wrap items-center gap-c32 md:gap-x-40 gap-y-6 mb-8 5">
          <div className="w-32">
            <p className="font-MontserratSemiBold text-c24 md:text-5xl mb-2">
              {ProductDetail.rating_average}/5
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={i <= Math.floor(Number(ProductDetail.rating_average)) ? YellowStar : Star}
                  alt="star rate"
                  width={32}
                  height={30.32}
                  className="h-5.5 w-6 md:h-[30.32px] md:w-8"
                />
              ))}
            </div>
          </div>

          <div>
            {[5, 4, 3, 2, 1].map((stars) => {
              const value = ratingCounts[stars as RatingKey];
              const widthPercent = totalRatingCount
                ? (value / totalRatingCount) * 100
                : 0;

              return (
                <div
                  key={stars}
                  className="flex items-center gap-2 md:gap-3 mb-2"
                >
                  <div className="flex items-center gap-1 w-5.25 md:w-6 justify-center">
                    <p className="text-c12 font-MontserratNormal md:text-base md:font-MontserratSemiBold">
                      {stars}
                    </p>
                    <Image
                      src={YellowStar}
                      alt="star rate"
                      width={12}
                      height={11.37}
                    />
                  </div>

                  <div className="md:w-32 md:h-2 h-1.5 w-34.25 bg-gray-200 overflow-hidden ">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="h-full bg-ffaco6 transition-width duration-300"
                    />
                  </div>

                  <p className="md:text-base text-c12 font-MontserratSemiBold w-2 md:w-2.5 text-center">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 items-center mb-4">
          <button className="border border-gray-400 w-14 md:w-18 h-10 md:h-13 rounded-c6 flex items-center justify-center">
            <Image src={CommentBox} alt="comment box" width={24} height={24} />
          </button>
          <button className="border border-gray-400 w-14 md:w-18 h-10 md:h-13 rounded-c6 flex items-center justify-center">
            <Image src={ImPrev} alt="image prev" width={24} height={24} />
          </button>
          <button
          onClick={() => {
            setShowAllReviews(showOnlyReviews);
            setActiveCountry(activeCountry === "Nigeria" ? null : "Nigeria");
          }}
            className={`border w-14 md:w-18 h-10 md:h-13 rounded-c6 flex items-center justify-center ${
              activeCountry ? "border-[#FF715B]" : "border-gray-400"
            }`}
          >
            <Image src={Flag} alt="flag filter" width={24} height={24} />
          </button>
        </div>

        {/* Star filter buttons */}
        <div className="flex gap-3 items-center mb-6">
          {[5, 4, 3, 2, 1].map((stars) => {
            const starKey = stars as RatingKey;
            return (
              <button
                key={starKey}
                onClick={() => {
                  setShowAllReviews(showOnlyReviews);
                  setActiveRating(activeRating === starKey ? null : starKey)
                }}
                className={`border rounded-c6 w-16 h-8 md:w-18 md:h-c56 flex items-center justify-center transition-colors duration-200 ${
                  activeRating === starKey
                    ? "border-[#FF715B]"
                    : "border-gray-400"
                }`}
                aria-label={`${starKey} star rating`}
                aria-pressed={activeRating === starKey}
              >
                <div className="flex items-center gap-1">
                  <p className="md:text-base text-sm font-MontserratNormal md:font-MontserratSemiBold">
                    {starKey}
                  </p>
                  <Image
                    src={YellowStar}
                    alt={`${starKey} star icon`}
                    width={12}
                    height={11.37}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="pb-20 md:pb-1">
          {loadingReviews ? (
            <p className="pt-6 text-center text-sm text-gray-500">
              Loading reviews...
            </p>
          ) : (
            <Overview
              reviews={
                showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)
              }
            />
          )}
        </div>
      </section>

      {/* ================= MOBILE CART BAR ================= */}
      {/* <div className="flex gap-9.75 items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
        <CartButton image={CartBtn} size={32} />
        <div className="flex gap-2 w-full text-c12">
          <Button
            className="bg-transparent border border-ff715b hover:border-0 text-ff715b focus:ring-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(
                addToCart({
                  ...product,
                  product_id: product.id, // ✅ Required by CartItem
                  quantity: 1,
                  variation_display: "default", // ✅ Safe fallback
                  price_at_purchase: product.price,
                })
              );
            }}
          >
            Add to cart
          </Button>
          <Button>Buy now</Button>
        </div>
      </div> */}

      

    </div>
  );
}
