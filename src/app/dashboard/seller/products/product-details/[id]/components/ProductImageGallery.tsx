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
    <div>
      <div className="w-full flex gap-6 h-76">
        <Image
          src={selectedImage?.large || "/placeholder.png"}
          alt={selectedImage?.alt_text || "Product image"}
          height={410}
          width={397}
          className="w-full md:max-w-76 h-76 object-cover"
        />

        {images.length > 1 && (
          <div className="flex gap-4 h-full w-full flex-col overflow-y-auto hcustom-scroll">
            {images.map((thumb, index) => (
              <button
                key={thumb.id}
                onMouseEnter={() => {
                  setSelectedImageId(thumb.id);
                  setActiveSlide(index);
                }}
                className={`w-c66-81 flex-shrink-0 ${
                  activeSlide === index
                    ? "my-gradient-border"
                    : "border-transparent"
                } transition-all duration-200`}
              >
                <Image
                  src={thumb.thumbnail}
                  alt={thumb.alt_text || "Thumbnail"}
                  width={64}
                  height={64}
                  className="object-cover w-16 h-16"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
