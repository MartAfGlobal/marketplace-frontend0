"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import UsableCard from "./cardUse";
import RedPointerIcon from "@/assets/Seller/redPointer.svg";
import WhitePointerIcon from "@/assets/Seller/WhitePointer.svg";
import { useSelector } from "react-redux";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";

const STATIC_CHART_DATA = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 35 },
  { name: "Apr", value: 55 },
  { name: "May", value: 48 },
  { name: "Jun", value: 65 },
  { name: "Jul", value: 75 },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function SalesCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orders = useSelector((state: any) => state.orders.orders);

    const { totalRevenue, targets, labels, chartData } = useMemo(() => {
      const productMap: Record<string, { qty: number; revenue: number }> = {};
      const monthBuckets: Record<string, number> = {};
      let totalRevenue = 0;
  
      orders.forEach((order: any) => {
        const date = new Date(order.created_at || order.date || "");
        if (!isNaN(date.getTime())) {
          const key = MONTH_NAMES[date.getMonth()];
          (order.order_items || []).forEach((item: any) => {
            const qty = item.quantity || 1;
            const price = parseFloat(item.unit_price || item.price || 0);
            monthBuckets[key] = (monthBuckets[key] || 0) + qty * price;
          });
        }
  
        (order.order_items || []).forEach((item: any) => {
          const name = item.product_name || "Unknown";
          const qty = item.quantity || 1;
          const price = parseFloat(item.unit_price || item.price || 0);
          totalRevenue += qty * price;
          if (!productMap[name]) productMap[name] = { qty: 0, revenue: 0 };
          productMap[name].qty += qty;
          productMap[name].revenue += qty * price;
        });
      });
  
      if (totalRevenue === 0) totalRevenue = 350000;
  
      const dynamicChart = MONTH_NAMES.map((name) => ({
        name,
      value: monthBuckets[name] || 0,
    })).filter((d) => d.value > 0);

    const chartData =
      dynamicChart.length >= 2 ? dynamicChart.slice(-7) : STATIC_CHART_DATA;

    const sorted = Object.entries(productMap)
      .sort(([, a], [, b]) => b.qty - a.qty)
      .slice(0, 2);

    const maxQty = Math.max(...sorted.map(([, v]) => v.qty), 1);
    const topProducts = sorted.map(([name, v]) => ({
      label: name,
      target: Math.round((v.qty / maxQty) * 100),
    }));

    const targets =
      topProducts.length > 0 ? topProducts.map((p) => p.target) : [0, 0];
    const labels =
      topProducts.length > 0
        ? topProducts.map((p) => p.label)
        : ["No data", "No data"];

    return { totalRevenue, targets, labels, chartData };
  }, [orders]);

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
  }, [orders, targets]);

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
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L0 0H14L7 10Z" fill="white"/>
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
                  width={16.5}
                  height={9}
                  className="mt-4"
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
