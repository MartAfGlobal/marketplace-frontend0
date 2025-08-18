"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DefaultCart from "@/assets/headerIcon/cart.svg";

interface CartButtonProps {
  size?: number; // flexibility (desktop vs mobile)
  image?: StaticImageData | string; // allow custom image
  showBadge?: boolean; // optionally hide badge
}

export default function CartButton({
  size = 25.32,
  image = DefaultCart,
  showBadge = true,
}: CartButtonProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-fit h-fit relative">
      <Link href="/cart">
        <button
          style={{ width: size, height: size }}
          className="flex items-center justify-center"
        >
          <Image
            src={image}
            alt="Cart"
            width={size}
            height={size}
            className="object-cover"
          />
        </button>

        {/* ✅ Only show badge if count > 0 */}
        {showBadge && cartCount > 0 && (
          <span className="bg-[#CA0202] text-white absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full font-MontserratSemiBold text-[8px]">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
