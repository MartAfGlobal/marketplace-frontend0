"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";


import NavBack from "@/assets/icons/navBacksmall.png";


import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";

import PaymentSuccessful from "@/components/ui/checkouts/Payment-successful";


import { useHttp } from "@/hooks/use-http";
import MobilePaymentSuccessfulPage from "@/components/ui/mobile/mobilePayment-success";
import { removeCheckedOutItems } from "@/store/cart/cartSlice";
import { setOrderData } from "@/store/orders/payment-success-slice";

export default function CartPage() {
  // const [visible, setVisible] = useState(10);
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  
    const {sendHttpRequest: getOrderRequest } = useHttp();
    const orderDatas = useSelector((state: RootState) => state.orderSlice.SuccessOrderData);

  useEffect(() => {
    dispatch(removeCheckedOutItems());
  }, [dispatch]);


useEffect(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const reference = queryParams.get("ref");

  if (reference) {
    // fetch(BASE_URL/)
    //   .then((res) => res.json())
    //   .then((data) => setOrderDetails(data.orders));

        getOrderRequest({
      requestConfig: {
        url: `/orders/payment-details/?ref=${reference}`,
        method: "GET",
       
        userType: "buyer",
        
      },
      successRes: (orderData) => {
        console.log("Order Datasss:", orderData.data.order);

        console.log("orderfffff", orderData)
       dispatch(setOrderData(orderData.data));

        
      }
    });
  }
}, []);

 console.log("orde", orderDatas)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start slightly down and transparent
      animate={{ opacity: 1, y: 0 }} // Animate to normal
      exit={{ opacity: 0, y: -20 }} // Optional exit animation
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      className="w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:pl-c56 hidden md:pt-c20 z-40 md:flex items-center w-full"
        style={{ top: "md:4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-6 px-6 md:px-0 md:h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className=" font-MontserratMedium text-c12">Checkout</span>
        </nav>
      </motion.div>

      <div className="w-full px-0 md:px-15">
        <Link
          href="/cart"
          className=" hidden md:flex items-center gap-4 mt-3 md:mt-c32"
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
          <MobilePaymentSuccessfulPage />
        </div>
        <div className="hidden w-full md:flex">
          <PaymentSuccessful />
        </div>

        <div className="px-4.75 md-px-0 w-full">
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
