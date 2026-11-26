import Image from "next/image";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import FilterDropdown from "./Filter-components/filterButton";
import SellerSearch from "./Filter-components/SellerSearch";

import { useEffect, useState } from "react";
import CategoryRankingTable from "../../tables/category-ranking-table";
import { useSelector } from "react-redux";
import { downloadTableRows } from "@/utils/downloadTableRows";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";

export interface CategoryRankingRow {
  sn: string;
  category: string;
  quantity: number;
}

export default function CategoryRanking() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const token = useSelector((state: RootState) => state.token?.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [filterValue, setFilterValue] = useState("Weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categoryRows, setCategoryRows] = useState<CategoryRankingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendHttpRequest } = useHttp();

  const timeFilterOptions = ["Weekly", "Monthly", "Yearly"];
  const period =
    filterValue === "Monthly" ? "month" : filterValue === "Yearly" ? "year" : "week";
  const filteredDataCount = categoryRows.filter((row) =>
    row.category.toLowerCase().includes(searchQuery.toLowerCase()),
  ).length;
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, filteredDataCount);

  useEffect(() => {
    if (!token) return;

    let isCurrentRequest = true;
    setIsLoading(true);
    sendHttpRequest({
      requestConfig: {
        url: "/products/manufacturer/category-ranking",
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
        params: { period },
      },
      successRes: (response: any) => {
        if (!isCurrentRequest) return;
        const data = response?.data?.data ?? response?.data;
        const responseRows = Array.isArray(data)
          ? data
          : data?.results ??
            data?.items ??
            data?.categories ??
            data?.category_ranking ??
            data?.category_rankings ??
            data?.ranking ??
            data?.data ??
            [];
        const rows = Array.isArray(responseRows) ? responseRows : [];
        setCategoryRows(
          rows.map((row: any, index: number) => ({
            sn: String(row.serial_number ?? row.sn ?? String(index + 1).padStart(4, "0")),
            category:
              typeof row.category === "string"
                ? row.category
                : row.category_name ?? row.category?.name ?? row.name ?? "",
            quantity: Number(
              row.quantity_in_stock ??
                row.stock_quantity ??
                row.in_stock ??
                row.quantity ??
                row.total_stock ??
                  row.stock_count ??
                0,
            ),
          })),
        );
        setIsLoading(false);
      },
      errorRes: (error: unknown) => {
        if (!isCurrentRequest) return;
        setCategoryRows([]);
        setIsLoading(false);
        console.warn(
          "Seller category ranking unavailable:",
          error instanceof Error ? error.message : error,
        );
      },
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [period, sendHttpRequest, token]);

  return (
    <div className="seller-overview-panel w-full lg:max-w-137.25 mb-4 lg:mb-6 p-6 lg:px-8 lg:pt-6 bg-ffffff rounded-c16">
      <div className=" mb-6">
        <p className="text-c18 font-MontserratMedium text-000000">Category ranking</p>
      </div>
      <div className=" h-fit  py-5 lg:py-6 pt-0 lg:pt-0">
        <div className="flex justify-between items-center gap-3">
          <SellerSearch 
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            onToggle={setIsSearchOpen}
            disabled={isIncomplete}
            placeholder="Search category..."
          />
          
          <div 
            className={`gap-2 lg:gap-3 relative ${isSearchOpen ? "hidden lg:flex" : "flex"}`}
          >
            <FilterDropdown
              options={timeFilterOptions}
              defaultValue={filterValue}
              onChange={(value) => {
                setFilterValue(value);
                setCurrentPage(1);
              }}
            />

            <button
              disabled={isIncomplete || categoryRows.length === 0}
              onClick={() => downloadTableRows(categoryRows, "category-ranking")}
              aria-label="Download category ranking"
              className={`w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8 ${
                isIncomplete || categoryRows.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } shrink-0`}
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
                .filter(n => n > 0 && (n <= filteredDataCount || n === resultsPerPage))
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
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rows={categoryRows}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
