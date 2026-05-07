"use client";

import Image from "next/image";
import { useState } from "react";
import SearchIcon from "@/assets/Seller/searchBtn.svg";

interface SellerSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  alwaysOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function SellerSearch({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  disabled = false,
  alwaysOpen = false,
  onToggle
}: SellerSearchProps) {
  const [isVisible, setIsVisible] = useState(alwaysOpen);

  const toggleSearch = () => {
    if (!disabled && !alwaysOpen) {
      const nextValue = !isVisible;
      setIsVisible(nextValue);
      onToggle?.(nextValue);
    }
  };

  return (
    <div 
      onClick={toggleSearch}
      className={`flex items-center justify-center bg-ffffff rounded-c8 circle-shadow h-10 transition-all duration-300 border-000000/10 border px-3 gap-2 ${
        isVisible || alwaysOpen ? "w-full max-w-138.5" : "w-10"
      } ${disabled ? "opacity-50 cursor-not-allowed" : alwaysOpen ? "cursor-default" : "cursor-pointer"}`}
    >
      <Image src={SearchIcon} height={13.01} width={13.01} alt="search" className="flex-shrink-0" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder} 
        autoFocus={isVisible && !alwaysOpen}
        onBlur={() => {
          if (!value && !alwaysOpen) {
            setIsVisible(false);
            onToggle?.(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className={`${isVisible || alwaysOpen ? "block" : "hidden"} flex-1 outline-none text-c12 font-MontserratNormal bg-transparent disabled:cursor-not-allowed`}
      />
    </div>
  );
}
