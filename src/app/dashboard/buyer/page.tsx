"use client";

import UserMain from "@/components/ui/buyer-components/Main-section/main";
import Image from "next/image";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import { motion } from "framer-motion";
import BuyerDashboard from "@/components/ui/mobile/dashbords/buyer-dashboard/dashboard";

export default function BuyerDashBoard() {
  return (
    <>
    <div className="md:hidden">
     < BuyerDashboard/>
    </div>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className=" pl-c56 pt-c20 z-40 md:flex items-center w-full hidden"
        style={{ top: "5rem" }}
      >
        <nav aria-label="breadcrumb" className="flex items-center gap-2">
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
            Account
          </span>
        </nav>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <UserMain />
      </motion.div>
    </>
  );
}
