"use client";

import { useState, useEffect, useRef } from "react";
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

import ArrowRightIcon  from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon    from "@/assets/Seller/calender2.png";
import PercentageIcon  from "@/assets/Seller/Percent2.png";
import Quantity        from "@/assets/Seller/quantity2.png";

import FilterDropdown   from "../../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../../over-view/Filter-components/filterOptions";
import FilterModal      from "@/components/ui/seller-components/tables/Filters/filter-modal";
import FullFilterButton from "@/components/ui/seller-components/tables/Filters/full-filterButton";

import { useOrdersChartData } from "./useOrdersChartData";

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-200 text-ffffff text-c12 font-MontserratSemiBold px-2 py-1 rounded-md shadow cursor-pointer">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

// Shared chart config used for both mobile and desktop renders
function ChartContent({ data }: { data: { label: string; orders: number }[] }) {
  return (
    <AreaChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
          <stop offset="10%" stopColor="#947FFF" stopOpacity={0.35} />
          <stop offset="90%" stopColor="#947FFF" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      <CartesianGrid stroke="#E6E6E6" vertical={false} />

      <XAxis
        dataKey="label"
        axisLine={false}
        tickLine={false}
        tickMargin={10}
        scale="band"
        padding={{ left: -30, right: 0 }}
        interval={0}
        tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)", fontFamily: "Montserrat-Normal" }}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        domain={[0, "dataMax + 2"]}
        tickMargin={30}
        tickCount={6}
        allowDecimals={false}
        tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)", fontFamily: "Montserrat-Normal" }}
      />

      <Tooltip content={<CustomTooltip />} cursor={false} />

      <Area
        type="monotone"
        dataKey="orders"
        stroke="#947FFF"
        strokeWidth={1.5}
        dot={false}
        activeDot={false}
        fill="url(#colorOrders)"
        fillOpacity={1}
      />
    </AreaChart>
  );
}

export default function OrderQuantityChart({
  externalPeriod,
}: {
  externalPeriod?: string;
}) {
  const [filters, setFilters]       = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [localPeriod, setLocalPeriod] = useState("This Year");

  const activePeriod = externalPeriod ?? localPeriod;

  const { trend } = useOrdersChartData(activePeriod);

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

  return (
    <div className="lg:px-8 py-6 w-full h-fit lg:bg-white lg:rounded-2xl lg:circle-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-MontserratSemiBold">Orders</h2>
        <div className="flex gap-3 relative" ref={dropdownRef}>
          <FullFilterButton
            onOpenFilter={() => setFilterOpen((prev) => !prev)}
            isOpen={filterOpen}
          />

          {filterOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 w-fit">
              <FilterModal
                onFiltersChange={(newFilters) => setFilters(newFilters)}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          )}

          {/* Only show the local period picker when no external period is passed */}
          {!externalPeriod && (
            <FilterDropdown
              options={filterOptions}
              onChange={(value) => setLocalPeriod(value)}
            />
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {(Object.entries(filters) as [string, any][]).map(([key, value]) => (
            <span
              key={key}
              className="flex items-center gap-2 bg-ff715b/60 h-c32 px-3 py-2 text-white text-c12 font-MontserratNormal rounded-c8 circle-shadow"
            >
              {key === "date" && (
                <span className="flex items-center gap-1">
                  <Image src={CalenderIcon} alt="calender" width={12} height={13} />
                  {value.start}
                  <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />
                  {value.end}
                </span>
              )}
              {key === "perc" && (
                <span className="flex items-center gap-1">
                  <Image src={PercentageIcon} alt="%" width={13} height={13} />
                  <span>{">"} {value}%</span>
                </span>
              )}
              {key === "sku" && `SKU: ${value}`}
              {key === "qty" && (
                <span className="flex justify-center items-center gap-1">
                  <Image src={Quantity} alt="%" width={12} height={7} />
                  {value.min ?? ""}
                  <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />
                  {" "}
                  {value.max ?? ""}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Mobile chart */}
      <div className="w-full overflow-y-auto rounded-c16 lg:hidden">
        <div className="w-full bg-ffffff h-83 p-6 lg:p-0 text-c12 font-MontserratNormal cursor-pointer">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="cursor-pointer outline-none focus:outline-none focus:ring-0"
          >
            <ChartContent data={trend} />
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desktop chart */}
      <div className="w-full hidden lg:block bg-ffffff h-83 p-6 lg:p-0 text-c12 font-MontserratNormal cursor-pointer">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="cursor-pointer outline-none focus:outline-none focus:ring-0"
        >
          <ChartContent data={trend} />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
