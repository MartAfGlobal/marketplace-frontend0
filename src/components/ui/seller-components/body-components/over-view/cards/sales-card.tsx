"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import UsableCard from "./cardUse";
import RedPointerIcon from "@/assets/Seller/redPointer.svg";
import WhitePointerIcon from "@/assets/Seller/WhitePointer.svg";
import { useSelector } from "react-redux";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { getChangeDirection, getChangeValue, getMetricArray, getMetricChange, getMetricSection, getMetricTotal, toMetricNumber } from "../overview-data";

export default function SalesCard({ analytics }: { analytics: any }) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const { totalRevenue, targets, labels, chartData, change } = useMemo(() => {
    const section = getMetricSection(analytics, "sales");
    const totalRevenue = getMetricTotal(analytics, "sales", ["revenue", "total_sales"]);
    const topProducts = getMetricArray(
      section,
      "top_products",
      "topProducts",
      "products_by_revenue",
      "top_selling_products",
    ).slice(0, 2);
    const targets = topProducts.map((product: any) => {
      const share = toMetricNumber(product.revenue_share ?? product.share ?? product.percentage);
      if (share > 0) return Math.round(share <= 1 ? share * 100 : share);
      const revenue = toMetricNumber(product.revenue ?? product.total_revenue);
      return totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
    });
    const labels = topProducts.map(
      (product: any) => product.product_name ?? product.name ?? product.title ?? "Product",
    );
    const chartData = getMetricArray(section, "chart_data", "trend", "sales_trend").map((item: any) => ({
      name: item.period ?? item.date ?? item.label ?? item.month ?? "",
      value: toMetricNumber(item.gross_revenue ?? item.revenue ?? item.sales ?? item.total),
    }));
    return {
      totalRevenue,
      targets: [targets[0] ?? 0, targets[1] ?? 0],
      labels: [labels[0] ?? "No data", labels[1] ?? "No data"],
      chartData,
      change: getMetricChange(analytics, "sales"),
    };
  }, [analytics]);

  const [progresses, setProgresses] = useState<number[]>(targets.map(() => 0));

  useEffect(() => {
    setProgresses(targets.map(() => 0));
    let start = targets.map(() => 0);

    const interval = setInterval(() => {
      let done = true;
      start = start.map((value, index) => {
        if (value < targets[index]) {
          done = false;
          return value + 1;
        }
        return value;
      });
      setProgresses([...start]);
      if (done) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [analytics, targets]);

  const formatProgress = (index: number) => {
    const p = progresses[index] || 0;
    return p.toString() + "%";
  };

  const getProgressWidth = (index: number) => {
    const p = progresses[index] || 0;
    return p.toString() + "%";
  };

  const getProgressColor = (index: number) => {
    const p = progresses[index] || 0;
    return p < 50 ? "#947FFF" : "#6A0DAD";
  };

  return (
    <>
      {/* Mobile Card */}
      <div className="lg:hidden w-full relative h-56.75 rounded-c16 overflow-hidden bg-6a0dad p-6 shadow-xl shadow-6a0dad/20">
        <div className="relative z-10">
          <p className="text-white text-sm font-MontserratNormal md:font-MontserratMedium mb-3">
            Sales
          </p>
          <div className="flex items-center gap-3">
            <h2 className="text-white text-c32 font-MontserratMedium ">
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>
            <div className="flex items-center justify-center mt-2">
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={`Sales ${getChangeDirection(change)} ${getChangeValue(change)} vs yesterday`}
                style={{ transform: getChangeDirection(change) === "up" ? "rotate(180deg)" : undefined }}
              >
                <path d="M7 10L0 0H14L7 10Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 z-0"
          style={{ height: "65%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="salesGradMobile"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#salesGradMobile)"
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desktop Card */}
      <div className="hidden lg:block">
        {isIncomplete ? (
          <UsableCard title="Sales">
            <div className="mt-4">
              <div className="flex gap-2.75 text-000000/10 mb-9">
                <p className="flex gap-2.5 items-center">
                  <span className="text-c18 font-MontserratMedium">$</span>
                  <span className="text-5xl font-MontserratSemiBold">0</span>
                </p>
                <div className="h-fit mt-3">
                  <Image
                    src={WhitePointerIcon}
                    alt="pointer"
                    width={16}
                    height={9}
                    className="w-4 h-2.25"
                  />
                </div>
              </div>

              {["Anker shoes", "Ankara dress"].map((label) => (
                <div key={label} className="mt-1 w-full">
                  <div className="flex justify-between w-full max-w-66 text-000000/10">
                    <span className="text-c10 font-MontserratMedium">
                      No data
                    </span>
                    <span className="text-c10 font-MontserratMedium">0%</span>
                  </div>
                  <div className="relative w-full h-2 rounded-c4 bg-black/5 overflow-hidden">
                    <div className="h-2 rounded-c4 bg-gray-200 w-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </UsableCard>
        ) : (
          <UsableCard title="Sales">
            <div className="flex gap-2.75">
              <p className="flex gap-2.5 items-center">
                <span className="text-c18 font-MontserratMedium">$</span>
                <span className="text-5xl font-MontserratSemiBold">
                  {totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
              <div className="flex flex-col">
                <Image
                  src={RedPointerIcon}
                  alt="pointer"
                  title={`Sales ${getChangeDirection(change)} ${getChangeValue(change)} vs yesterday`}
                  width={16.5}
                  height={9}
                  className={`mt-4 ${getChangeDirection(change) === "up" ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {labels.map((label, index) => (
              <div
                key={label + "-" + index}
                className="w-full"
                style={{ marginTop: index === 0 ? 36 : 16 }}
              >
                <div className="flex justify-between w-full max-w-66">
                  <span className="text-base font-MontserratMedium truncate max-w-48">
                    {label}
                  </span>
                  <span className="text-c10 font-MontserratMedium">
                    {formatProgress(index)}
                  </span>
                </div>
                <div className="relative w-full h-2 rounded-c4 bg-black/5 overflow-hidden">
                  <div
                    className="h-2 rounded-c4 transition-all duration-100 ease-out"
                    style={{
                      width: getProgressWidth(index),
                      background: getProgressColor(index),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </UsableCard>
        )}
      </div>
    </>
  );
}
