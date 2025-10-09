"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button/Button";

import ShildCheck from "@/assets/icons/ShieldCheck.png";
import { TrackOrders } from "@/types/global";
import padlock from "@/assets/icons/padlock.png";
import UserAddress from "@/components/ui/buyer-components/Main-section/sections/address-selector";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import MobileCards from "../mobile/mobile-payment-cards";
import { Input } from "../forms/Input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectCheckoutTotal } from "@/store/cart/cartSelectors";

export default function CheckoutItems() {
  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems
  );
 

  const TotalItems = checkoutItems.length;
  const totalPrice = useSelector(selectCheckoutTotal);
  const discount = 0
  const shippingFee = 0

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
                  {checkoutItems.map((item) => {
                    const subtotal =
                      (Number(item.price) || 0) * (Number(item.quantity) || 1);
                    const imageSrc =
                      item.image && item.image[0]
                        ? item.image[0]
                        : "/images/placeholder.png";

                    return (
                      <div key={item.id} className="w-fit h-fit">
                        <Image
                          src={imageSrc}
                          alt={item.name || "Product image"}
                          width={96}
                          height={96}
                        />
                        <p className="text-c12 font-MontserratSemiBold pt-4 text-161616">
                          ₦{subtotal.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
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
             
            </div>
          </div>
          <div className="w-full max-w-84.25 hidden md:flex md:flex-col">
            <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
              Order Summary
            </p>
            <div className="flex gap-2 pb-3">
              <Input placeholder="Enter coupon code w-full" />
              <button className="w-full max-w-31.25 bg-transparent border border-ff715b text-c12 h-12 rounded-c8 font-MontserratSemiBold text-ff715b">
                Apply coupon
              </button>
            </div>
            <div className="font-MontserratNormal text-sm text-000000 h-23 border-b border-b-000000/10 space-y-2">
              <div className="flex justify-between">
                <p>Total items</p>
                <p>N{totalPrice}</p>
              </div>
              <div className="flex justify-between">
                <p>Discounts</p>
                <p>-N{discount}</p>
              </div>
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{totalPrice - discount}</p>
              </div>
            </div>
            <div className="flex justify-between h-9 border-b border-b-000000/10 mt-3">
              <p>Shipping fee</p>
              <p>{shippingFee}</p>
            </div>
            <div className="flex justify-between h-9 border-b border-b-000000/10 mt-3">
              <p>Order total</p>
              <p>{totalPrice + shippingFee}</p>
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
              <p className="font-MontserratSemiBold text-c32 ">N{totalPrice + shippingFee}</p>
            </div>
            <Button>Checkout ({TotalItems})</Button>
            <div className="  w-full space-y-6 mt-c32 max-w-84">
             
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={ShildCheck}
                    alt="shild check"
                    width={20}
                    height={20}
                  />
                  <p className="text-c12 font-MontserratSemiBold">
                    Secure payments
                  </p>
                </div>
                <p className="text-c12 font-MontserratNormal leading-4 ">
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
                  <p className="text-c12 font-MontserratSemiBold">
                    Secure privacy
                  </p>
                </div>
                <p className="text-c12 font-MontserratNormal leading-4 ">
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
