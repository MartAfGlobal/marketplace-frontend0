"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../Button/Button";

export default function MobileHeroBackground() {
  const [index, setIndex] = useState(0);

  const router = useRouter();

  const backgrounds = [
    {
      id: 1,
      type: "hero",
      content: (
        <div className="relative w-full h-95 mobilebg-hero flex px-c32 items-center">
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
              <Button
                variant="secondary"
                onClick={() => router.push("/auth/seller/sign-up")}
                className=""
              >
                Become a seller
              </Button>
              <Button
                onClick={() => {
                  document
                    .getElementById("production-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="w-full flex items-center justify-center gap-3"
              >
                Shop now
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "ad",
      content: (
        <div className="w-full h-full px-5 flex items-center justify-center">
          <div className="w-full h-full relative rounded-2xl overflow-hidden">
            <Image
              src="/assets/images/AdBanner.svg"
              alt="Ad Banner"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      ),
    },
  ];

  // Auto swipe every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full mt-3.75  overflow-hidden transition-[height] duration-500 ease-in-out ${
        backgrounds[index].type === "ad" ? "h-52.5 sm:h-74" : "h-95"
      }`}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={backgrounds[index].id}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          initial={
            index === 0
              ? { opacity: 0, scale: 1.1 } // zoom-in first load
              : { x: "100%", opacity: 0 } // slide in others
          }
          animate={{ x: 0, opacity: 1, scale: 1 }} // all settle here
          exit={{ x: "-100%", opacity: 0 }} // all (including first) slide out
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          {backgrounds[index].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
