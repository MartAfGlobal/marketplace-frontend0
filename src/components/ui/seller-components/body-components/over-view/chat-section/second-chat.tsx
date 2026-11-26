"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MultiLineZigZagChart from "./mutiple-zig-chat";

import CaretDown from "@/assets/Seller/caretDown.png";
import { useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";

interface SecondChatProps {
  title?: string;
  externalPeriod?: string;
}

const filterOptions = ["This Week", "This Month", "This Year"];
const COLORS = ["#A65CCC", "#947FFF", "#B3A3FF", "#6A0DAD80", "#E1D5FF"];
const lightGray = "#f3f4f6";

type OrdersChartPoint = {
  month: string;
  line1?: number | null;
  line2?: number | null;
  line3?: number | null;
  sortTimestamp?: number;
  calendarYear?: number;
  calendarMonth?: number;
};

function unwrapChartResponse(response: any): any {
  let payload = response?.data ?? response;
  while (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    payload = payload.data;
  }
  return payload;
}

function formatOrdersChartLabel(label: any, range: string): string {
  const text = String(label);
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return text;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  if (range === "weekly") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  if (range === "monthly") {
    return String(date.getDate());
  }
  return date.toLocaleDateString("en-US", { month: "short" });
}

function addChartDate(point: OrdersChartPoint, label: any): OrdersChartPoint {
  const text = String(label);
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return point;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return point;
  return {
    ...point,
    sortTimestamp: date.getTime(),
    calendarYear: date.getFullYear(),
    calendarMonth: date.getMonth(),
  };
}

function organizeOrdersChartPoints(
  points: OrdersChartPoint[],
  range: string,
): OrdersChartPoint[] {
  let orderedPoints = [...points];
  const datedPoints = orderedPoints.filter(
    (point) => point.sortTimestamp !== undefined,
  );

  if (range === "yearly" && datedPoints.length > 0) {
    const currentYearPoints = datedPoints.filter(
      (point) => point.calendarYear === new Date().getFullYear(),
    );
    orderedPoints = currentYearPoints.length > 0 ? currentYearPoints : datedPoints;
  }

  if (orderedPoints.some((point) => point.sortTimestamp !== undefined)) {
    orderedPoints.sort(
      (a, b) => (a.sortTimestamp ?? 0) - (b.sortTimestamp ?? 0),
    );
  } else if (range === "yearly") {
    const monthOrder = new Map(
      [
        "jan", "january", "feb", "february", "mar", "march", "apr", "april",
        "may", "jun", "june", "jul", "july", "aug", "august", "sep",
        "september", "oct", "october", "nov", "november", "dec", "december",
      ].map((month) => [
        month,
        new Date(`${month} 1, 2000`).getMonth(),
      ]),
    );
    orderedPoints.sort(
      (a, b) =>
        (monthOrder.get(a.month.toLowerCase()) ?? 12) -
        (monthOrder.get(b.month.toLowerCase()) ?? 12),
    );
  }

  return orderedPoints.map(({ sortTimestamp, calendarYear, calendarMonth, ...point }) => point);
}

function normalizeOrdersChartData(payload: any, range: string): OrdersChartPoint[] {
  const labels = payload?.labels;
  const datasets = payload?.datasets ?? payload?.series;
  const values = payload?.orders ?? payload?.counts ?? payload?.values;

  if (Array.isArray(labels) && Array.isArray(datasets)) {
    const points = labels.map((label: any, index: number) => {
      const point = addChartDate(
        { month: formatOrdersChartLabel(label, range) },
        label,
      );
      datasets.slice(0, 3).forEach((dataset: any, seriesIndex: number) => {
        const datasetValues = Array.isArray(dataset)
          ? dataset
          : dataset?.data ?? dataset?.values;
        const value = Number(datasetValues?.[index]);
        if (Number.isFinite(value)) {
          point[`line${seriesIndex + 1}` as "line1" | "line2" | "line3"] = value;
        }
      });
      return point;
    });
    return organizeOrdersChartPoints(points, range);
  }

  if (Array.isArray(labels) && Array.isArray(values)) {
    return organizeOrdersChartPoints(
      labels.map((label: any, index: number) =>
        addChartDate(
          {
            month: formatOrdersChartLabel(label, range),
            line1: Number.isFinite(Number(values[index])) ? Number(values[index]) : null,
          },
          label,
        ),
      ),
      range,
    );
  }

  const points = Array.isArray(payload)
    ? payload
    : payload?.trend ??
      payload?.points ??
      payload?.chart_data ??
      payload?.chart ??
      payload?.results ??
      payload?.orders ??
      payload?.series ??
      payload?.data;
  if (!Array.isArray(points)) return [];

  const normalizedPoints = points.map((item: any, index: number) => {
    const label =
          item?.label ??
          item?.month ??
          item?.day ??
          item?.date ??
          item?.period ??
          item?.name ??
          item?.bucket ??
          index + 1;
    const point = addChartDate(
      { month: formatOrdersChartLabel(label, range) },
      label,
    );
    const primaryValue =
      item?.line1 ??
      (typeof item === "number" || typeof item === "string" ? item : undefined) ??
      item?.orders ??
      item?.order_count ??
      item?.total_orders ??
      item?.count ??
      item?.total ??
      item?.value;
    const values = [
      primaryValue,
      item?.line2 ?? item?.series2,
      item?.line3 ?? item?.series3,
    ];
    values.forEach((value, seriesIndex) => {
      if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
        point[`line${seriesIndex + 1}` as "line1" | "line2" | "line3"] = Number(value);
      }
    });
    return point;
  });
  return organizeOrdersChartPoints(normalizedPoints, range);
}

