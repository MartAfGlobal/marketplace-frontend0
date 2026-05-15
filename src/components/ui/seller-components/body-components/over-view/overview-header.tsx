"use client";

import { useSelector } from "react-redux";
import FilterDropdown from "./Filter-components/filterButton";
import { filterOptions } from "./Filter-components/filterOptions";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import AlartSvg from "@/assets/Seller/alart.svg";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OverviewHeader() {
  const verificationStatus = useSelector(
    (state: any) => state.seller.verificationStatus,
  );

  const percentage = verificationStatus?.percentage ?? 0;
  const isIncomplete = percentage < 65;

  console.log("overview-header status", percentage);
  const router = useRouter();
  console.log("checking-seller data:....", isIncomplete);

  return (
    <div className="flex flex-col md:flex-row md:h-c48 items-center justify-between w-full px-3 gap-4 md:gap-0 relative">
      {/* Top row on mobile: Overview + Filter (if not incomplete) */}
      <div className="w-full md:hidden md:max-w-87">
        <SearchInput placeholder="Search for anything" />
      </div>
      <div className="flex items-center justify-between w-full md:hidden">
        <p className="text-c18 font-MontserratMedium">Overview</p>

        <FilterDropdown
          options={filterOptions}
          onChange={(value) => console.log("Selected:", value)}
        />
      </div>

      <div className="flex items-center lg:justify-between  w-full">
        <div className="w-full hidden gap-12 lg:max-w-87 md:flex items-center justify-between">
          <p className="text-c18 font-MontserratMedium">Overview</p>
          <SearchInput placeholder="Search for anything" />
        </div>

        {/* Desktop View Title (hidden on mobile) */}

        {/* Desktop Filter */}
        <div className="  hidden lg:block">
           <FilterDropdown
              options={filterOptions}
              onChange={(value) => console.log("Selected:", value)}
            />
          {/* {!isIncomplete && (
           
          )} */}
        </div>
      </div>

      {/* {isIncomplete && (
        <motion.div
          className="w-full max-w-108.25 flex gap-2.5 absolute right-0 z-40 bg-[#0070e9]/60 text-white py-3 px-2.5 text-c12 font-MontserratNormal  shadow-lg"
          animate={{
            scale: [1, 1.03, 1], // gently scales up and back
            opacity: [1, 0.8, 1], // fades in and out slightly
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image src={AlartSvg} alt="Alert" className="w-c19 h-c19" />

          <div className="flex-1">
            <p>Complete your KYB documentation to begin using our services</p>
            <p className="mt-2">{percentage}%</p>
            <div className="flex justify-between items-center h-fit mt-2">
              <div className="w-full max-w-50.5">
                <div className="w-full bg-white/30 h-1 overflow-hidden rounded">
                  <motion.div
                    className="bg-0070e9 h-1"
                    style={{ width: `${percentage}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  router.push("/dashboard/seller/registration-progress")
                }
                className="font-MontserratBold text-c10 ml-2"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )} */}
    </div>
  );
}
