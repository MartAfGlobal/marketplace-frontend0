"use client";

import Image from "next/image";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import DeleteIcon from "@/assets/Seller/Trash.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";
import Pagination from "../../../products/pignation-button";
import { useSelector } from "react-redux";

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
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const orders = useSelector((state: any) => state.orders.orders);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const rowsPerPage = 10;
  const totalRows = filteredCount !== null ? filteredCount : (orders?.length || 0);
  const totalPages = Math.ceil(totalRows / rowsPerPage);
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
    <div className="w-full bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-4 md:px-8 relative pb-20" ref={topRef}>
      <div>
        <p className="text-c18 font-MontserratSemiBold hidden md:block">Orders</p>
        <div className="flex flex-col-reverse md:flex-row justify-between mt-6 gap-4 md:gap-0">
          <div className="hidden md:block w-full md:w-auto">
            <SellerSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by order ID, items, date..."
              alwaysOpen={true}
            />
          </div>
          <div className="flex justify-between items-center w-full md:w-auto gap-4">
            <p className="text-c18 font-MontserratSemiBold hidden">Orders</p>
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

              {selectedData.length > 0 && (
                <button 
                  className="w-10 h-10 flex items-center justify-center border border-ff715b rounded-c8 bg-ff715b/10 animate-in fade-in zoom-in duration-300"
                  onClick={handleExportPDF}
                  title="Export selected as PDF"
                >
                  <Image src={downloadIcon} alt="download" width={16} height={16} />
                </button>
              )}
              {/* <button className="w-10 h-10 flex items-center justify-center border border-ff715b rounded-c8">
                <Image src={DeleteIcon} alt="delete" width={16} height={16} />
              </button> */}
            </div>
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

      <div className="w-full pt-c32 ">
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
        <div className="w-full px-8 absolute bottom-4 left-0">
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
      )}
    </div>
  );
}
