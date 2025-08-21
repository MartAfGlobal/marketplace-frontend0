import Image from "next/image";
import { motion, Variants } from "framer-motion";

import Electricity from "@/assets/mobile/electricals.png";
import Clothing from "@/assets/mobile/clothing.png";
import Food from "@/assets/mobile/freshFood.jpg";
import Jewelry from "@/assets/mobile/jeweries.jpg";
import ArrowRight from "@/assets/mobile/arrow-pointer.png";

export default function MobileCategory() {
  const category = [
    { icon: Electricity, name: "Electronics" },
    { icon: Clothing, name: "Clothes" },
    { icon: Food, name: "Fresh foods" },
    { icon: Jewelry, name: "Jewelries" },
  ];

  // Always return a proper Variants object
  const getVariants = (index: number): Variants => {
    switch (index % 4) {
      case 0:
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
        };
      case 1:
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
        };
      case 2:
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
        };
      case 3:
        return {
          hidden: { scale: 1.2, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6 } },
        };
    }
  };

  return (
    <div className="mt-c48 w-full overflow-hidden px-6.75">
      <motion.div
        className="text-center mb-c32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-MontserratSemiBold text-161616 text-c16">
          Explore Our Categories
        </h1>
        <p className="font-MontserratSemiBold text-sm text-161616">
          Explore Our Categories. Find the perfect products that suit your needs.
        </p>
      </motion.div>

      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-c32 mt-c32 items-center">
        {category.map((cat, index) => (
          <motion.div
            key={cat.name}
            className="w-full cursor-pointer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={getVariants(index)}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={cat.icon}
              alt={cat.name}
              width={160}
              height={100}
              className="rounded-lg shadow-sm"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full pt-11 pb-c48"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-transparent border flex items-center justify-center gap-3 border-ff715b text-ff715b w-full h-c48 rounded-lg font-MontserratSemiBold text-c16"
        >
          <span>Browse All Categories</span>
          <Image src={ArrowRight} alt="arrow right" width={18.12} height={15.1} />
        </motion.button>
      </motion.div>
    </div>
  );
}
