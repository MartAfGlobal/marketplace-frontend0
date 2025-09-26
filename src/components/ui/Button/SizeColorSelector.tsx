"use client";

import { useState } from "react";
import Image from "next/image";
import NavButton from "@/assets/icons/thickNav.svg";
import SizeGuideModal from "../Modals/sizeGuideModal";
import { Product } from "@/types/global";

interface Props {
  product: Product;
}

// ✅ Map color names to hex codes (extend this as needed)
const colorHexMap: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#D30B0B",
  blue: "#0389F8",
  green: "#128807",
  yellow: "#FFD700",
  pink: "#FFC0CB",
  gray: "#808080",
};

export default function SizeColorSelector({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Extract variations safely
  const variations = product?.variations || [];

  const sizes = Array.from(
    new Set(variations.map((v) => v.size).filter(Boolean))
  ) as (string | number)[];

  const colors = Array.from(
    new Map(
      variations
        .filter((v) => !!v.color)
        .map((v) => {
          const colorName = (v.color || "").toLowerCase();
          return [
            colorName,
            { name: v.color!, code: colorHexMap[colorName] || "#CCCCCC" },
          ];
        })
    ).values()
  );

  // ✅ Decide which size guide to show
  const category = product?.category?.toLowerCase() || "";
  let sizeGuideType: "mens-shoes" | "womens-shoes" | "clothes" = "clothes";

  if (category.includes("men") && category.includes("shoe")) {
    sizeGuideType = "mens-shoes";
  } else if (category.includes("women") && category.includes("shoe")) {
    sizeGuideType = "womens-shoes";
  }

  return (
    <div className="md:pt-c24 pt-4  w-full">
      {/* Size buttons */}
      {sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 md:mb-c24">
            <p className="font-MontserratSemiBold text-sm">Size guide</p>
            <button onClick={() => setIsModalOpen(true)}>
              <Image
                src={NavButton}
                alt="nav button"
                width={7.5}
                height={13.75}
              />
            </button>
          </div>

          <div className="flex gap-2 overflow-auto w-full pb-2 no-scrollbar md:flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size ?? null)}
                className={`h-c47 w-c44 border rounded-lg transition text-sm flex-shrink-0 font-MontserratSemiBold text-000000
                  ${
                    selectedSize === size ? "border-ff715b" : "border-gray-300"
                  }
                  hover:bg-ff715b hover:text-000000`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selection */}
      {colors.length > 0 && (
        <div className="mt-c24">
          <p className="md:mb-c24 mb-2 text-sm font-MontserratSemiBold text-161616">
            Color:
          </p>
          <div className="flex gap-4.5">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name ?? null)}
                className={`flex flex-col items-center transition w-c48 h-c48
                  ${
                    selectedColor === color.name
                      ? "border border-ff715b"
                      : ""
                  }`}
              >
                <div
                  className="w-full h-c24 shadow"
                  style={{ backgroundColor: color.code }}
                ></div>
                <span className="mt-2 text-c12 font-MontserratMedium">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <SizeGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={sizeGuideType}
      />
    </div>
  );
}
