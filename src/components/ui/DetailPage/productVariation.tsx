"use client";

import { AppDispatch, RootState } from "@/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SizeGuideModal from "../Modals/sizeGuideModal";
import ShareModal from "../Modals/ShareModal";
import { useRouter } from "next/navigation";
import { setWishlist } from "@/store/cart/wishlist-slice";
import { toast } from "sonner";
import ItemAddToCart from "../ItemAddToCart";
import ProductNav from "../navigation/ProductNavView";
import MoreDetailedPage from "./MoreDetailedPage";
import { useHttp } from "@/hooks/use-http";
import { setsubCategoryProducts } from "@/store/user-data/products/subCategoryProductsSlice";
import {
  Product,
  ProductVariation as ProductVariationData,
} from "@/types/global";
import ProductImageGallery from "./product-variation/ProductImageGallery";
import ProductSummary from "./product-variation/ProductSummary";
import VariationSelector from "./product-variation/VariationSelector";
import SellerPurchasePanel from "./product-variation/SellerPurchasePanel";
import ProductRecommendations from "./product-variation/ProductRecommendations";
import MobilePurchaseBar from "./product-variation/MobilePurchaseBar";
import SimilarProductsSection from "./product-variation/SimilarProductsSection";

type ProductVariationProp = {
  isModal: boolean;
  selectedVariaton?: string;
  productSlug?: string;
};

