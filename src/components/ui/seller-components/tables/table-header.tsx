"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import SearchIcon from "@/assets/Seller/searchBtn.svg";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import { motion, AnimatePresence } from "framer-motion";

import FilterDropdown from "../body-components/over-view/Filter-components/filterButton";
import { filterOptions } from "../body-components/over-view/Filter-components/filterOptions";
import FilterModal from "./Filters/filter-modal";
import FullFilterButton from "./Filters/full-filterButton";

interface TableProps {
  title: string;
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  placeholder?: string;
  showSearch?: boolean;
  hideSearchOnMobile?: boolean;
  className?: string;
  image? : string;
}

export default function TableHeader({ 
  title, 
  setFilters, 
  placeholder = "Search...", 
  showSearch = true, 
  hideSearchOnMobile = false,
  className ="bg-ff715b", 
  image = downloadIcon 
}: TableProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery, setFilters]);

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
    <div>
      <p className="text-c18 font-MontserratSemiBold">{title}</p>
      <div className="flex justify-between mt-6">
        {/* Search input */}
        {showSearch ? (
          <motion.div 
            initial={false}
            animate={{ width: isSearchExpanded ? "100%" : "40px" }}
            className={`flex items-center bg-ffffff rounded-c8 circle-shadow h-10 px-3 gap-2 max-w-64 border-000000/10 border overflow-hidden cursor-pointer ${hideSearchOnMobile ? "hidden md:flex" : "flex"}`}
            onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
          >
            <div className="flex-shrink-0">
              <Image src={SearchIcon} height={13.01} width={13.01} alt="search" />
            </div>
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.input 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  type="text" 
                  autoFocus
                  placeholder={placeholder} 
                  className="flex-1 outline-none text-c12 font-MontserratNormal bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div />
        )}

        {/* Filter + dropdowns */}
        <div className="flex gap-3 relative" ref={dropdownRef}>
          <FullFilterButton
            onOpenFilter={() => setFilterOpen((prev) => !prev)}
          />

          {filterOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 w-fit">
              <FilterModal
                onFiltersChange={(newFilters) => setFilters(newFilters)}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          )}

          <FilterDropdown
            options={filterOptions}
            onChange={(value) => console.log("Selected:", value)}
          />

          <button className={`w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8 ${className}`}>
            <Image
              src={image}
              alt="download"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
