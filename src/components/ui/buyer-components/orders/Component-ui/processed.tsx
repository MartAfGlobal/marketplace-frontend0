"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Copy from "@/assets/icons/Copy.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { useRouter } from "next/navigation";
interface OrdersProps {
  searchTerm: string;
}

export default function ProccessedDetais({ searchTerm }: OrdersProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const { orders, loading } = useSelector((state: any) => state.orders);

  const delivered = orders.filter(
    (order: OrderItem) =>
      order.status === "DELIVERED" || order.status === "CANCELLED",
  );
  const filteredOrders = delivered.filter((order: OrderItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = order.order_no?.toLowerCase().includes(term);

    const matchesStore = order.manufacturer?.toLowerCase().includes(term);

    const matchesProduct = order.order_items?.some((item) =>
      item.product_name?.toLowerCase().includes(term),
    );

    return matchesOrderId || matchesStore || matchesProduct;
  });

  const handleReview = (id: string) => {
    router.push(`/dashboard/buyer/orders/leave-review/${id}`);
  };
  const handleCopy = (orderId: string) => {
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
    <div className="space-y-c24 w-ful l px-6">
      <div className="w-full">
        <div className="w-full space-y-c24 mt-c32">
          <AnimatePresence mode="wait">
            {delivered.length === 0 ? (
              <motion.div
                key="empty-orders"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="text-center text-000000/60 font-MontserratMedium text-c18">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>
              </motion.div>
            ) : filteredOrders.length === 0 ? (
              <motion.div
                key="no-search-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center h-60"
              >
                <p className="text-c16 font-MontserratMedium text-000000/60">
                  No matching orders found
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="orders-list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-c24"
              >
                {filteredOrders.map((item: OrderItem) => {
                  const isSingleItemOrder = item.order_items?.length === 1;
                  const MobileActions = (
                    <div className="w-full gap-4 text-c10 flex flex-row-reverse md:hidden mt-4 space-y-4">
                      <Button className="">Add to cart</Button>
                    { item.status === "DELIVERED" && <Button
                        onClick={() => handleReview(item.id)}
                        variant="secondary"
                        className=""
                      >
                        Leave a review
                      </Button>}
                    </div>
                  );
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full flex items-center md:gap-0 justify-between mb-3 md:mb-c32">
                        <div>
                          {item.status ==="DELIVERED"? <p className="text-sm font-MontserratSemiBold leading-c20 text-2d7565">
                            Delivered
                          </p> : item.status === "CANCELLED" ? <p className="text-sm font-MontserratSemiBold leading-c20 text-ca0202">
                            Cancelled
                          </p>: <p className="text-sm font-MontserratSemiBold leading-c20 text-2d7565">
                            {item.status}
                          </p> }
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12  font-MontserratNormal">
                              Order ID: {item.order_no}
                            </p>
                            <button
                              onClick={() => handleCopy(item.order_no || "")}
                            >
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
                          {item.estimated_delivery_date}
                        </p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <>
                          <Link
                            href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                            className="flex flex-col md:flex-row gap-4 items-start"
                          >
                            {item.order_items?.map((prod) => (
                              <div
                                key={prod.id}
                                className="flex gap-4 items-start  w-full"
                              >
                                <Image
                                  src={prod?.product_image}
                                  alt={prod.product_name || "Product Image"}
                                  width={96}
                                  height={96}
                                  className="h-24 w-24 "
                                />
                                <div className="w-full">
                                  <p className="font-MontserratSemiBold text-base mb-1">
                                    {prod.product_name}
                                  </p>
                                  <p className=" text-c12 font-MontserratMedium mb-3">
                                    {item.manufacturer}
                                  </p>
                                  <p className="rounded-c12 bg-000000/10 text-000000/60 p-2  w-fit font-MontserratSemiBold text-c12 flex items-center ">
                                    {prod.quantity}Pc,
                                    {prod.variation_name || prod.product_name}
                                  </p>
                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦{item.total_price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </Link>
                          {MobileActions}
                          </>
                        ) : (
                          <>
                          <Link
                            href={`/dashboard/buyer/orders/${item.id}?mode=${item.status.toLowerCase()}`}
                            className="flex gap-4 w-full"
                          >
                            <div className="hidden sm:flex gap-4">
                              <div
                                className={`grid gap-4 ${
                                  item.order_items.length === 1
                                    ? "grid-cols-1"
                                    : item.order_items.length === 2
                                      ? "grid-cols-2"
                                      : "grid-cols-3"
                                }`}
                              >
                                {item.order_items?.slice(0, 3).map((prod) => (
                                  <div
                                    key={prod.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="w-24 h-24 relative">
                                      <Image
                                        src={
                                          prod.product_image ||
                                          "/placeholder.png"
                                        }
                                        alt={
                                          prod.product_name || "Product Image"
                                        }
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 object-cover"
                                      />
                                      <p className="absolute bottom-2 text-c12 font-MontserratNormal flex items-center justify-center left-4 translate-x-1/2 text-center bg-000000 rounded-c12 text-ffffff  w-7.5 h-6">
                                        x{prod.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div>
                                <p className="font-MontserratSemiBold text-base mb-2 flex flex-wrap gap-1">
                                  {item.order_items
                                    ?.slice(0, 3)
                                    .map((prod, index) => (
                                      <span
                                        key={prod.id}
                                        className="flex items-center"
                                      >
                                        <span
                                          className="max-w-[110px] truncate inline-block align-middle"
                                          title={prod.product_name}
                                        >
                                          {prod.product_name}
                                        </span>
                                        {index <
                                          Math.min(item.order_items.length, 3) -
                                            1 && <span>,&nbsp;</span>}
                                      </span>
                                    ))}
                                  {item.order_items.length > 3 && (
                                    <span>...</span>
                                  )}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-3">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.order_items?.reduce(
                                    (sum, i) => sum + (i.quantity || 0),
                                    0,
                                  )}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-3">
                                  ₦{item.total_price}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:hidden w-full items-start gap-4">
                              {item.order_items?.[0] && (
                                <Image
                                  src={
                                    item.order_items[0].product_image ||
                                    "/placeholder.png"
                                  }
                                  alt={
                                    item.order_items[0].product_name ||
                                    "Product Image"
                                  }
                                  width={96}
                                  height={96}
                                  className="w-24 h-24"
                                />
                              )}

                              <div className="w-full ">
                                <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                  {item.order_items?.[0]?.product_name}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-2">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.order_items?.length}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-2">
                                  ₦{item.total_price}
                                </p>
                              </div>
                            </div>
                          </Link>
                          {MobileActions}
                          </>
                        )}

                        <div className="w-full  pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          <Button className="">Add to cart</Button>
                         { item.status === "DELIVERED" && <Button
                            onClick={() => handleReview(item.id)}
                            variant="secondary"
                            className=""
                          >
                            Leave a review
                          </Button>}
                          {/* <Button className="border-0" variant="secondary">
                            Remove
                          </Button> */}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
