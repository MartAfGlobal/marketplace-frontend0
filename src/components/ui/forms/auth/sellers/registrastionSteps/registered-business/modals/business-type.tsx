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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((option) => {
    const label = typeof option === "object" ? option.label : option;
    return label.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

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
    setSearchQuery("");
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
        onClick={() => {
          if (!disabled && !open) {
            setOpen(true);
            setSearchQuery("");
          }
        }}
      >
        <Input
          type="text"
          readOnly={!open}
          value={open ? searchQuery : getSelectedLabel()}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={open ? "Search options..." : placeholder}
          autoFocus={open}
          className={`pr-10 ${open ? "cursor-text" : "cursor-pointer"}`}
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
            setSearchQuery("");
          }}
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
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const label = typeof opt === "object" ? opt.label : opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-3 py-2 font-MontserratNormal text-c12 hover:bg-[#F4E7FD]"
                >
                  {label}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-400 font-MontserratNormal text-c12 italic text-center">
              {options.length > 0 ? "No matching options" : emptyState}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
