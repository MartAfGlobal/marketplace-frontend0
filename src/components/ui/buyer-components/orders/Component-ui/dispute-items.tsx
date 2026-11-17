"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
import OrdersListView from "./shared/OrdersListView";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
interface OrdersProps {
  searchTerm: string;
}

export default function Disputes({ searchTerm }: OrdersProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const allDisputes = useSelector((state: RootState) => state.orders.disputes);
  const disputes = allDisputes;
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
      <OrdersListView
        hasOrders={disputes.length > 0}
        hasResults={filteredOrders.length > 0}
        emptyMessage="No item under Dispute"
        noResultsMessage="No matching dispute item found"
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
                            {item.status_display ||
                              item.status?.replace(/_/g, " ") ||
                              "Dispute submitted"}
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
                          <OrderLineItemSummary
                            image={item.product_image || "/placeholder.png"}
                            imageAlt={item.product_name || "Product Image"}
                            productName={item.product_name}
                            sellerName={item.seller_name}
                            details={item.variant_name || item.product_name}
                            price={`₦${item.requested_refund_amount}`}
                            className="flex gap-4 items-start w-full"
                            imageClassName="h-24 w-24"
                          />
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
      </OrdersListView>
      <CancelOrderModal
        isDispute={true}
        isOpen={openCancelModal}
        orderId={selectedOrderId}
        onClose={() => setOpenCancelModal(false)}
      />
    </div>
  );
}
