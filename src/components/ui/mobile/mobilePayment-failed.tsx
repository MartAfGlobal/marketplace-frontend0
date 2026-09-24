"use client";

import PaymentFailed from "@/components/ui/checkouts/failed";
import { Button } from "@/components/ui/Button/Button";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";

export default function MobilePaymentFailedPage() {
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
    <div className="w-full pt-11 px-6">
      <div>
        <PaymentFailed />
      </div>
      <div className="flex flex-col gap-2 w-full mt-c32 text-c12 font-MontserratSemiBold">
        <Button onClick={handleRepay} disabled={repaying} className="w-full">
          {repaying ? <LoadingSpinner /> : "Retry payment"}
        </Button>
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => router.push("/")}
            className="bg-transparent border border-ff715b text-ff715b flex-1"
          >
            Go home
          </Button>
          {isLoggedIn && orderId && (
            <Button
              variant="secondary"
              onClick={() => setCancelOrderOpen(true)}
              className="flex-1 text-red-500 hover:text-red-600"
            >
              Cancel order
            </Button>
          )}
        </div>
      </div>

      {orderDatas?.order?.items && orderDatas.order.items.length > 0 && (
        <div className="relative md:h-full">
          <div className="w-full mt-7 pb-4 md:pb-0">
            <div className="flex justify-between items-center mb-c24">
              <p className="text-c12 font-MontserratSemiBold">
                Orders list ({orderDatas.order.items.length})
              </p>
            </div>

            <div className="w-full h-fit max-h-90 overflow-y-auto pr-2">
              <div className="space-y-c24 w-full">
                {orderDatas.order.items.map((item) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full justify-between items-end pb-8 flex">
                      <div className="flex gap-4 w-full items-center">
                        <div className="flex gap-3 items-center w-full max-w-fit">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name || "Product"}
                            width={100}
                            height={100}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="w-full">
                          <p className="font-MontserratSemiBold text-c12 pb-1 text-000000">
                            {item.name}
                          </p>
                          {item.manufacturer && (
                            <p className="font-MontserratNormal text-c12 pb-2 text-161616/60">
                              {item.manufacturer}
                            </p>
                          )}
                          <div className="w-fit p-1.5 justify-center rounded-c12 bg-black/5 flex items-center">
                            <span className="text-black/60 font-MontserratSemiBold text-[10px]">
                              {item.quantity}PC
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-c14 pt-2 text-161616">
                            ₦{item.total_price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CancelOrderModal
        isDispute={false}
        isOpen={cancelOrderOpen}
        orderId={orderId}
        onClose={() => setCancelOrderOpen(false)}
      />
    </div>
  );
}
