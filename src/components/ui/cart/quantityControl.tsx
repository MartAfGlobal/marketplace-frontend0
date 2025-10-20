"use client";
import { QuantitySelectorProps } from "@/types/global";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "@/store/cart/cartSlice";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";

type QuantitySelectorPropsWithBackend = Omit<QuantitySelectorProps, "productId"> & {
  productId?: string | number;
  token?: string;
  buttonWidth?: string;
  buttonHeight?: string;
  quantityFont?: string;
};

export default function QuantitySelector({
  productId,
  quantity = 1,
  onChange,
  token,
  increaseBg = "bg-ff715b",
  increaseText = "text-ffffff",
  decreaseBorder = "border-ff715b",
  decreaseText = "text-ff715b",
  hoverDecreaseBg = "hover:bg-ff715b",
  hoverDecreaseText = "hover:text-ffffff",
  buttonWidth = "w-6 md:w-7.5",
  buttonHeight = "h-6 md:h-7.5",
  quantityFont = "text-sm",
}: QuantitySelectorPropsWithBackend) {
  const [safeQty, setSafeQty] = useState(Number(quantity) || 1);
  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemExistsInCart = productId && cartItems.some((i) => i.product_id === productId);

  const updateBackendQuantity = async (newQty: number) => {
    if (!token || !productId) return;

   await sendHttpRequest({
  requestConfig: {
    url: `/cart/item/${productId}/update_quantity/`,
    method: "PATCH",
    body: { quantity: newQty },
    token,
    isAuth: true,
    userType: "buyer",
    successMessage: "Quantity updated successfully!",
  },
  successRes: () => {}, // ✅ Added empty callback
});

  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setSafeQty(newQty);
    onChange?.(newQty, productId);

    // ✅ Only update Redux if item already exists in cart
    if (itemExistsInCart) {
      dispatch(updateQuantity({ id: productId, quantity: newQty }));
    }

    // ✅ Sync backend only if logged in and in cart
    if (token && itemExistsInCart) {
      await updateBackendQuantity(newQty);
    }
  };

  return (
    <div className="flex md:items-center gap-2 md:gap-3">
      <button
        onClick={() => handleQuantityChange(safeQty - 1)}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center justify-center border ${decreaseBorder} ${decreaseText} ${hoverDecreaseBg} ${hoverDecreaseText} hover:border-0 transition
          md:border-ff715b md:text-ff715b md:hover:bg-transparent md:hover:text-ff715b`}
      >
        -
      </button>

      <span className={`text-center font-MontserratSemiBold text-sm ${quantityFont} md:text-c18`}>
        {safeQty}
      </span>

      <button
        onClick={() => handleQuantityChange(safeQty + 1)}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center justify-center ${increaseBg} ${increaseText} md:bg-ff715b md:text-ffffff`}
      >
        +
      </button>
    </div>
  );
}
