"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { removeCheckedOutItems } from "@/store/cart/cartSlice";
import { setOrderData } from "@/store/orders/payment-success-slice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function OrderPaymentCallbackContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const hasTriggeredRef = useRef(false);

  const reference =
    searchParams.get("reference") ||
    searchParams.get("ref") ||
    searchParams.get("trxref");

  const { sendHttpRequest: getOrderRequest } = useHttp();

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    if (!reference) {
      router.replace("/order/payment-callback/failed");
      return;
    }

    getOrderRequest({
      requestConfig: {
        url: `/orders/payment-details/?ref=${encodeURIComponent(reference)}`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        const data = res?.data ?? res;
        const order = data?.order;

        const rawStatus = (
          order?.payment_status ||
          data?.payment_status ||
          data?.status ||
          ""
        ).toLowerCase();

        const isExplicitlyFailed =
          rawStatus === "failed" ||
          rawStatus === "failure" ||
          rawStatus === "cancelled" ||
          rawStatus === "canceled" ||
          rawStatus === "declined" ||
          rawStatus === "abandoned";

        const isSuccess =
          !isExplicitlyFailed &&
          (rawStatus === "paid" ||
            rawStatus === "success" ||
            rawStatus === "successful" ||
            rawStatus === "completed" ||
            Boolean(order));

        if (data) {
          dispatch(setOrderData(data));
        }

        if (isSuccess) {
          dispatch(removeCheckedOutItems());
          router.replace(
            `/order/payment-callback/success?reference=${encodeURIComponent(reference)}`
          );
        } else {
          router.replace(
            `/order/payment-callback/failed?reference=${encodeURIComponent(reference)}`
          );
        }
      },
      errorRes: () => {
        router.replace(
          `/order/payment-callback/failed?reference=${encodeURIComponent(reference)}`
        );
      },
    });
  }, [reference, router, dispatch, getOrderRequest]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center max-w-sm text-center p-8 bg-white rounded-2xl border border-efefef shadow-sm">
        <LoadingSpinner color="border-ff715b" />
        <h2 className="text-c18 font-MontserratSemiBold text-161616 mt-6 mb-2">
          Verifying payment...
        </h2>
        <p className="text-c12 font-MontserratNormal text-161616/60">
          Please wait a moment while we confirm your transaction with the payment gateway.
        </p>
      </div>
    </div>
  );
}

export default function OrderPaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner color="border-ff715b" />
        </div>
      }
    >
      <OrderPaymentCallbackContent />
    </Suspense>
  );
}
