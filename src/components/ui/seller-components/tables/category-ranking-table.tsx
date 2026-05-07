import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import { useSelector } from "react-redux";
import Empty from "@/assets/Seller/Empty.svg";
import { ChevronRight } from "lucide-react";

const CATEGORY_DATA = [
  { sn: "0021", category: "Fashion & Shoes", quantity: 120 },
  { sn: "0022", category: "Electronics", quantity: 70 },
  { sn: "0023", category: "Foodstuff", quantity: 50 },
  { sn: "0024", category: "Accessories", quantity: 20 },
  { sn: "0025", category: "Home & Garden", quantity: 15 },
  { sn: "0026", category: "Sports", quantity: 10 },
  { sn: "0027", category: "Beauty", quantity: 5 },
];

interface CategoryRankingTableProps {
  searchQuery?: string;
  resultsPerPage?: number;
  filterValue?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
}

export default function CategoryRankingTable({
  searchQuery = "",
  resultsPerPage = 4,
  filterValue = "Weekly",
  currentPage = 1,
  onPageChange,
}: CategoryRankingTableProps) {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);

  const filteredData = CATEGORY_DATA.filter((item) =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Apply results per page slicing based on current page
  const startIndex = (currentPage - 1) * resultsPerPage;
  const displayedData = filteredData.slice(startIndex, startIndex + resultsPerPage);

  const handleNext = () => {
    if (currentPage * resultsPerPage < filteredData.length) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <div className="mt-c32 w-full">
      {/* Mobile View */}
      <div className="lg:hidden  flex flex-col gap-2">
        {isIncomplete ? (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <Image src={Empty} height={18} width={18} alt="empty" />
            <p className="text-base font-MontserratNormal text-000000/10">
              No data available
            </p>
          </div>
        ) : displayedData.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <p className="text-base font-MontserratNormal text-000000/40">
              No categories found
            </p>
          </div>
        ) : (
          <>
            {displayedData.map((item, index) => (
              <div
                key={index}
                className="py-3 flex flex-col gap-3 justify-center  px-4  border-b border-gray-100  last:border-0"
              >
                <div className="">
                  <span className="font-MontserratBold text-sm text-000000">
                    {item.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-c12 text-0000000 font-MontserratNormal">
                    Quantity
                  </span>
                  <span className="font-MontserratBold text-xs text-000000">
                    {item.quantity}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-end items-center mt-4 gap-4">
              {currentPage > 1 && (
                <button 
                  onClick={() => onPageChange?.(currentPage - 1)}
                  className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
                >
                  <ChevronRight size={14} className="rotate-180" /> previous
                </button>
              )}
              {filteredData.length > currentPage * resultsPerPage && (
                <button 
                  onClick={handleNext}
                  className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
                >
                  next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Desktop View */}
      <table className="hidden lg:table w-full">
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff w-full h-12 md:text-nowrap">
          <tr>
            <th className="px-4 text-center w-21">s/n</th>
            <th className="px-4 w-66 text-left">Category</th>
            <th className="px-4 w-33.5">Q. in stock</th>
            <th></th>
          </tr>
        </thead>
        {isIncomplete ? (
          <tbody>
            <tr className="h-64.5 ">
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 text-sm"
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={18} width={18} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/10">
                    No data available
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        ) : displayedData.length === 0 ? (
          <tbody>
            <tr className="h-c48">
              <td
                colSpan={4}
                className="text-center py-10 text-gray-400 font-MontserratNormal"
              >
                No matching categories found
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {displayedData.map((item, index) => (
              <tr
                key={index}
                className="h-c48 border-b text-sm font-MontserratNormal border-b-000000/10"
              >
                <td className="px-4 text-center">{item.sn}</td>
                <td className="px-6">{item.category}</td>
                <td className="px-4 text-center">{item.quantity}</td>
                <td>
                  <button className="w-6 h-6 flex-shrink-0">
                    <Image
                      src={HandBug}
                      alt="side button"
                      width={24}
                      height={24}
                      className=" flex-shrink-0"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      
      {/* Shared Pagination Controls for Desktop (Mobile already handled) */}
      <div className="hidden lg:flex justify-end items-center mt-6 gap-4">
        {currentPage > 1 && (
          <button 
            onClick={() => onPageChange?.(currentPage - 1)}
            className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
          >
            <ChevronRight size={14} className="rotate-180" /> previous
          </button>
        )}
        {filteredData.length > currentPage * resultsPerPage && (
          <button 
            onClick={handleNext}
            className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
          >
            next <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
