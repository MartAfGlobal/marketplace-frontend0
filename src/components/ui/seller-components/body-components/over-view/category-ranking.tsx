import Image from "next/image";
import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchIcon from "@/assets/Seller/searchBtn.svg";

import FilterDropdown from "./Filter-components/filterButton";
import { filterOptions } from "./Filter-components/filterOptions";

import CategoryRankingTable from "../../tables/category-ranking-table";
import { useSelector } from "react-redux";
export default function CategoryRanking() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  return (
    <div className="w-full max-w-137.25 bg-ffffff h-fit  max-h-139.5  circle-shadow rounded-c16 py-6 px-8">
      <p className="text-c18 font-MontserratSemiBold">Category ranking</p>
      <div className="flex justify-between mt-6">
        <button
          disabled={isIncomplete}
          className={`flex items-center justify-center bg-ffffff rounded-c8 circle-shadow h-10 w-10  ${
            isIncomplete ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <Image src={SearchIcon} height={13.01} width={13.01} alt="search" />
        </button>
        <div className="flex gap-3">
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
      <CategoryRankingTable />
    </div>
  );
}
