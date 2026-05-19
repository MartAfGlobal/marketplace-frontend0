"use client";

import React from "react";
import { Users2, ChevronDown } from "lucide-react";

interface ChartBar {
  day: string;
  height: string;
}

interface AdminStatsChartCardProps {
  title: string;
  total: string | number;
  active: string | number;
  inactive: string | number;
  timeFilterText?: string;
  chartBars?: ChartBar[];
}

export default function AdminStatsChartCard({
  title,
  total,
  active,
  inactive,
  timeFilterText = "This week",
  chartBars = [
    { day: "Mon", height: "60%" },
    { day: "Tue", height: "75%" },
    { day: "Wed", height: "75%" },
    { day: "Thu", height: "65%" },
    { day: "Fri", height: "85%" },
    { day: "Sat", height: "85%" },
    { day: "Sun", height: "70%" },
  ]
}: AdminStatsChartCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm w-full md:max-w-xl animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-MontserratBold text-[#161616] capitalize">{title}</h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[10px] text-gray-500 font-MontserratMedium border border-[#eef0f3] hover:bg-gray-50 transition-colors">
          <span>{timeFilterText}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center flex-1">
        {/* Left Side: Counts */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Users2 className="w-6 h-6 text-[#7f00ff]" />
          </div>
          <div>
            <p className="text-3xl font-MontserratBold text-[#161616]">{total}</p>
            <p className="text-[10px] text-gray-400 font-MontserratMedium uppercase tracking-wider mb-2">Total</p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-MontserratBold text-[#2ea37d] bg-[#2ea37d]/10 px-2 py-0.5 rounded-md uppercase">
                {active} Active
              </span>
              <span className="text-[9px] font-MontserratBold text-[#f44336] bg-[#f44336]/10 px-2 py-0.5 rounded-md uppercase">
                {inactive} Inactive
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Stacked Weekly Chart */}
        <div className="h-32 flex items-end justify-between relative pl-4 border-l border-gray-100">
          {/* Y Axis Grid Legends */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-400 font-MontserratMedium">
            <span>500</span>
            <span>400</span>
            <span>300</span>
            <span>200</span>
            <span>100</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end justify-around h-full pr-6">
            {chartBars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end w-4 group">
                {/* Visual Stacked Bar representation */}
                <div className="w-2.5 h-full flex flex-col justify-end bg-gray-50 rounded-t-sm overflow-hidden">
                  <div 
                    style={{ height: bar.height }} 
                    className="w-full bg-[#2ea37d] group-hover:bg-[#7f00ff] rounded-t-sm transition-all"
                  />
                </div>
                <span className="text-[7px] text-gray-400 font-MontserratMedium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
