"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";

import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SellerSearch from "../over-view/Filter-components/SellerSearch";
import productIcon from "@/assets/icons/productBox.svg";
import FilterDropdown from "../over-view/Filter-components/filterButton";
import { filterOptions } from "../over-view/Filter-components/filterOptions";
import InventoryFullTable from "../../tables/inventory-full-table";
import DraftProductDataTable from "../../tables/draft-product-tabe";
import Pagination from "./pignation-button";
import FullFilterButton from "../../tables/Filters/full-filterButton";
import FilterModal from "../../tables/Filters/filter-modal";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { setStep1Data } from "@/store/sellers/addProductSlice";
import ResultModal from "@/components/ui/forms/resultModal";
import { ChevronRight, PackagePlus, FileText, Package, FileUp } from "lucide-react";

export default function ProductInventoryPage() {
  const [filters, setFilters] = useState<any>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();
  const { fetchProducts } = useFetchProducts();

  const handleToggleActive = (id: string, isActive: boolean) => {
    if (!token) return;
    setTogglingId(id);
    const url = isActive
      ? `/products/manufacturer/products/${id}/request-deactivation/`
      : `/products/manufacturer/products/${id}/request-activation/`;
      
    sendHttpRequest({
      requestConfig: {
        url,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setTogglingId(null);
        setShowToggleModal(true);
        fetchProducts(); // refresh the list
      }
    });
  };

  const product = useSelector(
    (state: RootState) => state.sellerProduct.product,
  );
  const draft = useSelector((state: RootState) => state.draft.draft);

  const liveproduct = product?.filter((prod: any) => prod.is_active === true);
  const inactiveproduct = product?.filter((prod: any) => prod.is_active === false);

  const router = useRouter();
  const handleAddNewProduct = () => {
    dispatch(
      setStep1Data({
        id: "",

        attributes: [],
      }),
    );

    router.push("/dashboard/seller/products/add-product");
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
  const [currentDraftPage, setCurrentDraftPage] = useState(1);
  const [draftFilteredCount, setDraftFilteredCount] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
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

  const [resultsPerPage, setResultsPerPage] = useState(10);
  const totalDraftRowsCount = draftFilteredCount !== null ? draftFilteredCount : (draft?.length || 0);
  const totalDraftPages = Math.ceil(totalDraftRowsCount / resultsPerPage);

  const totalRowsCount = filteredCount !== null ? filteredCount : (product?.length || 0);
  const totalPages = Math.ceil(totalRowsCount / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, totalRowsCount);

  return (
    <div className="w-full flex flex-col gap-12 lg:gap-16 pb-20">
      {/* Inventory Section */}
      <div className="w-full md:bg-ffffff md:circle-shadow md:rounded-c16 lg:py-6 lg:px-8 relative" ref={topRef}>
        <div className="w-full lg:h-58 flex flex-col gap-6 lg:flex-row lg:justify-between ">
          <div className="space-y-c48 bg-ffffff py-8 px-6 rounded-c16 lg:rounded-none w-full">
            <div className="flex gap-4 lg:gap-2.5 items-end">
              <div className="h-8">
                <Image
                  src={productIcon}
                  height={20.99}
                  width={19.5}
                  className= " flex-shrink-0"
                  alt="products"
                />
              </div>

              <div className="flex-col gap-2 lg:gap-3">
                <p className="font-MontserratNormal text-sm md:text-base text-left ">
                  Products available
                </p>
                <p className="lg:text-c32 text-c24 font-MontserratSemiBold">
                  {product?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex lg:gap-c64 gap-4 h-fit">
              <div className="flex gap-2.5 items-end">
                <div className="h-8">
                  <Image
                    src={productIcon}
                    height={20.99}
                    width={19.5}
                    className= "hidden md:block flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2">
                  <p className="font-MontserratNormal text-c12 lg:text-base text-left">
                    Live products
                  </p>
                  <p className="text-c20 font-MontserratSemiBold text-2d7565">
                    {liveproduct?.length || 0}
                  </p>
                </div>
              </div>
              <div className="border border-000000/12 lg:hidden" />
              <div className="flex gap-2.5 items-end h-full">
                <div className="h-8">
                  <Image
                    src={productIcon}
                    height={20.99}
                    width={19.5}
                    className= "hidden md:block flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2">
                  <p className="font-MontserratNormal text-c12 lg:text-base text-left">
                    Inactive products
                  </p>
                  <p className="text-c20 font-MontserratSemiBold text-2d7565">
                    {inactiveproduct?.length || 0}
                  </p>
                </div>
              </div>
              <div className="border border-000000/12 lg:hidden" />
              <div className="flex gap-2.5 items-end">
                <div className="h-8  hidden md:block flex-shrink-0">
                  <Image
                    src={productIcon}
                    height={20.99}
                    width={19.5}
                    className= "hidden md:block flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2">
                  <p className="font-MontserratNormal text-c12 text-base text-left">
                    Drafts
                  </p>
                  <p className="text-c20 font-MontserratSemiBold text-2d7565">
                    {draft?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className =" lg:py-4 lg:px-4 rounded-c16 lg:rounded-none w-full">
            <p className="text-base text-left font-MontserratNormal">
              Quick links
            </p>
            <div className="flex justify-center gap-3 lg:gap-6">
              <button
                type="button"
                onClick={handleAddNewProduct}
                className="group mt-4 lg:mt-6 rounded-c8 w-full text-000000 hover:text-ffffff hover:bg-ff715b py-3 px-4 lg:py-2 lg:px-3 bg-ffffff lg:border-0 lg:bg-transparent border border-ff715b  transition-colors duration-200"
              >
                <div className="flex gap-2.5 ">
                  <div className="h-5">
                    <PackagePlus size={20} className= "hidden md:block flex-shrink-0 text-000000 group-hover:text-ffffff transition-colors"/>
                  </div>

                  <div className="flex-col gap-2 ">
                    <p className="font-MontserratSemiBold text-sm text-ff715b lg:text-000000 group-hover:text-ffffff lg:text-nowrap lg:text-base text-left transition-colors">
                      Create new live product
                    </p>
                    <p className="text-c12 text-left hidden md:block font-MontserratNormal group-hover:text-ffffff/80 transition-colors">
                      add a new product to live
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={() =>
                  router.push(
                    "/dashboard/seller/products/add-product/add-to-draft",
                  )
                }
                className="group mt-4 lg:mt-6 rounded-c8 w-full text-000000 hover:text-ffffff hover:bg-ff715b py-3 px-4 lg:py-2 lg:px-3 bg-ffffff lg:border-0 lg:bg-transparent border border-ff715b  transition-colors duration-200"
              >
                <div className="flex gap-2.5 ">
                  <div className="h-5">
                    <FileText size={20} className= "hidden md:block flex-shrink-0 text-000000 group-hover:text-ffffff transition-colors" />
                  </div>

                  <div className="flex-col gap-2 text-left ">
                    <p className="font-MontserratSemiBold text-sm text-ff715b lg:text-000000 group-hover:text-ffffff lg:text-base text-left lg:text-nowrap transition-colors">
                      Create new product draft
                    </p>
                    <p className="text-c12 text-left hidden md:block font-MontserratNormal group-hover:text-ffffff/80 transition-colors">
                      add a new product to your drafts
                    </p>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-center gap-3 lg:gap-6">
              <button className="group mt-4 lg:mt-6 rounded-c8 w-full text-000000 hover:text-ffffff hover:bg-ff715b py-3 px-4 lg:py-2 lg:px-3 bg-ffffff lg:border-0 lg:bg-transparent border border-ff715b  transition-colors duration-200">
                <div className="flex gap-2.5 ">
                  <div className="h-5">
                    <FileText size={20} className= "hidden md:block flex-shrink-0 text-000000 group-hover:text-ffffff transition-colors" />
                  </div>

                  <div className="flex-col gap-2 ">
                    <p className="font-MontserratSemiBold text-sm text-ff715b lg:text-000000 group-hover:text-ffffff lg:text-base text-left lg:text-nowrap transition-colors">
                      Upload bulk products
                    </p>
                    <p className="text-c12 hidden md:block text-left font-MontserratNormal group-hover:text-ffffff/80 transition-colors">
                      Upload multiple products using our template
                    </p>
                  </div>
                </div>
              </button>
              <button className="group mt-4 lg:mt-6 rounded-c8 w-full text-000000 hover:text-ffffff hover:bg-ff715b py-3 px-4 lg:py-2 lg:px-3 bg-ffffff lg:border-0 lg:bg-transparent border border-ff715b  transition-colors duration-200">
                <div className="flex gap-2.5 ">
                  <div className="h-5">
                    <Package size={20} className= "hidden md:block flex-shrink-0 text-000000 group-hover:text-ffffff transition-colors" />
                  </div>

                  <div className="flex-col gap-2 text-left">
                    <p className="font-MontserratSemiBold text-sm text-ff715b lg:text-000000 group-hover:text-ffffff lg:text-base text-left lg:text-nowrap transition-colors">
                      Request for product review
                    </p>
                    <p className="text-c12 hidden md:block text-left font-MontserratNormal group-hover:text-ffffff/80 transition-colors">
                      Request for a product review for inactive products
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full border hidden lg:block border-000000/10 my-c48" />
        
        <div className="bg-ffffff mt-6 lg:mt-0 p-6 lg:p-0 rounded-c16 lg:rounded-none">
          <p className="text-c18 font-MontserratSemiBold">Products Inventory</p>
          <div className="flex justify-between mt-6">
            <div className="w-full max-w-87.5">
              <SellerSearch 
                value={filters.sku || ""}
                onChange={(val) => setFilters((prev: any) => ({ ...prev, sku: val }))}
                onToggle={setIsSearchOpen}
                placeholder="Search products..."
              />
            </div>

            <div className={`flex gap-3 relative ${isSearchOpen ? "hidden md:flex" : "flex"}`} ref={dropdownRef}>
              <FullFilterButton
                onOpenFilter={() => setFilterOpen((prev: boolean) => !prev)}
              />

              {/* Dropdown Panel */}
              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 w-fit">
                  <FilterModal
                    onFiltersChange={(newFilters) => setFilters(newFilters)}
                    onClose={() => setFilterOpen(false)}
                  />
                </div>
              )}

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

          {/* Pagination Status Row (Mobile Only) */}
          <div className="flex items-center justify-between mt-6 md:hidden">
            <p className="text-sm font-MontserratNormal text-000000/40">
              {startIndex}-{endIndex} of {totalRowsCount} results
            </p>
            <div className="flex items-center gap-3">
              <p className="text-sm font-MontserratNormal text-000000/40">
                Results per page
              </p>
              <FilterDropdown 
                options={["4", "8", "10", "15", "20"]}
                defaultValue={String(resultsPerPage)}
                onChange={(value) => {
                  setResultsPerPage(Number(value));
                  setCurrentPage(1);
                }}
                className="w-10 rounded-c8"
              />
            </div>
          </div>

          <InventoryFullTable
            currentPage={currentPage}
            rowsPerPage={resultsPerPage}
            filters={filters}
            onFilteredCount={setFilteredCount}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
          />

          {/* Desktop Pagination */}
          <div className="hidden md:block w-full pt-13">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                if (topRef.current) {
                  topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>

          {/* Mobile Pagination (Next/Previous) */}
          <div className="flex justify-end items-center mt-6 gap-4 md:hidden">
            {currentPage > 1 && (
              <button 
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                <ChevronRight size={14} className="rotate-180" /> previous
              </button>
            )}
            {totalRowsCount > currentPage * resultsPerPage && (
              <button 
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        <ResultModal
          title="Status Updated Successfully"
          message="The product status update request was submitted successfully."
          discRescription="Your action has been processed."
          buttenText="Got it"
          isOpen={showToggleModal}
          onConfirm={() => setShowToggleModal(false)}
        />
      </div>

      {/* Drafts Section */}
      <div className="w-full md:bg-ffffff md:circle-shadow md:rounded-c16 lg:py-6 lg:px-8">
        <div className="bg-ffffff p-6 lg:p-0 rounded-c16 lg:rounded-none">
          <p className="text-c18 font-MontserratSemiBold">Products in Draft</p>
          
          <div className="flex items-center justify-between mt-6 md:hidden">
            <p className="text-sm font-MontserratNormal text-000000/40">
              {Math.min((currentDraftPage - 1) * resultsPerPage + 1, totalDraftRowsCount)}-{Math.min(currentDraftPage * resultsPerPage, totalDraftRowsCount)} of {totalDraftRowsCount} results
            </p>
            <div className="flex items-center gap-3">
              <p className="text-sm font-MontserratNormal text-000000/40">
                Results per page
              </p>
              <FilterDropdown 
                options={["4", "8", "10", "15", "20"]}
                defaultValue={String(resultsPerPage)}
                onChange={(value) => {
                  setResultsPerPage(Number(value));
                  setCurrentDraftPage(1);
                }}
                className="w-10 rounded-c8"
              />
            </div>
          </div>

          <DraftProductDataTable
            rowsPerPage={resultsPerPage}
            currentPage={currentDraftPage}
            filters={filters} // Sharing same filters for now
            onFilteredCount={setDraftFilteredCount}
            onDelete={handleDeleteDraft}
            deletingId={deletingId}
          />

          {/* Desktop Pagination */}
          <div className="hidden md:block w-full pt-13">
            <Pagination
              currentPage={currentDraftPage}
              totalPages={totalDraftPages}
              onPageChange={(page) => setCurrentDraftPage(page)}
            />
          </div>

          {/* Mobile Pagination (Next/Previous) */}
          <div className="flex justify-end items-center mt-6 gap-4 md:hidden">
            {currentDraftPage > 1 && (
              <button 
                onClick={() => setCurrentDraftPage(currentDraftPage - 1)}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                <ChevronRight size={14} className="rotate-180" /> previous
              </button>
            )}
            {totalDraftRowsCount > currentDraftPage * resultsPerPage && (
              <button 
                onClick={() => setCurrentDraftPage(currentDraftPage + 1)}
                className="text-ff715b text-xs font-MontserratBold flex items-center gap-1"
              >
                next <ChevronRight size={14} />
              </button>
            )}
          </div>
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
    </div>
  );
}
