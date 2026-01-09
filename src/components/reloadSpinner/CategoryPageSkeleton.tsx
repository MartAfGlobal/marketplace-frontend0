"use client";

import { motion } from "framer-motion";

export default function CategoryPageSkeleton() {
  const skeletonCount = 12;

  return (
    <div className="md:px-16 px-6">
      {/* Breadcrumb Skeleton */}
      <div className="py-8 flex items-center gap-1 text-sm font-semibold">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Hero Skeleton */}
      <div className="h-70 rounded-c30 bg-gray-200 relative overflow-hidden animate-pulse mb-12" />

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-c28 mb-12">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <motion.div
            key={idx}
            className="h-[264px] rounded-lg bg-gray-200"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Ad Banner Skeleton */}
      <div className="xl:max-w-full w-full h-75 bg-gray-200 rounded-2xl animate-pulse mb-12" />

      {/* Top Deals Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-c28">
        {Array.from({ length: 6 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="h-[264px] rounded-lg bg-gray-200"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}
