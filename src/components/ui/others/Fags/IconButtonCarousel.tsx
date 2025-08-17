"use client";
import FAgContactForm from "./contactForm";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IconButtonCarouselProps } from "@/types/global";
import { motion } from "framer-motion";
import LeftNav from "@/assets/icons/fags/leftNAV.svg";
import RightNav from "@/assets/icons/fags/rightNav.png";

export default function IconButtonCarousel({ options }: IconButtonCarouselProps) {
  const VISIBLE_COUNT = 5; // how many buttons to show at once
  const [startIndex, setStartIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAble, setIsAble] = useState({ prev: false, next: true });

  // Update prev/next button ability
  useEffect(() => {
    setIsAble({
      prev: startIndex > 0,
      next: startIndex + VISIBLE_COUNT < options.length,
    });
  }, [startIndex, options.length]);

  const prev = () => {
    if (isAble.prev) {
      setStartIndex((prevStart) => Math.max(prevStart - 1, 0));
    }
  };

  const next = () => {
    if (isAble.next) {
      setStartIndex((prevStart) =>
        Math.min(prevStart + 1, options.length - VISIBLE_COUNT)
      );
    }
  };

  const visibleOptions = options.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <>
    <div className="relative w-full -mt-20  h-fit items-center flex flex-col px-19 justify-center">
      {/* Top navigation & buttons */}
      <div className="relative w-full flex gap-4 justify-center items-center ">
        {/* Prev Button */}
        <button
          onClick={prev}
          disabled={!isAble.prev}
          className={`absolute flex items-center justify-center  circle-shadow bg-ffffff left-0 top-1/2 -translate-y-1/2 z-10 h-18 w-18 rounded-full flex-shrink-0 hover:bg-gray-100 ${
            !isAble.prev ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          {!isAble.prev ? (<Image src={LeftNav} alt="prev" width={48} height={48}  />):(<Image src={RightNav} alt="prev" width={48} height={48} className="rotate-180"/>)}
          
          
          
        </button>

        {/* Visible Buttons */}
        <div className="flex gap-c24">
          {visibleOptions.map((opt) => (
            <motion.button
              key={opt.id}
              onClick={() => setActiveIndex(opt.id - 1)}
              className="flex circle-shadow flex-col items-center justify-center p-4  rounded-lg w-47.5 h-40 relative"
              animate={{
                color: activeIndex === opt.id - 1 ? "#6A0DAD" : "#161616",
                backgroundColor: activeIndex === opt.id - 1 ? "#F4E7FD" : "#FFFFFF",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 flex items-center justify-center">{opt.icon}</div>
              <span className="mt-2 font-MontserratSemiBold text-c18 ">{opt.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={next}
          disabled={!isAble.next}
          className={`absolute justify-center circle-shadow bg-ffffff right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-gray-100 ${
            !isAble.next ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
        {!isAble.prev ?(<Image src={RightNav} alt="prev" width={48} height={48} />):(<Image src={LeftNav} alt="prev" width={48} height={48} className="rotate-180" />)}
        </button>
      </div>

      {/* Active Component */}
    
    </div>
     <div className="flex pt-c64 pb-c80 gap-c60  px-c60 justify-center">
       <div className="w-full ">
        {options[activeIndex]?.component}
      </div>
      <div className="w-full"><FAgContactForm/></div>
     </div>
     </> 
  );
}
