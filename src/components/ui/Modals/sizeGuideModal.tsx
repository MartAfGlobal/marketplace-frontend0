"use client";

import Image from "next/image";
import { useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "mens-shoes" | "womens-shoes" | "clothes";
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  type,
}: SizeGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ Map of images
  const sizeGuideImages: Record<string, string> = {
    "mens-shoes": "/images/size-charts/mens-shoes.png",
    "womens-shoes": "/images/size-charts/womens-shoes.png",
    clothes: "/images/size-charts/clothes.png",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Modal container */}
      <div className="bg-white rounded-xl shadow-lg p-4 w-[90%] max-w-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-black transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Size Guide</h2>

        {/* Image */}
        <div className="w-full">
          <Image
            src={sizeGuideImages[type]}
            alt={`${type} size chart`}
            width={800}
            height={600}
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
