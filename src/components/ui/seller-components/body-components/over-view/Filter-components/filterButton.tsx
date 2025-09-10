"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import CaretDown from "@/assets/Seller/caretDown.png";
import { useSelector } from "react-redux";

interface FilterDropdownProps {
  options: string[];              // can accept options
  defaultValue?: string;          // optional default
  onChange?: (value: string) => void;  // callback
}

export default function FilterDropdown({
  options,
  defaultValue,
  onChange,
}: FilterDropdownProps) {
     const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled ={isIncomplete}
        className={`flex circle-shadow text-c12 font-MontserratNormal text-ff715b bg-ffffff 
        items-center w-full max-w-fit p-3 rounded-xl justify-center flex-shrink-0 gap-4.5 h-10  ${isIncomplete? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span>{selected}</span>
        <Image src={CaretDown} alt="dropdown" width={11} height={6} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-40 right-0 mt-2 w-39 py-3 px-6 space-y-2.5 
            text-c12 font-MontserratNormal text-000000/50 bg-white rounded circle-shadow h-29"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="h-6 cursor-pointer hover:text-ff715b"
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 