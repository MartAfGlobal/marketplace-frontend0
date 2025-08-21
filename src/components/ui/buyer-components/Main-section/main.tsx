"use client";

import OverView from "./sections/over-view";
import SectionSelector from "@/components/ui/buyer-components/section-selector";
import { StaticImageData } from "next/image";
import Orders from "./sections/orders";
import Wishlist from "./sections/wish-list";
import { useRef } from "react";


import Btn1 from "@/assets/icons/user-dashboard/buttonSelector/button1.png";
import Btn2 from "@/assets/icons/user-dashboard/buttonSelector/button2.png";
import Btn3 from "@/assets/icons/user-dashboard/buttonSelector/button3.png";
import Btn4 from "@/assets/icons/user-dashboard/buttonSelector/button4.png";
import Btn5 from "@/assets/icons/user-dashboard/buttonSelector/button5.png";
import Btn6 from "@/assets/icons/user-dashboard/buttonSelector/button6.png";
import Btn7 from "@/assets/icons/user-dashboard/buttonSelector/button7.png";
import Btn8 from "@/assets/icons/user-dashboard/buttonSelector/button8.png";
import Btn9 from "@/assets/icons/user-dashboard/buttonSelector/button9.png";
import Btn10 from "@/assets/icons/user-dashboard/buttonSelector/button10.png";
import Btn11 from "@/assets/icons/user-dashboard/buttonSelector/button12.png";
import Btn12 from "@/assets/icons/user-dashboard/buttonSelector/button13.png";
import Coupon from "./sections/coupon";
import Seller from "./sections/sellers";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import UserCard from "./sections/user-cards";
import UserAddress from "./sections/address-selector";
import NotificationSettings from "./sections/notification-settings";
import CountryLanguageCurrencySelect from "./sections/language-region";
import PassWordSecurity from "./sections/password-security";
import DeleteAccount from "./sections/delete-account";

interface Section {
  id: string;
  label: string;
  icon: StaticImageData;
}

export default function UserMain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sections: Section[] = [
    { id: "overview", label: "Overview", icon: Btn1 },
    { id: "orders", label: "Orders", icon: Btn2 },
    { id: "wishlist", label: "Wishlist", icon: Btn3 },
    { id: "coupons", label: "Coupons", icon: Btn4 },
    { id: "sellers", label: "Sellers", icon: Btn5 },
    { id: "cards", label: "Cards", icon: Btn6 },
    { id: "addresses", label: "Addresses", icon: Btn7 },
    { id: "notifications", label: "Notifications", icon: Btn8 },
    { id: "language-regions", label: "Language & regions", icon: Btn9 },
    { id: "password-security", label: "Password & security", icon: Btn10 },
    { id: "privacy-policy", label: "Privacy policy", icon: Btn11 },
    { id: "legal-info", label: "Legal information", icon: Btn12 },
  ];

  const sidebarVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const overviewVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const ordersVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const wishlistVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const couponVariants: Variants = {
    hidden: { rotate: -3, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const sellerVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };



  return (
    <div
      className="hidden md:flex px-35 justify-center  gap-8 -full "
      style={{ paddingTop: "2rem" }}
    >
      {/* Sidebar with slide-in */}
      <motion.nav
        className="w-60 flex-shrink-0 sticky top-[7rem] overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 6rem)" }}
        variants={sidebarVariants}
        initial="hidden"
        viewport={{ once: false }}
        animate="visible"
      >
        <SectionSelector
          sections={sections}
          containerRef={containerRef}
          onSectionClick={(id) => {
            const el = document.getElementById(id);
            if (containerRef.current && el) {
              const yOffset = -20;
              const y =
                el.getBoundingClientRect().top -
                containerRef.current.getBoundingClientRect().top +
                containerRef.current.scrollTop +
                yOffset;

              containerRef.current.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
        />
      </motion.nav>

      {/* Main content with per-section animations */}
      <main
        className="space-y-c48 overflow-y-auto overflow-x-hidden w-full  mb-c32 box-border no-scrollbar"
        style={{ height: "calc(100vh - 6rem)" }}
        ref={containerRef}
      >
        <motion.section
          id="overview"
          className=" scroll-mt-28 section-offset "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={overviewVariants}
        >
          <OverView />
        </motion.section>

        <motion.section
          id="orders"
          className="section-offset scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={ordersVariants}
        >
          <Orders />
        </motion.section>

        <motion.section
          id="wishlist"
          className="section-offset scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={wishlistVariants}
        >
          <Wishlist />
        </motion.section>

        <motion.section
          id="coupons"
          className="section-offset"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={couponVariants}
        >
          <Coupon />
        </motion.section>

        <motion.section
          id="sellers"
          className="section-offset scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <Seller />
        </motion.section>
        <motion.section
          id="cards"
          className="section-offset scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <UserCard />
        </motion.section>
        <motion.section
          id="addresses"
          className="section-offset scroll-mt-28 border-b pb-c48 border-b-000000/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <UserAddress />
        </motion.section>
        <motion.section
          id="notifications"
          className="section-offset scroll-mt-28 border-b pb-c48 border-b-000000/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <NotificationSettings />
        </motion.section>
        <motion.section
          id="language-regions"
          className="section-offset scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <CountryLanguageCurrencySelect />
        </motion.section>
        <motion.section
          id="password-security"
          className="section-offset scroll-mt-28 border-b pb-c48 border-b-000000/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <PassWordSecurity />
        </motion.section>
        <motion.section
          id=""
          className="section-offset scroll-mt-28 "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={sellerVariants}
        >
          <DeleteAccount />
        </motion.section>
      </main>
    </div>
  );
}
