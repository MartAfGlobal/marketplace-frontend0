"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/forms/Input";
import SelectButton from "@/assets/icons/selectbutton.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DropdownInputProps {
  placeholder: string;
  options: (string | { label: string; value: string })[];
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;

  loading?: boolean;
  emptyState?: string;
}

export function DropdownInput({
  placeholder,
  options,
  value: propValue = "",
  onChange,
  disabled = false,
  loading,
  emptyState = "No options available"
}: DropdownInputProps) {
  console.log("DropdownInput rendering with options:", options);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (opt: string | { label: string; value: string }) => {
    const val = typeof opt === "object" ? opt.value : opt;
    setOpen(false);
    onChange?.(val);
  };

  const getSelectedLabel = () => {
    if (!propValue) return "";
    const found = options.find((opt) => {
      if (typeof opt === "object") {
        return opt.value === propValue;
      }
      return opt === propValue;
    });
    if (found && typeof found === "object") {
      return found.label;
    }
    return propValue;
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-container w-full h-fit relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div
        className="relative w-full h-fit"
        onClick={() => !disabled && setOpen(!open)}
      >
        <Input
          type="text"
          readOnly
          value={getSelectedLabel()}
          placeholder={placeholder}
          className=" cursor-pointer"
        />
        <button
          type="button"
          className="absolute  right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          {loading? <LoadingSpinner color="border-ff715b"/>:   <Image
            src={SelectButton}
            alt="select"
            width={14}
            height={8}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />}
        
        </button>
      </div>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 max-h-60 overflow-y-auto py-2 px-3 rounded-lg shadow-lg mt-1 z-[9999] flex flex-col">
          {options.length > 0 ? (
            options.map((opt, idx) => {
              const label = typeof opt === "object" ? opt.label : opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-3 py-2 font-MontserratNormal text-c12 hover:bg-[#F4E7FD]"
                >
                  {label}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-400 font-MontserratNormal text-c12 italic text-center">
              {emptyState}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
