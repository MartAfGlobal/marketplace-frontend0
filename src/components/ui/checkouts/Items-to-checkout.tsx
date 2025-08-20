"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button/Button";
import VisaCard from "@/assets/icons/visa_inc_logo.svg.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import { TrackOrders } from "@/types/global";
import padlock from "@/assets/icons/padlock.png";
import UserAddress from "@/components/ui/buyer-components/Main-section/sections/address-selector";
import UserCard from "@/components/ui/buyer-components/Main-section/sections/user-cards";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import MobileCards from "../mobile/mobile-payment-cards";
import { Input } from "../forms/Input";

export default function CheckoutItems() {
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

  const TotalItems = trackOrders.length;

  return (
    <div className="md:pt-c48  w-full md:pb-c64 ">
      <div className=" ">
        <div className="flex gap-18 justify-center ">
          <div className=" w-full pb-c32 flex md:flex-col md:max-w-207">
            <div className=" border-b hidden w-full md:flex border-b-000000/5  mb-c32">
              <div className="w-full">
                <div className="pb-c32 justify-between w-full flex ">
                  <p className="font-MontserratSemiBold text-c16 ">
                    Items details
                  </p>
                  <button className="font-MontserratSemiBold text-sm text-ff715b">
                    View all
                  </button>
                </div>
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
                  className=" w-full h-fit flex md:flex-row flex-col gap-c24"
                >
                  {trackOrders.map((items) => (
                    <div key={items.id} className="w-fit h-fit">
                      <Image
                        src={items.icon}
                        alt={items.title}
                        width={96}
                        height={96}
                      />
                      <p className="text-c12 font-MontserratSemiBold pt-4 text-161616">
                        ₦{items.totalAmount}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
            <div className="w-full ">
              <div className="pb-c32 border-b border-b-000000/5">
                <UserAddress className="md:w-64.25 h-31 " />
              </div>
              <div className="md:hidden">
                <MobileCards />
              </div>
              <div className="pb-c32 border-b border-b-000000/5 mt-c32 hidden md:flex">
                <UserCard className="w-64.25 h-36.75" />
              </div>
            </div>
          </div>
          <div className="w-full max-w-84.25 hidden md:flex md:flex-col">
            <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
              Order Summary
            </p>
            <div className="flex gap-2 pb-3">
              <Input  placeholder="Enter coupon code w-full"/>
              <button className="w-full max-w-31.25 bg-transparent border border-ff715b text-c12 h-12 rounded-c8 font-MontserratSemiBold text-ff715b">Apply coupon</button>
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

            <div className=" mt-3 mb-c32 flex gap-c42 items-center">
              <div>
                <p className="font-MontserratNormal text-sm text-000000">
                  Total
                </p>
                <p className="text-c10">
                  Please refer to your final actual payment amount.
                </p>
              </div>
              <p className="font-MontserratSemiBold text-c32 ">N30,000</p>
            </div>
            <Button>Checkout ({TotalItems})</Button>
            <div className="  w-full space-y-6 mt-c32 max-w-84">
              <div className="space-y-3">
                <p className="text-sm font-MontserratSemiBold">
                  Payment method
                </p>
                <p>Credit/Debit card</p>
                <div className="flex justify-between">
                  <p className="text-c12">534780******7167</p>
                  <Image
                    src={VisaCard}
                    alt="visa card"
                    width={32}
                    height={18.35}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
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
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={padlock}
                    alt="shild check"
                    width={20}
                    height={20}
                  />
                  <p>Secure privacy</p>
                </div>
                <p>
                  Protecting your privacy is important to us! Please be assured
                  that your information will be kept secured and uncompromised.
                  We will only use your information in accordance with our
                  privacy policy to provide and improve our services to you.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between"></div>
      </div>
    </div>
  );
}
