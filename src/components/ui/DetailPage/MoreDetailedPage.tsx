"use client";

import Image from "next/image";
import ShoeSketch from "@/assets/icons/shoeSketch.svg";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
import CommentBox from "@/assets/icons/commentBox.svg";
import ImPrev from "@/assets/icons/imageprev.svg";
import Flag from "@/assets/icons/flag.svg";
import { useState } from "react";
import Overview from "./overview";

type RatingKey = 1 | 2 | 3 | 4 | 5;

export default function MoreDetailedPage() {
  const [activeRating, setActiveRating] = useState<RatingKey | null>(null);

  // Ratings count state
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  // Calculate total votes
  const totalVotes = Object.values(ratings).reduce((a, b) => a + b, 0);

  // Average rating to 1 decimal place
  const average =
    totalVotes > 0
      ? (
          Object.entries(ratings).reduce(
            (sum, [stars, count]) => sum + Number(stars) * count,
            0
          ) / totalVotes
        ).toFixed(1)
      : "0.0";

  // On clicking a star button, increment that star's count
  const handleClick = (stars: RatingKey) => {
    setRatings((prev) => ({
      ...prev,
      [stars]: prev[stars] < 10 ? prev[stars] + 1 : 10, // max 10
    }));
    setActiveRating(stars);
  };

  return (
    <div className="w-full px-6 py-8 max-w-4xl mx-auto">
      <section id="details" className="mt-8 mb-6  w-full">
        <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-2">
          Product details
        </h2>
        <p className="text-base font-MontserratNormal text-[#1a1a1a] leading-relaxed">
          New range of formal shirts are designed keeping you in mind. With fits
          and styling that will make you stand apart. The Apollotech B340 is an
          affordable wireless mouse with reliable connectivity, 12 months
          battery life and modern design New range of formal shirts are designed
          keeping you in mind. With fits and styling that will make you stand
          apart Ergonomic executive chair upholstered in bonded black leather
          and PVC padded seat and back for all-day comfort and support New ABC
          13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD
          Graphics, OS 10 Home, OS Office A &amp; J 2016 Boston&apos;s most
          advanced compression wear technology increases muscle oxygenation,
          stabilizes active muscles Ergonomic executive chair upholstered in
          bonded black leather and PVC padded seat and back for all-day comfort
          and support Carbonite web goalkeeper gloves are ergonomically designed
          to give easy fit
        </p>

        <div className="w-full flex items-center justify-center py-8">
          <Image src={ShoeSketch} alt="shoe sketch" width={382} height={495} />
        </div>
      </section>

      <section id="specs" className="">
        <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-6">
          Product Specification
        </h2>
        <div className="font-MontserratNormal text-base text-[#1a1a1a] flex flex-col gap-3">
          <p>Pair of gloves</p>
          <p>Shoe horn</p>
          <p>Shoe box</p>
          <p>1 pair of shoes</p>
        </div>
      </section>

      <section id="reviews" className="pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-MontserratSemiBold text-base text-1a1a1a">
            Reviews
          </h2>
          <button className="font-MontserratSemiBold text-sm text-ff715b hover:underline">
            view more
          </button>
        </div>

        {/* Average rating and stars */}
        <div className="flex flex-wrap items-center gap-x-20 gap-y-6 mb-8">
          <div>
            <p className="font-MontserratSemiBold text-5xl mb-2">{average}/5</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={i <= Math.floor(Number(average)) ? YellowStar : Star}
                  alt="star rate"
                  width={32}
                  height={30.32}
                />
              ))}
            </div>
          </div>

          {/* Custom progress bars */}
          <div>
            {[5, 4, 3, 2, 1].map((stars) => {
              const value = ratings[stars as RatingKey];
              const max = 10;
              const widthPercent = (value / max) * 100;

              return (
                <div key={stars} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 w-6 justify-center">
                    <p className="text-base font-MontserratSemiBold">{stars}</p>
                    <Image
                      src={YellowStar}
                      alt="star rate"
                      width={12}
                      height={11.37}
                    />
                  </div>

                  <div className="w-32 h-2  bg-gray-200 overflow-hidden">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="h-2 bg-ffaco6  transition-width duration-300"
                    />
                  </div>

                  <p className="text-base font-MontserratSemiBold w-2.5 text-center">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex gap-2 items-center mb-4">
            <button className="border border-gray-400 w-18 h-13 rounded-c6 flex items-center justify-center">
              <Image
                src={CommentBox}
                alt="comment box"
                width={24}
                height={24}
              />
            </button>
            <button className="border border-gray-400 w-18 h-13 rounded-c6 flex items-center justify-center">
              <Image src={ImPrev} alt="comment box" width={24} height={24} />
            </button>
            <button className="border border-gray-400 w-18 h-13 rounded-c6 flex items-center justify-center">
              <Image src={Flag} alt="comment box" width={24} height={24} />
            </button>
          </div>
        </div>
        {/* Star rating buttons */}
        <div className="flex gap-3 items-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const starKey = stars as RatingKey;
            return (
              <button
                key={starKey}
                onClick={() => handleClick(starKey)}
                className={`border rounded-lg w-16 h-12 flex items-center justify-center transition-colors duration-200 ${
                  activeRating === starKey
                    ? "border-[#FF715B]"
                    : "border-gray-400"
                }`}
                aria-label={`${starKey} star rating`}
              >
                <div className="flex items-center gap-1">
                  <p className="text-base font-MontserratSemiBold">{starKey}</p>
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
        <div>
          <Overview />
        </div>
      </section>
    </div>
  );
}
