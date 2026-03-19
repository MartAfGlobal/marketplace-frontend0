// app/layouts/AuthenticationLayout.tsx

"use client"; // required for Framer Motion in Next.js app directory

import React from "react";
import { AuthenticationLayoutProps } from "@/types/global";
import Image from "next/image";
import authLogo from "@/assets/Logos/authLogo.svg";
import Link from "next/link";
import { motion } from "framer-motion";

import ScrollingFooter from "../forms/auth/ScrollingFooter";


export default function AuthenticationLayout({
  title,
  description,
  children,
  stage,
  userType,
  className="max-w-c393",
}: AuthenticationLayoutProps) {
  return (
    <div className="w-full relative h-dvh px-6 md:px-0">
      {/* Animated Logo/Link */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="absolute top-6.5 md:top-c42 left-1/2 -translate-x-1/2 md:left-c40 h-fit md:translate-0" 
      >
        <Link href="/" className="flex items-center gap-2 md:gap-4">
          <Image src={authLogo} alt="Logo" width={34.36} height={28} />
          <p className="text-6a0dad font-MontserratBold text-c20">MARTAF</p>
        </Link>
      </motion.div>

      {/* Centered Content */}
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-fit w-full "
        >
          {userType === "seller" && stage === 1 && (
            <div className="flex justify-center w-full items-center mb-c32">
              <div className="flex justify-center items-center w-full max-w-60.75 h-c32 gap-3">
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex text-ffffff bg-ff715b items-center justify-center">
                  1
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  2
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  3
                </div>
              </div>
            </div>
          )}
          {userType === "seller" && stage === 2 && (
            <div className="flex justify-center w-full items-center mb-c32">
              <div className="flex justify-center items-center w-full max-w-60.75 h-c32 gap-3">
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  1
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex text-ffffff bg-ff715b items-center justify-center">
                  2
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  3
                </div>
              </div>
            </div>
          )}
          {userType === "seller" && stage === 3 && (
            <div className="flex justify-center w-full items-center mb-c32">
              <div className="flex justify-center items-center w-full max-w-60.75 h-c32 gap-3">
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  1
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex border border-ff715b text-ff715b items-center justify-center">
                  2
                </div>
                <div className=" w-full max-w-11.5  border-1 border-000000/12"></div>
                <div className="w-c32 h-c32 rounded-full flex-shrink-0 flex text-ffffff bg-ff715b items-center justify-center">
                  3
                </div>
              </div>
            </div>
          )}
          <div className="text-center">
            <h1 className="font-MontserratSemiBold pb-1 text-c18 text-161616">
              {title}
            </h1>
            <p className="text-base font-MontserratNormal inset-0 bg-white/30">
              {description}
            </p>
          </div>
          <div className={`m-auto w-full mt-4  ${className}`}>{children}</div>
        </motion.div>
      </div>

      <ScrollingFooter />
    </div>
  );
}
