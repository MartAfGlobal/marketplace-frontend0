"use client";

import { motion } from "framer-motion";

interface PaymentFailedProps {
  title?: string;
  description?: string;
}

export default function PaymentFailed({
  title = "Payment Failed",
  description = "Your payment could not be processed. Please check your payment details or try again.",
}: PaymentFailedProps) {
  return (
    <div className="flex w-full max-w-101 m-auto flex-col items-center justify-center md:mb-c64 space-y-6">
      <div className="w-13 h-13 rounded-full border-4 border-[#EF4444] flex items-center justify-center bg-red-50">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          className="w-24 h-24"
        >
          <motion.path
            d="M16 16 L36 36 M36 16 L16 36"
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-c18 font-MontserratMedium text-center text-161616">
          {title}
        </h2>

        <p className="font-MontserratNormal text-center text-sm text-161616/70">
          {description}
        </p>
      </div>
    </div>
  );
}
