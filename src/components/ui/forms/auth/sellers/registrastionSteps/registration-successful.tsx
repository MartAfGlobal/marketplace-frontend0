"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";

export default function RegisteredSumibted() {
  const router = useRouter();

  return (
    <div className="w-full max-w-164 h-121 upload-shadow rounded-[31.33px] p-12">
      <div className="justify-center w-full">
        {/* Animated circle with checkmark */}
        <motion.div
          className="w-24 h-24 rounded-full bg-2d7565 flex items-center m-auto justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            className="w-12 h-10"
          >
            <motion.path
              d="M14 27 L22 35 L38 17"
              fill="transparent"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>

        {/* Text content */}
        <div className="space-y-6 mt-6 mb-12">
          <h2 className="text-c32 text-161616 font-MontserratSemiBold text-center">
            Registration Submitted Successfully
          </h2>
          <p className="font-MontserratNormal text-center text-base text-161616">
            Thanks for registering! Your details are under review. You'll be
            notified by email once your account is approved. We look forward to
            having you onboard!
          </p>
        </div>

        {/* Button */}
        <div className="w-full">
          <Button onClick={() => router.push("/dashboard/seller")}>
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
