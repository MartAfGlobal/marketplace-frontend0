"use client";

import Image from "next/image";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import DeleteIcon from "@/assets/Seller/Trash.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";

import FilterDropdown from "../../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../../over-view/Filter-components/filterOptions";
import { useState, useRef, useEffect } from "react";
import OrderFiltered from "./Orders-filtered";
import FilterModal from "@/components/ui/seller-components/tables/Filters/filter-modal";
import FullFilterButton from "@/components/ui/seller-components/tables/Filters/full-filterButton";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";



export default function MyOrders() {
 const [filters, setFilters] = useState<Record<string, any>>({}); // ✅ never undefined
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const rowsPerPage = 10;
  const totalRows = 55; // replace with real total count later
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

  return (
    <div className="w-full bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8">
      <div>
        <p className="text-c18 font-MontserratSemiBold">Orders</p>
        <div className="flex justify-between mt-6">
          <button className="flex items-center justify-center bg-ffffff rounded-c8 circle-shadow h-10 w-10">
            <Image src={SearchIcon} height={13.01} width={13.01} alt="search" />
          </button>
          <div className="flex gap-4">
            <div className="flex gap-3 relative" ref={dropdownRef}>
              <FullFilterButton onOpenFilter={() => setFilterOpen((prev) => !prev)} />

              {/* Dropdown Panel */}
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

              <button className="w-10 h-10 flex items-center justify-center border border-ff715b rounded-c8">
                <Image src={downloadIcon} alt="download" width={16} height={16} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-ff715b rounded-c8">
                <Image src={DeleteIcon} alt="delete" width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
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
                  <span>
                    {">"} {value}%
                  </span>
                </span>
              )}
              {key === "sku" && `SKU: ${value}`}
              {key === "qty" && (
                <span className="flex justify-center items-center gap-1">
                  <Image src={Quantity} alt="qty" width={12} height={7} />
                  {value.min ?? ""}
                  <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />{" "}
                  {value.max ?? ""}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="w-full pt-c32 ">
        <OrderFiltered
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
