import { useEffect, useState } from "react";
import { Props } from "@/types/global";
import Image from "next/image";
import { motion } from "framer-motion";

interface SectionSelectorProps extends Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSectionClick: (id: string) => void;
}

export default function SectionSelector({
  sections,
  hideOnMobile = true,
  containerRef,
  onSectionClick,
}: SectionSelectorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      {
        root: containerRef.current,
        rootMargin: "0px 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, containerRef]);

  return (
    <motion.nav
      aria-label="Page sections"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={`transform w-full max-w-66 rounded-2xl p-c24 circle-shadow z-40 ${
        hideOnMobile ? "hidden sm:block" : ""
      }`}
    >
      <h1 className="font-MontserratSemiBold text-c18 leading-c26 text-161616 pt-0 pb-c20">
        Account Overview
      </h1>
      <ul>
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => onSectionClick(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-3 text-161616 font-MontserratMedium text-c12 h-c32 w-full transition-all justify-start border-r-4 ${
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
