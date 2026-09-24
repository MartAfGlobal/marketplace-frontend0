"use client";

import { useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import PaymentFailedComponent from "@/components/ui/checkouts/Payment-failed";
import MobilePaymentFailedPage from "@/components/ui/mobile/mobilePayment-failed";
import { setOrderData } from "@/store/orders/payment-success-slice";
import { useHttp } from "@/hooks/use-http";

function OrderPaymentFailedContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ||
    searchParams.get("ref") ||
    searchParams.get("trxref");

  const orderDatas = useSelector(
    (state: RootState) => state.orderSlice.SuccessOrderData
  );

  const { sendHttpRequest: getOrderRequest } = useHttp();

  // If order details are missing and reference exists, attempt to fetch order info
  useEffect(() => {
    if (!orderDatas && reference) {
      getOrderRequest({
        requestConfig: {
          url: `/orders/payment-details/?ref=${encodeURIComponent(reference)}`,
          method: "GET",
          userType: "buyer",
        },
        successRes: (res: any) => {
          if (res?.data) {
            dispatch(setOrderData(res.data));
          }
        },
      });
    }
  }, [orderDatas, reference, dispatch, getOrderRequest]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:pl-c56 hidden md:pt-c20 z-40 md:flex items-center w-full"
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-6 px-6 md:px-0 md:h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link href="/cart" className="opacity-30 font-MontserratMedium text-c12">
            Checkout
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratMedium text-c12 text-red-500">Payment Failed</span>
        </nav>
      </motion.div>

      <div className="w-full px-0 md:px-15">
        <Link
          href="/cart"
          className="hidden md:flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Checkout
          </p>
        </Link>

        <div className="md:hidden w-full">
          <MobilePaymentFailedPage />
        </div>
        <div className="hidden w-full md:flex">
          <PaymentFailedComponent />
        </div>

        <div className="px-4.75 md:px-0 w-full">
          <div className="py-c32 w-full">
            <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
              More to love
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrderPaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center" />
      }
    >
      <OrderPaymentFailedContent />
    </Suspense>
  );
}
