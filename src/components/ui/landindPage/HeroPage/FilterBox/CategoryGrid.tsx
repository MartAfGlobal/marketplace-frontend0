"use client";

import { useState } from "react";
import Image from "next/image";
import CategoryButton from "./CategoryButton";
import { categories } from "@/utils/data/categories";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // 👈 import here

export default function CategoriesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<
    null | (typeof categories)[0]
  >(null);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full max-w-c281">
      <h1 className="font-MontserratBold text-c20 pb-c24 text-000000 pl-c32">
        Categories
      </h1>
      {categories.map((cat, index) => (
        <CategoryButton
          key={index}
          iconSrc={cat.iconSrc}
          label={cat.label}
          isSelected={selectedCategory?.label === cat.label}
          onClick={() => setSelectedCategory(cat)}
        />
      ))}

      {/* Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            className="fixed top-0 inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)} // ✅ closes when clicking background
          >
            {/* Modal content */}

            <motion.div
              className="w-full h-full absolute top-26 left-91.25"
              initial={{ y: "-100%", opacity: 0 }} // start from top
              animate={{ y: 0, opacity: 1 }} // slide down
              exit={{ y: "-100%", opacity: 0 }} // slide up when closing
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()} // stop clicks bubbling
            >
              <div className="bg-white p-8 shadow-customW w-full max-w-181.75 pointer-events-auto">
                <div className="flex flex-wrap gap-x-[26px] gap-y-[27px]">
                  {selectedCategory.subcategories.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        router.push(
                          `/categories/${encodeURIComponent(
                            selectedCategory.label
                          )}/${encodeURIComponent(sub.title)}`
                        )
                      }
                      className="flex flex-col w-22 items-center cursor-pointer hover:shadow-md"
                    >
                      <Image
                        src={sub.image}
                        alt={sub.title}
                        width={88}
                        height={88}
                      />
                      <p className="mt-2 text-sm text-center text-c12 font-MontserratNormal">
                        {sub.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
