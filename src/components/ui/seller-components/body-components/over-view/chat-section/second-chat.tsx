"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MultiLineZigZagChart from "./mutiple-zig-chat";

import CaretDown from "@/assets/Seller/caretDown.png";
import { useSelector } from "react-redux";

interface SecondChatProps {
  title?: string;
}

const filterOptions = ["This Week", "This Month", "This Year"];
const COLORS = ["#947FFF", "#6A0DAD", "#947FFF80", "#6A0DAD80", "#E1D5FF"];
const lightGray = "#f3f4f6";

export default function SecondChat({ title = "Orders" }: SecondChatProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orders = useSelector((state: any) => state.orders.orders);

  const [selected, setSelected] = useState(filterOptions[2]);
  const [isOpen, setIsOpen] = useState(false);

  // Derive real order segments from Redux orders
  const segments = useMemo(() => {
    const now = new Date();

    // Sort orders by date descending to get the "last" orders first
    const sortedOrders = [...(orders || [])].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const filtered = sortedOrders.filter((order: any) => {
      const d = new Date(order.created_at);
      if (selected === "This Week") {
        return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      }
      if (selected === "This Month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }
      return d.getFullYear() === now.getFullYear();
    });

    // 1. Find the last 3 unique categories ordered from (latest first)
    const last3Categories: string[] = [];
    filtered.forEach((order: any) => {
      (order.order_items || []).forEach((item: any) => {
        let cat = item.product_category || item.category || item.product_type;
        if (cat) {
          cat = typeof cat === "object" ? cat.name || "Unknown" : cat;
        } else {
          cat = "Uncategorized";
        }
        
        if (cat !== "Uncategorized" && !last3Categories.includes(cat) && last3Categories.length < 3) {
          last3Categories.push(cat);
        }
      });
    });

    // If still empty (no actual categories found), return placeholders matching user's reference image
    if (last3Categories.length === 0) {
      return [
        { label: "Fashion & shoes", value: 2500, color: COLORS[0] },
        { label: "Electronics", value: 250, color: COLORS[1] },
        { label: "Beverages", value: 400, color: COLORS[2] },
      ];
    }

    // 2. Count the quantity for these exact 3 latest categories across the filtered period
    const categoryMap: Record<string, number> = {};
    filtered.forEach((order: any) => {
      (order.order_items || []).forEach((item: any) => {
        let cat = item.product_category || item.category || item.product_type;
        if (cat) {
          cat = typeof cat === "object" ? cat.name || "Unknown" : cat;
        } else {
          cat = "Uncategorized";
        }

        if (last3Categories.includes(cat)) {
          categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity || 1);
        }
      });
    });

    // Format for chart
    return last3Categories.map((cat, i) => ({
      label: cat,
      value: categoryMap[cat] || 0,
      color: COLORS[i % COLORS.length],
    }));
  }, [orders, selected]);

  const equalSlices = segments.map((seg) => ({ ...seg, renderValue: 1 }));
  const hasData = segments.length > 0;

  return (
    <>
      {isIncomplete ? (
        <div className="w-full max-w-134.75 d">
          <div className="flex justify-between  items-center mb-4 lg:mb-6 px-1 lg:px-8 lg:pt-6 lg:bg-ffffff lg:rounded-t-c16 lg:shadow-none">
            <h2 className="text-base lg:text-lg  md:font-MontserratSemiBold text-000000">{title}</h2>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isIncomplete}
                className="flex circle-shadow text-[10px] lg:text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-fit p-2 lg:p-3 rounded-xl justify-center flex-shrink-0 gap-2 lg:gap-4.5 h-8 lg:h-10 border border-gray-100"
              >
                <span>{selected}</span>
                <Image src={CaretDown} alt="filter" width={11} height={6} />
              </button>
            </div>
          </div>

          <div className="w-full h-auto lg:h-[calc(100%-80px)] py-6 px-5 lg:px-8 bg-ffffff circle-shadow rounded-c16 lg:rounded-t-none lg:shadow-none lg:bg-transparent">

          <div className="flex w-full max-w-87.5 p-0 m-0 h-fit items-center lg:items-start gap-4 lg:gap-9 mb-4 lg:mb-0">
            <div className="flex-shrink-0 h-24 w-24 lg:h-c176-69 lg:w-c176-69 flex items-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg lg:text-2xl font-MontserratBold text-[#161616]">400</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { renderValue: 35, color: COLORS[0] }, // Fashion
                      { renderValue: 45, color: COLORS[1] }, // Electronics
                      { renderValue: 20, color: COLORS[2] }  // Beverages
                    ]}
                    dataKey="renderValue"
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    innerRadius="75%"
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={12}
                    paddingAngle={6}
                  >
                    {[
                      { renderValue: 35, color: COLORS[0] },
                      { renderValue: 45, color: COLORS[1] },
                      { renderValue: 20, color: COLORS[2] }
                    ].map((seg, i) => (
                      <Cell key={i} fill={seg.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-0 lg:mt-4">
              {[
                { label: "Fashion & shoes", color: COLORS[0] },
                { label: "Electronics", color: COLORS[1] },
                { label: "Beverages", color: COLORS[2] },
              ].map((seg, i) => (
                <div key={i} className="w-full lg:max-w-35 flex gap-2 lg:gap-4 items-center">
                  <div className="flex items-center gap-1.5 w-full pb-2 lg:pb-3 text-nowrap">
                    <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <p className="text-[10px] lg:text-c10 font-MontserratMedium text-[#666666] lg:text-000000/10 w-full truncate max-w-[90px] lg:max-w-none">{seg.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <MultiLineZigZagChart />
          </div>
        </div>
      ) : (
        <div className="w-full lg:max-w-134.75 lg:bg-ffffff md:rounded-c16">
          <div className="flex justify-between items-center mb-4 lg:mb-6 px-1 lg:px-8 lg:pt-6 ">
            <h2 className="text-c18 lg:text-lg font-MontserratMedium md:font-MontserratSemiBold text-000000">{title}</h2>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex circle-shadow text-c14 lg:text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-fit p-2 lg:p-3 rounded-xl justify-center flex-shrink-0 gap-2 lg:gap-4.5 h-8 lg:h-10 border border-gray-100"
              >
                <span className="">{selected}</span>
                <Image src={CaretDown} alt="filter" width={11} height={6} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-40 right-0 mt-2 w-39 py-3 px-6 space-y-2.5 text-c12 font-MontserratNormal text-000000/50 bg-white rounded circle-shadow h-29"
                  >
                    {filterOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSelected(option);
                          setIsOpen(false);
                        }}
                        className="h-6 cursor-pointer hover:text-ff715b"
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full h-auto lg:h-[calc(100%-80px)] py-6 px-5 lg:px-8 bg-ffffff  rounded-c16 lg:rounded-t-none lg:shadow-none lg:bg-transparent">
            <div className="flex w-full max-w-87.5 p-0 m-0 h-fit items-center lg:items-start gap-4 lg:gap-9 mb-4 lg:mb-0">
              <div className="flex-shrink-0 h-37.75 w-37.75 lg:h-c176-69 lg:w-c176-69 relative">
              {hasData && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-lg lg:text-2xl font-MontserratBold text-[#161616]">
                    {segments.reduce((acc, curr) => acc + curr.value, 0)}
                  </span>
                </div>
              )}
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equalSlices}
                      dataKey="renderValue"
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      innerRadius="75%"
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={12}
                      paddingAngle={6}
                    >
                      {segments.map((seg, i) => (
                        <Cell key={i} fill={seg.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ renderValue: 100 }]}
                      dataKey="renderValue"
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      innerRadius="75%"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill={lightGray} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-0 lg:mt-4">
              {hasData ? (
                segments.map((seg, i) => (
                  <div key={seg.label} className="w-full flex gap-3  lg:gap-4 items-center">
                    <div className="flex items-center gap-1.5 w-full pb-2 text-nowrap">
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <p className="text-sm font-MontserratNormal md:font-MontserratMedium text-[#666666] lg:text-000000/50 w-full truncate max-w-[90px] lg:max-w-none">
                        {seg.label}
                      </p>
                    </div>
                    <div className="w-full max-w-7.75 hidden md:block">
                      <p className="font-MontserratSemiBold text-c12 ">{seg.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-c10 font-MontserratNormal text-000000/30 mt-4">
                  No orders yet
                </p>
              )}
            </div>
          </div>
          <MultiLineZigZagChart />
          </div>
        </div>
      )}
    </>
  );
}
