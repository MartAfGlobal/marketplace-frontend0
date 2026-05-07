"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";
import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import { motion, AnimatePresence } from "framer-motion";

import FullFilterButton from "../../tables/Filters/full-filterButton";
import FilterDropdown from "./Filter-components/filterButton";
import SellerSearch from "./Filter-components/SellerSearch";
import { filterOptions } from "./Filter-components/filterOptions";
import InventoryTable from "../../tables/inventory-table";
import FilterModal from "../../tables/Filters/filter-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ChevronRight } from "lucide-react";

export default function ProductInventory() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const product = useSelector((state: RootState) => state.sellerProduct.product) || [];
  const totalRows = filteredCount !== null ? filteredCount : product.length;
  const filteredDataCount = totalRows; 

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, filteredDataCount);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full   mb-4 lg:mb-6 p-6 lg:px-8 lg:pt-6 bg-ffffff rounded-c16">
      <div className="mb-6">
        <p className="text-c18 font-MontserratMedium text-000000">Products Inventory</p>
      </div>
      
      <div className="h-fit  py-5 lg:py-6 lg:px-0 pt-0 lg:pt-0">
        <div className="flex justify-between items-center gap-3">
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={isIncomplete}
            placeholder="Search products..."
          />
          
          <div 
            className={`flex gap-2 lg:gap-3 transition-opacity duration-300 relative `}
            ref={dropdownRef}
          >
            <FullFilterButton
              onOpenFilter={() => setFilterOpen((prev) => !prev)}
            />

            {/* Dropdown Panel */}
            {filterOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 w-fit">
                <FilterModal
                  onFiltersChange={(newFilters) => setFilters(newFilters)}
                  onClose={() => setFilterOpen(false)}
                />
              </div>
            )}

            <button
              disabled={isIncomplete}
              className={`w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8 ${
                isIncomplete ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Image
                src={downloadIcon}
                alt="download"
                width={10.67}
                height={10.67}
              />
            </button>
          </div>
        </div>

        {/* Filter Chips Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
             {(Object.entries(filters) as [string, any][]).map(([key, value]) => (
               <span key={key} className="flex items-center gap-2 bg-ff715b/60 h-c32 px-3 py-2 text-white text-c12 font-MontserratNormal rounded-c8 circle-shadow">
                 {key === 'date' && (
                   <span className="flex items-center gap-1">
                     {value.start}
                     <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />
                     {value.end}
                   </span>
                 )}
                 {key === 'sku' && `SKU: ${value}`}
               </span>
             ))}
          </div>
        )}

        {/* Pagination Status Row */}
        <div className="flex items-center justify-between mt-6 md:hidden">
          <p className="text-sm font-MontserratNormal text-000000/40">
            {startIndex}-{endIndex} of {filteredDataCount} results
          </p>
          <div className="flex items-center gap-3 lg:gap-5">
            <p className="text-sm font-MontserratNormal text-000000/40">
              Results per page
            </p>
            <FilterDropdown 
              options={Array.from(new Set([4, 8, 12, filteredDataCount]))
                .filter(n => n <= filteredDataCount)
                .sort((a, b) => a - b)
                .map(String)}
              defaultValue={String(resultsPerPage)}
              onChange={(value) => {
                setResultsPerPage(Number(value));
                setCurrentPage(1);
              }}
              className="w-10 rounded-c8"
            />
          </div>
        </div>

        <InventoryTable
          currentPage={currentPage}
          rowsPerPage={resultsPerPage}
          filters={{ ...filters, sku: searchQuery }}
          onFilteredCount={setFilteredCount}
        />

        {/* Bottom Pagination controls */}
        <div className="flex justify-end items-center mt-6 gap-4">
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
            >
              <ChevronRight size={14} className="rotate-180" /> previous
            </button>
          )}
          {filteredDataCount > currentPage * resultsPerPage && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
            >
              next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
