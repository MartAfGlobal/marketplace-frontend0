"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

import Img1 from "@/assets/mobile/img1.png";
import Img2 from "@/assets/mobile/img2.png";
import Img3 from "@/assets/mobile/img3.png";
import Img4 from "@/assets/mobile/img4.png";
import Img5 from "@/assets/mobile/img5.png";
import Img6 from "@/assets/mobile/img6.png";

const imageVariants = {
  hiddenLeft: { x: -100, opacity: 0 },
  hiddenRight: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

// Image list with proper variant keys
const images = [
  { src: Img1, alt: "market 1", direction: "left" },
  { src: Img2, alt: "market 2", direction: "right" },
  { src: Img3, alt: "market 3", direction: "bottom" },
  { src: Img4, alt: "market 4", direction: "left" },
  { src: Img5, alt: "market 5", direction: "right" },
  { src: Img6, alt: "market 6", direction: "bottom" },
];

export default function Gallary() {
  return (
    <div className="w-full px-6 h-c376-36 space-y-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4  w-full">
          {images.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, i) => (
            <motion.div
              key={i}
              initial={item.direction === "left" ? "hiddenLeft" : "hiddenRight"} // ✅ always string key
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={imageVariants}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={162.24}
                height={114.79}
                className="w-full h-c114-79 flex-shrink-0 object-cover"
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
