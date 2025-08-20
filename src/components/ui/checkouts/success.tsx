"use client";

import { motion } from "framer-motion";

export default function PaymentSuccess() {
  return (
    <div className="flex w-full max-w-101 m-auto flex-col items-center justify-center md:mb-c64 space-y-6">
      <div className="w-13 h-13 rounded-full border-4 border-[#2D7565] flex items-center  justify-center">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          className="w-24 h-24"
        >
          <motion.path
            d="M14 27 L22 35 L38 17"
            fill="transparent"
            stroke="#2D7565"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-c18 font-MontserratMedium text-center">
          Payment Success
        </h2>

        <p className="font-MontserratNormal text-center text-sm">
          Your order is on its way, it will arrive between May 10th - Jun 19th.
        </p>
      </div>
    </div>
  );
}
