"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/cards/ProductCard";
import Copy from "@/assets/icons/Copy.png";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";


import { dummyProducts } from "@/store/data/products";

export default function Orders() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [visible, setVisible] = useState(10); // Show 6 items by default

  const showMore = () => setVisible((prev) => prev + 10);

  // const { id } = use(params);

  const handleTrackOrder = () => {
    const trackingId = trackOrders[0]?.id?.toString() ?? "";
    router.push(`/dashboard/buyer/orders/tracking/${trackingId}`);
  };

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );
  const trackOrders: TrackOrders[] = [
    // Uncomment to test non-empty state
    {
      id: 1,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 2,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
    {
      id: 3,
      date: "Delivery: May 15, 2025",
      title: "Nike shoes with white an",
      discription: "Two piece shop",
      icon: Shoes,
      totalQuantity: "2",
      colour: "black",
      totalAmount: "14,000",
    },
  ];

  const orderId = "304657846532";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="space-y-c24 w-full">
      <div className="w-full">
        <div className="w-full space-y-c24 mt-c32">
          <AnimatePresence mode="wait">
            {trackOrders.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="w-full text-center max-w-41.25 text-000000/60 font-MontserratMedium text-c18 leading-6.5">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 ">
                  {fashionProducts.slice(0, visible).map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </motion.div>
            ) : (
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
                className="space-y-c24"
              >
                {trackOrders.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-full flex justify-between mb-c32">
                      <div>
                        <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                          Order is being processed
                        </p>
                        <div className="flex gap-2 mt-2">
                          <p className="text-c12 font-MontserratNormal">
                            Order ID: {orderId}
                          </p>
                          <button onClick={handleCopy}>
                            <Image
                              src={Copy}
                              alt="copy"
                              width={16}
                              height={16}
                            />
                          </button>
                          {copied && (
                            <span className="text-green-600 text-c12 font-MontserratMedium">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                        {item.date}
                      </p>
                    </div>

                    <div className="w-full justify-between  pb-c32 flex">
                      <div className="flex gap-4 items-start">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={96}
                          height={96}
                        />
                        <div className="w-full max-w-143.75">
                          <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                            {item.title}
                          </p>
                          <p className="font-MontserratMedium text-c12 leading-c16 pb-3 text-000000">
                            {item.discription}
                          </p>
                          <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                            <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                              {item.totalQuantity}PC, {item.colour}
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                            ₦{item.totalAmount}
                          </p>
                        </div>
                      </div>

                      <div className="w-full max-w-70 space-y-4">
                        <Button
                          onClick={handleTrackOrder}
                          className="bg-transparent border border-ff715b text-ff715b"
                        >
                          Track order
                        </Button>
                        <Button onClick={() => setOpen(true)}>
                          Confirm delivery
                        </Button>
                        <div className="w-full flex justify-center">
                          <Link
                            href={`orders/${item.id}`}
                            className="text-c14 font-MontserratSemiBold text-ff715b"
                          >
                            Order details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onNo={() => setOpen(false)}
        onYes={() => {
          open;
        }}
      />
    </div>
  );
}
