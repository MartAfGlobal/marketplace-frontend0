import Image from "next/image";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";
import { ChevronDown } from "lucide-react";

import FilterDropdown from "./Filter-components/filterButton";
import { filterOptions } from "./Filter-components/filterOptions";
import SellerSearch from "./Filter-components/SellerSearch";

import { useState } from "react";
import CategoryRankingTable from "../../tables/category-ranking-table";
import { useSelector } from "react-redux";

export default function CategoryRanking() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [filterValue, setFilterValue] = useState("Weekly");
  const [currentPage, setCurrentPage] = useState(1);

  const timeFilterOptions = ["Weekly", "Monthly", "Yearly"];

  // This is a mock count for the pagination display
  const filteredDataCount = 16; 
  
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, filteredDataCount);

  return (
    <div className="w-full lg:max-w-137.25 mb-4 lg:mb-6 p-6 lg:px-8 lg:pt-6 bg-ffffff rounded-c16">
      <div className=" mb-6">
        <p className="text-c18 font-MontserratMedium text-000000">Category ranking</p>
      </div>
      <div className=" h-fit  py-5 lg:py-6 pt-0 lg:pt-0">
        <div className="flex justify-between items-center gap-3">
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={isIncomplete}
            placeholder="Search category..."
          />
          
          <div 
            className={` gap-2 lg:gap-3 transition-opacity duration-300 relative flex`}
          >
            <FilterDropdown
              options={timeFilterOptions}
              onChange={(value) => setFilterValue(value)}
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

        {/* Pagination Status Row */}
        <div className="flex items-center justify-between py-3 mt-6   lg:hidden">
          <p className="text-sm  font-MontserratNormal text-000000/40">
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

        <CategoryRankingTable 
          searchQuery={searchQuery} 
          resultsPerPage={resultsPerPage} 
          filterValue={filterValue} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalCount={filteredDataCount}
        />
      </div>
    </div>
  );
}
