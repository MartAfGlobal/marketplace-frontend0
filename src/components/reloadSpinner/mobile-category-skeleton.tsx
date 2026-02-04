import { motion } from "framer-motion";

export function MobileCategorySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-c32 mt-c32 justify-center items-center">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-200 animate-pulse"
        >
          {/* Image placeholder */}
          <div className="absolute inset-0 bg-gray-300" />

          {/* Bottom label placeholder */}
          <div className="absolute bottom-0 w-full h-10 bg-gray-400/60 flex items-center px-2">
            <div className="h-3 w-3/4 bg-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-center gap-3.75 mt-c32 mb-c48 h-c40"></div>
        </motion.div>
      ))}
    </div>
  );
}
