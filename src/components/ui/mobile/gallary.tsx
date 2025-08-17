"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

import Img1 from "@/assets/mobile/img1.png";
import Img2 from "@/assets/mobile/img2.png";
import Img3 from "@/assets/mobile/img3.png";
import Img4 from "@/assets/mobile/img4.png";
import Img5 from "@/assets/mobile/img5.png";
import Img6 from "@/assets/mobile/img6.png";

const imageVariants: Variants = {
  hiddenLeft: { opacity: 0, x: -100 },
  hiddenRight: { opacity: 0, x: 100 },
  hiddenBottom: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Gallary() {
  return (
    <div className="w-full px-c24-76 h-c376-36 space-y-4">
      {/* First row */}
      <div className="flex gap-4 justify-center w-full">
        <motion.div
          variants={imageVariants}
          initial="hiddenLeft"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Image
            src={Img1}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>

        <motion.div
          initial="hiddenRight"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
        >
          <Image
            src={Img2}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>
      </div>

      {/* Second row */}
      <div className="flex gap-4 justify-center w-full">
        <motion.div
          initial="hiddenBottom"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
        >
          <Image
            src={Img3}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>

        <motion.div
          initial="hiddenLeft"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
        >
          <Image
            src={Img4}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>
      </div>

      {/* Third row */}
      <div className="flex gap-4 justify-center w-full">
        <motion.div
          initial="hiddenRight"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
        >
          <Image
            src={Img5}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>

        <motion.div
          initial="hiddenBottom"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
        >
          <Image
            src={Img6}
            alt="market"
            width={162.24}
            height={114.79}
            className="w-full h-c114-79"
          />
        </motion.div>
      </div>
    </div>
  );
}
