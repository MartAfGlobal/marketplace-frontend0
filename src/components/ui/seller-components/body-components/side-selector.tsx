import { useState } from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionSelectorProps } from "@/types/global";


export default function OrderSectionSelector({
  sections,
  hideOnMobile = true,
  onSectionClick,
}: SectionSelectorProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id || null);

  const handleClick = (id: string) => {
    setActiveId(id);
    onSectionClick(id);
  };

  return (
    <motion.nav
      aria-label="Page sections"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={`transform w-full  max-w-66.25 rounded-2xl p-c24 circle-shadow z-40 bg-ffffff
         ${
        hideOnMobile ? "hidden sm:block" : ""
      }`}
    >
  
      <ul>
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-2 text-161616 font-MontserratMedium text-c12 h-c32 w-full transition-all justify-start border-r-4 ${
                  isActive
                    ? "border-r-ff715b"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {s.icon && (
                  <Image
                    src={s.icon}
                    alt={`${s.label} icon`}
                    className="w-2.5 h-2.5 object-contain"
                    width={16}
                    height={16}
                  />
                )}
                <span>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
