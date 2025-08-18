"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DropdownModalProps } from "@/types/global";


import Logo from "@/assets/Logos/authLogo.svg";
import CloseModal from "@/assets/headerIcon/closeModal.png";
import CaretDown from "@/assets/headerIcon/caretD.png";
import CartIcon from "@/assets/headerIcon/cateIcon.png";
import Currency from "@/assets/headerIcon/CurrencyCircleDollar.png";
import speak from "@/assets/headerIcon/speakIcon.png";
import shipto from "@/assets/headerIcon/shipto.png";
import { Category } from "@/types/global";
import English from "@/assets/headerIcon/englishicon.png"
import French from "@/assets/headerIcon/FrienchIcon.png"
import Spanish from "@/assets/headerIcon/spanish.png"
import Portegual from "@/assets/headerIcon/Portugal.png"


const settings = [
  {
    icon: Currency,
    name: "Currency",
    options: [
      { icon: English, name: "USD - $" },
      { icon: Spanish, name: "EUR - €" },
      { icon: Portegual, name: "NGN - ₦" },
    ],
  },
  {
    icon: speak,
    name: "Language",
    options: [
      { icon: English, name: "English" },
      { icon: Spanish, name: "Spanish" },
      { icon: French, name: "French" },
      { icon: Portegual, name: "Portuguese" },
    ],
  },
  {
    icon: shipto,
    name: "Ship To",
    options: [
      { icon: English, name: "United States" },
      { icon: Spanish, name: "Nigeria" },
      { icon: French, name: "United Kingdom" },
    ],
  },
];

const categories: Category[] = [
  {
    name: "Fashion",
    icon: CartIcon,
    subcategories: ["Shoes & footwear", "Men’s wear", "Women’s wear"],
  },
  {
    name: "Electronics",
    icon: CartIcon,
    subcategories: ["Phones", "Tablets", "Laptops & Desktop"],
  },

  {
    name: "Home & Living",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Groceries & Essentials",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Health & Beauty",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Books, Media & Education",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Travel & Luggage",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Automotive & Industrial",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Kids & Babies",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
  {
    name: "Culture-specific",
    icon: CartIcon,
    subcategories: ["Furniture", "Decor", "Appliances"],
  },
];



export default function DropdownModal({ open, onClose }: DropdownModalProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Container (unwrap) variants

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut", // ✅ valid easing
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut", // ✅ valid easing
      },
    },
  };

  // Subcategory expand/collapse
  const expandVariants: Variants = {
    collapsed: { opacity: 0, height: 0 },
    expanded: {
      opacity: 1,
      height: "auto" as any, // 👈 bypass TypeScript check
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Optional backdrop (click to close) */}
          <motion.div
            className="fixed top-0 inset-0 z-40  w-full "
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
          />

          {/* The dropdown itself */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="absolute top-0  z-50 w-full "
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="bg-white w-full px-6 py-6"
              onClick={(e) => e.stopPropagation()} // prevent backdrop close
            >
              <div className="flex justify-between items-center gap-2 mb-c32 h-c42">
                <Link href="/">
                  <Image src={Logo} alt="Logo" width={39.27} height={32} />
                </Link>
                <button onClick={onClose}>
                  <Image
                    src={CloseModal}
                    alt="close"
                    width={21.01}
                    height={21.01}
                  />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-MontserratSemiBold text-c20  mb-6">
                  Categories
                </h4>
                <ul className="space-y-2">
                  {categories.map((cat) => {
                    const isOpen = openCategory === cat.name;
                    return (
                      <li key={cat.name} className="">
                        <button
                          onClick={() =>
                            setOpenCategory(isOpen ? null : cat.name)
                          }
                          className="flex items-center justify-between w-full   h-c48  "
                        >
                          <span className="flex items-center gap-3">
                            <Image
                              src={cat.icon}
                              alt={cat.name}
                              width={24}
                              height={24}
                            />
                            <span className="font-MontserratSemiBold text-c12">
                              {cat.name}
                            </span>
                          </span>

                          <Image
                            src={CaretDown}
                            alt="open"
                            className={`${isOpen ? "rotate-180" : ""}`}
                            width={11}
                            height={6}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              key="sub"
                              className="overflow-hidden"
                              variants={expandVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                            >
                              {cat.subcategories.map((sub) => (
                                <li
                                  key={sub}
                                  className="text-c12 font-MontserratNormal h-c32 flex items-center pl-c48"
                                >
                                  {sub}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Settings */}
              <div className="mt-c24">
                <h4 className="font-MontserratSemiBold text-c20  mb-6">
                  Settings
                </h4>
                <ul className="space-y-2">
                  {settings.map((cat) => {
                    const isOpen = openCategory === cat.name;
                    return (
                      <li key={cat.name} className="">
                        <button
                          onClick={() =>
                            setOpenCategory(isOpen ? null : cat.name)
                          }
                          className="flex items-center justify-between w-full   h-c48  "
                        >
                          <span className="flex items-center gap-3">
                            <Image
                              src={cat.icon}
                              alt={cat.name}
                              width={24}
                              height={24}
                            />
                            <span className="font-MontserratSemiBold text-c12">
                              {cat.name}
                            </span>
                          </span>

                          <Image
                            src={CaretDown}
                            alt="open"
                            className={`${isOpen ? "rotate-180" : ""}`}
                            width={11}
                            height={6}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              key="sub"
                              className="overflow-hidden"
                              variants={expandVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                            >
                              {cat.options.map((opt) => (
                                <li key={opt.name} className="text-c12 font-MontserratNormal  flex items-center h-c40 gap-3 pl-c48">
                                    <Image src={opt.icon} alt={opt.name} width={24} height={24} />
                                  <span>{opt.name}</span> 
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Logins */}

              <div className="flex gap-3 text-c12 font-MontserratSemiBold mt-c24 mb-c48">
                <Link href="/auth/login" className="h-c48 w-full flex items-center justify-center rounded-c8 border text-ff715b border-ff715b">Sign in</Link>
                <Link href="/auth/login" className="h-c48 w-full flex items-center justify-center rounded-c8 text-ffffff bg-ff715b">Sign up</Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
