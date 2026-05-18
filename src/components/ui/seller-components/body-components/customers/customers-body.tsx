"use client";

import React, { useState } from "react";
import CustomersCards from "./customers-cards";
import CustomersTable from "../../tables/customers-table";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import FilterDropdown from "../over-view/Filter-components/filterButton";
import FullFilterButton from "../../tables/Filters/full-filterButton";
import { filterOptions } from "../over-view/Filter-components/filterOptions";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import Image from "next/image";
import SellerSearch from "../over-view/Filter-components/SellerSearch";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { SellerMobileHeader } from "../../header-components/SellerMobileHeader";

export default function CustomersBody() {
  const [searchQuery, setSearchQuery] = useState("");

  const isIncomplete = useSelector(
    (state: any) =>
      state.seller?.isIncomplete ??
      state.seller?.verificationStatus?.isIncomplete ??
      false,
  );

  return (
    <div className="space-y-6 pb-c32">
      {/* Top Header - Similar to OverviewHeader */}
       <div className="lg:hidden w-full -mb-0.5 flex justify-baseline">
          <SellerMobileHeader title="Customers" />
        </div>
      <div className="flex flex-col md:flex-row md:h-c48 items-center justify-between w-full px-3 gap-4 md:gap-0">
        <div className="flex items-center lg:justify-between w-full">
          <div className="w-full hidden  max-w-fit   md:flex items-center gap-c48">
            <p className="text-c18 font-MontserratMedium">
              Customer Management
            </p>
            <div className="lg:max-w-87">
              <SearchInput placeholder="Search for a customer by name, or order ID" />
            </div>
          </div>
          <div className="hidden lg:block w-fit ">
            <FilterDropdown
              options={filterOptions}
              onChange={(value) => console.log("Selected:", value)}
            />
          </div>
        </div>
       

        {/* Mobile top header */}
        <div className="w-full md:hidden md:max-w-87">
          <SearchInput placeholder="Search for a customer by name, or order ID" />
        </div>
        <div className="flex items-center justify-between w-full md:hidden">
          <p className="text-c18 font-MontserratMedium">Customer Management</p>
          <FilterDropdown
            options={filterOptions}
            onChange={(value) => console.log("Selected:", value)}
          />
        </div>
      </div>

      {/* Cards Section */}
      <div>
        <CustomersCards />
      </div>

      {/* Table Section or Empty State Container */}
      {isIncomplete ? (
        <div className="w-full mt-10 bg-ffffff circle-shadow rounded-c16 py-16 px-4 md:px-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-[700px] border border-[#efefef] rounded-[24px] bg-white p-8 md:p-16 flex flex-col items-center text-center justify-center">
            <h3 className="text-xl md:text-[22px] font-MontserratBold text-[#161616] mb-4">
              You have no customer yet
            </h3>
            <p className="text-xs md:text-sm text-[#666666] font-MontserratMedium leading-relaxed mb-8 max-w-lg mx-auto">
              Once you approve and complete an order, your customers will appear
              here automatically. Upload products and start selling to see your
              customers here.
            </p>
            <Link
              href="/dashboard/seller/products"
              className="bg-[#FF715B] text-white px-10 py-3 rounded-xl font-MontserratBold text-sm hover:bg-opacity-90 transition-all cursor-pointer shadow-md shadow-[#FF715B]/10"
            >
              Go to Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full mt-10 bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-4 lg:px-8 relative pb-28">
          {/* Title */}
          <div className="mb-6">
            <p className="text-c18 font-MontserratSemiBold text-000000 px-3 lg:px-0">
              Customers List
            </p>
          </div>

          {/* Search & Filters Row */}
          <div className="flex justify-between items-center gap-3 w-full px-3 lg:px-0">
            <SellerSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search customer..."
            />

            <div className="flex gap-2 lg:gap-3 items-center">
              <FullFilterButton onOpenFilter={() => {}} />
              <FilterDropdown
                options={filterOptions}
                onChange={(value) => console.log("Selected:", value)}
              />
              <button
                className="w-10 h-10 flex shrink-0 items-center justify-center bg-[#FF715B] rounded-c8 cursor-pointer shadow-sm hover:bg-opacity-90 animate-in fade-in zoom-in duration-300"
                title="Export selected as PDF"
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

          {/* Table Wrapper */}
          <div className="w-full pt-6 lg:pt-c32 px-3 lg:px-0">
            <CustomersTable />
          </div>

          {/* Unified Pagination matching MyOrders pattern */}
          <div className="w-full absolute bottom-6 left-0 right-0">
            {/* Desktop Pagination */}
            <div className="hidden lg:flex justify-between items-center px-8 text-sm text-gray-500 font-MontserratMedium">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#FF715B] text-white">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer">
                  4
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer">
                  5
                </button>
                <span className="px-2">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer">
                  10
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  &gt;
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-10 h-8 border border-gray-200 rounded text-center outline-none focus:border-[#FF715B]"
                  defaultValue="1"
                />
                <span>/ 10</span>
                <button className="bg-[#FF715B] text-white px-4 py-1.5 rounded cursor-pointer hover:bg-opacity-90">
                  Go
                </button>
              </div>
            </div>

            {/* Mobile Pagination */}
            <div className="flex lg:hidden justify-end items-center px-6 gap-4">
              <button className="text-[#FF715B] text-xs font-MontserratBold flex items-center gap-1 cursor-pointer">
                <ChevronRight size={14} className="rotate-180" /> previous
              </button>
              <button className="text-[#FF715B] text-xs font-MontserratBold flex items-center gap-1 cursor-pointer">
                next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
