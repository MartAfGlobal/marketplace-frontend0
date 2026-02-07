"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { BuyerDispute, OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Copy from "@/assets/icons/Copy.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";
interface OrdersProps {
  searchTerm: string;
}

export default function Disputes({ searchTerm }: OrdersProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const allDisputes = useSelector((state: RootState) => state.orders.disputes);
  const disputes = allDisputes.filter((item) => item.status === "REQUESTED");
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = disputes.filter((order: BuyerDispute) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = order.order_number?.toLowerCase().includes(term);

    const matchesStore = order.seller_name?.toLowerCase().includes(term);

    const matchesProduct = order.product_name.toLowerCase().includes(term);

    return matchesOrderId || matchesStore || matchesProduct;
  });

  const viewDisputeDetails = (disputeid: string) => {
    router.push(`/dashboard/buyer/orders/dispute-details/${disputeid}`);
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
            {disputes.length === 0 ? (
              <motion.div
                key="empty-orders"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="text-center text-000000/60 font-MontserratMedium text-c18">
                  No item under Dispute
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
                  No matching dispute item found
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
                {filteredOrders.map((item: BuyerDispute) => {
                  const MobileActions = (
                    <div className="w-full gap-4 text-c10 flex flex-row-reverse md:hidden mt-4 space-y-4">
                      
                      <Button onClick={() => viewDisputeDetails(item.id)}>
                        Dispute details
                      </Button>
                      <Button variant="secondary">Cancel dispute</Button>
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
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-161616">
                            Awaiting feedback
                          </p>
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12  font-MontserratNormal">
                              Order ID: {item.order_number}
                            </p>
                            <button
                              onClick={() =>
                                handleCopy(item.order_number || "")
                              }
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
                        <p className="text-c12 font-MontserratNormal leading-4 text-000000"></p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        <Link
                          href={`orders/dispute-details/${item.id}`}
                          className="flex flex-col md:flex-row gap-4 items-start  "
                        >
                          {disputes.map((prod) => (
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
                                  {item.seller_name}
                                </p>
                                <p className="rounded-c12 bg-000000/10 text-000000/60 p-2  w-fit font-MontserratSemiBold text-c12 flex items-center ">
                                  {/* {prod.}Pc, */}
                                  {prod.variant_name || prod.product_name}
                                </p>
                                <p className="font-MontserratSemiBold text-c16 pt-3">
                                  ₦{item.requested_refund_amount}
                                </p>
                              </div>
                            </div>
                          ))}
                        </Link>
                        {MobileActions}
                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          <Button onClick={() => viewDisputeDetails(item.id)}>
                            Dispute details
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedOrderId(item.id);
                              setOpenCancelModal(true);
                            }}
                            variant="secondary"
                          >
                            Cancel dispute
                          </Button>
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
      <CancelOrderModal
        isDispute={true}
        isOpen={openCancelModal}
        orderId={selectedOrderId}
        onClose={() => setOpenCancelModal(false)}
      />
    </div>
  );
}
