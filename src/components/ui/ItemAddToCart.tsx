"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button/Button";
import Image from "next/image";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";
import Location from "@/assets/mobile/MapPinArea.png";
import phone from "@/assets/mobile/Phone.png";
import { Product, Variations } from "@/types/global";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import QuantitySelector from "./cart/quantityControl";
import { addToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
// token comes from Redux / in-memory set by axios interceptor
import { LoadingSpinner } from "./loading-spinner";

type ItemAddToCartProps = {
  product: Product;
  quantity: number;
  selectedVariation: Variations | null;
  setSelectedQty: (qty: number) => void;
  setSelectedVariation: (variation: Variations) => void;
};

export default function ItemAddToCart({
  product,
  quantity,
  selectedVariation,
  setSelectedQty,
  setSelectedVariation,
}: ItemAddToCartProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, sendHttpRequest } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const cart = useSelector((state: RootState) => state.cart); // ✅ move here

  const [localQty, setLocalQty] = useState<number>(quantity || 1);

  useEffect(() => {
    if (product?.variations?.length && !selectedVariation) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product, selectedVariation, setSelectedVariation]);

  useEffect(() => {
    console.log("🧩 Cart updated:", cart);
  }, [cart]); // ✅ proper place for side effects

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
    setSelectedQty(newQty);
  };

  const handleAddToCart = () => {
    const qtyToAdd = localQty > 0 ? localQty : 1;

    // 🔹 Offline (no token)
    if (!token) {
      dispatch(
        addToCart({
          ...product,
          product_id: product.id,
          quantity: qtyToAdd,
          variation_display: selectedVariation
            ? `${selectedVariation.size} / ${selectedVariation.color}`
            : undefined,
          price_at_purchase: product.price,
        })
      );
      toast.success("Item added to cart (offline mode)");
      return;
    }

    // 🔹 Online (with token)
    sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          product_id: product.id,
          variation_id: selectedVariation?.id,
          quantity: qtyToAdd,
        },
      },
      successRes: () => {
        dispatch(
          addToCart({
            ...product,
            product_id: product.id,
            quantity: qtyToAdd,
            variation_display: selectedVariation
              ? `${selectedVariation.size} / ${selectedVariation.color}`
              : undefined,
            price_at_purchase: product.price,
          })
        );
        toast.success("Item added to cart successfully");
      },
    }).catch(() => {
      dispatch(
        addToCart({
          ...product,
          product_id: product.id,
          quantity: qtyToAdd,
          variation_display: selectedVariation
            ? `${selectedVariation.size} / ${selectedVariation.color}`
            : undefined,
          price_at_purchase: product.price,
        })
      );
      toast.error("Network error — added to local cart");
    });
  };

  return (
    <div className="w-full md:min-w-c386-58 md:shadow md:p-6 flex flex-col gap-6">
      {/* Quantity Selector */}
      <div className="hidden md:flex mt-3">
        <QuantitySelector quantity={localQty} onChange={handleQtyChange} />
      </div>

      {/* Add to Cart & Buy Now */}
      <div className="md:space-y-c32 flex w-full gap-2 md:gap-0 md:flex-col">
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50"
        >
          {loading ? <LoadingSpinner color="border-ff715b" /> : "Add to cart"}
        </Button>
        <Button>Buy now</Button>
      </div>
    </div>
  );
}
