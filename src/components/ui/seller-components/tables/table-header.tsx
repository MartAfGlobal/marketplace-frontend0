"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import SearchIcon from "@/assets/Seller/searchBtn.svg";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";

import FilterDropdown from "../body-components/over-view/Filter-components/filterButton";
import { filterOptions } from "../body-components/over-view/Filter-components/filterOptions";
import FilterModal from "./Filters/filter-modal";
import FullFilterButton from "./Filters/full-filterButton";

interface TableProps {
  title: string;
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function TableHeader({ title, setFilters }: TableProps) {
  const [filterOpen, setFilterOpen] = useState(false);
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
    <div>
      <p className="text-c18 font-MontserratSemiBold">{title}</p>
      <div className="flex justify-between mt-6">
        {/* Search button */}
        <button className="flex items-center justify-center bg-ffffff rounded-c8 circle-shadow h-10 w-10">
          <Image src={SearchIcon} height={13.01} width={13.01} alt="search" />
        </button>

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

          <button className="w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8">
            <Image
              src={downloadIcon}
              alt="download"
              width={10.67}
              height={10.67}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
