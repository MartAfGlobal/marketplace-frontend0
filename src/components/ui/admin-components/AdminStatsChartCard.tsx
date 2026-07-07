"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";

interface AdminStatsChartCardProps {
  title: string;
  total: string;
  active: string;
  inactive: string;
  timeFilterText?: string;
}

const DEFAULT_CHART_DATA = [
  { value: 30 },
  { value: 45 },
  { value: 35 },
  { value: 55 },
  { value: 48 },
  { value: 65 },
  { value: 75 },
];

export default function AdminStatsChartCard({
  title,
  total,
  active,
  inactive,
  timeFilterText = "This month",
}: AdminStatsChartCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-MontserratBold text-gray-400 capitalize">
          {title}
        </h2>
        {timeFilterText && (
          <div className="flex items-center gap-1 text-xs text-gray-400 font-MontserratMedium cursor-pointer hover:opacity-80">
            <span>{timeFilterText}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-MontserratBold text-[#161616] tracking-tight">
          {total}
        </span>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6A0DAD]"></span>
            <span className="text-xs text-gray-500 font-MontserratNormal">Active:</span>
            <span className="text-xs font-MontserratSemiBold text-[#161616]">{active}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff715b]"></span>
            <span className="text-xs text-gray-500 font-MontserratNormal">Inactive:</span>
            <span className="text-xs font-MontserratSemiBold text-[#161616]">{inactive}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-28 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DEFAULT_CHART_DATA}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="adminStatsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6A0DAD" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6A0DAD" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6A0DAD"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#adminStatsGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
