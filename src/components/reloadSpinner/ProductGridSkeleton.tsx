"use client";

import { motion } from "framer-motion";

export default function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-c28 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-[264px] rounded-lg bg-gray-200"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}
