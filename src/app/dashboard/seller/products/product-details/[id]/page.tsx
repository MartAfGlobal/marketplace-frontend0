"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SellerProductDetails } from "@/types/global";
import { useHttp } from "@/hooks/use-http";

import ProductDetailsSkeleton from "@/components/reloadSpinner/ProductDetailsSkeleton";
import ResultModal from "@/components/ui/forms/resultModal";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

// Extracted Components
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductActions from "./components/ProductActions";
import ProductVariants from "./components/ProductVariants";
import Image from "next/image";

export default function SellerProductDetailsPage() {
  /* ------------------------- CORE HOOKS ------------------------- */
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;
  const published = searchParams.get("isPublish") || undefined;
  const token = useSelector((state: RootState) => state.token?.token);

  /* ------------------------- LOCAL STATE ------------------------- */
  const [productDetails, setProductDetails] =
    useState<SellerProductDetails | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [successful, setSuccessful] = useState(false);
  const [DeleteDraftSuccess, setDeleteDraftSuccess] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    | "activate"
    | "deactivate"
    | "cancel activation"
    | "cancel deactivation"
    | null
  >(null);

  /* ------------------------- HTTP HOOKS & ERRORS ------------------------- */
  const {
    sendHttpRequest: fetchReq,
    loading: fetchLoading,
    error: fetchError,
    setError: setFetchError,
  } = useHttp();
  const {
    sendHttpRequest: deleteReq,
    loading: deleteLoading,
    error: deleteError,
    setError: setDeleteError,
  } = useHttp();
  const {
    sendHttpRequest: submitReq,
    loading: submiting,
    error: submitError,
    setError: setSubmitError,
  } = useHttp();

  /* ------------------------- CUSTOM HOOK ------------------------- */
  const {
    activateProduct,
    loading: ActivatingLoading,
    success: ActivationSuccess,
    setSuccess: setActivationSuccess,
    setIsActive,
    activated,
    setActivated,
    cancelProductRequest,
    successMessage,
    error: activateError,
    setError: setActivateError,
  } = useFetchProducts(id);

  /* ------------------------- DERIVED VALUES ------------------------- */
  const isDeactivation = successMessage === "Deactivation request cancelled.";

  const url =
    published === "true"
      ? `/products/manufacturer/products/${id}/`
      : `/products/manufacturer/drafts/${id}/`;

  const images = productDetails?.images?.length
    ? productDetails.images
    : productDetails?.draft_data?.product_images?.map(
        (img: any, index: number) => ({
          id: img.cloudinary_id || index.toString(),
          thumbnail: img.url,
          medium: img.url,
          large: img.url,
          alt_text: img.alt_text || productDetails?.name,
        }),
      ) || [];

  const variations =
    productDetails?.variations || productDetails?.draft_data?.variations || [];

  // Centralized Error Handling
  const anyError = fetchError || deleteError || submitError || activateError;
  const clearError = () => {
    if (fetchError) setFetchError(null);
    if (deleteError) setDeleteError(null);
    if (submitError) setSubmitError(null);
    if (activateError) setActivateError(null);
  };

  const [activeTab, setActiveTab] = useState<"main" | "variants">("main");

  /* ------------------------- EFFECTS ------------------------- */
  useEffect(() => {
    if (!id || !token) return;

    fetchReq({
      requestConfig: {
        url,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("=== FETCHED PRODUCT DETAILS ===", responseData?.data);
        setProductDetails(responseData?.data);
      },
    });
  }, [id, token, fetchReq, url]);

  useEffect(() => {
    if (!productDetails || !token) return;
    if (productDetails.is_active) {
      setIsActive(true);
    }
  }, [productDetails, setIsActive]);

  useEffect(() => {
    if (ActivationSuccess || activated) {
      if (token) {
        fetchReq({
          requestConfig: {
            url,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (responseData: any) => {
            setProductDetails(responseData?.data);
          },
        });
      }
      setConfirmAction(null);
    }
  }, [ActivationSuccess, activated, fetchReq, url, token]);

  useEffect(() => {
    if (images.length) {
      setSelectedImageId(images[0].id);
      setActiveSlide(0);
    }
  }, [images]);

  /* ------------------------- HANDLERS ------------------------- */
  const handleActivateToggle = () => {
    activateProduct();
  };

  const handleCancelRequest = () => {
    if (productDetails?.activation_requested) {
      cancelProductRequest("activation");
    } else if (productDetails?.deactivation_requested) {
      cancelProductRequest("deactivation");
    }
  };

  const handleDeleteDraft = () => {
    if (!token) return;

    deleteReq({
      requestConfig: {
        url: `products/manufacturer/drafts/${id}/`,
        method: "DELETE",
        token: token as string,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setDeleteDraftSuccess(true);
      },
    });
  };

  const isDraftComplete = () => {
    if (!productDetails) return false;
    const pd = productDetails as any;
    const dd = productDetails.draft_data as any;

    // Core fields
    const hasName = Boolean(pd.name || dd?.name);
    const hasPrice =
      (pd.base_price !== undefined && pd.base_price !== null && pd.base_price !== "") ||
      pd.price !== undefined ||
      dd?.base_price !== undefined;

    const hasCategory = Boolean(
      pd.category?.id ||
      pd.category_id ||
      (typeof pd.category === "string" && pd.category) ||
      pd.category_info?.category?.id ||
      pd.category_info?.subcategory?.id ||
      pd.subcategory?.id ||
      pd.subcategory_id ||
      (typeof pd.subcategory === "string" && pd.subcategory) ||
      dd?.category_id ||
      dd?.category
    );

    const hasDesc = Boolean(
      pd.description ||
      pd.description_html ||
      dd?.description ||
      pd.specifications_text ||
      pd.specifications_html
    );

    // Images
    const hasImages =
      (images && images.length > 0) ||
      Boolean(pd.images?.length) ||
      Boolean(pd.product_images?.length) ||
      Boolean(dd?.product_images?.length) ||
      Boolean(dd?.images?.length);

    // Variants or specs
    const variantsCount =
      variations?.length ||
      pd.variations?.length ||
      dd?.variations?.length ||
      0;
    const hasInventory =
      pd.inventory !== undefined ||
      pd.stock !== undefined ||
      pd.quantity !== undefined ||
      dd?.inventory !== undefined ||
      dd?.stock !== undefined;
    const hasVariantsOrInventory =
      variantsCount > 0 || hasInventory || pd.has_variations !== undefined;

    return (
      hasName &&
      hasPrice &&
      hasCategory &&
      hasDesc &&
      hasImages &&
      hasVariantsOrInventory
    );
  };

  const handleSubmitDraftProduct = () => {
    if (!token || !id) return;

    if (!isDraftComplete()) {
      setShowIncompleteModal(true);
      return;
    }

    submitReq({
      requestConfig: {
        url: `/products/manufacturer/drafts/${id}/publish/`,
        method: "POST",
        token: token as string,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setSuccessful(true);
      },
    });
  };

  /* ------------------------- LOADING STATE ------------------------- */
  if (!productDetails || fetchLoading) {
    return <ProductDetailsSkeleton />;
  }

  /* ------------------------- UI ------------------------- */
  return (
    <div>
      <SellerMobileHeader 
        title={productDetails.name || "Product Details"} 
      />

      <div className="w-full flex lg:flex-row flex-col justify-center gap-c48  bg-ffffff circle-shadow rounded-c16 py-6 px-6 lg:px-8 relative overflow-hidden mt-6 lg:mt-0">
        {/* Mobile View Layout (reorganized) */}
        <div className="lg:hidden w-full flex flex-col  gap-8">
          <ProductImageGallery
            images={images}
            selectedImageId={selectedImageId}
            activeSlide={activeSlide}
            setSelectedImageId={setSelectedImageId}
            setActiveSlide={setActiveSlide}
          />

          <ProductActions
            published={published}
            productDetails={productDetails}
            id={id}
            ActivatingLoading={ActivatingLoading}
            submiting={submiting}
            deleteLoading={deleteLoading}
            setConfirmAction={setConfirmAction}
            handleCancelRequest={handleCancelRequest}
            handleSubmitDraftProduct={handleSubmitDraftProduct}
            handleDeleteDraft={handleDeleteDraft}
          />

          {/* Switcher Tab */}
          <div className="flex border-b border-gray-200 ">
            <button
              onClick={() => setActiveTab("main")}
              className={`pb-4 px-6 text-sm font-MontserratNormal transition-all relative ${
                activeTab === "main" ? "text-ff715b" : "text-gray-500"
              }`}
            >
              Main product
              {activeTab === "main" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ff715b" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("variants")}
              className={`pb-4 px-6 text-sm font-MontserratMedium transition-all relative ${
                activeTab === "variants" ? "text-ff715b" : "text-gray-500"
              }`}
            >
              Variants
              {activeTab === "variants" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ff715b" />
              )}
            </button>
          </div>

          <div className="">
            {activeTab === "main" ? (
              <ProductInfo productDetails={productDetails} published={published} />
            ) : (
              <ProductVariants variations={variations} />
            )}
          </div>
        </div>

        {/* Desktop View Layout (Keeping existing structure) */}
        <div className="hidden lg:flex w-full lg:flex-row flex-col gap-c48">
          <div className="lg:flex-1 min-w-0 lg:w-full max-w-[616px]">
            <ProductImageGallery
              images={images}
              selectedImageId={selectedImageId}
              activeSlide={activeSlide}
              setSelectedImageId={setSelectedImageId}
              setActiveSlide={setActiveSlide}
            />
            <ProductInfo productDetails={productDetails} published={published} />
          </div>

          <div className="lg:flex-1 min-w-0 mb-c32 ">
            <ProductActions
              published={published}
              productDetails={productDetails}
              id={id}
              ActivatingLoading={ActivatingLoading}
              submiting={submiting}
              deleteLoading={deleteLoading}
              setConfirmAction={setConfirmAction}
              handleCancelRequest={handleCancelRequest}
              handleSubmitDraftProduct={handleSubmitDraftProduct}
              handleDeleteDraft={handleDeleteDraft}
            />

            <ProductVariants variations={variations} />
          </div>
        </div>

        {/* SUCCESS MODALS */}
        <ResultModal
          title="Product deleted from draft"
          message="Your product has been deleted from the draft."
          discRescription="Your product has been successfully deleted from the draft."
          buttenText="Go to Products"
          isOpen={DeleteDraftSuccess}
          onConfirm={() => router.push("/dashboard/seller/products")}
        />

        <ResultModal
          title="Product Submitted Successfully"
          message="Your product has been submitted and is now pending approval."
          discRescription="Once approved by the admin, it will be visible on the marketplace."
          buttenText="Go to Products"
          isOpen={successful}
          onConfirm={() => router.push("/dashboard/seller/products")}
        />

        <ResultModal
          title={successMessage || "Request Cancelled"}
          message="The action has been cancelled."
          discRescription="Your cancellation request was successful and the product details are refreshed."
          buttenText="Ok"
          isOpen={activated}
          onConfirm={() => setActivated(false)}
          onCancel={() => setActivated(false)}
        />

        <ResultModal
          title="Incomplete Draft"
          message="Please complete all required fields before submitting."
          discRescription="Your product is missing required details like images, category, price, or variations."
          buttenText="Continue"
          secondaryButtonText="Close"
          isOpen={showIncompleteModal}
          onConfirm={() =>
            router.push(
              `/dashboard/seller/products/add-product/updateProduct/${id}?isPublish=false`,
            )
          }
          onCancel={() => setShowIncompleteModal(false)}
          onSecondaryAction={() => setShowIncompleteModal(false)}
        />

        <ResultModal
          title="Status Updated Successfully"
          message="The product has been successfully updated."
          discRescription="Your changes have been applied and the product details are refreshed."
          buttenText="Ok"
          isOpen={ActivationSuccess}
          onConfirm={() => setActivationSuccess(false)}
          onCancel={() => setActivationSuccess(false)}
        />

        {/* CONFIRMATION MODAL */}
        <ResultModal
          result="warning"
          title={`Are you sure you want to ${confirmAction}?`}
          discRescription={
            confirmAction === "activate"
              ? "Activating this product will make it live and available for viewing and ordering."
              : confirmAction === "deactivate"
                ? "Deactivating this product will remove it from live viewing and ordering."
                : "This will cancel your pending request and revert the product's status."
          }
          onCancel={() => setConfirmAction(null)}
          loading={ActivatingLoading}
          buttenText="Yes, I accept"
          isOpen={!!confirmAction}
          onConfirm={() => {
            if (
              confirmAction === "activate" ||
              confirmAction === "deactivate"
            ) {
              handleActivateToggle();
            } else {
              handleCancelRequest();
            }
          }}
        />

        {/* ERROR MODAL (NEW) */}
        <ResultModal
          result="error"
          title="Action Failed"
          message={anyError || "An unexpected error occurred."}
          discRescription="Please review your network connection and try again."
          buttenText="Close"
          isOpen={!!anyError}
          onConfirm={clearError}
          onCancel={clearError}
        />
      </div>
    </div>
  );
}
