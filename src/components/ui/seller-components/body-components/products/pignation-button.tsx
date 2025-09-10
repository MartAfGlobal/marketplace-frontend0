"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavRightIcon from "@/assets/Seller/navRight.png";
import NavLeft from "@/assets/Seller/navLeft.png";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  // keep input in sync with external page changes
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 5) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleGoToPage = () => {
    let page = parseInt(inputPage, 10);
    if (!isNaN(page)) {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      onPageChange(page);
      setInputPage(page.toString());
    }
  };

  return (
    <div className="w-full mt-c32">
      <div className="flex justify-between w-full  items-center ">
        <div className="flex gap-2 items-center">
          {getPageNumbers().map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === page
                    ? "bg-[#FF715B] text-white"
                    : "text-000000"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="px-2">
                {page}
              </span>
            )
          )}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded circle-shadow ${
              currentPage === totalPages
                ? "bg-ffffff/60 cursor-not-allowed"
                : "bg-ffffff"
            }`}
          >
            <Image src={NavRightIcon} alt="next" width={6} height={11} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-MontserratNormal">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              className="w-8 h-8 p-0 text-center no-spinner focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-0 border border-ff715b rounded-c2"
            />
            <span>/ {totalPages}</span>
          </div>
          <button
            onClick={handleGoToPage}
            className="h-10 w-10 bg-[#FF715B] flex items-center justify-center text-white rounded-lg"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
