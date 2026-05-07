"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ArrowRightUp from "@/assets/icons/ArrowUpRight.svg";
import CartonBox from "@/assets/icons/carton.svg";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
}

export default function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  return (
    <section className="mt-28 mb-8.25 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h1
          className="text-4xl md:text-5xl lg:text-[64px] font-MontserratSemiBold text-000000 mb-8 px-4"
          style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
        >
          Africa to the world
        </h1>
        <div className="w-full max-w-full md:max-w-2xl lg:max-w-226.75 space-y-2 mb-8 px-6 mx-auto">
          <p className="text-lg md:text-xl text-000000 font-MontserratMedium leading-[36px]">
            The best of African-made products at your fingertips
          </p>
          <p className="text-sm md:text-base font-MontserratNormal text-000000/72 leading-[32px]">
            Martaf Global is the trusted marketplace for Made-in-Africa goods
            — connecting the world's buyers to Africa's finest manufacturers,
            designers, and artisans. One platform. Verified sellers. Global
            delivery.
          </p>
        </div>

        <div>
          <button
            onClick={onJoinWaitlist}
            className="flex w-full max-w-52 items-center gap-2 bg-6a0dad text-white px-2 py-4 rounded-c8 font-MontserratSemiBold justify-center mx-auto hover:scale-105 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <span className="text-base font-MontserratNormal">
              Start shopping
            </span>
            <Image
              src={ArrowRightUp}
              alt="Arrow Right"
              width={24}
              height={24}
            />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="mx-auto relative px-6 md:px-c58"
      >
        <Image
          src={CartonBox}
          alt="Martaf Box"
          width={1611}
          height={907}
          className=""
          priority
        />
      </motion.div>
    </section>
  );
}
