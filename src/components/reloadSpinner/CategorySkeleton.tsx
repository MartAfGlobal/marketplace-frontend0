"use client";

import { motion } from "framer-motion";

export default function CategorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      <div className="md:flex flex-col gap-3 px-c32 hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm"
          >
            {/* Icon placeholder */}
            <motion.div
              className="w-10 h-10 rounded-md bg-gray-200"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />

            {/* Text placeholder */}
            <motion.div
              className="h-4 w-32 rounded bg-gray-200"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 px-c24 md:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between p-2  bg-white shadow-sm"
          >
            <div className="flex w-full items-center gap-4 ">
              {/* Icon placeholder */}
              <motion.div
                className="w-8 h-8 rounded-full bg-gray-200"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />

              {/* Text placeholder */}
              <motion.div
                className="h-4 w-32  bg-gray-200"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>
              {/* drowpdown button */}
              <motion.div
                className="h-4 w-4  bg-gray-200"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            
          </div>
        ))}
      </div>
    </>
  );
}
