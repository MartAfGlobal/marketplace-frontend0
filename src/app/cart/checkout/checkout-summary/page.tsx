"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBack from "@/assets/icons/navBacksmall.png";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/Button/Button";

import { updateQuantity } from "@/store/cart/cartSlice";
import { dummyProducts } from "@/store/data/products";
import QuantitySelector from "@/components/ui/cart/quantityControl";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Input } from "@/components/ui/forms/Input";

import Master from "@/assets/mobile/cards/master.png";
import CaretDwn from "@/assets/mobile/carent-down.png";
import CareteRight from "@/assets/mobile/cards/CaretRight.png";

export default function CheckoutSummary() {
  const router = useRouter();

  const [selected, setSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => selectedItems[item.id]);

  const toggleSelectAll = () => {
    if (allSelected) {
      // unselect all
      const newState: { [key: string]: boolean } = {};
      setSelectedItems(newState);
    } else {
      // select all
      const newState: { [key: string]: boolean } = {};
      cartItems.forEach((item) => {
        newState[item.id] = true;
      });
      setSelectedItems(newState);
    }
  };
  const fashionProducts = dummyProducts.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price.replace(/[, ]/g, "")); // removes commas & spaces
    const quantity = item.quantity ?? 1; // default to 1 if undefined
    return acc + (isNaN(price) ? 0 : price) * quantity;
  }, 0);

  console.log(totalPrice);

  const showMore = () => setVisible((prev) => prev + 10);

  return (
    <div className="px-6">
      <div className="pb-7">
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
            Checkout Summary
          </p>
        </button>
      </div>
      <div>
        <div className="font-MontserratSemiBold text-c12 flex justify-between w-full mb-6">
          <p>Shipping address</p>
          <button
            onClick={() =>
              router.push("/card/mobile/payment-cards/add-new-card")
            }
            className="text-ca0202"
          >
            Change address
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="w-full p-4  h-31 rounded-2xl  bg-000000/7  circle-shadow flex-shrink-0  shadow-sm cursor-pointer transition-colors flex  items-center"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-MontserratSemiBold text-c12">
                Chisom Ebube Chris
              </p>
              <p className="text-c12 font-MontserratNormal">+2347034562314</p>
              <p className="text-c12 font-MontserratNormal">
                LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mt-7 ">
        <div className="font-MontserratSemiBold text-c12 flex justify-between w-full mb-6">
          <p>Payment method</p>
          <button
            onClick={() => router.push("/card/mobile/addresses/add-address")}
            className="text-ca0202"
          >
            Change method
          </button>
        </div>
        <div className=" pb-7">
          <div className="flex items-center  justify-between ">
            <Image
              src={Master}
              alt="card logo"
              width={24}
              height={14.81}
              className="object-contain"
            />

            <span className="text-c12 font-MontserratSemiBold text-000000 flex-1 ml-3">
              272080******7167
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="relative md: md:h-full ">
          {/* Cart Content */}
          <div className="w-full  pb-4 md:pb-0">
            <div className="flex justify-between items-center mb-c24">
              <p className="text-c12 font-MontserratSemiBold ">
                Orders list ({cartItems.length})
              </p>
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
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="w-full justify-between  items-end  pb-8 flex">
                            <div className="flex gap-4 w-full j items-center md:items-start">
                              <div className="flex gap-3  items-center w-full max-w-fit">
                                <Image
                                  src={item.image[0]}
                                  alt={item.slug}
                                  width={100}
                                  height={100}
                                  className="w-16 h-16 md:w-25 md:h-25"
                                />
                              </div>
                              <div className="w-full md:max-w-143.75">
                                <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                                  {item.title}
                                </p>
                                <p className="font-MontserratNormal text-c12 pb-3">
                                  Two piece shop
                                </p>
                                <div className="w-24.5 h-c32 justify-center rounded-c12 bg-black/3 flex items-center">
                                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                    {item.quantity}PC, {item.colour}
                                  </span>
                                </div>
                                <p className="font-MontserratSemiBold text-base md:text-c18 pt-3 leading-6.5">
                                  ₦{item.price}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-end">
                              <QuantitySelector
                                productId={item.id}
                                quantity={item.quantity} // <-- get quantity directly from Redux
                                onChange={(newQty, id) =>
                                  dispatch(
                                    updateQuantity({ id, quantity: newQty })
                                  )
                                }
                                increaseBg="bg-black/20"
                                decreaseBorder="border-black/20"
                                decreaseText="text-black/20"
                                buttonHeight="h-6"
                                buttonWidth="w-6"
                                quantityFont="text-sm"
                              />
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
                            <motion.div
                              animate={{ rotate: openModal ? 180 : 0 }}
                            >
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
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 300, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className=" pt-3 pb-120"
          >
            <div className="">
              <p className="text-base font-MontserratSemiBold">Summary</p>

              <div className="space-y-2 pt-4">
                <Input placeholder="Enter coupon code" />
                <button className="text-c12 font-MontserratSemiBold text-ff715b border border-ff715b w-full h-10 rounded-c8 flex justify-center items-center">
                  Apply coupon
                </button>
              </div>
              <div className="w-full flex justify-between items-center pt-3 pb-4">
                <p className="text-c12 font-MontserratSemiBold">More coupons</p>
                <Image
                  src={CareteRight}
                  alt="see more "
                  width={16}
                  height={16}
                />
              </div>
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
                <p className=" text-ca0202">-₦50</p>
              </div>
              <div className="flex justify-between">
                <p className="">Shipping fee:</p>
                <p className="">Free</p>
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
                <p className="text-base font-MontserratSemiBold mb-3">Total</p>
                <p className="font-MontserratSemiBold text-c20">
                  ₦{totalPrice}
                </p>
                <p className="text-c12 font-MontserratNormal text-ca0202 line-through">
                  ₦1250.00
                </p>
              </div>
              <button
                className="w-full transition-transform"
                onClick={() => setOpenModal((prev) => !prev)}
              >
                <motion.div animate={{ rotate: openModal ? 180 : 0 }}>
                  <Image src={CaretDwn} alt="view" width={16} height={16} />
                </motion.div>
              </button>
            </div>

            <Button
              onClick={() => router.push("/dashboard/buyer/mobile/payment-successful")}
              className="border-0"
            >
              Confirm order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
