"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface SectionItem {
  id: string;
  label: string;
  icon?: any;
  href?: string;
  content?: React.ReactNode;
}

export interface OrderSectionSelectorProps {
  sections: SectionItem[];
  hideOnMobile?: boolean;
  activeId?: string;
  onSectionClick?: (id: string) => void;
}

export default function OrderSectionSelector({
  sections,
  hideOnMobile = true,
  activeId: activeIdProp,
  onSectionClick,
}: OrderSectionSelectorProps) {
  const [activeId, setActiveId] = useState(activeIdProp || sections[0]?.id || null);

  useEffect(() => {
    if (activeIdProp) {
      setActiveId(activeIdProp);
    }
  }, [activeIdProp]);

  const currentActiveId = activeIdProp || activeId;

  const handleClick = (id: string) => {
    setActiveId(id);
    if (onSectionClick) {
      onSectionClick(id);
    }
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
      className={`transform w-full lg:max-w-66.25 lg:rounded-2xl lg:p-c24 lg:circle-shadow z-40 lg:bg-ffffff  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
         ${
        hideOnMobile ? "hidden sm:block" : ""
      }`}
    >
      <ul className="flex flex-row lg:flex-col border-b  lg:border-b-0 border-gray-200 bg-[#947fff]/10 lg:border-transparent gap-2 lg:gap-0 w-full lg:w-full   lg:px-0">
        {sections.map((s) => {
          const isActive = currentActiveId === s.id;
          const buttonContent = (
            <>
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
            </>
          );

          const itemClasses = `flex items-center font-MontserratMedium gap-2 text-xs lg:h-c32 py-2 w-full transition-all justify-center lg:justify-start p-4 lg:p-0 whitespace-nowrap border-b-2 lg:border-b-0 ${
            isActive
              ? "lg:border-r-4 lg:border-r-ff715b border-b-[#6a0dad] text-[#6a0dad] lg:text-161616"
              : "lg:border-r-4 lg:border-r-transparent border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`;

          return (
            <li key={s.id}>
              {s.href ? (
                <Link
                  href={s.href}
                  onClick={() => handleClick(s.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={itemClasses}
                >
                  {buttonContent}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={itemClasses}
                >
                  {buttonContent}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
