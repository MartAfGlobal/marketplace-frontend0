import Image from "next/image";

interface ProductImageGalleryProps {
  images: any[];
  selectedImageId: string | null;
  activeSlide: number;
  setSelectedImageId: (id: string) => void;
  setActiveSlide: (index: number) => void;
}

export default function ProductImageGallery({
  images,
  selectedImageId,
  activeSlide,
  setSelectedImageId,
  setActiveSlide,
}: ProductImageGalleryProps) {
  const selectedImage = images.find((img) => img.id === selectedImageId) || images[0];

    return (
      <div className="w-full max-w-[392px]">
        {/* Main container: row layout, responsive */}
        <div className="flex flex-row gap-4 md:gap-6 w-full items-start">
          <div className="flex-1 min-w-0">
            <Image
              src={selectedImage?.large || "/placeholder.png"}
              alt={selectedImage?.alt_text || "Product image"}
              height={304}
              width={392}
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
