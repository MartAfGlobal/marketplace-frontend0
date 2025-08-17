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
}: AuthenticationLayoutProps) {
  return (
    <div className="w-full relative h-dvh">
      {/* Animated Logo/Link */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="absolute top-c42 left-c40 h-fit"
      >
        <Link href="/" className="flex items-center gap-4">
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
          className="h-fit w-full max-w-c400"
        >
          <div className="text-center">
            <h1 className="font-MontserratSemiBold pb-1 text-c18 text-161616">
              {title}
            </h1>
            <p className="text-base font-MontserratNormal inset-0 bg-white/30">
              {description}
            </p>
          </div>
          <div className="m-auto w-full max-w-c393">{children}</div>
        </motion.div>
      </div>

      <ScrollingFooter />
    </div>
  );
}
