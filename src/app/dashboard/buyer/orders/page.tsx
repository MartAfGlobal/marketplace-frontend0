"use client";

import Image from "next/image";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import { motion } from "framer-motion";
import NavBack from "@/assets/icons/navBacksmall.png";
import OrdersPage from "@/components/ui/buyer-components/orders/orders";
import SearchBtn from "@/assets/mobile/searchBtn.png"

export default function OrderPage() {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className=" hidden pl-c56 pt-c20 z-40 md:flex items-center w-full"
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
          <Link
            href="/dashboard/buyer"
            className="opacity-30 font-MontserratMedium text-c12"
          >
            Account
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
            orders
          </span>
        </nav>
      </motion.div>
      <div className="w-full  md:px-15">
        <div className="flex justify-between px-6 md:px-0  mt-3 md:mt-c32">
         <div className="flex items-center gap-4">
           <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px] "
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">orders</p>
         </div>
         <div className="h-6 w-6 md:hidden flex items-center justify-center">
          <Image
            src={SearchBtn}
            alt="Search"
            width={19.52}
            height={19.52}
            className=" "
          />
         </div>
        </div>
        <div>
          <OrdersPage />
        </div>
      </div>
    </div>
  );
}
