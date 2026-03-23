"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";

import FilterDropdown from "../over-view/Filter-components/filterButton";
import { filterOptions } from "../over-view/Filter-components/filterOptions";
import DraftProductDataTable from "../../tables/draft-product-tabe";
import FullFilterButton from "../../tables/Filters/full-filterButton";
import FilterModal from "../../tables/Filters/filter-modal";
import Pagination from "./pignation-button";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import ResultModal from "@/components/ui/forms/resultModal";

export default function DraftProduct() {
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const draft = useSelector((state: RootState) =>state.draft.draft);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();
  const { fetchdDraft } = useFetchProducts();

  const handleDeleteDraft = (id: string) => {
    if (!token) return;
    setDeletingId(id);
    sendHttpRequest({
      requestConfig: {
        url: `/products/manufacturer/drafts/${id}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setDeletingId(null);
        setShowDeleteModal(true);
        fetchdDraft();
      }
    });
  };

  const rowsPerPage = 10;
  const totalRows = filteredCount !== null ? filteredCount : (draft?.length || 0);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // 🔴 optional: close dropdown when clicking outside
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

  return (
    <div className="w-full max-w-250  bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8 relative">
      <p className="text-c18 font-MontserratSemiBold">Products in Draft</p>
      <div className="flex justify-between mt-6">
        <div className="w-full max-w-87.5">
          <SearchInput placeholder="" className="w-full max-w-87.5" />
        </div>
        <div className="flex gap-3 relative" ref={dropdownRef}>
          <FullFilterButton
            onOpenFilter={() => setFilterOpen((prev) => !prev)}
          />

          {/* Dropdown Panel */}
          {filterOpen && (
            <div className="absolute top-full left-0 mt-2 z-50   w-fit">
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

          <button className="w-10 h-10 flex items-center justify-center bg-ff715b rounded-c8">
            <Image
              src={downloadIcon}
              alt="download"
              width={10.67}
              height={10.67}
            />
          </button>
        </div>
      </div>
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {(Object.entries(filters) as [string, any][]).map(([key, value]) => (
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
                <span className="flex items-center gap-1 w-fit justify-center">
                  <Image src={PercentageIcon} alt="%" width={13} height={13} />
                  <span className="flex gap-1">
                    {value.from ?? 0}%
                    <Image
                      src={ArrowRightIcon}
                      alt="TO"
                      width={16}
                      height={16}
                    />
                    {value.to ?? 100}%
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
      <DraftProductDataTable
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        filters={filters}
        onFilteredCount={setFilteredCount}
        onDelete={handleDeleteDraft}
        deletingId={deletingId}
      />

      <div className="w-full mt-c32">
        {totalRows > 10 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}
      </div>

      <ResultModal
        title="Product deleted from draft"
        message="Your product has been deleted from the draft."
        discRescription="Your product has been successfully deleted from the draft."
        buttenText="Ok"
        isOpen={showDeleteModal}
        onConfirm={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
