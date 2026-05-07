"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import FilterDropdown from "../Filter-components/filterButton";
import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";

import { filterOptions } from "../Filter-components/filterOptions";
import Image from "next/image";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import FullFilterButton from "../../../tables/Filters/full-filterButton";
import FilterModal from "../../../tables/Filters/filter-modal";
import { useSelector } from "react-redux";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-947fff text-ffffff text-c12 font-MontserratSemiBold px-2 py-1 rounded-md shadow cursor-pointer">
        {payload[0].value} orders
      </div>
    );
  }
  return null;
};

export default function SalesChart() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const orders = useSelector((state: any) => state.orders.orders);
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [period, setPeriod] = useState("This Year");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build chart data from real Redux orders
  const chartData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (period === "This Year") {
      const counts = Array(12).fill(0);
      orders.forEach((order: any) => {
        const d = new Date(order.created_at);
        if (d.getFullYear() === currentYear) counts[d.getMonth()]++;
      });
      return MONTHS.map((month, i) => ({ month, sales: counts[i] }));
    }

    if (period === "This Month") {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const counts = Array(daysInMonth).fill(0);
      orders.forEach((order: any) => {
        const d = new Date(order.created_at);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          counts[d.getDate() - 1]++;
        }
      });
      return counts.map((sales, i) => ({ month: String(i + 1), sales }));
    }

    if (period === "This Week") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const result: { month: string; sales: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push({ month: days[d.getDay()], sales: 0 });
      }
      orders.forEach((order: any) => {
        const d = new Date(order.created_at);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          const label = days[d.getDay()];
          const entry = result.find((r) => r.month === label);
          if (entry) entry.sales++;
        }
      });
      return result;
    }

    return MONTHS.map((month) => ({ month, sales: 0 }));
  }, [orders, period]);

  return (
    <>
      {isIncomplete ? (
        <div className="px-8 py-6 w-full  h-fit bg-white rounded-2xl circle-shadow">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-MontserratSemiBold">Sales</h2>
            <div className="flex gap-3 relative" ref={dropdownRef}>
              <FullFilterButton
                onOpenFilter={() => setFilterOpen((prev) => !prev)}
              />

              {/* Dropdown Panel */}
              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 z-50   w-fit">
                  <FilterModal
                    onFiltersChange={(newFilters) => setFilters(newFilters)}
                    onClose={() => setFilterOpen(false)}
                  />
                </div>
              )}

              {/* Extra filters */}
              <FilterDropdown
                options={filterOptions}
                onChange={(value) => console.log("Selected:", value)}
              />
            </div>
          </div>

          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 my-4">
              {(Object.entries(filters) as [string, any][]).map(
                ([key, value]) => (
                  <span
                    key={key}
                    className="flex items-center gap-2 bg-ff715b/60 h-c32 px-3 py-2 text-white text-c12 font-MontserratNormal rounded-c8 circle-shadow"
                  >
                    {key === "date" && (
                      <span className="flex items-center gap-1">
                        <Image
                          src={CalenderIcon}
                          alt="calender"
                          width={12}
                          height={13}
                        />

                        {value.start}
                        <Image
                          src={ArrowRightIcon}
                          alt="TO"
                          width={16}
                          height={16}
                        />
                        {value.end}
                      </span>
                    )}
                    {key === "perc" && (
                      <span className="flex items-center gap-1">
                        <Image
                          src={PercentageIcon}
                          alt="%"
                          width={13}
                          height={13}
                        />
                        <span>
                          {">"} {value}%
                        </span>
                      </span>
                    )}
                    {key === "sku" && `SKU: ${value}`}
                    {key === "qty" && (
                      <span className="flex justify-center items-center gap-1">
                        <Image src={Quantity} alt="%" width={12} height={7} />
                        {value.min ?? ""}
                        <Image
                          src={ArrowRightIcon}
                          alt="TO"
                          width={16}
                          height={16}
                        />{" "}
                        {value.max ?? ""}
                      </span>
                    )}
                  </span>
                ),
              )}
            </div>
          )}
          <div className="w-full h-83  text-c12 font-MontserratNormal cursor-pointer">
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="cursor-pointer outline-none focus:outline-none focus:ring-0"
            >
              <AreaChart
                data={chartData}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                {/* gradient */}

                <CartesianGrid stroke="#E6E6E6" vertical={false} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  scale="band"
                  padding={{ left: -30, right: 0 }}
                  interval={0}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "dataMax + 5"]}
                  tickMargin={30}
                  tickCount={6}
                  allowDecimals={false}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#FF9B73"
                  strokeWidth={0}
                  dot={false}
                  activeDot={false}
                  fill="url(#colorSales)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="px-8 py-6 w-full  h-fit bg-ffffff rounded-2xl circle-shadow">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-MontserratSemiBold">Sales</h2>
            <div className="flex gap-3 relative" ref={dropdownRef}>
              <FullFilterButton
                onOpenFilter={() => setFilterOpen((prev) => !prev)}
              />

              {/* Dropdown Panel */}
              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 z-50   ">
                  <FilterModal
                    onFiltersChange={(newFilters) => setFilters(newFilters)}
                    onClose={() => setFilterOpen(false)}
                  />
                </div>
              )}

              {/* Extra filters */}
              <FilterDropdown
                options={filterOptions}
                onChange={(value: string) => setPeriod(value)}
              />
            </div>
          </div>

          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 my-4">
              {(Object.entries(filters) as [string, any][]).map(
                ([key, value]) => (
                  <span
                    key={key}
                    className="flex items-center gap-2 bg-ff715b/60 h-c32 px-3 py-2 text-white text-c12 font-MontserratNormal rounded-c8 circle-shadow"
                  >
                    {key === "date" && (
                      <span className="flex items-center gap-1">
                        <Image
                          src={CalenderIcon}
                          alt="calender"
                          width={12}
                          height={13}
                        />

                        {value.start}
                        <Image
                          src={ArrowRightIcon}
                          alt="TO"
                          width={16}
                          height={16}
                        />
                        {value.end}
                      </span>
                    )}
                    {key === "perc" && (
                      <span className="flex items-center gap-1">
                        <Image
                          src={PercentageIcon}
                          alt="%"
                          width={13}
                          height={13}
                        />
                        <span>
                          {">"} {value}%
                        </span>
                      </span>
                    )}
                    {key === "sku" && `SKU: ${value}`}
                    {key === "qty" && (
                      <span className="flex justify-center items-center gap-1">
                        <Image src={Quantity} alt="%" width={12} height={7} />
                        {value.min ?? ""}
                        <Image
                          src={ArrowRightIcon}
                          alt="TO"
                          width={16}
                          height={16}
                        />{" "}
                        {value.max ?? ""}
                      </span>
                    )}
                  </span>
                ),
              )}
            </div>
          )}
          <div className="w-full h-83  text-c12 font-MontserratNormal cursor-pointer">
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="cursor-pointer outline-none focus:outline-none focus:ring-0"
            >
              <AreaChart
                data={chartData}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                {/* gradient */}
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="10%"
                      stopColor="#FFAC06A3"
                      stopOpacity={0.4}
                    />
                    <stop offset="90%" stopColor="#FFAC06" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#E6E6E6" vertical={false} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  scale="band"
                  padding={{ left: -30, right: 0 }}
                  interval={0}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "dataMax + 5"]}
                  tickMargin={30}
                  tickCount={6}
                  allowDecimals={false}
                />

                <Tooltip content={<CustomTooltip />} cursor={false} />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#FF9B73"
                  strokeWidth={1}
                  dot={false}
                  activeDot={false}
                  fill="url(#colorSales)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
