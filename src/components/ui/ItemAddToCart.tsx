"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button/Button";
import { Product, Variations, Sizes } from "@/types/global";
import { useSelector, useDispatch } from "react-redux";
import store, { RootState } from "@/store";
import QuantitySelector from "./cart/quantityControl";

import { addToCart, addGuestItemToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./loading-spinner";

export type SelectedVariationSize = {
  variation_id: string;
  size: string;
  stock?: number;
  sku?: string;
  price: string;
  main_value: string;
  main_image?: string;
  is_default?: boolean;
};

type ItemAddToCartProps = {
  product: Product;
  quantity: number;
  selectedVariation: SelectedVariationSize | null; // received from parent
  setSelectedQty: (qty: number) => void;
  setSelectedVariation: (variation: SelectedVariationSize) => void;
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
   const products = useSelector((state: RootState) => state.products.items);
const variationId = selectedVariation?.variation_id;

const productContainingVariation = products.find((product) =>
  product.grouped_variations?.some((variationGroup) =>
    variationGroup.sizes?.some((size: Sizes) => size.variation_id === variationId)
  )
);

const productId = productContainingVariation?.id; 
const product_slug = productContainingVariation?.slug;





console.log("Product ID for variation:", productId, product_slug, variationId, productContainingVariation, products);

 
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.variation_id === variationId)
  );

  const [localQty, setLocalQty] = useState<number>(cartItem?.quantity ?? 0);

  useEffect(() => {
    if (cartItem) {
      setSelectedQty(cartItem.quantity);
      setLocalQty(cartItem.quantity);
    } else {
      setSelectedQty(0);
      setLocalQty(0);
    }
  }, [cartItem, setSelectedQty]);

  // Build display string
  const variationDisplay = `${selectedVariation?.main_value ?? ""}${
    selectedVariation?.size ? ` / ${selectedVariation.size}` : ""
  }`;


  // Handle quantity change
  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
    setSelectedQty(newQty);
  };

const handleAddToCart = async () => {
  if (!selectedVariation) {
    toast.error("Please select a variation");
    return;
  }
  



  const variationId = selectedVariation.variation_id;
  const existingCartItem = store.getState().cart.items.find(
    (item) => item.variation_id === variationId
  );

  // Determine the new quantity: increment by 1 if already exists, else 1
  const newQty = (existingCartItem?.quantity || 0) + 1;

  // Update local state
  setLocalQty(newQty);
  setSelectedQty(newQty);

  // Guest cart
  if (!token) {
    dispatch(
      addGuestItemToCart({
        product_slug: product_slug || "",
        product_id: product.id,
        variation_id:variationId,
        quantity: 1,
        variation_display: variationDisplay,
        product_name: product.name ?? "",
        product_image: selectedVariation.main_image ?? "image-not-found.png",
        price: selectedVariation.price ?? product.price,
        checked: true,
      })
    );
    toast.success(existingCartItem ? "Quantity updated" : "Item added to cart");
    return;
  }

  // Logged-in user cart
  try {
    await sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: { variation_id:variationId, quantity: 1 },
      },
        successRes: (res) => {
        console.log("Add to cart response:", res);  
        const price =
          selectedVariation?.price ||
          products.find((p) => p.id === productId)?.price ||
          0;

        dispatch(
          addToCart({
            product_slug: product_slug || "",
            variation_display: variationDisplay,
            product_id: productId || "",
            variation_id: variationId || "",
            quantity: 1 , 
            product_image: selectedVariation?.main_image || "",
            price,
            price_at_purchase: price,
            product_name: products.find((p) => p.id === productId)?.name || "",
            checked: true,
            size: selectedVariation?.size || "",
          })
        );
      },
    });

   
    toast.success(existingCartItem ? "Quantity updated" : "Item added successfully");
  } catch {
    dispatch(
      addToCart({
         product_slug: product_slug || "",
        product_id: product.id,
        variation_id: variationId,
        quantity: 1,
        variation_display: variationDisplay,
        product_name: product.name ?? "",
        product_image: selectedVariation.main_image ?? "image-not-found.png",
        price: selectedVariation.price ?? product.price,
        price_at_purchase: selectedVariation.price ?? product.price,
        checked: true,
      })
    );

    toast.error("Network error — updated locally");
  }
};

  return (
    <div className="w-full md:min-w-c386-58 md:shadow md:p-6 flex flex-col gap-6">
      {/* Quantity Selector */}
      <div className="hidden md:flex mt-3">
        <QuantitySelector
          quantity={localQty}
          onChange={handleQtyChange}
          variation_id={variationId!}
          productId={product.id}
        />
      </div>

      {/* Add to Cart */}
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
