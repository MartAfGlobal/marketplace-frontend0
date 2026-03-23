"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";

import downloadIcon from "@/assets/Seller/downloadIcon.svg";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import productIcon from "@/assets/icons/productBox.svg";
import FilterDropdown from "../over-view/Filter-components/filterButton";
import { filterOptions } from "../over-view/Filter-components/filterOptions";
import InventoryFullTable from "../../tables/inventory-full-table";
import Pagination from "./pignation-button";
import FullFilterButton from "../../tables/Filters/full-filterButton";
import FilterModal from "../../tables/Filters/filter-modal";
import uploadIcon from "@/assets/icons/uploadIcon.svg";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { setStep1Data } from "@/store/sellers/addProductSlice";
import ResultModal from "@/components/ui/forms/resultModal";

export default function ProductInventoryPage() {
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
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

  const rowsPerPage = 10;
  const totalRows = filteredCount !== null ? filteredCount : (product?.length || 0);
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
    <div className="w-full  bg-ffffff  circle-shadow rounded-c16 py-6 px-8 relative">
      <div className="w-full h-58 flex gap-39 ">
        <div className="space-y-c48">
          <div className="flex gap-2.5 items-end">
            <div className="h-8">
              <Image
                src={productIcon}
                height={20.99}
                width={19.5}
                className="flex-shrink-0"
                alt="products"
              />
            </div>

            <div className="flex-col gap-3">
              <p className="font-MontserratNormal text-base text-left ">
                Products available
              </p>
              <p className="text-c32 font-MontserratSemiBold">
                {product?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-c64">
            <div className="flex gap-2.5 items-end">
              <div className="h-8">
                <Image
                  src={productIcon}
                  height={20.99}
                  width={19.5}
                  className="flex-shrink-0"
                  alt="products"
                />
              </div>

              <div className="flex-col gap-2">
                <p className="font-MontserratNormal text-base text-left">
                  Live products
                </p>
                <p className="text-c20 font-MontserratSemiBold text-2d7565">
                  {liveproduct?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 items-end">
              <div className="h-8">
                <Image
                  src={productIcon}
                  height={20.99}
                  width={19.5}
                  className="flex-shrink-0"
                  alt="products"
                />
              </div>

              <div className="flex-col gap-2">
                <p className="font-MontserratNormal text-base text-left">
                  Inactive products
                </p>
                <p className="text-c20 font-MontserratSemiBold text-2d7565">
                  {inactiveproduct?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 items-end">
              <div className="h-8 flex-shrink-0">
                <Image
                  src={productIcon}
                  height={20.99}
                  width={19.5}
                  className="flex-shrink-0"
                  alt="products"
                />
              </div>

              <div className="flex-col gap-2">
                <p className="font-MontserratNormal text-base text-left">
                  Drafts
                </p>
                <p className="text-c20 font-MontserratSemiBold text-2d7565">
                  {draft?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-base text-left font-MontserratNormal">
            Quick links
          </p>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={handleAddNewProduct}
              className="mt-6 rounded-c8 w-full hover:text-ffffff hover:bg-ff715b   py-2 px-3 "
            >
              <div className="flex gap-2.5 ">
                <div className="h-5">
                  <Image
                    src={productIcon}
                    height={16.25}
                    width={17.5}
                    className="flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2 ">
                  <p className="font-MontserratSemiBold text-base text-left">
                    Create new live product
                  </p>
                  <p className="text-c12 text-left font-MontserratNormal ">
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
              className="mt-6 rounded-c8 w-full hover:text-ffffff hover:bg-ff715b   py-2 px-3 "
            >
              <div className="flex gap-2.5 ">
                <div className="h-5">
                  <Image
                    src={uploadIcon}
                    height={16.25}
                    width={17.5}
                    className="flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2 text-left">
                  <p className="font-MontserratSemiBold text-base text-left ">
                    Create new product draft
                  </p>
                  <p className="text-c12 text-left font-MontserratNormal ">
                    add a new product to your drafts
                  </p>
                </div>
              </div>
            </button>
          </div>
          <div className="flex gap-6">
            <button className="mt-6 rounded-c8 w-full hover:text-ffffff hover:bg-ff715b   py-2 px-3 ">
              <div className="flex gap-2.5 ">
                <div className="h-5">
                  <Image
                    src={uploadIcon}
                    height={16.25}
                    width={17.5}
                    className="flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2 ">
                  <p className="font-MontserratSemiBold text-base text-left">
                    Upload bulk products
                  </p>
                  <p className="text-c12 text-left font-MontserratNormal ">
                    Upload multiple products using our template
                  </p>
                </div>
              </div>
            </button>
            <button className="mt-6 rounded-c8 w-full hover:text-ffffff hover:bg-ff715b   py-2 px-3 ">
              <div className="flex gap-2.5 ">
                <div className="h-5">
                  <Image
                    src={productIcon}
                    height={16.25}
                    width={17.5}
                    className="flex-shrink-0"
                    alt="products"
                  />
                </div>

                <div className="flex-col gap-2 text-left">
                  <p className="font-MontserratSemiBold text-base text-left  ">
                    Request for product review
                  </p>
                  <p className="text-c12 text-left font-MontserratNormal ">
                    Request for a product review for inactive products
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full border border-000000/10 my-c48" />
      <p className="text-c18 font-MontserratSemiBold">Products Inventory</p>
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

          {/* Extra filters */}
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
      <InventoryFullTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        filters={filters}
        onFilteredCount={setFilteredCount}
        onToggleActive={handleToggleActive}
        togglingId={togglingId}
      />

      <div className="w-full  pt-13 ">
        <div className="w-full left-0 px-c32 absolute bottom-4 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
  );
}
