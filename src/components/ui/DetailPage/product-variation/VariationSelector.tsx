"use client";

import Image from "next/image";
import NavButton from "@/assets/icons/thickNav.svg";
import { ProductDetail, VariationOption } from "@/types/global";
import { getColorHex } from "./productVariationUtils";

interface VariationSelectorProps {
  productDetails: ProductDetail | null;
  selectedAttributes: Record<string, string>;
  missingAttribute: string | null;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  onSelectAttribute: (attributeName: string, value: string) => void;
  onOpenSizeGuide: () => void;
  onReset: () => void;
  getAvailableValues: (attributeName: string) => string[];
}

export default function VariationSelector({
  productDetails,
  selectedAttributes,
  missingAttribute,
  sectionRef,
  onSelectAttribute,
  onOpenSizeGuide,
  onReset,
  getAvailableValues,
}: VariationSelectorProps) {
  const hasSelectedAttributes = Object.values(selectedAttributes).some(
    (value) => value !== ""
  );
  const hasVariations =
    productDetails?.has_variations ||
    (productDetails?.variations && productDetails.variations.length > 0);

  if (!hasVariations) return null;

  return (
    <>
      <div
        ref={sectionRef}
        className="flex flex-col gap-4 mt-6"
      >
        <h2 className="font-MontserratSemiBold">Variations available</h2>

        {missingAttribute && (
          <p className="text-red-500 text-sm font-MontserratSemiBold">
            Please select {missingAttribute}
          </p>
        )}

        <div className="flex flex-col gap-5">
          {Object.values(productDetails.variation_options)
            // Sizes are prioritized; other options follow their configured order.
            .sort((a, b) => {
              const aIsSize = a.attribute_name?.toLowerCase().includes("size");
              const bIsSize = b.attribute_name?.toLowerCase().includes("size");
              if (aIsSize && !bIsSize) return -1;
              if (!aIsSize && bIsSize) return 1;
              return (a.display_order ?? 0) - (b.display_order ?? 0);
            })
            .map((variation: VariationOption) => {
              const name = variation.attribute_name;
              const isSize = name?.toLowerCase().includes("size");
              const isColor =
                name?.toLowerCase().includes("color") ||
                name?.toLowerCase().includes("colour");

              const optionValues: string[] =
                variation.values?.map((value) =>
                  typeof value === "string" ? value : value.value
                ) ?? [];
              const compatibleValues = getAvailableValues(name);
              const values =
                optionValues.length > 0
                  ? productDetails.variations?.length
                    ? optionValues.filter((value) =>
                        compatibleValues.includes(value)
                      )
                    : optionValues
                  : compatibleValues;

              if (isSize) {
                return (
                  <div
                    key={variation.attribute_id || name}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-MontserratSemiBold text-sm text-161616">
                        Size guide
                      </p>
                      <button
                        type="button"
                        onClick={onOpenSizeGuide}
                        className="p-1 hover:opacity-75 transition-opacity"
                        aria-label="Size guide"
                      >
                        <Image
                          src={NavButton}
                          alt="nav button"
                          width={7.5}
                          height={13.75}
                        />
                      </button>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar flex-wrap pb-1">
                      {values.map((value) => {
                        const isSelected = selectedAttributes[name] === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => onSelectAttribute(name, value)}
                            className={`w-c44 h-c47 border rounded-lg flex items-center justify-center text-sm font-MontserratSemiBold transition-colors ${
                              isSelected
                                ? "border-ff715b text-161616 shadow-xs"
                                : "border-gray-300 text-161616 bg-white hover:border-gray-400"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (isColor) {
                return (
                  <div
                    key={variation.attribute_id || name}
                    className="flex flex-col gap-2.5"
                  >
                    <p className="font-MontserratSemiBold text-sm text-161616">
                      {name}:
                    </p>

                    <div className="flex gap-3 overflow-x-auto no-scrollbar flex-wrap pb-2">
                      {values.map((value) => {
                        const isSelected = selectedAttributes[name] === value;
                        const valueObject = variation.values?.find(
                          (option) =>
                            (typeof option === "string"
                              ? option
                              : option.value) === value
                        );
                        const hex = getColorHex(
                          value,
                          valueObject?.extra_data
                        );

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => onSelectAttribute(name, value)}
                            className={`flex flex-col items-center justify-between w-c48 min-h-c48 px-1 pt-1 transition-all rounded-none cursor-pointer focus:outline-none ${
                              isSelected
                                ? "border border-ff715b"
                                : "border border-transparent hover:border-gray-200"
                            }`}
                          >
                            <div
                              className="w-full h-c24 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="mt-2 text-c12 font-MontserratNormal text-161616 text-center select-none capitalize">
                              {value}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={variation.attribute_id || name}
                  className="flex flex-col gap-2.5"
                >
                  <p className="font-MontserratSemiBold text-sm text-161616">
                    {name}:
                  </p>

                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar flex-wrap pb-1">
                    {values.map((value) => {
                      const isSelected = selectedAttributes[name] === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSelectAttribute(name, value)}
                          className={`h-10 px-3.5 border rounded-lg flex items-center justify-center text-sm font-MontserratMedium transition-colors ${
                            isSelected
                              ? "border-ff715b text-161616 bg-ff715b/5 font-MontserratSemiBold"
                              : "border-gray-300 text-gray-700 bg-white hover:border-gray-400"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {hasSelectedAttributes && (
        <div className="w-full flex items-center justify-end pt-2">
          <button
            onClick={onReset}
            className="text-ff715b font-MontserratNormal text-sm hover:underline"
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
}
