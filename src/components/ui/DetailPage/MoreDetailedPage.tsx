"use client";

import Image from "next/image";

import ShoeSketch from "@/assets/icons/shoeSketch.svg";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
import CommentBox from "@/assets/icons/commentBox.svg";
import ImPrev from "@/assets/icons/imageprev.svg";
import Flag from "@/assets/icons/flag.svg";
import { useState, useMemo } from "react";
import Overview from "./overview";
import CartButton from "../cart/cartButton";
import { Button } from "../Button/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";
import { Product, ProductDetail } from "@/types/global";
import CartBtn from "@/assets/mobile/cart.png";

type RatingKey = 1 | 2 | 3 | 4 | 5;

interface ReviewOverview {
  name: string;
  date: string;
  rating: number;
  text: string;
  country?: string;
}
interface ProductProps {
  ProductDetail: ProductDetail | null;
}

export default function MoreDetailedPage({ProductDetail}:ProductProps) {
  const dispatch = useDispatch();

 

  const [activeRating, setActiveRating] = useState<RatingKey | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  // Group reviews by rating
  // const ratingsCount = useMemo(() => {
  //   const counts: Record<RatingKey, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  //   reviews.forEach((r: any) => {
  //     const rating = Math.round(r.rating || 0) as RatingKey;
  //     if (rating >= 1 && rating <= 5) counts[rating]++;
  //   });
  //   return counts;
  // // }, [reviews]);

  // const totalVotes = Object.values(ratingsCount).reduce((a, b) => a + b, 0);

  // const average =
  //   totalVotes > 0
  //     ? (
  //         Object.entries(ratingsCount).reduce(
  //           (sum, [stars, count]) => sum + Number(stars) * count,
  //           0
  //         ) / totalVotes
  //       ).toFixed(1)
  //     : "0.0";

  // Filter reviews dynamically
  // const filteredReviews = useMemo(() => {
  //   return reviews.filter((r: any) => {
  //     const ratingMatch =
  //       activeRating === null || Math.round(r.rating) === activeRating;
  //     const countryMatch =
  //       activeCountry === null || r.country === activeCountry;
  //     return ratingMatch && countryMatch;
  //   });
  // }, [reviews, activeRating, activeCountry]);

  // Map filtered reviews to Overview component type
  // const overviewReviews: ReviewOverview[] = filteredReviews.map((r: any) => ({
  //   name: r.name || r.user || "Anonymous",
  //   date: r.date || "N/A",
  //   rating: r.rating || 0,
  //   text: r.comment || "",
  //   country: r.country || "",
  // }));
    if (!ProductDetail) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }


  return (
    <div className="w-full md:pt-8 md:max-w-4xl md:mx-auto relative">
      {/* ================= PRODUCT DETAILS ================= */}
      <section id="details" className="mt-8 mb-6 hidden md:flex w-full">
        <div>
          <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-2">
            Product details
          </h2>
          <p className="text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed">
            {ProductDetail.description ||
              "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart."}
          </p>

          <div className="w-full flex items-center justify-center py-8">
            <Image
              src={ShoeSketch}
              alt="product sketch"
              width={382}
              height={495}
            />
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SPECIFICATIONS ================= */}
      <section id="specifications" className="mb-8">
        <h3 className="font-MontserratSemiBold text-base mb-6">
          Product specifications
        </h3>
        {ProductDetail.specifications &&
        ProductDetail.specifications.length > 0 ? (
          <ul className="list-disc pl-5 space-y-3">
            {ProductDetail.specifications.map((spec: any) => (
              <li key={spec.id} className="text-sm text-gray-700">
                {spec.title}: {spec.value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No specifications available.</p>
        )}
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="w-full md:pt-8">
        {/* Header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h2 className="font-MontserratSemiBold text-base text-1a1a1a">
            Reviews
          </h2>
          <button className="font-MontserratSemiBold text-sm text-ff715b hover:underline">
            view more
          </button>
        </div>

        {/* Average rating + stars */}
        <div className="flex md:flex-wrap items-center gap-c32 md:gap-x-20 gap-y-6 mb-8">
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
                  className="h-4 w-4 md:h-[30.32px] md:w-8"
                />
              ))}
            </div>
          </div>

          {/* Progress bars */}
          {/* <div>
            {[5, 4, 3, 2, 1].map((stars) => {
              const value = ratingsCount[stars as RatingKey];
              const max = totalVotes || 1;
              const widthPercent = (value / max) * 100;

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

                  <div className="md:w-32 md:h-2 h-1.5 w-34.25 bg-gray-200 overflow-hidden rounded">
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
          </div> */}
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
            onClick={() =>
              setActiveCountry(activeCountry === "Nigeria" ? null : "Nigeria")
            }
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
                onClick={() =>
                  setActiveRating(activeRating === starKey ? null : starKey)
                }
                className={`border rounded-lg w-16 h-8 md:h-12 flex items-center justify-center transition-colors duration-200 ${
                  activeRating === starKey
                    ? "border-[#FF715B]"
                    : "border-gray-400"
                }`}
                aria-label={`${starKey} star rating`}
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

        {/* Filtered reviews */}
        {/* <div className="mt-6 space-y-4">
          {filteredReviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            filteredReviews.map((rev: any) => (
              <div
                key={rev.id}
                className="border border-gray-200 rounded-md p-3"
              >
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image
                      key={i}
                      src={i <= rev.rating ? YellowStar : Star}
                      alt="star"
                      width={16}
                      height={16}
                    />
                  ))}
                  <p className="text-xs text-gray-500 ml-2">{rev.country}</p>
                </div>
                <p className="text-sm mt-1">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="pb-20 md:pb-1">
          <Overview reviews={overviewReviews} />
        </div> */}
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

      

      <section className="similar">

      </section>
    </div>
  );
}
