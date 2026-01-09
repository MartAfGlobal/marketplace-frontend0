"use client";

import { RootState } from "@/store";
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
import { setCategoryProducts } from "@/store/user-data/products/categoryProductsSlice";
import { setsubCategoryProducts } from "@/store/user-data/products/subCategoryProductsSlice";
import ProductSection from "../landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import ProductDetailCategory from "../mobile/product-detail.categories";
import { div } from "framer-motion/client";

type ProductVariationProp = {
  isModal: boolean;
};

export default function ProductVariation({
  isModal = true,
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
  const dispatch = useDispatch();

  const [pendingRequests, setPendingRequests] = useState(2); // 2 API calls
  const { sendHttpRequest } = useHttp();

  const subCategorySlug = productDetails?.category.subcategory.slug;
  /* ---------------- FETCH CATEGORY PRODUCTS ---------------- */
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
    if (!productDetails?.has_variations) return;

    setHasTriedAddToCart(true);

    const attributes = Object.keys(productDetails.variation_options || {});
    const firstMissing = attributes.find((attr) => !selectedAttributes[attr]);

    if (!firstMissing) return;

    setMissingAttribute(firstMissing);
    setOpenAttribute(firstMissing);

      scrollToVariations();
  };

  const selectedImage = images.find((img) => img.id === selectedImageId);

const scrollToVariations = () => {
  if (!variationSectionRef.current) return;

  const yOffset = 120; // 🔧 adjust this value (px)
  const y =
    variationSectionRef.current.getBoundingClientRect().top +
    window.pageYOffset -
    yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};



  return (
    <div
      className={`flex w-full md:gap-23 flex-col md:flex-row justify-center  ${
        !isModal ? "mt-c32" : "mt-0"
      }`}
    >
      <div className="max-w-205.5 w-full ">
        <div className="w-full flex md:flex-row gap-c32   flex-col  h-fit max-w-205.5 md:gap-c48 relative">
          {/* IMAGES */}
          <div
            className={`w-full md:max-w-94.75 md:pb-12 ${
              isModal ? "h-127.25 overflow-scroll no-scrollbar" : ""
            }`}
          >
            <Image
              src={selectedImage?.large || "/placeholder.png"}
              alt={productDetails?.name || ""}
              height={410}
              width={397}
              className="w-full h-92.25 md:max-w-92.25"
            />

            <div className="flex gap-2 mt-4">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onMouseEnter={() => {
                    setSelectedImageId(img.id);
                    setActiveSlide(i);
                  }}
                  className={`h-1 rounded-full ${
                    activeSlide === i
                      ? "w-c117 bg-gray-700"
                      : "w-c40 bg-gray-300"
                  }`}
                />
              ))}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 mt-8 mb-4 h-19 w-full overflow-x-auto hcustom-scroll">
                {" "}
                {images.map((thumb, index) => (
                  <button
                    key={thumb.id}
                    onMouseEnter={() => {
                      setSelectedImageId(thumb.id);
                      setActiveSlide(index);
                    }}
                    className={`w-c66-81 h-17 flex-shrink-0 border-2 rounded-c12 ${
                      activeSlide === index
                        ? "my-gradient-border"
                        : "border-transparent"
                    } transition-all duration-200`}
                  >
                    {" "}
                    <Image
                      src={thumb.thumbnail}
                      alt={thumb.alt_text}
                      width={64}
                      height={64}
                      className="object-cover w-c66-81 c66-81"
                    />{" "}
                  </button>
                ))}{" "}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div
            ref={detailsContainerRef}
            className={`w-full md:max-w-94 md:pb-40 relative ${
              isModal ? "h-c557-39 overflow-y-auto no-scrollbar" : ""
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
              {productDetails?.price_range.currency}
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
            {productDetails?.has_variations && (

              <div ref={variationSectionRef} className="flex flex-col gap-6 mt-6">
                <h2 className="font-MontserratSemiBold">
                  Variations available
                </h2>

                {missingAttribute && (
                  <p className="text-red-500 text-sm font-MontserratSemiBold">
                    Please select {missingAttribute}
                  </p>
                )}

                <div className="flex gap-3 flex-wrap">
                  {Object.values(productDetails.variation_options).map(
                    (variation: VariationOption) => {
                      const name = variation.attribute_name;

                      return (
                        <button
                          key={variation.attribute_id}
                          onClick={() =>
                            setOpenAttribute(
                              openAttribute === name ? null : name
                            )
                          }
                          className={`px-4 py-2 rounded-lg border text-sm ${
                            openAttribute === name
                              ? "border-ff715b bg-ff715b/10"
                              : "border-gray-300"
                          }`}
                        >
                          {name} ▾
                        </button>
                      );
                    }
                  )}
                </div>

                <AnimatePresence>
                  {openAttribute && (
                    <motion.div
                      ref={attributePanelRef}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <div className="flex gap-2 flex-wrap">
                        {getAvailableValues(openAttribute).map((value) => {
                          const isSelected =
                            selectedAttributes[openAttribute] === value;

                          return (
                            <motion.button
                              key={value}
                              onClick={() =>
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [openAttribute]: value,
                                }))
                              }
                              className={`px-3 py-1 border rounded ${
                                isSelected ? "border-ff715b" : "border-gray-300"
                              }`}
                            >
                              {value}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {hasSelectedAttributes && (
              <div className="w-full flex items-center justify-end">
                <button
                  onClick={() => setSelectedAttributes({})}
                  className="text-ff715b font-MontserratNormal text-sm"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {isModal && (
            <ItemAddToCart
              selectedVariation={selectedVariation}
              productId={productDetails?.id || ""}
              isModal={isModal}
              product_slug={productDetails?.slug || ""}
              product_name={productDetails?.name || ""}
              onIncompleteVariation={handleIncompleteVariation}
            />
          )}

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
          <div className="w-full max-w-110.5 hidden md:block  h-screen sticky top-24 ">
            <div className="">
              <div className=" flex flex-col mt-c32 m  gap-c24 pb-4 md:border-b md:border-gray-100">
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
                <div className="md:flex gap-4 items-start hidden">
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
                    Seller Name
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

      <div className="md:hidden flex w-full  gap-2 mb-c32  md:gap-0  md:flex-col">
        <Button className="" variant="secondary">
          View profile
        </Button>
        <Button variant="primary">Send message</Button>
      </div>
      <div>
        <AdSlider />
      </div>

      <div className=" mt-c32 md:hidden">
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
