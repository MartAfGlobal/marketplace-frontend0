"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FormFooter from "@/assets/images/loginFooter.png"; // your image

export default function ScrollingFooter() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden -z-10">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20, 
          ease: "linear",
          
        }}
      >
        {/* Duplicate image twice for seamless loop */}
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
        <Image
          src={FormFooter}
          alt="form footer"
          width={268}
          height={154}
          className="w-67 h-c80 opacity-30"
        />
       
      </motion.div>
    </div>
  );
}
