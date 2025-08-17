"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";

import { dummyProducts } from "@/store/data/products";
import ProductCard from "@/components/ui/cards/ProductCard";
import NavBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";
import VisaCard from "@/assets/icons/visa_inc_logo.svg.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";

import Trash from "@/assets/icons/trash.png";
import padlock from "@/assets/icons/padlock.png";

import QuantitySelector from "@/components/ui/cart/quantityControl";
import Filter from "@/assets/icons/filter.png"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart } from "@/store/cart/cartSlice";

export default function CartPage() {
  const [visible, setVisible] = useState(10);

  const [open, setOpen] = useState(false);
  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const showMore = () => setVisible((prev) => prev + 10);
    const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

 

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 pt-c20 z-40 flex items-center w-full"
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
          <span
           
            className=" font-MontserratMedium text-c12"
          >
            Cart
          </span>
        </nav>
      </motion.div>
      <div className="w-full px-15">
        <div className="flex items-center gap-4 mt-c32">
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">Cart</p>
        </div>

        <div className="pt-c48 pb-c64 ">
          <div className="">
            <div className="flex gap-18 justify-center ">
              <div className=" w-full max-w-207 ">
                <div className="w-full h-c56 mb-c32 flex px-6 justify-between items-center bg-947fff/10">
                 
                    <div className="flex items-center gap-4 ">
                      <input
                        type="checkbox"
                        className="h-5 w-5 border border-black rounded accent-black checked:bg-black checked:text-white"
                      />
                      <span className="text-c12 font-MontserratSemiBold" >Select</span>
                    </div>
                    <Image src={Filter} alt="filter" width={24} height={24}/>
                  
                </div>
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
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                        className="w-full "
                      >
                        <div className="w-full justify-between pb-8 flex">
                          <div className="flex gap-4 items-start">
                            <Image
                              src={item.image[0]}
                              alt={item.slug}
                              width={100}
                              height={100}
                            />
                            <div className="w-full max-w-143.75">
                              <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                                {item.title}
                              </p>

                              <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                                <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                  {item.quantity}PC, {item.colour}
                                </span>
                              </div>
                              <p className="font-MontserratSemiBold text-c18 pt-3 leading-6.5">
                                ₦{item.price}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <button  onClick={() => dispatch(removeFromCart(item.id))}>
                              <Image
                                src={Trash}
                                alt="delete"
                                width={15}
                                height={16.25}
                              />
                            </button>
                            <QuantitySelector  productId={item.id}/>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              <div className="w-full max-w-84.25">
                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                  Order Summary
                </p>

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
                <Button>Checkout ({cartItems.length})</Button>
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
                      Every payment you make on MartAf is secured with strict
                      SSL encryption and PCI DSS data protection protocols
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
                      Protecting your privacy is important to us! Please be
                      assured that your information will be kept secured and
                      uncompromised. We will only use your information in
                      accordance with our privacy policy to provide and improve
                      our services to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              {/* <div className="w-full max-w-57">
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
              </div> */}
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
  );
}
