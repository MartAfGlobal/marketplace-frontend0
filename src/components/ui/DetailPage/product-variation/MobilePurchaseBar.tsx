"use client";

import CartBtn from "@/assets/mobile/cart.png";
import CartButton from "@/components/ui/cart/cartButton";
import ItemAddToCart from "@/components/ui/ItemAddToCart";
import { ProductDetail, ProductVariation } from "@/types/global";

interface MobilePurchaseBarProps {
  productDetails: ProductDetail | null;
  selectedVariation: ProductVariation | null;
  isModal: boolean;
  onIncompleteVariation: () => void;
}

export default function MobilePurchaseBar({
  productDetails,
  selectedVariation,
  isModal,
  onIncompleteVariation,
}: MobilePurchaseBarProps) {
  // Keep a fixed cart action available while browsing on small screens.
  return (
    <div className="flex gap-9.75  items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
      <CartButton image={CartBtn} size={32} />
      <div className=" gap-2 w-full text-c12">
        <ItemAddToCart
          selectedVariation={selectedVariation}
          productId={productDetails?.id || ""}
          isModal={isModal}
          product_slug={productDetails?.slug || ""}
          product_name={productDetails?.name || ""}
          onIncompleteVariation={onIncompleteVariation}
        />
      </div>
    </div>
  );
}