export default function ProductVariation({
  isModal = true,
  selectedVariaton,
  productSlug,
}: ProductVariationProp) {
  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );
  const variationSectionRef = useRef<HTMLDivElement | null>(null);
  console.log("available variation", productDetails);

  const detailsContainerRef = useRef<HTMLDivElement | null>(null);
  const attributePanelRef = useRef<HTMLDivElement | null>(null);

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openAttribute, setOpenAttribute] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const [missingAttribute, setMissingAttribute] = useState<string | null>(null);
  const [hasTriedAddToCart, setHasTriedAddToCart] = useState(false);
  const categoryProducts = useSelector(
    (state: RootState) => state.subCategoryProducts.items
  );

  const dispatch = useDispatch() as AppDispatch;

  const [isLoadingSimilarProducts, setIsLoadingSimilarProducts] =
    useState(true);
  const { sendHttpRequest } = useHttp();
  const { loading: loadingWishlist, sendHttpRequest: addWishlistReq } =
    useHttp();
  const { sendHttpRequest: wishlistReq } = useHttp();

  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const wishlistItem = wishlistItems.find((item) => {
    const product: Product | string = item.product;
    const productId = typeof product === "string" ? product : product.id;
    return productId === productDetails?.id;
  });
  const isInWishlist = Boolean(wishlistItem);
  const wishlistId = wishlistItem?.id;

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const fetchWishlist = () => {
    if (!token) return;
    wishlistReq({
      requestConfig: {
        url: "/wishlist/all",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const items = res?.data?.results || [];
        dispatch(setWishlist(items));
      },
    });
  };

  const handleToggleWishlist = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!productDetails?.id) return;

    if (!token) {
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      toast.info("Please log in to manage your wishlist");
      if (isMobile) {
        router.replace("/?showLogin=true");
      } else {
        router.replace("/auth/login");
      }
      return;
    }

    if (isInWishlist && wishlistId) {
      addWishlistReq({
        requestConfig: {
          url: `/wishlist/items/remove/${wishlistId}/`,
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
          successMessage: "Removed from wishlist",
        },
        successRes: () => {
          fetchWishlist();
        },
      });
      return;
    }

    addWishlistReq({
      requestConfig: {
        url: `/wishlist/add/${productDetails.id}/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Added to wishlist",
      },
      successRes: () => {
        fetchWishlist();
      },
    });
  };

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const shareTitle = productDetails?.name || "Product";
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${shareTitle} on MartAf!`,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          err.name === "AbortError"
        ) {
          return;
        }
      }
    }

    setShareModalOpen(true);
  };

  const categorySlug = productDetails?.category?.slug;

  const scrollToVariations = useCallback(() => {
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
  }, [isModal]);

  const scrollToPanel = useCallback(() => {
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
  }, []);

  // Apply variations opened directly from a product URL, and scroll them into view.
  useEffect(() => {
    if (!selectedVariaton || !productDetails?.variations) return;

    const match = productDetails.variations.find(
      (variation) =>
        String(variation.id) === String(selectedVariaton) ||
        String(
          (variation as ProductVariationData & { variation_id?: string })
            .variation_id
        ) === String(selectedVariaton)
    );

    if (!match) return;

    setSelectedAttributes({ ...match.attribute_summary });
    setSelectedVariation(match);
    scrollToVariations();
  }, [selectedVariaton, productDetails, scrollToVariations]);

  // Select the only available variation automatically when there is no choice to make.
  useEffect(() => {
    const variations = productDetails?.variations;
    if (
      !variations ||
      variations.length !== 1 ||
      (productSlug && productDetails.slug !== productSlug)
    ) {
      return;
    }

    const onlyVariation = variations[0];
    setSelectedAttributes(onlyVariation.attribute_summary || {});
    setSelectedVariation(onlyVariation);
  }, [productDetails, productSlug, selectedVariaton]);

  useEffect(() => {
    let isCurrentRequest = true;

    if (!categorySlug) {
      dispatch(setsubCategoryProducts([]));
      setIsLoadingSimilarProducts(false);
      return;
    }

    dispatch(setsubCategoryProducts([]));
    setIsLoadingSimilarProducts(true);

    // Load the category's products so the similar section matches this product's category.
    sendHttpRequest({
      requestConfig: {
        url: `/products/public/products/?category=${categorySlug}&page=1&page_size=20`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res) => {
        try {
          const products = res?.data?.results ?? [];
          if (isCurrentRequest) {
            dispatch(setsubCategoryProducts(products));
          }
        } finally {
          if (isCurrentRequest) {
            setIsLoadingSimilarProducts(false);
          }
        }
      },
      errorRes: (err) => {
        console.error("Failed to fetch similar products:", err);
        if (isCurrentRequest) {
          setIsLoadingSimilarProducts(false);
        }
      },
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [categorySlug, dispatch, sendHttpRequest]);

  useEffect(() => {
    if (openAttribute) scrollToPanel();
  }, [openAttribute, scrollToPanel]);

  useEffect(() => {
    if (!productDetails?.variations?.length) return;

    const attributes = Object.keys(productDetails.variation_options || {});
    const isComplete = attributes.every((attribute) =>
      selectedAttributes[attribute]
    );

    if (!isComplete) {
      setSelectedVariation(null);
      return;
    }

    const match = productDetails.variations.find((variation) =>
      Object.entries(variation.attribute_summary).every(
        ([attribute, value]) => selectedAttributes[attribute] === value
      )
    );

    setSelectedVariation(match || null);
  }, [selectedAttributes, productDetails]);

  useEffect(() => {
    if (!hasTriedAddToCart) return;

    const attributes = Object.keys(productDetails?.variation_options || {});
    const nextMissing = attributes.find(
      (attribute) => !selectedAttributes[attribute]
    );

    if (nextMissing) {
      setMissingAttribute(nextMissing);
      setOpenAttribute(nextMissing);
    } else {
      setMissingAttribute(null);
    }
  }, [selectedAttributes, hasTriedAddToCart, productDetails]);

  const getAvailableValues = (attributeName: string) => {
    if (!productDetails?.variations?.length) return [];

    return productDetails.variations
      .filter((variation) =>
        Object.entries(selectedAttributes).every(([attribute, value]) => {
          if (attribute === attributeName) return true;
          return variation.attribute_summary[attribute] === value;
        })
      )
      .map((variation) => variation.attribute_summary[attributeName])
      .filter((value, index, values) => values.indexOf(value) === index);
  };

  const handleSelectAttribute = (attributeName: string, value: string) => {
    const variations = productDetails?.variations ?? [];

    if (variations.length === 0) {
      setSelectedAttributes((previous) => ({
        ...previous,
        [attributeName]: value,
      }));
      return;
    }

    // Keep earlier choices only when they remain compatible with this selection.
    setSelectedAttributes((previous) => {
      let compatibleVariations = variations.filter(
        (variation) => variation.attribute_summary?.[attributeName] === value
      );
      const nextAttributes: Record<string, string> = {
        [attributeName]: value,
      };

      Object.entries(previous).forEach(([attribute, selectedValue]) => {
        if (attribute === attributeName || !selectedValue) return;

        const matchingVariations = compatibleVariations.filter(
          (variation) =>
            variation.attribute_summary?.[attribute] === selectedValue
        );

        if (matchingVariations.length > 0) {
          nextAttributes[attribute] = selectedValue;
          compatibleVariations = matchingVariations;
        }
      });

      return nextAttributes;
    });
  };

  // Point the shopper to the first missing option before adding the item to cart.
  const handleIncompleteVariation = () => {
    const hasVars =
      productDetails?.has_variations ||
      (productDetails?.variations && productDetails.variations.length > 0);
    if (!hasVars) return;

    setHasTriedAddToCart(true);

    const attributes = Object.keys(productDetails.variation_options || {});
    const firstMissing = attributes.find(
      (attribute) => !selectedAttributes[attribute]
    );

    if (!firstMissing) return;

    setMissingAttribute(firstMissing);
    setOpenAttribute(firstMissing);
    scrollToVariations();
  };

  return (
    <div className={`w-full ${!isModal ? "mt-c32" : "mt-0"}`}>
      <div className="flex w-full gap-6 md:gap-8 lg:justify-between flex-col md:flex-row justify-center">
      <div className="md:flex-1 w-full   space-y-c32  min-w-0">
        <div
          className={`w-full flex md:flex-row gap-6  md:gap-8 xl:gap-c48 flex-col h-fit relative    ${
            isModal
              ? "h-fit"
              : "border-b border-b-000000/12 pb-[5.65px] "
          }`}
        >
          <ProductImageGallery
            productDetails={productDetails}
            selectedVariation={selectedVariation}
            isModal={isModal}
          />

          <div
            ref={detailsContainerRef}
            className={`w-full min-w-0   relative ${
              isModal ? "h-fit  w-full overflow-y-auto no-scrollbar" : ""
            }`}
          >
            <ProductSummary
              productDetails={productDetails}
              selectedVariation={selectedVariation}
              isInWishlist={isInWishlist}
              loadingWishlist={loadingWishlist}
              onToggleWishlist={handleToggleWishlist}
              onShare={handleShare}
            />

            <VariationSelector
              productDetails={productDetails}
              selectedAttributes={selectedAttributes}
              missingAttribute={missingAttribute}
              sectionRef={variationSectionRef}
              onSelectAttribute={handleSelectAttribute}
              onOpenSizeGuide={() => setIsModalOpen(true)}
              onReset={() => setSelectedAttributes({})}
              getAvailableValues={getAvailableValues}
            />

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

          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            title={productDetails?.name || "Product"}
            url={typeof window !== "undefined" ? window.location.href : ""}
          />
        </div>

        {!isModal && (
          <>
            <div className="sticky z-40  hidden md:flex top-20 bg-white shadow">
              <ProductNav />
            </div>
            <div className="hidden md:flex">
              <MoreDetailedPage ProductDetail={productDetails} />
            </div>
          </>
        )}
      </div>

      <SellerPurchasePanel
        productDetails={productDetails}
        selectedVariation={selectedVariation}
        isModal={isModal}
        onIncompleteVariation={handleIncompleteVariation}
      />

      <ProductRecommendations
        productDetails={productDetails}
        isLoading={isLoadingSimilarProducts}
        similarProducts={categoryProducts}
      />

      <MobilePurchaseBar
        productDetails={productDetails}
        selectedVariation={selectedVariation}
        isModal={isModal}
        onIncompleteVariation={handleIncompleteVariation}
      />
      </div>

      {!isModal && (
        <SimilarProductsSection
          products={categoryProducts}
          isLoading={isLoadingSimilarProducts}
        />
      )}
    </div>
  );
}
