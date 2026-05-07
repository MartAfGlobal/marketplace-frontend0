"use client";

import React from "react";
import { motion } from "framer-motion";

interface CTASectionProps {
  onJoinWaitlist: () => void;
}

export default function CTASection({ onJoinWaitlist }: CTASectionProps) {
  return (
    <section className="bg-ffffff text-center mb-52">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-full md:max-w-3xl lg:max-w-207.25 mx-auto px-6"
      >
        <h2 className="text-4xl md:text-[48px] font-MontserratNormal text-000000 mb-2 leading-[150%]">
          The Market Moment
        </h2>
        <p className="text-lg text-000000 mb-10 text-center leading-[200%] font-MontserratNormal">
          Africa's diaspora numbers more than 200 million people globally and
          sends home more than $95 billion in remittances each year. Africa
          growth forum These are not just people sending money home. They are
          buyers. They are brand ambassadors. They are the most powerful
          distribution network for Made-in-Africa products on earth — and
          today, no platform is properly serving them. Martaf is built for
          this moment
        </p>
        <button
          onClick={onJoinWaitlist}
          className="inline-flex items-center gap-2 bg-6a0dad/68 text-white px-12 py-4 rounded-[48px] font-MontserratMedium text-lg hover:scale-105 transition-all active:scale-95 cursor-pointer"
        >
          Join the waitlist
        </button>
      </motion.div>
    </section>
  );
}
