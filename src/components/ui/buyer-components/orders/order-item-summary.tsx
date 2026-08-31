"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { OrderLineItem } from "@/types/global";

interface OrderItemSummaryProps {
  orderItems: OrderLineItem[];
}

export default function OrderItemSummary({ orderItems }: OrderItemSummaryProps) {
  return (
    <motion.div
      key="orders-list"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0, height: 0 },
        visible: {
          opacity: 1,
          height: "auto",
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="md:space-y-c24 space-y-7 w-full"
    >
      {orderItems.map((item: OrderLineItem) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between"
        >
          <Link
            href={{
              pathname: `/product/${item.product_slug}`,
              query:
                item.variation || item.product
                  ? { variationId: item.variation }
                  : { variationId: item.product },
            }}
            className="w-full justify-between md:pb-8 flex"
          >
            <div className="flex gap-4 items-center md:items-start">
              <Image
                src={item.product_image || "/placeholder.png"}
                alt={item.product_name || "Product"}
                width={100}
                height={100}
                className="hidden md:flex"
              />
              <Image
                src={item.product_image || "/placeholder.png"}
                alt={item.product_name || "Product"}
                width={64}
                height={64}
                className="md:hidden"
              />
              <div className="w-full max-w-143.75">
                <p className="md:font-MontserratSemiBold text-c12 font-MontserratNormal md:text-sm leading-c24 pb-3 text-000000">
                  {item.product_name}
                </p>

                <div className="w-fit p-2 justify-center md:text-nowrap rounded-c12 bg-black/3 flex items-center">
                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12">
                    {item.fulfilled_quantity ?? item.quantity}PC,{" "}
                    {item.variation_name || item.product_name}
                  </span>
                </div>
                <p className="font-MontserratSemiBold text-sm flex md:text-c18 pt-3 leading-6.5">
                  ₦{(item.price_at_purchase * (item.fulfilled_quantity ?? item.quantity ?? 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
