"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import Copy from "@/assets/icons/Copy.png";
import { useRouter } from "next/navigation";
import PaymentFailed from "./failed";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";

export default function PaymentFailedComponent() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const token = useSelector((state: RootState) => state.token.token);
  const isLoggedIn = Boolean(token);
  const [cancelOrderOpen, setCancelOrderOpen] = useState(false);

  const orderDatas = useSelector(
    (state: RootState) => state.orderSlice.SuccessOrderData
  );

  const orderId = String(
    (orderDatas?.order as any)?.id || orderDatas?.order?.order_id || ""
  );

  const { sendHttpRequest: repayReq, loading: repaying } = useHttp();

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleRepay = () => {
    if (!orderId) {
      router.push("/cart");
      return;
    }

    const rawTotal = orderDatas?.order?.total;
    const amountNum = Number(rawTotal) || 0;

    repayReq({
      requestConfig: {
        url: "/checkout/repay/",
        method: "POST",
        token: token || undefined,
        body: {
          payment_id: orderId,
          order_id: orderId,
          repay_order_id: orderId,
          expected_amount: amountNum > 0 ? amountNum.toFixed(2) : undefined,
        },
        isAuth: Boolean(token),
        userType: "buyer",
      },
      successRes: (res: any) => {
        const paymentUrl =
          res.data?.paystack_payment_url ||
          res.data?.payment_url ||
          res.data?.authorization_url ||
          res.data?.checkout_url ||
          res.data?.url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          router.push("/cart");
        }
      },
      errorRes: () => {
        router.push("/cart");
      },
    });
  };

  return (
    <div className="w-full">
      <div className="w-full px-15">
        <div className="pt-c32 pb-c64 w-full flex justify-center">
          <div className="w-205 p-8 rounded-2xl border border-000000/10">
            {/* Payment Failed Icon & Title */}
            <PaymentFailed />

            {/* Actions & Order details */}
            <div className="flex justify-between space-y-c32">
              <div className="w-full max-w-57">
                {orderId && (
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Order ID: {orderId}
                    </p>
                    <button onClick={handleCopy} aria-label="Copy order id">
                      <Image src={Copy} alt="copy" width={16} height={16} />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                )}
                <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                  <p>
                    Order date:{" "}
                    {orderDatas?.order?.created_at
                      ? new Date(
                          orderDatas.order.created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </p>
                  <p className="text-red-500 font-MontserratMedium">
                    Status: Payment Unsuccessful
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-84">
                <Button onClick={handleRepay} disabled={repaying}>
                  {repaying ? <LoadingSpinner /> : "Retry Payment"}
                </Button>
                {isLoggedIn && orderId && (
                  <Button
                    variant="secondary"
                    onClick={() => setCancelOrderOpen(true)}
                  >
                    Cancel order
                  </Button>
                )}
                <Button variant="secondary" onClick={() => router.push("/cart")}>
                  Return to Cart
                </Button>
              </div>
            </div>

            {/* Delivery address if available */}
            {orderDatas?.order?.shipping_info && (
              <div className="flex justify-between mt-6">
                <div className="w-full max-w-57">
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Address for delivery
                    </p>
                  </div>
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <p>{orderDatas.order.shipping_info.fullname}</p>
                    <p>{orderDatas.order.shipping_info.phone}</p>
                    <p>{orderDatas.order.shipping_info.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items & Payment Details if available */}
            {orderDatas?.order?.items && orderDatas.order.items.length > 0 && (
              <div className="flex justify-between mt-c64">
                <div className="max-w-74">
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
                      {orderDatas.order.items.map((item) => (
                        <motion.div
                          key={item.product_id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="w-full justify-between pb-8 flex">
                            <div className="flex gap-4 items-start">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={100}
                                height={100}
                              />
                              <div className="w-full max-w-143.75">
                                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                                  {item.name}
                                </p>

                                <div className="w-fit p-2 justify-center rounded-c12 bg-black/3 flex items-center">
                                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12 ">
                                    {item.quantity}PC, {item.name}
                                  </span>
                                </div>
                                <p className="font-MontserratSemiBold text-c18 pt-3 leading-6.5">
                                  ₦{item.total_price}
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
                    <p className="font-MontserratSemiBold text-c32 ">
                      {orderDatas.order.total}
                    </p>
                  </div>
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <div className="flex justify-between">
                      <p>Total items</p>
                      <p>{orderDatas.order.items.length}</p>
                    </div>
                    {orderDatas.order.subtotal !== undefined && (
                      <>
                        <div className="flex justify-between">
                          <p>Discounts</p>
                          <p>-N{orderDatas.order.subtotal}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Subtotal</p>
                          <p>N{orderDatas.order.subtotal}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="font-MontserratNormal text-left text-sm mt-c24 text-000000 space-y-2">
                    {orderDatas.order.shipping !== undefined && (
                      <div className="flex justify-between">
                        <p>Shipping fee</p>
                        <p>{orderDatas.order.shipping}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p>Order total</p>
                      <p>{orderDatas.order.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CancelOrderModal
        isDispute={false}
        isOpen={cancelOrderOpen}
        orderId={orderId}
        onClose={() => setCancelOrderOpen(false)}
      />
    </div>
  );
}
