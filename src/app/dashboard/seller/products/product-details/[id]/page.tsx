"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SellerProductDetails } from "@/types/global";
import { useHttp } from "@/hooks/use-http";

import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import Trash from "@/assets/icons/trashWhite.svg";

import ProductDetailsSkeleton from "@/components/reloadSpinner/ProductDetailsSkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ResultModal from "@/components/ui/forms/resultModal";

import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

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
  const [deactivate, setDeactivate] = useState(false);


  /* ------------------------- HTTP HOOKS ------------------------- */

  const { sendHttpRequest, loading } = useHttp();
  const { sendHttpRequest: deleteReq, loading: deleteLoading } = useHttp();
  const { sendHttpRequest: submitReq, loading: submiting } = useHttp();


  /* ------------------------- CUSTOM HOOK ------------------------- */

  const {
    activateProduct,
    loading: ActivatingLoading,
    success: ActivationSuccess,
    setIsActive,
    activated,
    cancelProductRequest,
    successMessage,
  } = useFetchProducts(id);


  /* ------------------------- DERIVED VALUES ------------------------- */

 const isDeactivation = successMessage === "Deactivation request cancelled.";


const modalDescription = isDeactivation
  ? "Your request to deactivate this product has been cancelled. The product will remain active and visible to customers."
  : "Your request to activate this product has been cancelled. The product will remain inactive until you submit a new activation request.";


  const url =
    published === "true"
      ? `/products/manufacturer/products/${id}/`
      : `/products/manufacturer/drafts/${id}/`;

  const images =
    productDetails?.images?.length
      ? productDetails.images
      : productDetails?.draft_data?.product_images?.map((img: any, index: number) => ({
          id: img.cloudinary_id || index.toString(),
          thumbnail: img.url,
          medium: img.url,
          large: img.url,
          alt_text: img.alt_text || productDetails?.name,
        })) || [];

  const variations =
    productDetails?.variations ||
    productDetails?.draft_data?.variations ||
    [];


  /* ------------------------- EFFECTS ------------------------- */

  useEffect(() => {
    if (!id || !token) return;

    sendHttpRequest({
      requestConfig: {
        url,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        setProductDetails(responseData?.data);
      },
    });
  }, [id, token, sendHttpRequest]);



  useEffect(() => {
    if (!productDetails) return;

    if (productDetails.is_active) {
      setIsActive(true);
    }
  }, [productDetails]);


  useEffect(() => {
    if (images.length) {
      setSelectedImageId(images[0].id);
      setActiveSlide(0);
    }
  }, [images]);


  useEffect(() => {
    if (activated) {
      setDeactivate(false);
    }
  }, [activated]);


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
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: () => {
        setDeleteDraftSuccess(true);
      },
    });
  };


  const handleSubmitDraftProduct = () => {
    if (!token || !id) return;

    submitReq({
      requestConfig: {
        url: `/products/manufacturer/drafts/${id}/publish/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setSuccessful(true);
      },
    });
  };


  /* ------------------------- LOADING STATE ------------------------- */

  if (!productDetails || loading) {
    return <ProductDetailsSkeleton />;
  }


  /* ------------------------- SELECTED IMAGE ------------------------- */

  const selectedImage = images.find((img) => img.id === selectedImageId);


  /* ------------------------- UI ------------------------- */



  //  const selectedImage = images.find((img) => img.id === selectedImageId);
  return (
    <div className="w-full flex justify-center gap-c48  bg-ffffff  circle-shadow rounded-c16 py-6 px-8 relative">
      <div className="w-full">
        <div>
          <div>
            <div
              // className={`w-full md:max-w-94.75 md:pb-12 ${
              //   isModal ? "h-127.25 overflow-scroll no-scrollbar" : ""
              // }`}
              className="w-full   flex gap-6 h-76"
            >
              <Image
                src={selectedImage?.large || "/placeholder.png"}
                alt={selectedImage?.alt_text || "imgae"}
                height={410}
                width={397}
                className="w-full  md:max-w-76 h-76"
              />

              {/* <div className=" gap-2 mt-4 hidden">
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
            </div> */}
              {images.length > 1 && (
                <div className="flex gap-4 h-full w-full flex-col overflow-y-auto hcustom-scroll">
                  {" "}
                  {images.map((thumb, index) => (
                    <button
                      key={thumb.id}
                      onMouseEnter={() => {
                        setSelectedImageId(thumb.id);
                        setActiveSlide(index);
                      }}
                      className={`w-c66-81  flex-shrink-0    ${
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
                        className="object-cover w-16 h-16"
                      />{" "}
                    </button>
                  ))}{" "}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <div className="space-y-2">
            <h2 className="text-base font-MontserratNormal">Quantity sold</h2>
            <p className="text-c20 font-MontserratNormal ">
              {productDetails?.sold || 0}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-MontserratNormal">
              Quantity in stock
            </h2>
            <p className="text-c20 font-MontserratNormal text-000000/78">
              {productDetails.inventory ||
                (productDetails as any).quantity ||
                0}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-1">
          <h1 className="text-c12 font-MontserratNormal">Product name</h1>
          <p className="text-c18 font-MontserratMedium">
            {productDetails?.name || "Product name not available"}
          </p>
        </div>
        <div className="mt-4 space-y-1">
          <h1 className="text-c12 font-MontserratNormal">Status</h1>
          <p className="text-c18 font-MontserratMedium">
            {published === "true"
              ? productDetails?.is_active
                ? "Live"
                : "Inactive"
              : "Draft"}
          </p>
        </div>
        <div className="mt-4 space-y-1">
          <h1 className="text-c12 font-MontserratNormal">Price</h1>
          <p className="text-c24 font-MontserratSemiBold">
            N{productDetails?.base_price}
          </p>
        </div>
        <div className="mt-6 flex gap-6">
          <div>
            <h1 className="text-c12 font-MontserratNormal">Category</h1>
            <p className="text-c18 font-MontserratMedium">
              {productDetails?.category?.name ||
                productDetails.category_info?.category.name ||
                "N/A"}
            </p>
          </div>
          <div>
            <h1 className="text-c12 font-MontserratNormal">Subcategory</h1>
            <p className="text-c18 font-MontserratMedium">
              {productDetails?.category?.subcategory?.name ||
                productDetails.category_info?.subcategory?.name ||
                "N/A"}
            </p>
          </div>
          <div>
            <h1 className="text-c12 font-MontserratNormal">Stock code</h1>
            {!published && (
              <p className="text-c18 font-MontserratMedium">
                {productDetails?.stockcode || "N/A"}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-sm font-MontserratSemiBold">
            Product description
          </h1>
          <div className=" text-c12 font-MontserratNormal prose max-w-none prose-p:mt-0 prose-p:mb-0">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  productDetails?.description_html ||
                  productDetails?.description ||
                  "",
              }}
            />
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-sm font-MontserratSemiBold">
            Product specification
          </h1>
          <div className=" text-c12 font-MontserratNormal prose max-w-none prose-p:mt-0 prose-p:mb-0">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  productDetails?.specifications_html ||
                  productDetails?.draft_data?.specifications_text ||
                  "",
              }}
            />
            <p>{}</p>
          </div>
        </div>
      </div>
      <div className="w-full mb-c32">
        <div className="w-full flex gap-6  justify-end">
          {published &&
            productDetails.activation_requested === false &&
            productDetails.deactivation_requested === false &&
            productDetails.is_approved !== "pending" && (
              <Button
                onClick={() =>
                  router.push(`/dashboard/seller/products/edit/${id}`)
                }
                className="max-w-41.75"
              >
                Edit product
              </Button>
            )}

          {published &&
          productDetails.is_active &&
          productDetails.is_approved === "approved" &&
          productDetails.deactivation_requested === false ? (
            <Button
              onClick={() => setDeactivate(true)}
              className="max-w-41.75  bg-ca0202"
            >
              Deactivate product
            </Button>
          ) : published &&
            productDetails.is_active === false &&
            productDetails.activation_requested === false &&
            productDetails.is_approved === "approved" ? (
            <Button
              disabled={ActivatingLoading}
              onClick={() => setDeactivate(true)}
              className="max-w-41.75"
              variant="primary"
            >
              {ActivatingLoading ? <LoadingSpinner /> : "Activate product"}
            </Button>
          ) : published && productDetails.activation_requested ? (
            <Button
              disabled={ActivatingLoading}
              onClick={handleCancelRequest}
              className="max-w-41.75"
              variant="primary"
            >
              {ActivatingLoading? <LoadingSpinner/>: "Cancel activation"}
            </Button>
          ) : published && productDetails.deactivation_requested ? (
            <Button
              disabled={ActivatingLoading}
              onClick={handleCancelRequest}
              className="max-w-41.75"
              variant="primary"
            >
             {ActivatingLoading? <LoadingSpinner/>: "Cancel deactivation"}
            </Button>
          ) : published &&
            !productDetails.activation_requested &&
            !productDetails.deactivation_requested &&
            productDetails.is_approved === "pending" ? (
            <Button
              disabled={ActivatingLoading}
              onClick={handleActivateToggle}
              className="max-w-41.75"
              variant="primary"
            >
              Cancel submission
            </Button>
          ) : (
            !published && (
              <Button
                disabled={submiting || !id}
                onClick={handleSubmitDraftProduct}
                className="max-w-41.75"
                variant="primary"
              >
                {submiting ? <LoadingSpinner /> : "Submit for review"}
              </Button>
            )
          )}
          {!published && (
            <button
              onClick={handleDeleteDraft}
              className="bg-ca0202 rounded-c8 flex items-center justify-center w-c48 flex-shrink-0"
            >
              {deleteLoading ? (
                <LoadingSpinner />
              ) : (
                <Image src={Trash} alt="Delete" width={18.12} height={19.63} />
              )}
            </button>
          )}
        </div>
        <p className="text-c18 font-MontserratSemiBold mt-c32">Variants</p>
        <div className="grid grid-cols-2 gap-y-12 gap-x-16 mt-c48">
          {variations.map((variant, index) => (
            <div
              key={variant.id ?? `variant-${index}`}
              className="flex gap-6 bg"
            >
              <div className="space-y-4">
                <Image
                  src={
                    variant.main_image_url ||
                    variant.images[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={variant.name || `Variant ${index + 1}`}
                  width={96}
                  height={96}
                />
                <div className="mt-4 space-y-1">
                  <h1 className="text-c12 font-MontserratNormal">
                    Variant name
                  </h1>
                  <p className="text-base flex-nowrap  font-MontserratSemiBold">
                    {variant.name}
                  </p>
                </div>
                <div className="mt-4 space-y-1">
                  <h1 className="text-c12 font-MontserratNormal">Price</h1>
                  <p className="text-base font-MontserratSemiBold">
                    N{variant.base_price}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-c12 font-MontserratNormal">
                {Object.entries(variant.attribute_summary || {}).map(
                  ([attribute, value]) => (
                    <div
                      key={attribute}
                      className="flex gap-4 text-c12 font-MontserratNormal"
                    >
                      <div className="flex flex-col gap-1">
                        <p>Attribute</p>
                        <span className="font-semibold">{attribute}:</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p>Value</p>
                        <span>{value}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ResultModal
        title="Product deleted from draft"
        message="Your product has been Deleted from draft."
        discRescription="Your product has been successfully deleted from the draft."
        buttenText="Go to Products"
        isOpen={DeleteDraftSuccess}
        onConfirm={() => router.push("/dashboard/seller/products")}
      />

            <ResultModal
        title="Product deleted from draft"
        message="Your product has been Deleted from draft."
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
        title={successMessage || ""}
       
        discRescription={modalDescription}
        buttenText="Go to Products"
        isOpen={activated}
        onConfirm={() => router.push("/dashboard/seller/products")}
      />

      <ResultModal
        result="warning"
        title="Are you sure you want to deactivate this product?"
        discRescription="deactivating this product removes it from live viewing and ordering"
        onCancel={() => setDeactivate(false)}
        loading={ActivatingLoading}
        buttenText="Yes, I accept"
        isOpen={deactivate}
        onConfirm={handleActivateToggle}
      />
    </div>
  );
}
