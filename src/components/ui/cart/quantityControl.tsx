"use client";
import { QuantitySelectorProps } from "@/types/global";

export default function QuantitySelector({
  productId,
  quantity = 1,
  
   
  onChange,
  // Mobile colors (apply only below md)
  increaseBg = "bg-ff715b",
  increaseText = "text-ffffff",
  decreaseBorder = "border-ff715b",
  decreaseText = "text-ff715b",
  hoverDecreaseBg = "hover:bg-ff715b",
  hoverDecreaseText = "hover:text-ffffff",
  // Sizes
  buttonWidth = "w-7.5",
  buttonHeight = "h-7.5",
  quantityFont = "text-c18",
}: QuantitySelectorProps & {
  buttonWidth?: string;
  buttonHeight?: string;
  quantityFont?: string;
}) {
  // Ensure quantity is always a valid number
  const safeQty = Number(quantity) || 1;

  const handleDecrease = () => {
    if (safeQty > 1) onChange?.(safeQty - 1, productId);
  };

  const handleIncrease = () => {
    onChange?.(safeQty + 1, productId);
  };

  return (
    <div className="flex md:items-center gap-3">
      {/* Decrease Button */}
      <button
        onClick={handleDecrease}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center justify-center border ${decreaseBorder} ${decreaseText} ${hoverDecreaseBg} ${hoverDecreaseText} hover:border-0 transition
          md:border-ff715b md:text-ff715b md:hover:bg-transparent md:hover:text-ff715b`}
      >
        -
      </button>

      {/* Quantity Display */}
      <span
        className={`text-center font-MontserratSemiBold ${quantityFont} md:text-c18`}
      >
        {safeQty}
      </span>

      {/* Increase Button */}
      <button
        onClick={handleIncrease}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center justify-center ${increaseBg} ${increaseText} 
          md:bg-ff715b md:text-ffffff`}
      >
        +
      </button>
    </div>
  );
}
