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
      className={`transform w-full lg:max-w-66.25 lg:rounded-2xl lg:p-c24 lg:circle-shadow z-40 lg:bg-ffffff overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
         ${
        hideOnMobile ? "hidden sm:block" : ""
      }`}
    >
  
      <ul className="flex flex-row lg:flex-col border-b lg:border-b-0 border-gray-200 lg:border-transparent gap-2 lg:gap-0 w-full lg:w-full  lg:px-0">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => handleClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-2 font-MontserratNormal text-sm lg:h-c32 w-full transition-all justify-center lg:justify-start  p-4 lg:p-0 whitespace-nowrap lg:border-r-4 border-b-2 lg:border-b-0 ${
                  isActive
                    ? "lg:border-r-ff715b lg:border-b-transparent border-b-[#6a0dad] text-[#6a0dad] lg:text-161616"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {s.icon && (
                  <Image
                    src={s.icon}
                    alt={`${s.label} icon`}
                    className="w-2.5 h-2.5 object-contain hidden lg:block"
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
