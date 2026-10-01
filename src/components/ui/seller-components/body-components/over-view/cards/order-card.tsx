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
import { getChangeDirection, getChangeValue, getMetricChange, getMetricSection, getMetricTotal, getWeekdayCounts } from "../overview-data";

export default function OrderCard({ analytics }: { analytics: any }) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orderSection = getMetricSection(analytics, "orders");
  const total = getMetricTotal(analytics, "orders", ["order_count", "total_orders"]);
  const change = getMetricChange(analytics, "orders");
  const weeklyData = useMemo(() => {
    const counts = getWeekdayCounts(orderSection);
    const maxCount = Math.max(...counts.map((day) => day.count), 1);
    return counts.map((day) => ({
      label: day.label,
      progress: Math.round((day.count / maxCount) * 60),
    }));
  }, [orderSection]);

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
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
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
                <span className="font-MontserratMedium text-c12">
                  {getChangeValue(change).toLocaleString()} vs yesterday
                </span>
                <Image
                  src={getChangeDirection(change) === "up" ? greenPointerIcon : redPointerIcon}
                  alt={getChangeDirection(change) === "up" ? "up" : "down"}
                  width={16.5}
                  height={9}
                />
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
