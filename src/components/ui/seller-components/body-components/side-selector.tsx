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
      className={`transform w-full md:max-w-66.25 md:rounded-2xl md:p-c24 md:circle-shadow z-40 md:bg-ffffff overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
         ${
        hideOnMobile ? "hidden sm:block" : ""
      }`}
    >
  
      <ul className="flex flex-row md:flex-col border-b md:border-b-0 border-gray-200 md:border-transparent gap-2 md:gap-0 w-full md:w-full  md:px-0">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-2 font-MontserratNormal text-sm md:h-c32 w-full transition-all justify-center md:justify-start  p-4 md:p-0 whitespace-nowrap md:border-r-4 border-b-2 md:border-b-0 ${
                  isActive
                    ? "md:border-r-ff715b md:border-b-transparent border-b-[#6a0dad] text-[#6a0dad] md:text-161616"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {s.icon && (
                  <Image
                    src={s.icon}
                    alt={`${s.label} icon`}
                    className="w-2.5 h-2.5 object-contain hidden md:block"
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
