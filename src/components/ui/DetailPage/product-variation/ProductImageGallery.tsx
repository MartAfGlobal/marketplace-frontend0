"use client";

import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import {
  ProductDetail,
  ProductVariation as ProductVariationData,
} from "@/types/global";
import { useEffect, useState } from "react";
import {
  getImageUrl,
  getThumbUrl,
  ProductImageValue,
} from "./productVariationUtils";

interface ProductImageGalleryProps {
  productDetails: ProductDetail | null;
  selectedVariation: ProductVariationData | null;
  isModal: boolean;
}

export default function ProductImageGallery({
  productDetails,
  selectedVariation,
  isModal,
}: ProductImageGalleryProps) {
  // A selected variation's images take precedence over the product gallery.
  const productImages = Array.isArray(productDetails?.images)
    ? productDetails.images
    : [];
  const variationImages: ProductImageValue[] = [];

  if (
    selectedVariation?.images &&
    Array.isArray(selectedVariation.images) &&
    selectedVariation.images.length > 0
  ) {
    variationImages.push(...selectedVariation.images);
  } else if (selectedVariation?.main_image_url) {
    variationImages.push(selectedVariation.main_image_url);
  }

  const images = variationImages.length > 0 ? variationImages : productImages;
  const firstImage = images[0];
  const firstImageId = firstImage
    ? typeof firstImage === "object"
      ? firstImage.id || getImageUrl(firstImage) || null
      : firstImage
    : null;

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setSelectedImageId(firstImageId);
    setActiveSlide(0);
  }, [firstImageId]);

  const productWithImageFallbacks = productDetails as
    | (ProductDetail & {
        thumbnail?: string;
        image?: string;
        cover_image?: string;
      })
    | null;
  const productImageSource =
    productWithImageFallbacks?.thumbnail ||
    productWithImageFallbacks?.image ||
    productWithImageFallbacks?.cover_image ||
    productDetails?.main_image ||
    (Array.isArray(productDetails?.images) && productDetails.images.length > 0
      ? getImageUrl(productDetails.images[0])
      : "");

  const selectedImage = images.find((img) => {
    const imageId =
      typeof img === "object" ? img?.id || getImageUrl(img) : img;
    return imageId === selectedImageId;
  });

  const selectedImageUrl = getImageUrl(selectedImage);
  const firstImageUrl = images.length > 0 ? getImageUrl(images[0]) : "";
  const variationMainImage =
    selectedVariation?.main_image_url ||
    (selectedVariation?.images?.length
      ? getImageUrl(selectedVariation.images[0])
      : "");
  const mainImageSrc =
    selectedImageUrl || firstImageUrl || variationMainImage || productImageSource;

  return (
    <div
      className={`w-full md:max-w-[280px] lg:max-w-[320px] xl:max-w-[397px]    flex-shrink-0 ${
        isModal ? "h-fit  overflow-visible " : "h-fit"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-ffffff flex items-center justify-center md:max-w-full lg:max-w-[320px] xl:max-w-92.25 ${
          isModal ? "h-70" : "h-92.25"
        }`}
      >
        <ImageWithSkeleton
          src={mainImageSrc || null}
          alt={productDetails?.name || "Product image"}
          sizes="(max-width: 768px) 100vw, 397px"
          className="object-cover"
        />
      </div>

      {!productDetails ? (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-1 w-c40 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        images.length > 0 && (
          <div className="flex gap-2 mt-4">
            {images.map((img, i: number) => {
              const imgId =
                typeof img === "object" ? img?.id || getImageUrl(img) : img;
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
        )
      )}

      {!productDetails ? (
        <div className="flex gap-4 mt-6 mb-4 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-c66-81 h-17 flex-shrink-0 rounded-c12 bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        images.length > 1 && (
          <div className="flex gap-4 mt-6 mb-4 h-19  w-full overflow-x-auto  hcustom-scroll">
            {images.map((thumb, index: number) => {
              const thumbId =
                typeof thumb === "object"
                  ? thumb?.id || getImageUrl(thumb)
                  : thumb;
              const thumbSrc = getThumbUrl(thumb);
              const thumbAlt =
                typeof thumb === "object"
                  ? thumb.alt_text || "Thumbnail"
                  : "Thumbnail";
              return (
                <button
                  key={thumbId || index}
                  onMouseEnter={() => {
                    setSelectedImageId(thumbId);
                    setActiveSlide(index);
                  }}
                  onClick={() => {
                    setSelectedImageId(thumbId);
                    setActiveSlide(index);
                  }}
                  className={`relative w-c66-81 h-17 flex-shrink-0 border-2 rounded-c12 overflow-hidden ${
                    activeSlide === index
                      ? "my-gradient-border"
                      : "border-transparent"
                  } transition-all duration-200`}
                >
                  <ImageWithSkeleton
                    src={thumbSrc}
                    alt={thumbAlt}
                    sizes="64px"
                    className="object-cover w-full h-full"
                  />
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
