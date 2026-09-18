"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CategoriesGrid from "./FilterBox/CategoryGrid";
import HeroBaground from "./HeroBaground";
import SubcategoryModal from "./SubcategoryModal";
import MobileHeroBaground from "../../mobile/mobile-herobagroung";
import SearchInput from "../Header/SearchInput";
import { Category, subcategory } from "@/types/global";

export default function HeroPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<subcategory[]>([]);
  const [subLoading, setSubLoading] = useState(false);

  return (
    <motion.div
      className="lg:flex gap-6 pb-6 w-full justify-center relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-full md:max-w-[281px] hidden lg:flex"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <CategoriesGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSubcategoriesLoaded={setSubcategories}
          onSubLoadingChange={setSubLoading}
        />
      </motion.div>

      <motion.div
        className="flex-1 w-full min-w-0 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="w-full lg:hidden px-6">
          <SearchInput className="w-full" />
        </div>
        <div className="lg:hidden">
          <MobileHeroBaground />
        </div>
        <div className="hidden lg:flex relative w-full h-full overflow-hidden">
          <HeroBaground />
          <SubcategoryModal
            selectedCategory={selectedCategory}
            onClose={() => setSelectedCategory(null)}
            subcategories={subcategories}
            subLoading={subLoading}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
