"use client";

import Image from "next/image";
import success from "@/assets/icons/success.png";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function AccountDetailsStep({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const sellerData = useSelector((state: any) => state.seller.data);

  console.log("leeeeeee,...", sellerData);

  return (
    <motion.div
      className="w-full  flex flex-col items-center justify-start"
      initial={{ opacity: 0, y: 30 }} // start faded & pushed down
      animate={{ opacity: 1, y: 0 }} // animate to visible & normal position
      exit={{ opacity: 0, y: -30 }} // exit animation if step changes
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className=" mt-20 h-98 bg-white rounded-xl flex flex-col gap-c48  items-center justify-center verfy   p-c48 w-full max-w-fit text-center text-nowrap"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="w-full max-w-98.25 justify-center m-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 w-full">
            <span className="text-2d7565 font-MontserratSemiBold text-c18">
              Verified
            </span>

            <motion.div
              className="rounded-full w-6 h-6 bg-2d7565 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
              viewport={{ once: true }}
            >
              <Image src={success} width={15.75} height={13.5} alt="success" />
            </motion.div>
          </div>

          {/* Email */}
          <div className="flex py-3.25 justify-center   w-full  mt-6 gap-4 text-left mb-2">
            <span className="text-646464 w-full max-w-41.75 font-MontserratSemiBold">
              Email Address:
            </span>
            <span className=" w-full font-MontserratSemiBold   text-c18 text-161616">
              {sellerData.email}
            </span>
          </div>

          {/* Phone */}
          <div className="flex py-3.25 gap-4 w-full text-left justify-center text-sm mb-6">
            <span className="text-646464 w-full max-w-41.75  text-base font-MontserratSemiBold">
              Phone Number 1:
            </span>
            <span className=" w-full font-MontserratSemiBold text-c18 text-161616">
              {sellerData.phone}
            </span>
          </div>
        </div>

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-ff715b max-w-111  text-white h-11 flex items-center justify-center rounded-lg font-sm font-MontserratSemiBold"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
