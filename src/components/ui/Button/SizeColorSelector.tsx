"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import NavButton from "@/assets/icons/thickNav.svg";
import SizeGuideModal from "../Modals/sizeGuideModal";
import { Product, Sizes, Variations } from "@/types/global";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  product: Product;

  setSelectedVariation: (variation: any) => void;
}

export default function SizeColorSelector({
  product,

  setSelectedVariation,
}: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = useSelector((state: RootState) => state.products.items);
  const selectedVariation = useSelector(
    (state: RootState) => state.selectedVariation
  );

  const groups = product?.grouped_variations || [];

  // Get the variation and size from grouped_variations (groups)
  const selectedVariationWithSize = groups
    ?.map((variation) => {
      const size = variation.sizes?.find(
        (s: Sizes) => s.variation_id === selectedVariation?.variation_id
      );
      if (size) return { variation, size };
    })
    .filter(Boolean)[0];

  // Access main values
  const mainValue = selectedVariationWithSize?.variation.main_value;
  const mainImage = selectedVariationWithSize?.variation.main_image;

  const stableGroups = useMemo(() => groups, [groups.length]);
  const stableSelectedVariation = useMemo(
    () => selectedVariation,
    [selectedVariation?.variation_id]
  );
  
  useEffect(() => {
    if (stableGroups.length === 0 || !stableSelectedVariation?.variation_id)
      return;

    if (selectedColor !== null || selectedSize !== null) return;

    const matched = stableGroups
      .map((variation) => {
        const size = variation.sizes?.find(
          (s: Sizes) => s.variation_id === stableSelectedVariation.variation_id
        );
        if (size) return { variation, size };
      })
      .filter(Boolean)[0];

    if (matched) {
      setSelectedColor(matched.variation.main_value);
      setSelectedSize(matched.size.size);

      setSelectedVariation({
        ...matched.size,
        main_value: matched.variation.main_value,
        main_image: matched.variation.main_image,
      });
    } else {
      const firstGroup = stableGroups[0];
      const firstSize = firstGroup.sizes[0];

      setSelectedColor(firstGroup.main_value);
      setSelectedSize(firstSize.size);

      setSelectedVariation({
        ...firstSize,
        main_value: firstGroup.main_value,
        main_image: firstGroup.main_image,
      });
    }
  }, [stableGroups, stableSelectedVariation]);

  // ⭐ When user selects a color
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);

    const group = groups.find((g) => g.main_value === color);
    if (!group) return;

    const firstSize = group.sizes[0];
    setSelectedSize(firstSize.size);

    setSelectedVariation({
      ...firstSize,
      main_value: group.main_value,
      main_image: group.main_image,
    });
  };

  // ⭐ When user selects a size
  const handleSizeSelect = (size: string | number) => {
    if (!selectedColor) return;

    setSelectedSize(size);

    const group = groups.find((g) => g.main_value === selectedColor);
    const sizeData = group?.sizes.find((s: any) => s.size === size);

    console.log("Size Data:", sizeData);

    if (sizeData) {
      setSelectedVariation({
        ...sizeData,
        main_value: group.main_value,
        main_image: group.main_image,
      });
    }
  };

  const currentGroup = groups.find((g) => g.main_value === selectedColor);

  console.log("yyyyyyyyyyyyyyyyyyyy", currentGroup);

  return (
    <div className="md:pt-c24 pt-4 w-full">
      {/* Color selection */}
      {currentGroup && (
        <div className="mt-5">
          <div className="flex justify-between items-center mb-4">
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

          <div className="flex gap-2 overflow-auto  no-scrollbar md:flex-wrap">
            {currentGroup.sizes.map((sizeObj: any) => (
              <button
                key={sizeObj.size}
                onClick={() => handleSizeSelect(sizeObj.size)}
                className={`h-c47 w-c44 border rounded-lg text-sm font-MontserratSemiBold ${
                  selectedSize === sizeObj.size
                    ? "border-ff715b"
                    : "border-gray-300"
                }`}
              >
                {sizeObj.size}
              </button>
            ))}
          </div>
        </div>
      )}
      {groups.length > 0 && (
        <div>
          <p className="md:my-c24 mb-2 text-sm font-MontserratSemiBold">
            Color:
          </p>
          <div className="flex gap-4.5 overflow-x-auto no-scrollbar pb-2">
            {groups.map((group) => (
              <button
                key={group.main_value}
                onClick={() => handleColorSelect(group.main_value)}
                className={`flex flex-col items-center transition w-c48 h-c48 ${
                  selectedColor === group.main_value
                    ? "border border-ff715b"
                    : ""
                }`}
              >
                <div
                  className={`w-full h-c24 shadow bg-${group.main_value
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  // style={{
                  //   backgroundImage: `url(${group.main_image})`,
                  //   backgroundSize: "cover"
                  // }}
                ></div>
                <span className="mt-2 text-c12 font-MontserratMedium">
                  {group.main_value}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <SizeGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="clothes"
      />
    </div>
  );
}
