"use client";

import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavButton from "@/assets/icons/thickNav.svg";
import SizeGuideModal from "../Modals/sizeGuideModal";
import { VariationOption } from "@/types/global";
import { motion, AnimatePresence } from "framer-motion";
import Heart from "@/assets/icons/heart.svg";
import Share from "@/assets/icons/share.svg";
import { Button } from "../Button/Button";
import ItemAddToCart from "../ItemAddToCart";
import ProductNav from "../navigation/ProductNavView";
import MoreDetailedPage from "./MoreDetailedPage";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";
import Location from "@/assets/mobile/MapPinArea.png";
import phone from "@/assets/mobile/Phone.png";
import CartBtn from "@/assets/mobile/cart.png";
import CartButton from "../cart/cartButton";
import AdSlider from "@/components/Ads";
import { useHttp } from "@/hooks/use-http";

import { setsubCategoryProducts } from "@/store/user-data/products/subCategoryProductsSlice";
import ProductSection from "../landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import ProductDetailCategory from "../mobile/product-detail.categories";
import { setSelectedVariation as setSelectedVariationAction } from "@/store/slices/variationSelectorSlice";



type ProductVariationProp = {
  isModal: boolean;
  selectedVariaton?:string
};

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#0080FF",
  red: "#D32F2F",
  green: "#2E7D32",
  brown: "#5D4037",
  yellow: "#FBC02D",
  orange: "#F57C00",
  purple: "#7B1FA2",
  pink: "#E91E63",
  gray: "#757575",
  grey: "#757575",
  beige: "#F5F5DC",
  navy: "#000080",
  cream: "#FFFDD0",
  gold: "#FFD700",
  silver: "#C0C0C0",
  maroon: "#800000",
  teal: "#008080",
  olive: "#808000",
};

const getColorHex = (value: string, extraData?: Record<string, string>): string => {
  if (extraData?.hex_code) return extraData.hex_code;
  if (extraData?.hex) return extraData.hex;
  if (extraData?.color) return extraData.color;
  if (value.startsWith("#")) return value;
  const normalized = value.toLowerCase().trim();
  return COLOR_MAP[normalized] || normalized;
};

export default function ProductVariation({
  isModal = true,
  selectedVariaton
}: ProductVariationProp) {
  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );
const variationSectionRef = useRef<HTMLDivElement | null>(null);

  const detailsContainerRef = useRef<HTMLDivElement | null>(null);
  const attributePanelRef = useRef<HTMLDivElement | null>(null);

  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = productDetails?.images || [];

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [error, setError] = useState("");
 

  const [openAttribute, setOpenAttribute] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});


  const [missingAttribute, setMissingAttribute] = useState<string | null>(null);
  const [hasTriedAddToCart, setHasTriedAddToCart] = useState(false);
  const hasSelectedAttributes = Object.values(selectedAttributes).some(
    (value) => value !== ""
  );
  const subCategory = useSelector(
    (state: RootState) => state.subCategoryProducts.items
  );
  
