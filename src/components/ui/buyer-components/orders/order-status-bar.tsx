"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface OrdersNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function OrdersNav({ tabs, activeTab, onTabChange }: OrdersNavProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t === activeTab);

    // ✅ Only run scroll on mobile (below md: 768px)
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      activeIndex !== -1 &&
      tabRefs.current[activeIndex]
    ) {
      tabRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative flex gap-2 justify-center bg-947fff/10 w-full md:max-w-152.25 overflow-x-auto  no-scrollbar text-nowrap scroll-smooth">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[index] = el; // ✅ no return
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
