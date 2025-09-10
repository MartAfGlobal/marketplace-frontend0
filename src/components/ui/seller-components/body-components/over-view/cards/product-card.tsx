"use client";

import { useState, useEffect } from "react";
import UsableCard from "./cardUse";
import Image from "next/image";
import ProductBox from "@/assets/Seller/productBox.png";
import EmptyProductBox from "@/assets/Seller/Package.png";
import { useSelector } from "react-redux";

export default function ProductStockCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [progress, setProgress] = useState(0);
  const target = 70;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      if (start < target) {
        start += 1;
        setProgress(start);
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  // preload is always progress + half of the remaining
  const preload = Math.min(progress + 0.7 * (100 - progress), 90);

  return (
    <>
      {isIncomplete ? (
        <UsableCard title="Products available">
          <div className="flex items-center  gap-2.5 text-000000/10">
            <div className="h-fit w-fit flex-shrink-0">
              <Image
                src={EmptyProductBox}
                alt="box"
                width={19.5}
                height={20.99}
              />
            </div>
            <p className="text-c32 font-MontserratSemiBold">0</p>
          </div>

          <div className="flex w-full  h-fit items-end gap-3.25 mt-c42">
            <div className="w-c61-19 h-c61-19">
              <svg className="w-full h-full" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke="#f3f4f6" // light gray
                  strokeWidth="12"
                  fill="transparent"
                />
              </svg>
            </div>

            <div className=" text-c10 space-y-0.5 font-MontserratMedium text-000000/10">
              <p className="">Fully stocked</p>
              <p className="">Average stocked</p>
              <p className="">Low stock</p>
            </div>
          </div>
        </UsableCard>
      ) : (
        <UsableCard title="Products available">
          <div className="flex items-center  gap-2.5">
            <div className="h-fit w-fit flex-shrink-0">
              <Image src={ProductBox} alt="box" width={19.5} height={20.99} />
            </div>
            <p className="text-c32 font-MontserratSemiBold">4,500</p>
          </div>

          <div className="flex w-full  h-fit items-end gap-3.25 mt-c42">
            <div className=" w-c61-19 h-c61-19 ">
              <svg className="w-full h-full transform ">
                {/* 1. Base track (gray) */}
                <circle
                  cx="30.1"
                  cy="30.1"
                  r={radius}
                  stroke="#947FFF"
                  strokeOpacity="0.40"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* 2. Preload arc (faded purple, extends beyond progress) */}
                <circle
                  cx="30.1"
                  cy="30.1"
                  r={radius}
                  stroke="#947FFF"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (preload / 100) * circumference
                  }
                  className="transition-all duration-300"
                />

                {/* 3. Progress arc (solid purple) */}
                <circle
                  cx="30.1"
                  cy="30.1"
                  r={radius}
                  stroke="#6A0DAD"
                  strokeOpacity="0.30"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (progress / 100) * circumference
                  }
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            <div className=" text-c10 space-y-0.5 font-MontserratMedium">
              <p className="text-6a0dad/60">Fully stocked</p>
              <p className="text-947fff">Average stocked</p>
              <p className="text-947fff/40">Low stock</p>
            </div>
          </div>
        </UsableCard>
      )}
    </>
  );
}
