"use client";

import { motion, easeInOut } from "framer-motion";

export default function WireframeLoader() {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: easeInOut, // ✅ use imported constant
      },
    },
  };

  const Box = ({ w, h, r }: { w: string; h: string; r?: string }) => (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-${r || "lg"} ${w} ${h}`}
    >
      <motion.div
        className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-6 bg-white">
  
      <Box w="w-2/3" h="h-8" />

     
      <Box w="w-full" h="h-64" r="xl" />

      {/* Text lines */}
      <Box w="w-full" h="h-5" />
      <Box w="w-5/6" h="h-5" />
      <Box w="w-2/3" h="h-5" />

      {/* Small cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} w="w-full" h="h-24" r="md" />
        ))}
      </div>
    </div>
  );
}
