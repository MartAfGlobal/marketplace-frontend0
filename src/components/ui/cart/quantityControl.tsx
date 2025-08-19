"use client";
import { useState } from "react";
import { QuantitySelectorProps } from "@/types/global";

export default function QuantitySelector({
  productId,
  initialQty = 1,
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
  const [quantity, setQuantity] = useState(initialQty);

  const handleDecrease = () => {
    setQuantity((prev) => {
      const newQty = Math.max(prev - 1, 1);
      onChange?.(newQty, productId);
      return newQty;
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newQty = prev + 1;
      onChange?.(newQty, productId);
      return newQty;
    });
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
      <span className={`text-center font-MontserratSemiBold ${quantityFont} md:text-c18`}>
        {quantity}
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
