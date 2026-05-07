"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/forms/Input";
import SelectButton from "@/assets/icons/selectbutton.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DropdownInputProps {
  placeholder: string;
  options: string[];
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(propValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keep internal value in sync if controlled
  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

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

  const handleSelect = (opt: string) => {
    setValue(opt);
    setOpen(false);
    onChange?.(opt);
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
          value={value}
          placeholder={placeholder}
          className="mt-2 cursor-pointer"
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
        <div className="absolute bottom-10 left-0 w-full bg-white border border-gray-200 max-h-60 overflow-y-auto py-2 px-3 rounded-lg shadow-lg mt-1 z-50">
          {options.length > 0 ? (
            options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-3 py-2 font-MontserratNormal text-c12 hover:bg-[#F4E7FD]"
              >
                {opt}
              </button>
            ))
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
