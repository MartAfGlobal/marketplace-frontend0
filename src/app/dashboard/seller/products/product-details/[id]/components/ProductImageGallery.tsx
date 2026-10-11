import Image from "next/image";

/**
 * Displays the main product image and an image thumbnail strip for quick selection.
 * This component keeps the current selection in sync with the parent page state so the
 * large preview always reflects the thumbnail the seller is hovering or viewing.
 */
interface ProductImageGalleryProps {
  /** Full list of image objects for this product. */
  images: any[];
  /** Id of the image currently selected for the main preview. */
  selectedImageId: string | null;
  /** Current slide index, used for highlighting the active thumbnail. */
  activeSlide: number;
  /** Updates the selected preview image from the thumbnail strip. */
  setSelectedImageId: (id: string) => void;
  /** Keeps the active thumbnail highlight in sync with the current image. */
  setActiveSlide: (index: number) => void;
}

export default function ProductImageGallery({
  images,
  selectedImageId,
  activeSlide,
  setSelectedImageId,
  setActiveSlide,
}: ProductImageGalleryProps) {
  // If the exact selected image is missing, fall back to the first one in the set.
  const selectedImage = images.find((img) => img.id === selectedImageId) || images[0];

  return (
    <div className="w-full max-w-[392px]">
      {/* Main preview sits on the left and the thumbnails appear to the side when more than one image exists. */}
      <div className="flex flex-row gap-4 md:gap-6 w-full items-start">
        <div className="flex-1 min-w-0">
          <Image
            src={selectedImage?.large || "/placeholder.png"}
            alt={selectedImage?.alt_text || "Product image"}
            height={304}
            width={392}
            unoptimized
            className="w-full  h-[266px] lg:max-h-[410px] object-cover "
          />
        </div>

        {images.length > 1 && (
          <div className="flex flex-col gap-4 lg:gap-2 w-13.5 sm:w-13.5 md:w-20 lg:w-24 flex-shrink-0 max-h-[410px] overflow-y-auto hcustom-scroll">
            {images.map((thumb, index) => (
              <button
                key={thumb.id}
                onMouseEnter={() => {
                  setSelectedImageId(thumb.id);
                  setActiveSlide(index);
                }}
                className={`w-full aspect-square lg:h-16 lg:w-16  flex-shrink-0 ${
                  activeSlide === index ? "my-gradient-border" : "border-transparent"
                } transition-all duration-200 overflow-hidden rounded`}
              >
                <Image
                  src={thumb.thumbnail}
                  alt={thumb.alt_text || "Thumbnail"}
                  width={64}
                  height={64}
                  unoptimized
                  className="object-cover md:w-full md:h-full w-13.5 h-13.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
