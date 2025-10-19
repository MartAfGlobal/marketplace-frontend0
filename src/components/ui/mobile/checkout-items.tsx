"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { RootState } from "@/store";

import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import CaretDwn from "@/assets/mobile/carent-down.png";

import ProductCard from "@/components/ui/cards/ProductCard";
import { Button } from "@/components/ui/Button/Button";

import { useHttp } from "@/hooks/use-http";


export default function MobileCheckoutItems() {
  // const [selectedItems, setSelectedItems] = useState<{
  //   [key: string]: boolean;
  // }>({});
  const [visibleItems, setVisibleItems] = useState(2);

  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);

  const router = useRouter();
 

  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems
  );

  const checkoutSummary = useSelector(
    (state: RootState) => state.cart.checkoutSummary
  );

  const totalPrice = Number(checkoutSummary?.subtotal ?? 0);
  const discount = Number(checkoutSummary?.discount_amount ?? 0);
  const shippingFee = Number(checkoutSummary?.shipping_cost ?? 0);
  const TotalItems = checkoutItems.length;


 
  return (
    <div className="relative md: md:h-full">
      {/* Cart Content */}
      <div className="w-full  pb-4 md:pb-0">
        <div className="flex justify-between items-center mb-c24">
          <p className="text-c12 font-MontserratSemiBold ">
            Orders list ({checkoutItems.length})
          </p>
          {visibleItems < checkoutItems.length && (
            <button
              className="font-MontserratSemiBold text-sm text-ff715b mt-2"
              onClick={() => setVisibleItems((prev) => prev + 2)}
            >
              See More
            </button>
          )}
        </div>

        <div className="">
          <div className="md:flex gap-18 justify-center">
            {/* Cart Items */}
            <div className="">
              <div className="flex  w-full justify-between">
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
                  className="space-y-c24 w-full"
                >
                  {checkoutItems.slice(0, visibleItems).map((item, index) => (
                    <motion.div
                       key={`${item.id || item.product_id || "item"}-${
                        item.variation_display || index 
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full justify-between  items-end  pb-8 flex">
                        <div className="flex gap-4 w-full j items-center md:items-start">
                          <div className="flex gap-3  items-center w-full max-w-fit">
                            <Image
                              src={item.product_image || "/placeholder.png"}
                              alt={item.name || "Product image"}
                              width={96}
                              height={96}
                              className="rounded h-24 w-24"
                            />
                          </div>
                          <div className="w-full md:max-w-143.75">
                            <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                              {item.name}
                            </p>
                            <p className="font-MontserratNormal text-c12 pb-3">
                              Two piece shop
                            </p>
                            <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                              <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                {item.quantity}PC, {item.name}
                              </span>
                            </div>
                            <p className="font-MontserratSemiBold text-base md:text-c18 pt-3 leading-6.5">
                              ₦{item.subtotal}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-MontserratSemiBold text-c12">
                            Shipping: Free shipping
                          </p>
                          <span className="font-MontserratNormal text-c12">
                            Delivery estimate: May 26 - Jun 05
                          </span>
                        </div>
                        <motion.div animate={{ rotate: openModal ? 180 : 0 }}>
                          <Image
                            src={CaretDwn}
                            alt="view"
                            width={16.16}
                            height={9.06}
                            className="brightness-50"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden w-full md:flex">
          <div className=" w-full">
            <div className="py-c32 ">
              <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
                More to love
              </p>
              {/* <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {fashionProducts.slice(0, visible).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 300, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className=" pt-3 pb-80"
      >
        <div className="flex justify-between pb-4">
          <p className="text-base font-MontserratSemiBold">Summary</p>
        </div>
        {/* Price Details */}
        <div className=" space-y-2 text-sm font-MontserratNormal">
          <div className="flex justify-between">
            <p className="">Total items:</p>
            <p className="">${totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-MontserratSemiBold">Subtotal:</p>
            <p className="">${totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p className="">Discount:</p>
            <p className=" text-ca0202">{discount}</p>
          </div>
          <div className="flex justify-between">
            <p className="">Shipping fee: </p>
            <p className="">{shippingFee}</p>
          </div>
          <div className="flex justify-between text-base font-MontserratSemiBold">
            <p className="">Estimated total:</p>
            <p className="">₦{totalPrice}</p>
          </div>
        </div>
      </motion.div>

      <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <div>
            <p className="font-MontserratSemiBold text-c20">₦{TotalItems}</p>
          { discount > 0 && <p className="text-c12 font-MontserratNormal text-ca0202 line-through">
              ₦{totalPrice - discount}
            </p>}
          </div>
          {/* <button
            className="w-full transition-transform"
            onClick={() => setOpenModal((prev) => !prev)}
          >
            <motion.div animate={{ rotate: openModal ? 180 : 0 }}>
              <Image src={CaretDwn} alt="view" width={16} height={16} />
            </motion.div>
          </button> */}
        </div>

        <Button
          onClick={() => router.push("/cart/checkout/checkout-summary")}
          className="border-0"
        >
          Place order
        </Button>
      </div>
    </div>
  );
}
