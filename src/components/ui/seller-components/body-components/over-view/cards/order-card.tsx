"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import UsableCard from "./cardUse";
import redPointerIcon from "@/assets/Seller/redPointer.png";
import greenPointerIcon from "@/assets/Seller/greenPointer.png";
import PlanIcon from "@/assets/Seller/plane.png";
import whitePointer from "@/assets/Seller/WhitePointer.svg";
import whitePointeruP from "@/assets/Seller/WhitePointer.png";
import whitePlane from "@/assets/Seller/whitePlane.png";
import { useSelector } from "react-redux";

const ProgressChat = [
  { label: "Mon", progress: 27 },
  { label: "Tue", progress: 44 },
  { label: "Wed", progress: 14 },
  { label: "Thus", progress: 30 },
  { label: "Fri", progress: 11 },
  { label: "Sat", progress: 39 },
  { label: "Sun", progress: 4 },
];

export default function OrderCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [chartProgress, setChartProgress] = useState(
    ProgressChat.map(() => 0) // start at 0
  );

  useEffect(() => {
    // trigger animation after mount
    const timeout = setTimeout(() => {
      setChartProgress(ProgressChat.map((item) => item.progress));
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isIncomplete ? (
        <UsableCard title="Orders">
          {/* Top Section */}

          <div className="flex flex-col justify-between gap-10 items-stretch">
            <div className="flex gap-2.75 items-center text-000000/10">
            <div className="flex gap-2.5 items-center">
              <Image
                src={whitePlane}
                alt="order"
                width={18.75}
                height={18.75}
              />
              <span className="text-c32 font-MontserratSemiBold">0</span>
            </div>
            <div className="w-full max-w-c46">
              <div className="flex justify-between items-center w-full h-4">
                <span className="font-MontserratMedium text-c12">0</span>
                <Image
                  src={whitePointeruP}
                  alt="good"
                  width={16.5}
                  height={9}
                />
              </div>
              <div className="flex items-center justify-between w-full h-4">
                <span className="font-MontserratMedium text-c12">0</span>
                <Image src={whitePointer} alt="bad" width={16.5} height={9} />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex gap-3 mt-12 items-end">
            {ProgressChat.map((progresses, index) => (
              <div
                key={progresses.label}
                className="w-6 flex flex-col items-center justify-end"
              >
                <div
                  className="w-6 bg-000000/10 transition-all duration-1000 ease-out"
                  style={{ height: `2px` }}
                ></div>
                <p className="text-c10 font-MontserratNormal h-4 text-000000/10">
                  {progresses.label}
                </p>
              </div>
            ))}
          </div>
          </div>
        </UsableCard>
      ) : (
        <UsableCard title="Orders">
          {/* Top Section */}

          <div className="flex gap-2.75 items-center">
            <div className="flex gap-2.5 items-center">
              <Image src={PlanIcon} alt="order" width={18.75} height={18.75} />
              <span className="text-c32 font-MontserratSemiBold">400</span>
            </div>
            <div className="w-full max-w-c46">
              <div className="flex justify-between items-center w-full h-4">
                <span className="font-MontserratMedium text-c12">350</span>
                <Image
                  src={greenPointerIcon}
                  alt="good"
                  width={16.5}
                  height={9}
                />
              </div>
              <div className="flex items-center justify-between w-full h-4">
                <span className="font-MontserratMedium text-c12">50</span>
                <Image src={redPointerIcon} alt="bad" width={16.5} height={9} />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex gap-3 mt-10 items-end">
            {ProgressChat.map((progresses, index) => (
              <div
                key={progresses.label}
                className="w-6 flex flex-col items-center justify-end"
              >
                <div
                  className="w-6 bg-947fff/60 transition-all duration-1000 ease-out"
                  style={{ height: `${chartProgress[index]}px` }}
                ></div>
                <p className="text-c10 font-MontserratNormal h-4">
                  {progresses.label}
                </p>
              </div>
            ))}
          </div>
        </UsableCard>
      )}
    </>
  );
}
