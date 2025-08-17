"use client";

import { useEffect, useRef, useState } from "react";

const tabs = [
  { id: "details", label: "Product Details" },
  { id: "specs", label: "Product Specification" },
  { id: "reviews", label: "Reviews" },
  { id: "similar", label: "Similar Items" },
];

export default function ProductNav() {
  const [activeTab, setActiveTab] = useState("details");
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll to section
  const handleClick = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Track scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      let current = activeTab;
      for (const tab of tabs) {
        const section = document.getElementById(tab.id);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop <= 150 && sectionTop >= -section.offsetHeight + 150) {
            current = tab.id;
          }
        }
      }
      setActiveTab(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Update underline position when active tab changes or on resize
  useEffect(() => {
    const updateUnderline = () => {
      const activeIndex = tabs.findIndex((t) => t.id === activeTab);
      const activeButton = buttonRefs.current[activeIndex];
      if (activeButton) {
        setUnderlineStyle({
          width: activeButton.offsetWidth,
          left: activeButton.offsetLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  return (
    <div className="sticky top-0 z-50 bg-[rgba(148,127,255,0.15)]   bg-opacity-40 w-full">
      <div className="relative flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {(buttonRefs.current[index] = el)}}
            onClick={() => handleClick(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-6a0dad" : "text-6a0dad"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Underline animation */}
        <div
          className="absolute bottom-0 h-c3 bg-6a0dad transition-all duration-300"
          style={{
            width: underlineStyle.width,
            transform: `translateX(${underlineStyle.left}px)`,
          }}
        />
      </div>
    </div>
  );
}
