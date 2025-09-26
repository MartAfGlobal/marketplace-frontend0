"use client";
import React from "react";
import Image from "next/image";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";

interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
  country?: string;
}

export default function Overview({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return (
      <p className="text-center text-gray-500 font-MontserratNormal">
        No reviews found
      </p>
    );
  }

  return (
    <div className="pt-c48 md:pt-c56">
      <div className="flex flex-col gap-6 md:gap-c56">
        {reviews.map((review, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="font-MontserratSemiBold text-sm text-161616">
                {review.name}
              </p>
              <p className="font-MontserratNormal text-c12 text-646464">
                {review.date}
              </p>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-c2">
                {[...Array(5)].map((_, i) => (
                  <Image
                    key={i}
                    src={i < review.rating ? YellowStar : Star}
                    alt="star"
                    width={16}
                    height={15.16}
                  />
                ))}
              </div>
              <p className="font-MontserratSemiBold text-c12 text-128807">
                Verified Purchase
              </p>
            </div>
            <p className="font-MontserratNormal text-sm text-000000">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
