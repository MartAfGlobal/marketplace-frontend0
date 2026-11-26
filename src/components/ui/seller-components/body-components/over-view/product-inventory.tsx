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
import InventoryTable, { InventoryRow } from "../../tables/inventory-table";
import FilterModal from "../../tables/Filters/filter-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ChevronRight } from "lucide-react";
import { downloadTableRows } from "@/utils/downloadTableRows";
import { useHttp } from "@/hooks/use-http";

function formatInventoryDate(value?: Date | string): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ProductInventory() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    date?: { start?: Date | string; end?: Date | string };
    perc?: { from?: number; to?: number };
    sku?: string;
    qty?: { min?: number; max?: number };
  }>({});
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();
  const totalRows = filteredCount !== null ? filteredCount : inventoryCount;
  const filteredDataCount = totalRows; 

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, filteredDataCount);

  useEffect(() => {
    setCurrentPage(1);
    setFilteredCount(null);
  }, [filters, searchQuery, resultsPerPage]);

  useEffect(() => {
    if (!token) return;

    let isCurrentRequest = true;
    const timeout = setTimeout(() => {
      sendHttpRequest({
        requestConfig: {
          url: "/products/manufacturer/inventory",
          method: "GET",
          token,
          isAuth: true,
          userType: "seller",
          params: {
            search: searchQuery || filters.sku || "",
            page: currentPage,
            page_size: resultsPerPage,
            ...(filters.perc?.from !== undefined && {
              percent_min: filters.perc.from,
            }),
            ...(filters.perc?.to !== undefined && {
              percent_max: filters.perc.to,
            }),
            ...(filters.qty?.min !== undefined && {
              quantity_min: filters.qty.min,
            }),
            ...(filters.qty?.max !== undefined && {
              quantity_max: filters.qty.max,
            }),
            ...(formatInventoryDate(filters.date?.start) && {
              date_from: formatInventoryDate(filters.date?.start),
            }),
            ...(formatInventoryDate(filters.date?.end) && {
              date_to: formatInventoryDate(filters.date?.end),
            }),
          },
        },
        successRes: (response: any) => {
          if (!isCurrentRequest) return;
          const data = response?.data?.data ?? response?.data;
          const responseRows = Array.isArray(data)
            ? data
            : data?.results ?? data?.items ?? data?.inventory ?? data?.products ?? [];
          const rows = Array.isArray(responseRows) ? responseRows : [];
          const normalizedRows = rows.map((row: any, index: number) => ({
            ...row,
            id: row.id ?? row.product_id ?? row.stockcode ?? row.sku ?? String(index),
            name: row.name ?? row.product_name ?? row.title ?? "",
            stockcode: row.stockcode ?? row.stock_code ?? row.sku ?? "",
            sold: row.sold ?? row.quantity_sold ?? row.qty_sold ?? 0,
            inventory:
              row.inventory ??
              row.quantity_in_stock ??
              row.stock_quantity ??
              row.available_stock ??
              0,
            sales_percentag:
              row.sales_percentag ?? row.sales_percentage ?? row.sales_percent ?? 0,
          }));
          setInventoryRows(normalizedRows);
          setInventoryCount(
            Number(data?.count ?? data?.total ?? data?.total_count ?? rows.length),
          );
        },
        errorRes: (error: unknown) => {
          if (isCurrentRequest) {
            console.warn(
              "Seller product inventory unavailable:",
              error instanceof Error ? error.message : error,
            );
          }
        },
      });
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeout);
    };
  }, [currentPage, filters, resultsPerPage, searchQuery, sendHttpRequest, token]);

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
    <div className="seller-overview-panel w-full mb-4 lg:mb-6 p-6 lg:px-8 lg:pt-6 bg-ffffff rounded-c16">
      <div className="mb-6">
        <p className="text-c18 font-MontserratMedium text-000000">Products Inventory</p>
      </div>
      
      <div className="h-fit  py-5 lg:py-6 lg:px-0 pt-0 lg:pt-0">
        <div className="flex justify-between items-center gap-3">
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            onToggle={setIsSearchOpen}
            disabled={isIncomplete}
            placeholder="Search products..."
          />
          
          <div 
            className={`gap-2 lg:gap-3 relative ${isSearchOpen ? "hidden lg:flex" : "flex"}`}
            ref={dropdownRef}
          >
            <FullFilterButton
              onOpenFilter={() => setFilterOpen((prev) => !prev)}
              isOpen={filterOpen}
            />

            {/* Dropdown Panel */}
            {filterOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 w-full">
                <FilterModal
                  onFiltersChange={(newFilters) => setFilters(newFilters)}
                  onClose={() => setFilterOpen(false)}
                />
              </div>
            )}

            <button
              disabled={isIncomplete || selectedProducts.length === 0}
              onClick={() => downloadTableRows(selectedProducts, "products-inventory")}
              aria-label="Download selected products"
              className={`w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8 ${
                isIncomplete || selectedProducts.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
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
        <div className="flex items-center justify-between mt-6 lg:hidden">
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
          filters={filters}
          products={inventoryRows}
          totalCount={inventoryCount}
          onFilteredCount={setFilteredCount}
          onSelectionChange={setSelectedProducts}
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
