"use client";
import { use } from "react"; // <-- Important

import { Button } from "@/components/ui/Button/Button";
import SpeedOf from "@/assets/icons/speedof.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import Copy from "@/assets/icons/Copy.png";
import { TrackOrders } from "@/types/global";
import { useState } from "react";
import { dummyProducts } from "@/store/data/products";
import ProductCard from "@/components/ui/cards/ProductCard";
import Pointer from "@/assets/icons/pointer.svg";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";

export default function TrackingDetail() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(10);
  const showMore = () => setVisible((prev) => prev + 10);

  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const trackOrders: TrackOrders[] = [
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
  const trackingNumber = "NG020645529915";
  const handleCopy = () => {
    navigator.clipboard
      .writeText(trackingNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const handleCopyTrack = () => {
    navigator.clipboard
      .writeText(trackingNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 hidden pt-c20 z-40 md:flex items-center w-full"
        style={{ top: "4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link
            href="/dashboard/buyer"
            className="opacity-30 font-MontserratMedium text-c12"
          >
            Account
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link
            href="/dashboard/buyer/orders"
            className="opacity-30 font-MontserratMedium text-c12"
          >
            orders
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
            Tracking
          </span>
        </nav>
      </motion.div>

      <div className="w-full px-6 md:px-15">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mt-4 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold  hidden md:flex text-c16 text-161616">
            Order tracking
          </p>
          <p className="font-MontserratSemiBold md:hidden text-c16 text-161616">
            Track order
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:pt-c32  md:pb-c64 md:px-62.5"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="nd:py-c32 py-7"
          >
            <div>
              <div className="md:flex md:justify-between  md:border-b border-b-000000/20 space-y-c32 ">
                <div className="w-full md:max-w-84.25">
                  <p className="text-sm mb-6 font-MontserratSemiBold">
                    Delivery
                  </p>
                  <div className="">
                    <div className="flex gap-4 items-center text-6a0dad ">
                      <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                        <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">15</p>
                        <p className="text-c12 font-MontserratSemiBold">May 2025</p>
                      </div>
                      <p className="font-MontserratNormal text-sm text-000000">
                        -
                      </p>
                      <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                        <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">21</p>
                        <p className="text-c12 font-MontserratSemiBold">Jun 2025</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Image
                        src={SpeedOf}
                        alt="speed of"
                        width={82.96}
                        height={26.76}
                        className="w-16 h-[20.65px] md:[w-82.96] md:h-[26.76]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2  items-center">
                    <p className="text-sm  font-MontserratNormal">
                      Order ID: <span className="text-c12 font-MontserratSemiBold"> {orderId} </span>
                    </p>
                    <button onClick={handleCopy}>
                      <Image
                        src={Copy}
                        alt="copy"
                        width={12}
                        height={12}
                        className="items-center justify-center"
                      />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 md:items-center pb-6 md:pb-0 border-b border-b-000000/5">
                    <p className="md:text-sm font-MontserratNormal text-c12">
                      Tracking number:<span className="text-c12 font-MontserratSemiBold"> {trackingNumber} </span>
                    </p>
                    <button
                      onClick={handleCopyTrack}
                      className="flex   items-center justify-center"
                    >
                      <Image src={Copy} alt="copy" width={12} height={12} />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="font-MontserratNormal pt-c24 text-sm text-000000 border-b pb-6 md:pb-0  border-b-000000/5">
                    <p className="text-sm md:mb-6 mb-3 font-MontserratSemiBold">
                      Address for delivery
                    </p>
                    <div className="space-y-2">
                      <p>Chisom Ebube Chris</p>
                      <p>+2347034562314s</p>
                      <p>
                        LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria,
                        900102
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" md:max-w-74  w-full overflow-y-auto  custom-scroll mb-c32 h-fit  md:max-h-105.5 md:pr-7.5">
                  <p className="text-sm font-MontserratSemiBold mb-c32">
                    Package details
                  </p>
                  <div className="flex justify-between overflow-y-auto  custom-scroll h-fit max-h-54 ">
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
                          <div className="w-full justify-between md:pb-8 flex ">
                            <div className="flex gap-4 items-start  border-b border-b-000000/5  md:border-0 pb-c20 md:pb-0 h-fit">
                              <Image
                                src={item.icon}
                                alt={item.title}
                                width={100}
                                height={100}
                              />
                              <div className="w-full md:max-w-143.75">
                                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                                  {item.title}
                                </p>

                                <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                    {item.totalQuantity}PC, {item.colour}
                                  </span>
                                </div>
                                <p className="font-MontserratSemiBold hidden md:flex text-c18 pt-3 leading-6.5">
                                  ₦{item.totalAmount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pt-c32  text-sm font-MontserratSemiBold text-000000">
              <h1>Tracking details</h1>
            </div>
            <div className="flex gap-c24 mt-c24 items-start ">
              <div className="w-4 h-fit max-h-120">
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-4 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
              </div>

              <div className="pt-3 space-y-5.5">
                <div className="space-y-1">
                  <p className="text-sm font-MontserratSemiBold">
                    Customs clearance completed
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Package arrived at airport
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Flight departure
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Shipped
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Your order is being picked in the warehouse
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    The warehouse has started preparing your order
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Paid Successfully
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Submitted
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <div className="py-c32">
          <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
            More to love
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 ">
            {fashionProducts.slice(0, visible).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
