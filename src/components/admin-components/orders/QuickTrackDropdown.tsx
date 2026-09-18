"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface QuickTrackDropdownProps {
  onOpenTrackModal: () => void;
  onOpenPickupModal: () => void;
}

export default function QuickTrackDropdown({
  onOpenTrackModal,
  onOpenPickupModal,
}: QuickTrackDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#FF715B] w-[167.15px] h-[48.15px] hover:bg-[#e6604a] text-white px-6 py-3 rounded-[8px] flex items-center gap-3 font-MontserratSemiBold text-sm transition-colors shadow-sm focus:outline-none"
      >
        <span>Quick track</span>
        <ChevronDown
          className={`w-[24.15px] h-[24.15px] text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 h-22 w-46 bg-white rounded-[8px] quickTrackShadow  border border-0000004 py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col ">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenTrackModal();
              }}
              className="w-full text-left px-6 py-3 h-10 text-xs font-MontserratNormal text-ff715b hover:bg-red-50/70  transition-colors"
            >
              Quick track
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenPickupModal();
              }}
              className="w-full text-left px-6 py-3 h-10 text-xs font-MontserratNormal text-ffaco6 hover:bg-amber-50/70  transition-colors"
            >
              Request pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