export default function SecondChat({ title = "Orders", externalPeriod }: SecondChatProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orders = useSelector((state: any) => state.orders.orders);
  const token = useSelector((state: any) => state.token?.token);
  const { sendHttpRequest } = useHttp();

  const [selected, setSelected] = useState(filterOptions[2]);
  const activePeriod = externalPeriod ?? selected;
  const [ordersChartResponse, setOrdersChartResponse] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const range =
    activePeriod === "This Week"
      ? "weekly"
      : activePeriod === "This Month"
        ? "monthly"
        : "yearly";

  useEffect(() => {
    if (!token) return;

    let isCurrentRequest = true;
    setOrdersChartResponse(null);
    sendHttpRequest({
      requestConfig: {
        url: `/orders/manufacturer/orders-chart?range=${range}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (response: any) => {
        if (isCurrentRequest) {
          console.log("Seller orders chart response:", response);
          setOrdersChartResponse(unwrapChartResponse(response));
        }
      },
      errorRes: (error: unknown) => {
        if (isCurrentRequest) {
          setOrdersChartResponse(null);
          console.warn(
            "Seller orders chart unavailable:",
            error instanceof Error ? error.message : error,
          );
        }
      },
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [range, sendHttpRequest, token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

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
      if (activePeriod === "This Week") {
        return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      }
      if (activePeriod === "This Month") {
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
  }, [orders, activePeriod]);

  const chartPayload = ordersChartResponse;
  const chartPoints = useMemo(
    () => normalizeOrdersChartData(chartPayload, range),
    [chartPayload, range],
  );
  const apiCategories =
    chartPayload?.categories ??
    chartPayload?.category_breakdown ??
    chartPayload?.categoryBreakdown ??
    chartPayload?.category_data ??
    chartPayload?.segments;
  const displayedSegments = Array.isArray(apiCategories)
    ? apiCategories.slice(0, 3).map((category: any, index: number) => ({
        label: String(category?.label ?? category?.name ?? category?.category ?? "Category"),
        value: Number(
          category?.value ??
            category?.count ??
            category?.orders ??
            category?.quantity ??
            category?.total ??
            0,
        ) || 0,
        color: COLORS[index % COLORS.length],
      }))
    : segments;
  const equalSlices = displayedSegments.map((seg) => ({ ...seg, renderValue: 1 }));
  const hasData = displayedSegments.length > 0;
  const totalOrders = Number(
    chartPayload?.total_orders ?? chartPayload?.total ?? chartPayload?.count,
  ) || displayedSegments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <>
      {isIncomplete ? (
        <div className="seller-overview-panel w-full max-w-134.75 d">
          <div className="flex justify-between  items-center mb-4 lg:mb-6 px-1 lg:px-8 lg:pt-6 lg:bg-ffffff lg:rounded-t-c16 lg:shadow-none">
            <h2 className="text-base lg:text-lg  md:font-MontserratSemiBold text-000000">{title}</h2>

            {externalPeriod === undefined && <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isIncomplete}
                className="flex circle-shadow text-[10px] lg:text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-fit p-2 lg:p-3 rounded-xl justify-center flex-shrink-0 gap-2 lg:gap-4.5 h-8 lg:h-10 border border-gray-100"
              >
                <span>{activePeriod}</span>
                <Image
                  src={CaretDown}
                  alt="filter"
                  width={11}
                  height={6}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>}
          </div>

          <div className="seller-overview-panel w-full h-auto lg:h-[calc(100%-80px)] py-6 px-5 lg:px-8 bg-ffffff circle-shadow rounded-c16 lg:rounded-t-none lg:shadow-none lg:bg-transparent">

          <div className="flex w-full max-w-87.5 p-0 m-0 h-fit items-center lg:items-start gap-4 lg:gap-9 mb-4 lg:mb-0">
            <div className="flex-shrink-0 h-24 w-24 lg:h-c176-69 lg:w-c176-69 flex items-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg lg:text-2xl font-MontserratBold text-[#161616]">{totalOrders}</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {hasData ? (
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
                      {displayedSegments.map((seg, i) => (
                        <Cell key={i} fill={seg.color} />
                      ))}
                    </Pie>
                  ) : (
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
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-0 lg:mt-4">
              {displayedSegments.map((seg, i) => (
                <div key={seg.label} className="w-full lg:max-w-35 flex gap-2 lg:gap-4 items-center">
                  <div className="flex items-center gap-1.5 w-full pb-2 lg:pb-3 text-nowrap">
                    <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <p className="text-[10px] lg:text-c10 font-MontserratMedium text-[#666666] lg:text-000000/10 w-full truncate max-w-[90px] lg:max-w-none">{seg.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <MultiLineZigZagChart data={chartPoints} />
          </div>
        </div>
      ) : (
        <div className="seller-overview-panel w-full lg:max-w-134.75 lg:bg-ffffff md:rounded-c16">
          <div className="flex justify-between items-center mb-4 lg:mb-6 px-1 lg:px-8 lg:pt-6 ">
            <h2 className="text-c18 lg:text-lg font-MontserratMedium md:font-MontserratSemiBold text-000000">{title}</h2>

            {externalPeriod === undefined && <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex circle-shadow text-c14 lg:text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-fit p-2 lg:p-3 rounded-xl justify-center flex-shrink-0 gap-2 lg:gap-4.5 h-8 lg:h-10 border border-gray-100"
              >
                <span className="">{activePeriod}</span>
                <Image
                  src={CaretDown}
                  alt="filter"
                  width={11}
                  height={6}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
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
            </div>}
          </div>

          <div className="seller-overview-panel w-full h-auto lg:h-[calc(100%-80px)] py-6 px-5 lg:px-8 bg-ffffff rounded-c16 lg:rounded-t-none lg:shadow-none lg:bg-transparent">
            <div className="flex w-full max-w-87.5 p-0 m-0 h-fit items-center lg:items-start gap-4 lg:gap-9 mb-4 lg:mb-0">
              <div className="flex-shrink-0 h-37.75 w-37.75 lg:h-c176-69 lg:w-c176-69 relative">
              {hasData && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-lg lg:text-2xl font-MontserratBold text-[#161616]">
                    {totalOrders}
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
                      {displayedSegments.map((seg, i) => (
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

            <div className="mt-0 min-w-0 flex-1 lg:mt-4 lg:max-w-35">
              {hasData ? (
                displayedSegments.map((seg, i) => (
                  <div
                    key={seg.label}
                    className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_31px] items-center gap-2"
                  >
                    <div className="flex min-w-0 items-center gap-1.5 pb-2 text-nowrap">
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <p className="min-w-0 max-w-[93px] truncate text-sm font-MontserratNormal md:font-MontserratMedium text-[#666666] lg:text-000000/50">
                        {seg.label}
                      </p>
                    </div>
                    <div className="hidden w-7.75 shrink-0 text-right md:block">
                      <p className="font-MontserratSemiBold text-c12">{seg.value}</p>
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
          <MultiLineZigZagChart data={chartPoints} />
          </div>
        </div>
      )}
    </>
  );
}
