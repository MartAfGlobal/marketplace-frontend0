"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cart from "@/assets/headerIcon/cart.svg";

const backgrounds = [
  {
    id: 1,
    className: "mobilebg-hero",
    content: (
      <div className="relative w-full h-95 mobilebg-hero  flex  px-c32  items-center">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/64 z-0"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <h1 className="font-MontserratSemiBold text-c24 text-ffffff leading-c32 pb-4">
            Shop from the best of African products.
          </h1>
          <p className="font-MontserratNormal text-sm text-ffffff pb-6">
            Explore a world of quality products across Africa at Martaf. From
            electronics to fashion and home goods, we offer something for
            everyone.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-full h-c48 rounded-c8 border border-ff715b text-ffffff text-c12 text-shadow-ff715b flex items-center justify-center"
            >
              Become a seller
            </Link>
            <button className="w-full h-c48 rounded-c8 bg-ff715b text-ffffff text-c12 flex items-center justify-center gap-3">
              Shop now
            </button>
          </div>
        </div>
      </div>
    ),
  },
{
  id: 2,
  className: "ad-hero",
  content: (
    <div className="w-full h-52.5 relative  rounded-2xl flex items-center justify-center">
      <Image
        src="/assets/images/AdBanner.svg"
        alt="Ad Banner"
        fill
        className="object-fill rounded-2xl"
      />
    </div>
  ),
}


];

export default function MobileHeroBaground() {
  const [index, setIndex] = useState(0);

  // Auto swipe every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={`
        "relative w-full  flex mt-3.75 px-c32 items-center"
            ${backgrounds[index].id === 2
              ? "w-full h-52.5 "
              : " h-95"
          }`}>
      <AnimatePresence mode="sync">
        {" "}
        <motion.div
          key={backgrounds[index].id}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 10,
            bounce: 0.3,
            duration: 0.8,
          }}
          className={`${
            backgrounds[index].id === 2
              ? "w-full h-52.5 flex items-center overflow-hidden rounded-2xl"
              : "absolute inset-0 flex items-center w-full"
          }`}
        >
          {backgrounds[index].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
