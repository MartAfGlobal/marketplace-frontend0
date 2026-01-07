"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Hardcoded banners
import adBanner1 from "@/assets/images/adbanner1.svg";

interface Ad {
  id: number | string;
  image: string | StaticImageData;
}

interface AdSliderProps {
  mobileHeight?: number;
  desktopHeight?: number;
  interval?: number;
}

export default function AdSlider({
  mobileHeight = 210,
  desktopHeight = 300,
  interval = 4000,
}: AdSliderProps) {
  const ads: Ad[] = [
    { id: 1, image: adBanner1 },
    { id: 2, image: adBanner1 },
    { id: 3, image: adBanner1 },
    { id: 4, image: adBanner1 },
    { id: 5, image: adBanner1 },
    { id: 6, image: adBanner1 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, interval);
    return () => clearInterval(sliderInterval);
  }, [ads.length, interval]);

  const visibleAds = isMobile
    ? [ads[currentIndex % ads.length]]
    : [ads[currentIndex % ads.length], ads[(currentIndex + 1) % ads.length]];

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ height: isMobile ? mobileHeight : desktopHeight }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute top-0 left-0 flex gap-4 w-full h-full"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        >
          {visibleAds.map((ad) => (
            <div
              key={ad.id}
              className={`relative h-full ${
                isMobile ? "w-full" : "w-[calc(50%-8px)]"
              } rounded-2xl overflow-hidden`}
            >
              <Image
                src={ad.image}
                alt="Ad Banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
