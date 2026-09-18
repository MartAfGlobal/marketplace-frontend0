"use client";

import { motion } from "framer-motion";

export default function ProductSectionSkeleton({
  title,
  count = 12,
}: {
  title?: string;
  count?: number;
}) {
  return (
    <section className="mb-c64">
      {/* Title skeleton */}
      <div className="flex items-center justify-between mb-12">
        <motion.div
          className="h-5 w-40 rounded bg-gray-200"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-[48px] products-section md:gap-x-[28.2px] justify-center w-full mx-auto">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="h-[264px] rounded-lg bg-gray-200"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>
    </section>
  );
}
