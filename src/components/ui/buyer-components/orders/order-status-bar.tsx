"use client";

import { motion } from "framer-motion";

interface OrdersNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function OrdersNav({ tabs, activeTab, onTabChange }: OrdersNavProps) {
  return (
    <div className="relative flex gap-2 bg-947fff/10 w-full max-w-152.25 border-gray-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
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
