"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface OrdersNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string
}

export default function OrdersNav({ tabs, activeTab, onTabChange, className= "" }: OrdersNavProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const activeIndex = tabs.findIndex((t) => t === activeTab);
  if (activeIndex === -1) return;

  // Only run on mobile
  if (window.innerWidth < 768) {
    const activeTabEl = tabRefs.current[activeIndex];
    const container = activeTabEl?.parentElement;

    if (activeTabEl && container) {
      const tabLeft = activeTabEl.offsetLeft;
      const offset = tabLeft - 20; // extra padding so it aligns left

      container.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  }
}, [activeTab, tabs]);

  return (
    <div className={clsx("relative  flex gap-2 justify-center md:justify-center bg-947fff/10 w-full md:max-w-179.25 overflow-x-auto  no-scrollbar text-nowrap scroll-smooth", className)}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[index] = el; 
            }}
            onClick={() => onTabChange(tab)}
            className="relative p-4 text-c12 font-MontserratSemiBold text-6a0dad"
          >
            {tab}
            {isActive && (
              <motion.div
                layoutId="active-border"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-6a0dad"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
