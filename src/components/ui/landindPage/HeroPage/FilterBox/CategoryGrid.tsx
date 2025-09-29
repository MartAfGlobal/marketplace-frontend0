"use client";

import { useState } from "react";
import Image from "next/image";
import CategoryButton from "./CategoryButton";
import { categories } from "@/utils/data/categories";
import { useRouter } from "next/navigation"; // 👈 imported here


export default function CategoriesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<
    null | (typeof categories)[0]
  >(null);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full max-w-c281 ">
      <h1 className="font-MontserratBold text-c20 pb-c24 text-000000 pl-c32">
        Categories
      </h1>
      {categories.map((cat, index) => (
        <CategoryButton
          key={index}
          iconSrc={cat.iconSrc}
          label={cat.label}
          isSelected={selectedCategory?.label === cat.label} // ✅ fixed
          onClick={() => setSelectedCategory(cat)}
        />
      ))}

      {/* Modal */}
      {selectedCategory && (
        <div
          className="fixed top-0 inset-0 bg-black/50 flex items-center justify-center z-50 "
          onClick={() => setSelectedCategory(null)}
        >
          <div className="w-full h-full absolute top-26 left-91.25">
            <div className="bg-white p-8  shadow-customW w-full max-w-181.75">
              <div className="flex flex-wrap gap-x-[26px] gap-y-[27px]">
                {selectedCategory.subcategories.map((sub, idx) => (
                  <div
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
