"use client";

import PaymentSuccess from "@/components/ui/checkouts/success";
import { Button } from "@/components/ui/Button/Button";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function MobilePaymentSuccessfulPage() {
  const router = useRouter();

  const orderDatas = useSelector(
    (state: RootState) => state.orderSlice.SuccessOrderData
  );

  return (
    <div className="w-full pt-11 px-6 ">
      <div>
        <PaymentSuccess />
      </div>
      <div className="flex gap-1 w-full mt-c32 text-c12 font-MontserratSemiBold">
        <Button
          onClick={() => router.push("/")}
          className="bg-transparent border border-ff715b text-ff715b"
        >
          Go home
        </Button>
        <Button>Check my order</Button>
      </div>
      <div className="relative md: md:h-full ">
        {/* Cart Content */}
        <div className="w-full  mt-7 pb-4 md:pb-0">
          <div className="flex justify-between items-center mb-c24">
            <p className="text-c12 font-MontserratSemiBold ">
              Orders list ({orderDatas?.order.items.length})
            </p>
          </div>

          <div className=" w-full h-fit max-h-90 overflow-y-auto  pr-2">
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
                    {orderDatas?.order.items.map((item) => (
                      <motion.div
                        key={item.product_id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="w-full justify-between  items-end  pb-8 flex ">
                          <div className="flex gap-4 w-full  items-center md:items-start">
                            <div className="flex gap-3  items-center w-full max-w-fit">
                              <Image
                                src={item.image || "profile image"}
                                alt={item.name || "name"}
                                width={100}
                                height={100}
                                className="w-16 h-16 md:w-25 md:h-25"
                              />
                            </div>
                            <div className="w-full md:max-w-143.75">
                              <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                                {item.name}
                              </p>
                              <p className="font-MontserratNormal text-c12 pb-3">
                                {item.manufacturer}
                              </p>
                              <div className="w-fit p-2 justify-center rounded-c12 bg-black/3 flex items-center">
                                <span className="text-black opacity-32 font-MontserratSemiBold text-c12 leading-16">
                                  {item.quantity}PC, {item.name}
                                </span>
                              </div>
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
        </div>
      </div>
    </div>
  );
}
