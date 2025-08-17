"use client";

import { useState } from "react";
import Image from "next/image";
import NavButton from "@/assets/icons/thickNav.svg";

export default function SizeColorSelector() {
  const allSizes = Array.from({ length: 47 }, (_, i) => i + 41);
  const [page, setPage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizesPerPage = 7;
  const start = page * sizesPerPage;
  const currentSizes = allSizes.slice(start, start + sizesPerPage);

  const colors = [
    { name: "White", code: "#FFFFFF" },
    { name: "Blue", code: "#0389F8" },
    { name: "Red", code: "#D30B0B" },
    { name: "Black", code: "#000000" },
    { name: "Green", code: "#128807" },
  ];

  return (
    <div className="pt-c24">
      {/* Size buttons */}
      <div>
        <div className="flex justify-between items-center mb-c24">
          <p className="">Size guide</p>
          {start + sizesPerPage < allSizes.length && (
            <button onClick={() => setPage(page + 1)}>
              <Image
                src={NavButton}
                alt="nav button"
                width={7.5}
                height={13.75}
              />
            </button>
          )}
        </div>

        <div className="flex gap-2  flex-wrap ">
          {currentSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-c47 w-c44 border rounded-lg transition text-sm font-MontserratSemiBold text-000000 
                ${selectedSize === size ? "border-ff715b" : "border-gray-300"}
                hover:bg-ff715b hover:text-000000`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color selection */}
     <div className="mt-c24">
      <p className="mb-c24 text-sm font-MontserratSemiBold text-161616">Color:</p>
       <div className="flex gap-4.5">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.name)}
            className={`flex flex-col items-center transition w-c48 h-c48
              ${selectedColor === color.name ? "border border-ff715b" : ""}`}
          >
            <div
              className="w-full h-c24  shadow"
              style={{ backgroundColor: color.code }}
            ></div>
            <span className="mt-2 text-c12 font-MontserratMedium">
              {color.name}
            </span>
          </button>
        ))}
      </div>
     </div>
    </div>
  );
}
