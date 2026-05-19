"use client";

import React from "react";
import { Search, SlidersHorizontal, ChevronDown, Download } from "lucide-react";
import { Input } from "@/components/ui/forms/Input";

interface AdminListHeaderProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  selectedMonth?: string;
  onMonthChange?: (val: string) => void;
  onExportClick?: () => void;
}

export default function AdminListHeader({
  searchVal,
  setSearchVal,
  placeholder = "Search...",
  onFilterClick,
  selectedMonth = "This month",
  onMonthChange,
  onExportClick
}: AdminListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search Input Box */}
      <div className="w-full sm:max-w-md">
        <Input
          placeholder={placeholder}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          className="h-11 bg-white border border-[#eef0f3] rounded-xl px-4 text-xs focus:ring-[#7f00ff] focus:border-[#7f00ff]"
        />
      </div>

      {/* Filters row actions */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        {/* Sliders filter button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 h-11 px-4 bg-white border border-[#eef0f3] rounded-xl text-xs text-gray-500 font-MontserratMedium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span>Filters</span>
        </button>

        {/* Dropdown Select month */}
        <button
          className="flex items-center justify-between gap-2 h-11 px-4 bg-white border border-[#eef0f3] rounded-xl text-xs text-gray-500 font-MontserratMedium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span>{selectedMonth}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Red/Coral Export PDF Button */}
        <button
          onClick={onExportClick}
          className="h-11 w-11 flex shrink-0 items-center justify-center bg-[#FF715B] text-white rounded-xl shadow-md shadow-[#FF715B]/10 hover:bg-opacity-95 transition-all active:scale-95 cursor-pointer"
          title="Export as PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
