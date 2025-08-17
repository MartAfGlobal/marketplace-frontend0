"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import WnavRight from "@/assets/icons/WnavRight.svg";
import { AboutHeroProps } from "@/types/global";


export default function AboutHero({
  bgImage,
  height = "h-c601",
  breadcrumbs,
  smallTitle,
  mainTitle,
  description,
  paddingX = "px-c60",
}: AboutHeroProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full ${height}`}
    >
      <Image
        src={bgImage}
        alt="background image"
        width={500}
        height={500}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>

      <div className={`absolute top-0 h-full w-full ${paddingX}`}>
        {/* Breadcrumb */}
        <div className="pt-4 flex items-center gap-2">
          {(breadcrumbs ?? []).map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="font-MontserratBold text-base text-ffffff"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-MontserratBold text-base text-ffffff">
                  {crumb.label}
                </span>
              )}
              {i < breadcrumbs.length - 1 && (
                <Image
                  src={WnavRight}
                  alt="navigation pointer"
                  width={12}
                  height={7.27}
                />
              )}
            </span>
          ))}
        </div>

        {/* Centered content */}
        <div className="flex mt-32 justify-center w-full max-w-c556 h-full">
          <div>
            <p className="mb-4 text-xl font-MontserratBold text-ffffff">
              {smallTitle}
            </p>
            <h1 className="mb-4 text-5xl font-MontserratBold text-ffffff">
              {mainTitle}
            </h1>
            <p className="font-MontserratSemiBold text-c18 text-ffffff mt-c48">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