const dispatch = useDispatch() as AppDispatch;


  const [pendingRequests, setPendingRequests] = useState(2); // 2 API calls
  const { sendHttpRequest } = useHttp();

  const subCategorySlug = productDetails?.category?.subcategory?.slug;

  /* ---------------- SCROLL TO VARIATIONS ---------------- */
  const scrollToVariations = () => {
    setTimeout(() => {
      const container = detailsContainerRef.current;
      const section = variationSectionRef.current;
      if (!section) return;

      if (container && isModal) {
        const containerRect = container.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();

        container.scrollTo({
          top: container.scrollTop + (sectionRect.top - containerRect.top) - 24,
          behavior: "smooth",
        });
      } else {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  };

  /* ---------------- SCROLL TO OPEN PANEL ---------------- */
  const scrollToPanel = () => {
    setTimeout(() => {
      const container = detailsContainerRef.current;
      const panel = attributePanelRef.current;
      if (!container || !panel) return;

      const containerRect = container.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      container.scrollTo({
        top: container.scrollTop + (panelRect.top - containerRect.top) - 24,
        behavior: "smooth",
      });
    }, 80);
  };

  useEffect(() => {
    if (!selectedVariaton || !productDetails?.variations) return;

    // Find the variation that matches the given ID
    const match = productDetails.variations.find(
      (v) =>
        String(v.id) === String(selectedVariaton) ||
        String((v as any).variation_id) === String(selectedVariaton)
    );

    if (!match) return;

    // Set the selected attributes
    setSelectedAttributes({ ...match.attribute_summary });

    // Set the selected variation
    setSelectedVariation(match);

    // Scroll to variation section if needed
    scrollToVariations();
  }, [selectedVariaton, productDetails]);

  useEffect(() => {
    if (!subCategorySlug) return;

    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?subcategory=${subCategorySlug}&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        try {
          const products = res?.data?.results ?? [];
          dispatch(setsubCategoryProducts(products));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch category data.");
        } finally {
          setPendingRequests((prev) => prev - 1);
        }
      },
    });
  }, [subCategorySlug, dispatch, sendHttpRequest]);

  /* ---------------- DEFAULT IMAGE ---------------- */
  useEffect(() => {
    if (images.length) {
      setSelectedImageId(images[0].id);
      setActiveSlide(0);
    }
  }, [images]);

  useEffect(() => {
    if (openAttribute) scrollToPanel();
  }, [openAttribute]);

  /* ---------------- VARIATION MATCHING ---------------- */
  useEffect(() => {
    if (!productDetails?.variations?.length) return;

    const attributes = Object.keys(productDetails.variation_options || {});
    const isComplete = attributes.every((attr) => selectedAttributes[attr]);

    if (!isComplete) {
      setSelectedVariation(null);
      return;
    }

    const match = productDetails.variations.find((v) =>
      Object.entries(v.attribute_summary).every(
        ([attr, val]) => selectedAttributes[attr] === val
      )
    );

    setSelectedVariation(match || null);
  }, [selectedAttributes, productDetails]);

  /* ---------------- AUTO MOVE TO NEXT ATTRIBUTE ---------------- */
  useEffect(() => {
    if (!hasTriedAddToCart) return;

    const attributes = Object.keys(productDetails?.variation_options || {});
    const nextMissing = attributes.find((attr) => !selectedAttributes[attr]);

    if (nextMissing) {
      setMissingAttribute(nextMissing);
      setOpenAttribute(nextMissing);
    } else {
      setMissingAttribute(null);
    }
  }, [selectedAttributes, hasTriedAddToCart, productDetails]);

  /* ---------------- AVAILABLE VALUES ---------------- */
  const getAvailableValues = (attributeName: string) => {
    if (!productDetails?.variations) return [];

    return productDetails.variations
      .filter((v) =>
        Object.entries(selectedAttributes).every(([attr, val]) => {
          if (attr === attributeName) return true;
          return v.attribute_summary[attr] === val;
        })
      )
      .map((v) => v.attribute_summary[attributeName])
      .filter((v, i, a) => a.indexOf(v) === i);
  };

  /* ---------------- ADD TO CART HANDLER ---------------- */
  const handleIncompleteVariation = () => {
    const hasVars = productDetails?.has_variations || (productDetails?.variations && productDetails.variations.length > 0);
    if (!hasVars) return;

    setHasTriedAddToCart(true);

    const attributes = Object.keys(productDetails.variation_options || {});
    const firstMissing = attributes.find((attr) => !selectedAttributes[attr]);

 

    if (!firstMissing) return;

    setMissingAttribute(firstMissing);
    setOpenAttribute(firstMissing);

      scrollToVariations();
  };

  /* ── Image Helpers ── */
  const getImageUrl = (img: any): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return (
      img.large ||
      img.medium ||
      img.image ||
      img.url ||
      img.thumbnail ||
      ""
    );
  };

  const getThumbUrl = (thumb: any): string => {
    if (!thumb) return "";
    if (typeof thumb === "string") return thumb;
    return (
      thumb.thumbnail ||
      thumb.medium ||
      thumb.image ||
      thumb.url ||
      thumb.large ||
      ""
    );
  };

  const fallbackProductImage =
    (productDetails as any)?.thumbnail ||
    (productDetails as any)?.image ||
    (productDetails as any)?.cover_image ||
    productDetails?.main_image ||
    (Array.isArray(productDetails?.images) && productDetails.images.length > 0
      ? getImageUrl(productDetails.images[0])
      : "") ||
    "/placeholder.png";

  const selectedImage = images.find(
    (img: any) =>
      (typeof img === "object" ? img?.id === selectedImageId : img === selectedImageId)
  );

  const mainImageSrc = getImageUrl(selectedImage) || fallbackProductImage;

  return (
    <div
      className={`flex w-full gap-6 md:gap-8 lg:justify-between flex-col md:flex-row justify-center  ${
        !isModal ? "mt-c32" : "mt-0"
      }`}
    >
      <div className="md:flex-1 w-full   space-y-c32  min-w-0" >
        <div className={`w-full flex md:flex-row gap-6  md:gap-8 xl:gap-c48 flex-col h-fit relative    ${
              isModal ? "h-fit" : "border-b border-b-000000/12 pb-[5.65px] "}`}>
          {/* IMAGES */}
          <div
            className={`w-full md:max-w-[280px] lg:max-w-[320px] xl:max-w-[397px]    flex-shrink-0 ${
              isModal ? "h-fit  overflow-visible " : "h-fit"
            }`}
          >
            <div className="relative w-full  overflow-hidden bg-ffffff flex items-center justify-center">
              <Image
                src={mainImageSrc}
                alt={productDetails?.name || "Product image"}
                height={410}
                width={397}
                priority={true}
                className={`w-full object-cover md:max-w-full lg:max-w-[320px] xl:max-w-92.25  ${
                  isModal ? "h-70" : "h-92.25"
                }`}
              />
            </div>

            {images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {images.map((img: any, i: number) => {
                  const imgId = typeof img === "object" ? img?.id : img;
                  return (
                    <button
                      key={imgId || i}
                      onMouseEnter={() => {
                        setSelectedImageId(imgId);
                        setActiveSlide(i);
                      }}
                      className={`h-1 rounded-full transition-all ${
                        activeSlide === i
                          ? "w-c117 bg-gray-700"
                          : "w-c40 bg-gray-300"
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-4 mt-6 mb-4 h-19  w-full overflow-x-auto  hcustom-scroll">
                {images.map((thumb: any, index: number) => {
                  const thumbId = typeof thumb === "object" ? thumb?.id : thumb;
                  const thumbSrc = getThumbUrl(thumb) || "/placeholder.png";
                  return (
                    <button
                      key={thumbId || index}
                      onMouseEnter={() => {
                        setSelectedImageId(thumbId);
                        setActiveSlide(index);
                      }}
                      className={`w-c66-81 h-17 flex-shrink-0 border-2 rounded-c12 overflow-hidden ${
                        activeSlide === index
                          ? "my-gradient-border"
                          : "border-transparent"
                      } transition-all duration-200`}
                    >
                      <Image
                        src={thumbSrc}
                        alt={thumb?.alt_text || "Thumbnail"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div
            ref={detailsContainerRef}
            className={`w-full min-w-0   relative ${
              isModal ? "h-fit  w-full overflow-y-auto no-scrollbar" : ""
            }`}
          >
            <div className="flex justify-between">
              <h1 className="font-MontserratMedium text-base mb-3">
                {productDetails?.name}
              </h1>
              <div className="md:hidden flex gap-c19 md:mt-c24 items-center">
                {" "}
                <Image
                  src={Heart}
                  alt="Like"
                  height={22.93}
                  width={28}
                  className="w-5.25 h-4.5"
                />{" "}
                <Image
                  src={Share}
                  alt="Share"
                  height={24}
                  width={28.01}
                  className="h-5.25 w-4.5"
                />{" "}
              </div>
            </div>

            <p className="text-c20 font-MontserratSemiBold">
              {productDetails?.price_range?.currency}
              {selectedVariation?.base_price ?? productDetails?.base_price}
            </p>

            <span className="text-sm font-MontserratSemiBold text-2d7565">
              {selectedVariation
                ? `${selectedVariation.stock} in stock`
                : "Select options"}{" "}
            </span>
            <div className="mt-3 flex items-center gap-3">
              {" "}
              <div className="flex items-center">
                {" "}
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-base ${
                      i < Math.round(productDetails?.rating_average || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    {" "}
                    ★{" "}
                  </span>
                ))}{" "}
              </div>{" "}
              <p className="font-MontserratMedium text-sm text-161616">
                {" "}
                {productDetails?.rating_average}/5{" "}
              </p>{" "}
            </div>
            <div className="hidden md:flex gap-c19 md:mt-c24 items-center">
              {" "}
              <Image
                src={Heart}
                alt="Like"
                height={22.93}
                width={28}
                className="w-5.25 h-4.5"
              />{" "}
              <Image
                src={Share}
                alt="Share"
                height={24}
                width={28.01}
                className="h-5.25 w-4.5"
              />{" "}
            </div>
            {(productDetails?.has_variations || (productDetails?.variations && productDetails.variations.length > 0)) && (

              <div ref={variationSectionRef} className="flex flex-col gap-4 mt-6">
                <h2 className="font-MontserratSemiBold">
                  Variations available
                </h2>

                {missingAttribute && (
                  <p className="text-red-500 text-sm font-MontserratSemiBold">
                    Please select {missingAttribute}
                  </p>
                )}

                <div className="flex flex-col gap-5">
                  {Object.values(productDetails.variation_options)
                    .sort((a: any, b: any) => {
                      const aIsSize = a.attribute_name?.toLowerCase().includes("size");
                      const bIsSize = b.attribute_name?.toLowerCase().includes("size");
                      if (aIsSize && !bIsSize) return -1;
                      if (!aIsSize && bIsSize) return 1;
                      return (a.display_order ?? 0) - (b.display_order ?? 0);
                    })
                    .map((variation: VariationOption) => {
                      const name = variation.attribute_name;
                      const isSize = name?.toLowerCase().includes("size");
                      const isColor =
                        name?.toLowerCase().includes("color") ||
                        name?.toLowerCase().includes("colour");

                      const values: string[] =
                        variation.values && variation.values.length > 0
                          ? variation.values.map((v: any) =>
                              typeof v === "string" ? v : v.value
                            )
                          : getAvailableValues(name);

                      if (isSize) {
                        return (
                          <div key={variation.attribute_id || name} className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <p className="font-MontserratSemiBold text-sm text-161616">
                                Size guide
                              </p>
                              <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="p-1 hover:opacity-75 transition-opacity"
                                aria-label="Size guide"
                              >
                                <Image
                                  src={NavButton}
                                  alt="nav button"
                                  width={7.5}
                                  height={13.75}
                                />
                              </button>
                            </div>

                            <div className="flex gap-2.5 overflow-x-auto no-scrollbar flex-wrap pb-1">
                              {values.map((val) => {
                                const isSelected = selectedAttributes[name] === val;

                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() =>
                                      setSelectedAttributes((prev) => ({
                                        ...prev,
                                        [name]: val,
                                      }))
                                    }
                                    className={`w-c44 h-c47 border rounded-lg flex items-center justify-center text-sm font-MontserratSemiBold transition-colors ${
                                      isSelected
                                        ? "border-ff715b text-161616 shadow-xs"
                                        : "border-gray-300 text-161616 bg-white hover:border-gray-400"
                                    }`}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (isColor) {
                        return (
                          <div key={variation.attribute_id || name} className="flex flex-col gap-2.5">
                            <p className="font-MontserratSemiBold text-sm text-161616">
                              {name}:
                            </p>

                            <div className="flex gap-3 overflow-x-auto no-scrollbar flex-wrap pb-2">
                              {values.map((val) => {
                                const isSelected = selectedAttributes[name] === val;
                                const valObj = variation.values?.find(
                                  (v: any) =>
                                    (typeof v === "string" ? v : v.value) === val
                                );
                                const hex = getColorHex(val, valObj?.extra_data);
                                const isLightColor =
                                  hex.toLowerCase() === "#ffffff" ||
                                  hex.toLowerCase() === "white" ||
                                  hex.toLowerCase() === "#fff" ||
                                  hex.toLowerCase() === "#fafafa";

                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() =>
                                      setSelectedAttributes((prev) => ({
                                        ...prev,
                                        [name]: val,
                                      }))
                                    }
                                    className={`flex flex-col items-center justify-between w-c48 min-h-c48 px-1 pt-1 transition-all rounded-none cursor-pointer focus:outline-none ${
                                      isSelected
                                        ? "border border-ff715b"
                                        : "border border-transparent hover:border-gray-200"
                                    }`}
                                  >
                                    <div
                                      className="w-full h-c24 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                                      style={{ backgroundColor: hex }}
                                    />
                                    <span className="mt-2 text-c12 font-MontserratNormal text-161616 text-center select-none capitalize">
                                      {val}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Other attributes (e.g. Material, Version, Style, etc.)
                      return (
                        <div key={variation.attribute_id || name} className="flex flex-col gap-2.5">
                          <p className="font-MontserratSemiBold text-sm text-161616">
                            {name}:
                          </p>

                          <div className="flex gap-2.5 overflow-x-auto no-scrollbar flex-wrap pb-1">
                            {values.map((val) => {
                              const isSelected = selectedAttributes[name] === val;

                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() =>
                                    setSelectedAttributes((prev) => ({
                                      ...prev,
                                      [name]: val,
                                    }))
                                  }
                                  className={`h-10 px-3.5 border rounded-lg flex items-center justify-center text-sm font-MontserratMedium transition-colors ${
                                    isSelected
                                      ? "border-ff715b text-161616 bg-ff715b/5 font-MontserratSemiBold"
                                      : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {hasSelectedAttributes && (
              <div className="w-full flex items-center justify-end pt-2">
                <button
                  onClick={() => setSelectedAttributes({})}
                  className="text-ff715b font-MontserratNormal text-sm hover:underline"
                >
                  Reset
                </button>
              </div>
            )}

            {isModal && (
              <div className=" hidden md:block mt-8 w-full ">
                <ItemAddToCart
                  selectedVariation={selectedVariation}
                  productId={productDetails?.id || ""}
                  isModal={isModal}
                  product_slug={productDetails?.slug || ""}
                  product_name={productDetails?.name || ""}
                  onIncompleteVariation={handleIncompleteVariation}
                />
              </div>
            )}
          </div>

          <SizeGuideModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type="clothes"
          />
        </div>

        {!isModal && (
          <>
            <div className="sticky z-50  hidden md:flex top-20 bg-white shadow">
              <ProductNav />
            </div>
            <div className="hidden md:flex">
              <MoreDetailedPage ProductDetail={productDetails} />
            </div>
          </>
        )}
      </div>
      {!isModal && (
        <>
          <div className="w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-110.5 hidden md:block p-6 bg-ffffff rounded-c16 shadow-customW h-fit sticky top-32 ">
            <div className="">
              <div className=" flex flex-col   gap-c24 pb-4 md:border-b md:border-gray-100">
                <div className="w-full flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-c88 w-c88 rounded-c12 bg-f89f1c flex items-center justify-center text-center">
                      <p className="font-MontserratBold text-c12 text-000000">
                        COMPANY LOGO
                      </p>
                    </div>
                    <div>
                      <h1 className="font-MontserratSemiBold text-161616 text-c18">
                        {productDetails?.manufacturer_name}
                      </h1>
                      <div className="flex gap-2 items-center">
                        <div className="w-5 h-5">
                          <Image
                            src={Location}
                            alt="location"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                          Suppliers Location
                        </p>
                      </div>
                      <div className="md:hidden flex gap-2 items-center">
                        <div className="w-5 h-5">
                          <Image
                            src={phone}
                            alt="phone"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                          +234 80312345678
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Shipping Info */}
                <div className="md:flex gap-4 items-start hidden ">
                  {/* <div>
                    <Image
                      src={truck}
                      alt="truck"
                      width={22.5}
                      height={15.76}
                    />
                  </div> */}
                  {/* <div className="md:flex flex-col gap-2">
                    <p className="font-MontserratSemiBold text-base text-161616">
                      Shipping fee
                    </p>
                    <p className="text-c12 font-MontserratMedium text-gray-500">
                      Delivery:{" "}
                      <span className="font-MontserratSemiBold text-c12 text-161616">
                        May 25, 2020
                      </span>
                    </p>
                    <p className="text-c12 font-MontserratMedium text-gray-500">
                      Courier company:{" "}
                      <span className="font-MontserratSemiBold text-c12 text-161616">
                        SpeedAf
                      </span>
                    </p>
                  </div> */}
                </div>
                {/* Security & Refund */}
                <div className="space-y-6 ">
                  <div className="flex gap-4 items-start">
                    <Image
                      src={Security}
                      alt="security check"
                      width={22.5}
                      height={15.76}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-MontserratSemiBold text-sm text-161616">
                        Secure payments
                      </p>
                      <p className="text-sm font-MontserratNormal text-gray-500">
                        Every payment you make on MartAf is secured with strict
                        SSL encryption and PCI DSS data protection protocols
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Image
                      src={refund}
                      alt="refund"
                      width={26}
                      height={24.76}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-MontserratSemiBold text-sm text-161616">
                        Standard refund policy
                      </p>
                      <p className="text-sm font-MontserratNormal text-gray-500">
                        Claim a refund if your order doesn&apos;t ship, is
                        missing, or arrives with product issues
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ItemAddToCart
                selectedVariation={selectedVariation}
                productId={productDetails?.id || ""}
                isModal={isModal}
                product_slug={productDetails?.slug || ""}
                product_name={productDetails?.name || ""}
                onIncompleteVariation={handleIncompleteVariation}
              />
            </div>
          </div>
          <div className="md:hidden flex flex-col-reverse mt-c32 m  gap-c24 pb-4 md:border-b md:border-gray-100">
            <div className="w-full flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-c88 w-c88 rounded-c12 bg-f89f1c flex items-center justify-center text-center">
                  <p className="font-MontserratBold text-c12 text-000000">
                    COMPANY LOGO
                  </p>
                </div>
                <div>
                  <h1 className="font-MontserratSemiBold text-161616 text-c18">
                    {productDetails?.manufacturer_name || "Seller Name"}
                  </h1>
                  <div className="flex gap-2 items-center">
                    <div className="w-5 h-5">
                      <Image
                        src={Location}
                        alt="location"
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                      Suppliers Location
                    </p>
                  </div>
                  <div className="md:hidden flex gap-2 items-center">
                    <div className="w-5 h-5">
                      <Image src={phone} alt="phone" width={20} height={20} />
                    </div>
                    <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                      +234 80312345678
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping Info */}
            <div className="md:flex gap-4 items-start hidden">
              <div>
                <Image src={truck} alt="truck" width={22.5} height={15.76} />
              </div>
              <div className="md:flex flex-col gap-2">
                <p className="font-MontserratSemiBold text-base text-161616">
                  Shipping fee
                </p>
                <p className="text-c12 font-MontserratMedium text-gray-500">
                  Delivery:{" "}
                  <span className="font-MontserratSemiBold text-c12 text-161616">
                    May 25, 2020
                  </span>
                </p>
                <p className="text-c12 font-MontserratMedium text-gray-500">
                  Courier company:{" "}
                  <span className="font-MontserratSemiBold text-c12 text-161616">
                    SpeedAf
                  </span>
                </p>
              </div>
            </div>
            {/* Security & Refund */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <Image
                  src={Security}
                  alt="security check"
                  width={22.5}
                  height={15.76}
                />
                <div className="flex flex-col gap-2">
                  <p className="font-MontserratSemiBold text-sm text-161616">
                    Secure payments
                  </p>
                  <p className="text-sm font-MontserratNormal text-gray-500">
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Image src={refund} alt="refund" width={26} height={24.76} />
                <div className="flex flex-col gap-2">
                  <p className="font-MontserratSemiBold text-sm text-161616">
                    Standard refund policy
                  </p>
                  <p className="text-sm font-MontserratNormal text-gray-500">
                    Claim a refund if your order doesn&apos;t ship, is missing,
                    or arrives with product issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* <div className="md:hidden flex w-full  gap-2 mb-c32  md:gap-0  md:flex-col">
        <Button className="" variant="secondary">
          View profile
        </Button>
        <Button variant="primary">Send message</Button>
      </div> */}
      <div className = "">
        <AdSlider />
      </div>

      <div className=" mt-c32 md:hidden s">
        <div className="md:hidden">
          <ProductDetailCategory
            slug={productDetails?.slug || "new"}
            ProductDetail={productDetails}
          />
        </div>
        {pendingRequests ? (
          <div>
            <h1 className="mb-12">Searching for similier products...</h1>
          </div>
        ) : (
          <div>
            {subCategory.length > 0 && (
              <ProductSection
                title={"Similar products"}
                products={subCategory}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex gap-9.75  items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
        <CartButton image={CartBtn} size={32} />
        <div className=" gap-2 w-full text-c12">
          <ItemAddToCart
            selectedVariation={selectedVariation}
            productId={productDetails?.id || ""}
            isModal={isModal}
            product_slug={productDetails?.slug || ""}
            product_name={productDetails?.name || ""}
            onIncompleteVariation={handleIncompleteVariation}
          />
        </div>
      </div>
    </div>
  );
}
