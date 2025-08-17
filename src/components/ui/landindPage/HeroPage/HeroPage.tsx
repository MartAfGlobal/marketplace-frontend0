"use client";

import { motion } from "framer-motion";
import CategoriesGrid from "./FilterBox/CategoryGrid";
import HeroBaground from "./HeroBaground";
import MobileHeroBaground from "../../mobile/mobile-herobagroung";
import SearchInput from "../Header/SearchInput";

export default function HeroPage() {
  return (
    <motion.div
      className="md:flex gap-6 pb-6  w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-full  md:max-w-70.25 hidden md:flex"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <CategoriesGrid />
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="w-full md:hidden px-6">
          <SearchInput  className="w-full"/>
        </div>
        <div className="md:hidden">
          <MobileHeroBaground />
        </div>
        <div className="hidden md:flex">
          <HeroBaground />
        </div>
      </motion.div>
    </motion.div>
  );
}
