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
import { downloadTableRows } from "@/utils/downloadTableRows";
import { useHttp } from "@/hooks/use-http";
import { RootState } from "@/store";

function formatOrderDate(value?: Date | string): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function OverviewOder() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const token = useSelector((state: RootState) => state.token?.token);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const rowsPerPage = 6;
  const totalRows = orders.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const dateFrom = formatOrderDate(filters.date?.start);
  const dateTo = formatOrderDate(filters.date?.end);
  const { sendHttpRequest } = useHttp();

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
    if (!token) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    let isCurrentRequest = true;
    const timeout = setTimeout(() => {
      setIsLoading(true);
      sendHttpRequest({
        requestConfig: {
          url: "/orders/manufacturer/orders",
          method: "GET",
          token,
          isAuth: true,
          userType: "seller",
          params: {
            ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
            ...(dateFrom ? { date_from: dateFrom } : {}),
            ...(dateTo ? { date_to: dateTo } : {}),
          },
        },
        successRes: (response: any) => {
          if (!isCurrentRequest) return;
          const data = response?.data?.data ?? response?.data;
          const responseRows = Array.isArray(data)
            ? data
            : data?.orders ?? data?.results ?? data?.items ?? data?.data ?? [];
          setOrders(Array.isArray(responseRows) ? responseRows : []);
          setIsLoading(false);
        },
        errorRes: (error: unknown) => {
          if (!isCurrentRequest) return;
          setOrders([]);
          setIsLoading(false);
          console.warn(
            "Seller orders unavailable:",
            error instanceof Error ? error.message : error,
          );
        },
      });
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeout);
    };
  }, [dateFrom, dateTo, searchQuery, sendHttpRequest, token]);

  return (
    <div className="seller-overview-panel w-full max-w-214.5 bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8">
      <p className="text-c18 font-MontserratSemiBold">Orders</p>
      <div className="flex justify-between mt-6">
          <SellerSearch 
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            onToggle={setIsSearchOpen}
            disabled={isIncomplete}
            placeholder="Search by ID, items, date..."
          />

        <div className={`gap-3 relative ${isSearchOpen ? "hidden lg:flex" : "flex"}`} ref={dropdownRef}>
          <FullFilterButton
            onOpenFilter={() => setFilterOpen((prev) => !prev)}
            isOpen={filterOpen}
          />

          {/* Dropdown Panel */}
          {filterOpen && (
            <div className="absolute top-full left-0 mt-2 z-50   w-fit">
              <FilterModal
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  setCurrentPage(1);
                }}
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
            disabled={isIncomplete || selectedOrders.length === 0}
            onClick={() => downloadTableRows(selectedOrders, "orders")}
            aria-label="Download selected orders"
            className={`w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8 ${
              isIncomplete || selectedOrders.length === 0
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
        filters={{ ...filters, search: searchQuery }}
        orders={orders}
        isLoading={isLoading}
        onSelectionChange={setSelectedOrders}
      />

      {totalRows > rowsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
