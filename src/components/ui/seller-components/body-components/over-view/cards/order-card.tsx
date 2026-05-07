"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import UsableCard from "./cardUse";
import redPointerIcon from "@/assets/Seller/redPointer.png";
import greenPointerIcon from "@/assets/Seller/greenPointer.png";
import PlanIcon from "@/assets/Seller/plane.png";
import whitePointer from "@/assets/Seller/WhitePointer.svg";
import whitePointeruP from "@/assets/Seller/WhitePointer.png";
import whitePlane from "@/assets/Seller/whitePlane.png";
import { useSelector } from "react-redux";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function OrderCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orders = useSelector((state: any) => state.orders.orders);

  // Real stats derived from orders
  const { total, fulfilled, cancelled, weeklyData } = useMemo(() => {
    const total = orders.length;
    const fulfilled = orders.filter((o: any) => {
      const s = (o.order_timeline_stage || o.status || "").toLowerCase();
      return s === "delivered" || s === "fulfilled" || s === "shipped";
    }).length;
    const cancelled = orders.filter((o: any) => {
      const s = (o.order_timeline_stage || o.status || "").toLowerCase();
      return s === "cancelled" || s === "rejected" || s === "returned";
    }).length;

    // Count orders per weekday (Mon=0…Sun=6) for the last 7 days
    const counts = Array(7).fill(0);
    const now = new Date();
    orders.forEach((o: any) => {
      const d = new Date(o.created_at);
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        // getDay(): 0=Sun,1=Mon…6=Sat → map to Mon-Sun index
        const idx = (d.getDay() + 6) % 7;
        counts[idx]++;
      }
    });
    const maxCount = Math.max(...counts, 1);
    // Scale to max 60px
    const weeklyData = DAY_LABELS.map((label, i) => ({
      label,
      progress: Math.round((counts[i] / maxCount) * 60),
    }));
    return { total, fulfilled, cancelled, weeklyData };
  }, [orders]);

  const [chartProgress, setChartProgress] = useState(weeklyData.map(() => 0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setChartProgress(weeklyData.map((item) => item.progress));
    }, 100);
    return () => clearTimeout(timeout);
  }, [weeklyData]);

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
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="w-6 flex flex-col items-center justify-end"
              >
                <div
                  className="w-6 bg-000000/10 transition-all duration-1000 ease-out"
                  style={{ height: "2px" }}
                ></div>
                <p className="text-c10 font-MontserratNormal h-4 text-000000/10">
                  {label}
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
              <span className="text-c32 font-MontserratSemiBold">{total}</span>
            </div>
            <div className="w-full max-w-c46">
              <div className="flex justify-between items-center w-full h-4">
                <span className="font-MontserratMedium text-c12">{fulfilled}</span>
                <Image
                  src={greenPointerIcon}
                  alt="good"
                  width={16.5}
                  height={9}
                />
              </div>
              <div className="flex items-center justify-between w-full h-4">
                <span className="font-MontserratMedium text-c12">{cancelled}</span>
                <Image src={redPointerIcon} alt="bad" width={16.5} height={9} />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex gap-3 mt-10 items-end">
            {weeklyData.map((item, index) => (
              <div
                key={item.label}
                className="w-6 flex flex-col items-center justify-end"
              >
                <div
                  className="w-6 bg-947fff/60 transition-all duration-1000 ease-out"
                  style={{ height: `${chartProgress[index]}px` }}
                ></div>
                <p className="text-c10 font-MontserratNormal h-4">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </UsableCard>
      )}
    </>
  );
}
