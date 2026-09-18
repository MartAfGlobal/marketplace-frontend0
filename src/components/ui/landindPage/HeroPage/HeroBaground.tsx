"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cart from "@/assets/headerIcon/cart.svg";
import { Button } from "../../Button/Button";
import { useRouter } from "next/navigation";





export default function HeroBackground() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const backgrounds = [
  {
    id: 1,
    className: "bg-hero",
    content: (
      <div className="max-w-[468px] ">
        <h1 className="font-MontserratSemiBold max-w-[328px] text-5xl leading-[56px] text-[#131313] pb-4">
          Discover the best of Africa
        </h1>
        <p className="font-MontserratNormal text-lg text-[#131313] pb-[48px]">
          Explore a world of quality products across Africa at Martaf. From
          electronics to fashion and home goods, we offer something for
          everyone.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/auth/seller/sign-up")}
            className="w-[179px]"
          >
            Become a seller
          </Button>
          <Button
            onClick={() => {
              document.getElementById("production-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="w-[173.15px]  flex items-center justify-center gap-3"
          >
            <Image src={Cart} alt="cart" width={24.15} height={24.15} />
            <p>Shop now</p>
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    className: "ad-hero",
    content: <div className="text-white wfull h-full text-4xl font-bold"></div>,
  },
];

  // Auto swipe every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full md:h-125 lg:h-134 overflow-hidden rounded-[16px]">
      <AnimatePresence mode="sync">
        {" "}
        {/* sync keeps both present until animation ends */}
        <motion.div
          key={backgrounds[index].id}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            type: "spring",
            stiffness: 160, // how fast it moves
            damping: 13, // how much it resists (less = more bounce)
            bounce: 0.3, // bounce intensity
            duration: 0.3,
          }}
          className={`absolute h-full w-full inset-0 flex items-center hero-contentPadding lg:pl-[61px] ${backgrounds[index].className}`}
        >
          {backgrounds[index].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
