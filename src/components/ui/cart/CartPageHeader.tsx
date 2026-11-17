"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import NavBack from "@/assets/icons/navBacksmall.png";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";

interface CartPageHeaderProps {
  itemCount: number;
  onBack: () => void;
}

export default function CartPageHeader({
  itemCount,
  onBack,
}: CartPageHeaderProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-15 pt-c20 z-40 hidden md:flex items-center w-full"
        style={{ top: "4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratMedium text-c12">Cart</span>
        </nav>
      </motion.div>

      <div className="w-full  md:px-15 px-0 pb-3 md:pb-0">
        <button
          onClick={onBack}
          className="flex items-center gap-4 pl-6 md:pl-0  mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 "
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            My Cart ({itemCount})
          </p>
        </button>
      </div>
    </>
  );
}
