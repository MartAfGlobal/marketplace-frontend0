"use client";
import { QuantitySelectorProps } from "@/types/global";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGuestItemToCart,
  addToCart,
  updateQuantity,
} from "@/store/cart/cartSlice";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
type ColorItem = {
  main_value: string;
  main_image: string;
  sizes: Array<{
    variation_id: string;
    size: string;
    stock: number;
    sku: string;
    price: string;
  }>;
};

type QuantitySelectorPropsWithBackend = Omit<
  QuantitySelectorProps,
  "productId"
> & {
  productId: string;
  group_variation?: ColorItem;
  token?: string;
  buttonWidth?: string;
  buttonHeight?: string;
  quantityFont?: string;
  variation_id?: string;

};

export default function QuantitySelector({
  productId,
  variation_id,
  group_variation,
  quantity = 0,
  onChange,
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
  const dispatch = useDispatch();
  const { sendHttpRequest } = useHttp();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.items);
const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );
  const item = cartItems.find((i) => i.variation_id === variation_id);
  const initialQty = item?.quantity ?? Number(quantity) ?? 0;

  const [safeQty, setSafeQty] = useState(initialQty);

  useEffect(() => {
  const item = cartItems.find((i) => i.variation_id === variation_id);
  const qtyFromCart = item?.quantity ?? Number(quantity) ?? 0;
  setSafeQty(qtyFromCart);
}, [cartItems, variation_id, quantity]);

  const itemExistsInCart = Boolean(item);
  const token = useSelector((state: RootState) => state.token.token);
  const selectedSize = group_variation?.sizes.find(
    (s) => s.variation_id === variation_id
  );




 const variationDisplay = productDetails?.variations.find((p)=>p.id === variation_id)





  const addItemToCartBackend = async () => {
    if (!token || !productId) return;

    return sendHttpRequest({
      requestConfig: {
        url: `/cart/add`,
        method: "POST",
        body: {
          variation_id,
          quantity: 1,
        },
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Item added to cart!",
      },
      successRes: (res) => {
        console.log("Add to cart response:", res);  
        const price =
          selectedSize?.price ||
          products.find((p) => p.id === productId)?.base_price ||
          0;

        dispatch(
          addToCart({
             product_slug: products.find((p)=>p.id ===productId)?.slug || "",
            variation_display: variationDisplay?.name,
            id: productId,
            variation_id: variation_id || "",
            quantity: res.data.quantity , // first add is always 1
            product_image: group_variation?.main_image || "",
            price,
            price_at_purchase: price,
            product_name: products.find((p) => p.id === productId)?.name || "",
            checked: true,
            size: selectedSize?.size || "",
          })
        );
      },
    });
  };

 
  const updateBackendQuantity = async (newQty: number) => {
    if (!token || !variation_id) return;

    console.log("Updating backend quantity to:", newQty, variation_id);

    return sendHttpRequest({
      requestConfig: {
        url: `/cart/item/${variation_id}/update_quantity/`,
        method: "PATCH",
        body: { quantity: newQty },
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Quantity updated successfully!",
      },
      successRes: () => {},
    });
  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 0) return;
    if (safeQty === 0 && newQty === 1) {
      setSafeQty(1);
      onChange?.(1, productId);

      if (token) {
        await addItemToCartBackend();
      } else {
        dispatch(
          addGuestItemToCart({
            product_slug: products.find((p)=>p.id ===productId)?.slug || "",
            variation_display: variationDisplay?.name,
            id: productId,
            variation_id: variation_id || "",
            quantity: newQty,
            product_image: group_variation?.main_image || "",
            price:
              selectedSize?.price ||
              products.find((p) => p.id === productId)?.base_price ||
              "",
            product_name: products.find((p) => p.id === productId)?.name || "",
            checked: true,
            size: selectedSize?.size || "",
          })
        );
        toast.success("Item added to cart (offline mode)");
      }

      return;
    }

    if (newQty >= 1) {
      setSafeQty(newQty);
      onChange?.(newQty, productId);

      if (itemExistsInCart) {
        dispatch(updateQuantity({ variation_id, quantity: newQty }));
      }

      if (token && itemExistsInCart) {
        await updateBackendQuantity(newQty);
      }
    }
  };

  return (
    <div className="flex md:items-center gap-2 md:gap-3">
      <button
        disabled={safeQty <= 0}
        onClick={() => handleQuantityChange(safeQty - 1)}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center disabled:opacity-40 disabled:cursor-not-allowed justify-center border ${decreaseBorder} ${decreaseText} ${hoverDecreaseBg} ${hoverDecreaseText} hover:border-0 transition md:border-ff715b md:text-ff715b md:hover:bg-transparent md:hover:text-ff715b`}
      >
        -
      </button>

      <span
        className={`text-center font-MontserratSemiBold text-sm ${quantityFont} md:text-c18`}
      >
        {safeQty}
      </span>

      <button
        disabled={
          group_variation
            ? safeQty >=
              (group_variation.sizes.find(
                (s) => s.variation_id === variation_id
              )?.stock || Infinity)
            : false
        }
        onClick={() => handleQuantityChange(safeQty + 1)}
        className={`md:w-6 md:h-6 ${buttonWidth} ${buttonHeight} rounded-full flex items-center disabled:opacity-40 disabled:cursor-not-allowed justify-center ${increaseBg} ${increaseText} md:bg-ff715b md:text-ffffff`}
      >
        +
      </button>
    </div>
  );
}
