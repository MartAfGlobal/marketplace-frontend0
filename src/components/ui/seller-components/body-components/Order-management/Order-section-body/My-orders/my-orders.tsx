"use client";

import Image from "next/image";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import DeleteIcon from "@/assets/Seller/Trash.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";
import Pagination from "../../../products/pignation-button";
import { useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";

import FilterDropdown from "../../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../../over-view/Filter-components/filterOptions";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import SellerSearch from "../../../over-view/Filter-components/SellerSearch";
import autoTable from "jspdf-autotable";
import OrderFiltered from "./Orders-filtered";
import FilterModal from "@/components/ui/seller-components/tables/Filters/filter-modal";
import FullFilterButton from "@/components/ui/seller-components/tables/Filters/full-filterButton";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";



export default function MyOrders({ externalSearchQuery }: { externalSearchQuery?: string }) {
  const [filters, setFilters] = useState<Record<string, any>>({}); // ✅ never undefined
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const orders = useSelector((state: any) => state.orders.orders);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const totalRows = filteredCount !== null ? filteredCount : (orders?.length || 0);
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, totalRows);
  const PaginationComponent = (totalPages: number) => (
    <div className="w-full px-8 absolute bottom-4 left-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => {
              setCurrentPage(page);
              if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
        </div>
  )
  

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
    if (externalSearchQuery !== undefined && externalSearchQuery !== searchQuery) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  const handleExportPDF = () => {
    if (selectedData.length === 0) return;

    const doc = new jsPDF();
    doc.text("Selected Orders Report", 14, 15);
    
    const tableColumn = ["Order ID", "Date", "Items", "SKU", "Amount", "Status"];
    const tableRows = selectedData.map(order => [
      order.orderId,
      order.date,
      order.items,
      order.sku,
      order.amount,
      order.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`orders_export_${new Date().getTime()}.pdf`);
    
    // Also save to local storage as requested (metadata)
    const exportLog = JSON.parse(localStorage.getItem("pdf_export_history") || "[]");
    exportLog.push({
      date: new Date().toISOString(),
      rowCount: selectedData.length,
      orders: selectedData.map(o => o.orderId)
    });
    localStorage.setItem("pdf_export_history", JSON.stringify(exportLog));
  };

  return (
    <div className="w-full bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-4 lg:px-8 relative pb-20" ref={topRef}>
      <div>
        {/* Mobile Title */}
        {/* Orders Title */}
        <div className="mb-6">
          <p className="text-c18 font-MontserratSemiBold text-000000">Orders</p>
        </div>

        {/* Search & Filters Row */}
        <div className="flex justify-between items-center gap-3 w-full">
          {/* Search Input */}
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by order ID..."
          />

          <div className="flex gap-2 lg:gap-3 relative" ref={dropdownRef}>
            <div className="hidden lg:block">
              <FullFilterButton onOpenFilter={() => setFilterOpen((prev) => !prev)} />
            </div>

            {/* Dropdown Panel */}
            {filterOpen && (
              <div className="absolute top-full right-0 lg:left-0 mt-2 z-50 w-[300px] lg:w-fit">
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

            <button 
              className="w-10 h-10 flex shrink-0 items-center justify-center bg-ff715b rounded-c8 animate-in fade-in zoom-in duration-300 cursor-pointer"
              onClick={handleExportPDF}
              title="Export selected as PDF"
            >
              <Image src={downloadIcon} alt="download" width={10.67} height={10.67} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
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

      {/* Mobile Pagination Info */}
      <div className="flex items-center justify-between mt-6 lg:hidden">
        <p className="text-[10px] sm:text-c12 font-MontserratNormal text-000000/40">
          {totalRows > 0 ? `${startIndex}-${endIndex} of ${totalRows} results` : "0 results"}
        </p>
        <div className="flex items-center gap-2 sm:gap-4">
          <p className="text-[10px] sm:text-c12 font-MontserratNormal text-000000/40">
            Results per page
          </p>
          <FilterDropdown 
            options={Array.from(new Set([4, 8, 12, totalRows]))
              .filter(n => n > 0 && n <= totalRows)
              .sort((a, b) => a - b)
              .map(String)}
            defaultValue={String(rowsPerPage)}
            onChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
            className="w-10 rounded-c8 !py-1 !px-2 text-[10px]"
          />
        </div>
      </div>

      <div className="w-full pt-6 lg:pt-c32 ">
        <OrderFiltered
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          onFilteredCount={setFilteredCount}
          onSelectionChange={setSelectedData}
        />
      </div>

       {totalPages > 1 && (
        <div className="w-full absolute bottom-4 left-0">
          {/* Desktop Pagination */}
          <div className="hidden lg:block px-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => {
                setCurrentPage(page);
                if (topRef.current) {
                   topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
          </div>

          {/* Mobile Pagination */}
          <div className="flex lg:hidden justify-end items-center px-4 gap-4">
            {currentPage > 1 && (
              <button 
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                <ChevronRight size={14} className="rotate-180" /> previous
              </button>
            )}
            {currentPage < totalPages && (
              <button 
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
