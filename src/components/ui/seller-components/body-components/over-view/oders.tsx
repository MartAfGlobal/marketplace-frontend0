"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";
import { motion, AnimatePresence } from "framer-motion";

import FullFilterButton from "../../tables/Filters/full-filterButton";

import FilterDropdown from "./Filter-components/filterButton";
import SellerSearch from "./Filter-components/SellerSearch";
import { filterOptions } from "./Filter-components/filterOptions";

import OrderTable from "../../tables/order-table";
import Pagination from "../products/pignation-button";
import FilterModal from "../../tables/Filters/filter-modal";
import { useSelector } from "react-redux";

export default function OverviewOder() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const rowsPerPage = 10;
  const totalRows = 5;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // 🔴 optional: close dropdown when clicking outside
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

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  return (
    <div className="w-full max-w-214.5 bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8">
      <p className="text-c18 font-MontserratSemiBold">Orders</p>
      <div className="flex justify-between mt-6">
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={isIncomplete}
            placeholder="Search by ID, items, date..."
          />

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

      {Object.entries(filters).filter(([key, value]) => key !== "search" && value).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {(Object.entries(filters) as [string, any][])
            .filter(([key, value]) => key !== "search" && value)
            .map(([key, value]) => (
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
                    <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />
                    {value.end}
                  </span>
                )}
                {key === "perc" && (
                  <span className="flex items-center gap-1">
                    <Image src={PercentageIcon} alt="%" width={13} height={13} />
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
            ))}
        </div>
      )}
      <OrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        filters={filters}
      />

      {totalRows > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
