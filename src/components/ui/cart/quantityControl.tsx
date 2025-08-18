"use client";
import { useState } from "react";
import { QuantitySelectorProps } from "@/types/global";

export default function QuantitySelector({ productId, initialQty = 1, onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQty);

  const handleDecrease = () => {
    setQuantity((prev) => {
      const newQty = Math.max(prev - 1, 1);
      if (onChange) onChange(newQty, productId); // ✅ send productId too
      return newQty;
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newQty = prev + 1;
      if (onChange) onChange(newQty, productId); // ✅ send productId too
      return newQty;
    });
  };

  return (
    <div className="flex md:items-center gap-3">
      <button
        onClick={handleDecrease}
        className="md:w-6 md:h-6  w-7.5 h-7.5 rounded-full flex items-center justify-center border border-ff715b hover:bg-ff715b hover:text-ffffff text-ff715b hover:border-0 transition"
      >
        -
      </button>
      <span className=" text-center text-161616 font-MontserratSemiBold text-c18">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        className="md:w-6 md:h-6 rounded-full w-7.5 h-7.5  text-ffffff bg-ff715b flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
