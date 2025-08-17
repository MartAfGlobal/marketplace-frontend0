"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";
import VisaCard from "@/assets/icons/visa_inc_logo.svg.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import Copy from "@/assets/icons/Copy.png";
import { TrackOrders } from "@/types/global";
import { useState } from "react";
import { dummyProducts } from "@/store/data/products";
import ProductCard from "@/components/ui/cards/ProductCard";
import { useRouter } from "next/navigation";
import { OrderDetailsPageProps } from "@/types/global";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import PaymentSuccess from "./success";

export default function PaymentSuccessful() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
 
  const router = useRouter();
  const orderId = "304657846532";
  const [visible, setVisible] = useState(10);

  const handleTrackOrder = () => {
    const trackingId = trackOrders[0]?.id?.toString() ?? "";
    router.push(`/dashboard/buyer/orders/tracking/${trackingId}`);
  };

  const showMore = () => setVisible((prev) => prev + 10);

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
    <>
      <div>
   

        <div className="w-full px-15">
        
          <div className="pt-c32 pb-c64 px-62.5 ">
            
            <div className="px-c32 pt-c32 rounded-2xl border border-000000/10">
             <PaymentSuccess/>
              <div className="flex justify-between space-y-c32">
                <div className="w-full max-w-57">
                 
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
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
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <p>Seller: Kinicho stores</p>
                    <p>Order date: May 15, 2025</p>
                    <p>Delivery date: June 15, 2025 - July 25, 2025</p>
                  </div>
                </div>
                <div className=" flex flex-col gap-c32 w-full max-w-84">
                  <Button onClick={() => setOpen(true)}>
                    Confirm delivery
                  </Button>
                  <Button
                    onClick={handleTrackOrder}
                    className="bg-transparent border text-ff715b hover:text-ffffff border-ff715b"
                  >
                    Track order
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-full max-w-57">
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Address for delivery
                    </p>
                  </div>
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <p>Chisom Ebube Chris</p>
                    <p>+2347034562314</p>
                    <p>
                      LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria,
                      900102
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col gap-3 w-full max-w-84">
                  <p className="text-sm font-MontserratSemiBold">
                    Payment method
                  </p>
                  <p>Credit/Debit card</p>
                  <div className="flex justify-between">
                    <p>534780******7167</p>
                    <Image
                      src={VisaCard}
                      alt="visa card"
                      width={32}
                      height={18.35}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={ShildCheck}
                      alt="shild check"
                      width={20}
                      height={20}
                    />
                    <p>Secure payments</p>
                  </div>
                  <p>
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-c64">
                <div className=" max-w-74">
                  <div className="flex justify-between">
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
                          <div className="w-full justify-between pb-8 flex">
                            <div className="flex gap-4 items-start">
                              <Image
                                src={item.icon}
                                alt={item.title}
                                width={100}
                                height={100}
                              />
                              <div className="w-full max-w-143.75">
                                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                                  {item.title}
                                </p>

                                <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                    {item.totalQuantity}PC, {item.colour}
                                  </span>
                                </div>
                                <p className="font-MontserratSemiBold text-c18 pt-3 leading-6.5">
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
                <div className="w-full max-w-84.25">
                  <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                    Payment details
                  </p>
                  <div className="space-y-3 mt-3 mb-c32">
                    <p className="font-MontserratNormal text-sm text-000000">
                      Total
                    </p>
                    <p className="font-MontserratSemiBold text-c32 ">N30,000</p>
                  </div>
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <div className="flex justify-between">
                      <p>Total items</p>
                      <p>N50,000</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Discounts</p>
                      <p>-N25,000</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>N25,000</p>
                    </div>
                  </div>
                  <div className="font-MontserratNormal text-left text-sm mt-c24 text-000000 space-y-2">
                    <div className="flex justify-between">
                      <p>Shipping fee</p>
                      <p>N5,000</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Order total</p>
                      <p>N30,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </>
  );
}
