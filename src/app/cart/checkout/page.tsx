"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";

import { dummyProducts } from "@/store/data/products";
import ProductCard from "@/components/ui/cards/ProductCard";
import NavBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";

import { TrackOrders } from "@/types/global";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import CheckoutItems from "@/components/ui/checkouts/Items-to-checkout";
import PaymentSuccessful from "@/components/ui/checkouts/Payment-successful";
import MobileCheckoutItems from "@/components/ui/mobile/checkout-items";

export default function CartPage() {
  const [visible, setVisible] = useState(10);
  const router = useRouter();

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const showMore = () => setVisible((prev) => prev + 3);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}  // Start slightly down and transparent
      animate={{ opacity: 1, y: 0 }}  // Animate to normal
      exit={{ opacity: 0, y: -20 }}   // Optional exit animation
      transition={{ duration: 0.5, ease: "easeOut" }}  // Smooth transition
      className="w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:pl-c56 hidden md:pt-c20 z-40 md:flex items-center w-full"
        style={{ top: "md:4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-6 px-6 md:px-0 md:h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className=" font-MontserratMedium text-c12">Checkout</span>
        </nav>
      </motion.div>

      <div className="w-full px-6 md:px-15">
        <Link href="/cart" className="flex items-center gap-4 mt-3 md:mt-c32">
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Checkout
          </p>
        </Link>

        <div className="flex justify-between mt-7 md:hidden">
          <p className="text-c12 font-MontserratSemiBold ">Shipping address</p>
          <button onClick={() => router.push("/dashboard/buyer/mobile/addresses/add-address")} className="rounded-full bg-ff715b text-ffffff w-c32 h-c32">
            +
          </button>
        </div>

        <CheckoutItems />
        <div className="md:hidden">
          <MobileCheckoutItems />
        </div>

        <div className="hidden md:flex w-full">
          <div className="py-c32 w-full">
            <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
              More to love
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 ">
              {fashionProducts.slice(0, visible).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
