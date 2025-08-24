"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ProductCard from "@/components/ui/cards/ProductCard";
import Copy from "@/assets/icons/Copy.png";
import Visa from "@/assets/mobile/cards/visa.png";
import { dummyProducts } from "@/store/data/products";
import Security from "@/assets/icons/ShieldCheck.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";

import NavBack from "@/assets/icons/navBacksmall.png";
import { TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import ResponseModal from "@/components/ui/mobile/modal/ResponseModal";

export default function OrderOnTheWayPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"yes" | "no">("no");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const orderId = "1234567890";

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

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  return (
    <div className="px-6">
      <div className="pb-7 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Confirm delivery
          </p>
        </button>
      </div>
      <div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <div className="flex gap-2 mt-2">
                <p className="text-sm font-MontserratSemiBold">
                  Order ID: {orderId}
                </p>
                <button onClick={handleCopy}>
                  <Image src={Copy} alt="copy" width={16} height={16} />
                </button>
                {copied && (
                  <span className="text-green-600 text-c12 font-MontserratMedium">
                    Copied!
                  </span>
                )}
              </div>
              <div className="font-MontserratNormal text-c12 space-y-1 pt-3 pb-4 border-b border-black/5">
                <p>Seller: Kinicho stores</p>
                <p>Order date: May 15, 2025 </p>
                <p>Delivery date: June 15, 2025 - July 25, 2025 </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-51 mt-4"
          >
            <div>
              <div className="flex gap-2 ">
                <p className="text-sm font-MontserratSemiBold">
                  Address for delivery
                </p>
              </div>
              <div className="font-MontserratNormal text-c12 space-y-1 pt-3 pb-4  border-b border-black/5">
                <p>Chisom Ebube Chris</p>
                <p>+2347034562314 </p>
                <p>
                  LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full  mt-4"
          >
            <div>
              <div className="flex gap-2 ">
                <p className="text-sm font-MontserratSemiBold">
                  Payment method
                </p>
              </div>
              <div className="font-MontserratNormal text-c12 space-y-1 pt-3 pb-4  border-b border-black/5">
                <p>Credit/Debit card</p>
                <div className=" flex items-center justify-between mt-c13-17">
                  <p className="text-c12 font-MontserratSemiBold">
                    534780******7167
                  </p>
                  <Image src={Visa} alt="card" width={32} height={18.35} />
                </div>
                <div className="flex items-center gap-2 mt-3.5">
                  <Image src={Security} alt="Security" width={20} height={20} />
                  <p className="text-c12 font-MontserratSemiBold">
                    Secure payments
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

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
            className="space-y-c32 pt-4"
          >
            <div>
              <p>Package details</p>
            </div>
            {trackOrders.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-full md:justify-between flex-col pb-5 border-b border-000000/5 flex md:flex-row">
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 300, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className=" pt-4 "
        >
          <div className="">
            <p className="text-sm font-MontserratSemiBold pb-3 ">
              Payment details
            </p>
          </div>
          {/* Price Details */}
          <div className=" space-y-2 text-sm font-MontserratNormal">
            <div className="pb-3 border-b border-000000/5">
              <p className="">Total</p>
              <p className="text-c20 font-MontserratSemiBold">N30,000</p>
            </div>
            <div className="flex justify-between">
              <p className="">Total items:</p>
              <p className="">N50,000</p>
            </div>
            <div className="flex justify-between">
              <p className="">Discount:</p>
              <p className=" text-ca0202">-₦50</p>
            </div>
            <div className="flex justify-between pb-3 border-b border-000000/5">
              <p className="">Subtotal:</p>
              <p className="">N30,000</p>
            </div>

            <div className="flex justify-between pb-3 border-b border-000000/5">
              <p className="">Shipping fee:</p>
              <p className="">N5,000</p>
            </div>
            <div className="flex justify-between pb-3 border-b border-000000/5">
              <p className="">Order total:</p>
              <p className="">N30,000</p>
            </div>
          </div>
        </motion.div>
        <div className="py-c32  pb-60">
          <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
            More to love
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {fashionProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-46 bg-ffffff circle-shadow px-6 pt-6 fixed left-0 bottom-0 md:hidden z-50 gap-4">
        <div className="text-center w-full pb-c32 space-y-1">
          <p className="text-sm font-MontserratSemiBold">
            Did you receive this package?
          </p>
          <p className="text-c12 font-MontserratNormal">
            Confirming helps us complete your order and improve service.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-center w-full text-c12 font-MontserratSemiBold">
          <button
            onClick={() => {
              setModalType("no");
              setIsModalOpen(true);
            }}
            className="border border-ff715b rounded-lg h-c48 flex items-center justify-center w-full text-ff715b"
          >
            No
          </button>
          <button
             onClick={() => {
          setModalType("yes");
          setIsModalOpen(true);
        }}
            className=" rounded-lg h-c48 flex items-center justify-center w-full bg-ff715b text-white"
          >
            Yes
          </button>
        </div>
      </div>
      <ResponseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
         type={modalType}
      />
    </div>
  );
}
