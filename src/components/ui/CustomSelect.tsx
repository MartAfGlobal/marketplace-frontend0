"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

type CustomSelectOption =
  | { label: string; value: string; disabled?: boolean }
  | string;

interface CustomSelectProps {
  value: string;
  placeholder: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    for (const option of options) {
      if (typeof option === "string") {
        if (option === value) return option;
      } else if (option.value === value) {
        return option.label;
      }
    }
    return value;
  }, [value, options]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className={`w-full h-12 px-3.5 rounded-c8 border border-efefef bg-white text-left flex items-center justify-between text-sm font-MontserratNormal transition-all ${
          isOpen ? "border-ff715b ring-1 ring-ff715b" : "hover:border-gray-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`truncate ${
            selectedLabel ? "text-[#161616]" : "text-gray-400"
          }`}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-50 py-1"
          >
            {options.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              const isDisabled =
                typeof option !== "string" && !!option.disabled;
              const isSelected = optionValue === value;

              return (
                <button
                  key={`${optionValue}-${index}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(optionValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-MontserratNormal flex items-center justify-between transition-colors ${
                    isDisabled
                      ? "cursor-not-allowed text-gray-400"
                      : isSelected
                      ? "bg-ff715b text-ffffff font-MontserratMedium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{optionLabel}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#ff715b] shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
