"use client";

import React from "react";
import { Search, SlidersHorizontal, ChevronDown, Download } from "lucide-react";
import { Input } from "@/components/ui/forms/Input";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

interface AdminListHeaderProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  selectedMonth?: string;
  onMonthChange?: (val: string) => void;
  onExportClick?: () => void;
  searchExpandable?: boolean;
  filterOptions?: string[];
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  onApplyFilters?: () => void;
}

export default function AdminListHeader({
  searchVal,
  setSearchVal,
  placeholder = "Search...",
  onFilterClick,
  selectedMonth = "This month",
  onMonthChange,
  onExportClick,
  searchExpandable = false,
  filterOptions = [],
  selectedFilters = [],
  onFilterChange,
  onApplyFilters,
}: AdminListHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<string[]>(selectedFilters);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const isExpanded = isSearchExpanded || !!searchVal;

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleBlur = () => {
    if (!searchVal) {
      setIsSearchExpanded(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (option: string) => {
    setLocalFilters(prev => 
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  const handleApply = () => {
    if (onFilterChange) onFilterChange(localFilters);
    if (onApplyFilters) onApplyFilters();
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setLocalFilters([]);
    if (onFilterChange) onFilterChange([]);
    if (onApplyFilters) onApplyFilters();
    setIsFilterOpen(false);
  };

  const renderFilterDropdown = () => {
    if (!filterOptions.length || !isFilterOpen) return null;
    return (
      <div 
        className="absolute top-full right-0 mt-2 w-[176px] bg-ffffff rounded-c8 shadow-custom border border-000000/4 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-MontserratSemiBold text-c12  mb-3">Filter by</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {filterOptions.map((option) => {
            const isSelected = localFilters.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleFilter(option)}
                className={`py-2.5 px-2 w-c64 text-sm font-MontserratNormal text-c12 flex items-center justify-center transition-colors ${
                  isSelected 
                    ? "bg-[#FFE8E8] text-[#FF715B]" 
                    : "bg-[#F5F5F5] text-[#A3A3A3] hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handleClear}
            className="text-c12 font-MontserratSemiBold text-000000/12 hover:text-gray-700 transition-colors"
          >
            Clear filters
          </button>
          <button 
            onClick={handleApply}
            className="text-c12 font-MontserratSemiBold text-[#FF715B] hover:text-[#e56550] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  if (searchExpandable) {
    return (
      <div className="flex items-center justify-between gap-4 w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Search Container */}
        <div 
          className={`transition-all duration-300 ${
            isExpanded ? "w-full sm:max-w-md" : "w-11"
          }`}
        >
          {isExpanded ? (
            <div className="relative text-gray-700 w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onBlur={handleBlur}
                className="h-10 w-full bg-white border border-[#eef0f3] rounded-c8 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-ff715b focus:border-ff715b"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <button
              onClick={handleSearchClick}
              className="w-10 h-10 flex shrink-0 items-center justify-center bg-white shadow-custom rounded-c8 hover:bg-gray-50 transition-colors  cursor-pointer"
              title="Search"
            >
              <Search className="w-[13.01] h-[13.01] text-000000" />
            </button>
          )}
        </div>

        {/* Filters/Actions Row - hides on mobile when search is expanded */}
        <div 
          className={`items-center gap-4 text-c12 font-MontserratNormal sm:gap-3 justify-end sm:flex-1 ${
            isExpanded ? "hidden sm:flex" : "flex"
          }`}
        >
          {/* Sliders filter button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                if (filterOptions.length > 0) {
                  setIsFilterOpen(!isFilterOpen);
                } else if (onFilterClick) {
                  onFilterClick();
                }
              }}
              className="flex justify-center items-center gap-4 text-c12 font-MontserratNormal px-3 bg-white rounded-c8 transition-colors shadow-custom cursor-pointer h-10 w-23.25"
            >
              <span className="hidden sm:inline text-ff715b text-c12 font-MontserratNormal">Filters</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-ff715b" />
            </button>
            {renderFilterDropdown()}
          </div>

          {/* Dropdown Select month */}
          <FilterDropdown 
            options={["This Week", "This Month", "This Year"]}
            defaultValue={selectedMonth}
            onChange={onMonthChange}
            className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
          />

          {/* Red/Coral Export PDF Button */}
          <button
            onClick={onExportClick}
            className="h-10 w-10 flex shrink-0 items-center justify-center bg-ff715b text-white rounded-c8   hover:bg-opacity-95 transition-all active:scale-95 cursor-pointer"
            title="Export as PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Fallback non-expandable mode
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
      <div className="flex items-center gap-4 text-c12 font-MontserratNormal sm:gap-3 w-full sm:w-auto justify-end">
        {/* Sliders filter button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => {
              if (filterOptions.length > 0) {
                setIsFilterOpen(!isFilterOpen);
              } else if (onFilterClick) {
                onFilterClick();
              }
            }}
            className="flex items-center gap-4 text-c12 font-MontserratNormal px-3 bg-white rounded-c8 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer h-11"
          >
            <span className="text-ff715b text-c12 font-MontserratNormal">Filters</span>
            <SlidersHorizontal className="w-3.25 h-3 text-ff715b" />
          </button>
          {renderFilterDropdown()}
        </div>

        {/* Dropdown Select month */}
        <FilterDropdown 
          options={["This Week", "This Month", "This Year"]}
          defaultValue={selectedMonth}
          onChange={onMonthChange}
          className="border border-[#eef0f3] !rounded-xl !h-11 !py-0 !px-4 !gap-4 !text-gray-500 hover:bg-gray-50 !shadow-sm"
        />

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
