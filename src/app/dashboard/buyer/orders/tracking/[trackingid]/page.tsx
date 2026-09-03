"use client";
import { use, useEffect } from "react"; // <-- Important
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button/Button";
import SpeedOf from "@/assets/icons/speedof.png";
import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import Copy from "@/assets/icons/Copy.png";
import { OrderItem, TrackOrders } from "@/types/global";
import { useState } from "react";

import ProductCard from "@/components/ui/cards/ProductCard";
import Pointer from "@/assets/icons/pointer.svg";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { setTrackingData } from "@/store/orders/tracking-slice";
import Cookies from "js-cookie";
import OrderItemSummary from "@/components/ui/buyer-components/orders/order-item-summary";


export default function TrackingDetail() {
  const [copied, setCopied] = useState(false);
  const [copiedtrackno, setCopiedtrackno] = useState(false);
  const [visible, setVisible] = useState(10);
  const showMore = () => setVisible((prev) => prev + 10);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { trackingid } = useParams();
  const [isMobile, setIsMobile] = useState(false);

  const { orders, loading } = useSelector((state: any) => state.orders);

  const OrderDetails = orders?.find((item: any) => item.id === trackingid);

  const oderItems = OrderDetails?.items || OrderDetails?.order_items || [];

  console.log("checking order items", oderItems);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);

  const { sendHttpRequest } = useHttp(); // ✅ hook instance
  // const token = useSelector((state: any) => state.token?.token);

  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // adjust breakpoint as needed
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${id}`); // redirect on mobile
    } else {
      setOpen(true); // open modal on desktop
    }
  };

  useEffect(() => {
    if (!token || !trackingid) return;

    sendHttpRequest({
      requestConfig: {
        url: `/orders/${trackingid}/track/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);
        const TrackingDetail = res.data ?? res;
        dispatch(setTrackingData(TrackingDetail));
      },
      errorRes: () => {
        // Fallback to /orders/${trackingid}/
        sendHttpRequest({
          requestConfig: {
            url: `/orders/${trackingid}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "buyer",
          },
          successRes: (res) => {
            const TrackingDetail = res.data ?? res;
            dispatch(setTrackingData(TrackingDetail));
          },
        });
      },
    });
  }, [token, trackingid, dispatch]);

  const trackingData = useSelector((state: any) => state.tracking.trackingData);
  console.log("lets see redux store:", trackingData);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const selectedAddress = buyerAddresses?.find(
    (item: any) => item.id === trackingData?.shipping_address
  );
   
const isoDate = trackingData?.paid_at;
const orderCreateDate = trackingData?.created_at;

const formattedCtreateDate = new Date (orderCreateDate).toLocaleString("en-GB", {
    day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})

const formattedDate = new Date(isoDate).toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

console.log(formattedDate);
// 👉 "15 May 2025, 3:09 pm"




  const handleCopy = (trackingid: string) => {
    navigator.clipboard
      .writeText(trackingid)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const handleCopyTrack = (trackingNumber: any) => {
    navigator.clipboard
      .writeText(trackingNumber)
      .then(() => {
        setCopiedtrackno(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 hidden pt-c20 z-40 md:flex items-center w-full"
        style={{ top: "4rem" }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex h-c32 w-full items-center gap-2"
        >
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link
            href="/dashboard/buyer"
            className="opacity-30 font-MontserratMedium text-c12"
          >
            Account
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link
            href="/dashboard/buyer/orders"
            className="opacity-30 font-MontserratMedium text-c12"
          >
            orders
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
            Tracking
          </span>
        </nav>
      </motion.div>

      <div className="w-full px-6 md:px-15">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mt-4 md:mt-c32"
          onClick={() => router.back()}
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold  hidden md:flex text-c16 text-161616">
            Order tracking
          </p>
          <p className="font-MontserratSemiBold md:hidden text-c16 text-161616">
            Track order
          </p>
        </motion.button>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:pt-c32  md:pb-c64 md:px-62.5"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="nd:py-c32 py-7"
          >
            <div>
              <div className="md:flex md:justify-between  md:border-b border-b-000000/20 space-y-c32 ">
                <div className="w-full md:max-w-84.25">
                  <p className="text-sm mb-6 font-MontserratSemiBold">
                    Delivery
                  </p>
                  <div className="">
                    <div className="flex gap-4 items-center text-6a0dad ">
                      <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                        <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">
                          15
                        </p>
                        <p className="text-c12 font-MontserratSemiBold">
                          May 2025
                        </p>
                      </div>
                      <p className="font-MontserratNormal text-sm text-000000">
                        -
                      </p>
                      <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                        <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">
                          21
                        </p>
                        <p className="text-c12 font-MontserratSemiBold">
                          Jun 2025
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Image
                        src={SpeedOf}
                        alt="speed of"
                        width={82.96}
                        height={26.76}
                        className="w-16 h-[20.65px] md:[w-82.96] md:h-[26.76]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2  items-center">
                    <p className="text-sm  font-MontserratNormal">
                      Order ID:{" "}
                      <span className="text-c12 font-MontserratSemiBold">
                        {" "}
                        {trackingData?.id || "-"}{" "}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        handleCopy(trackingData?.id);
                      }}
                    >
                      <Image
                        src={Copy}
                        alt="copy"
                        width={12}
                        height={12}
                        className="items-center justify-center"
                      />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 md:items-center pb-6 md:pb-0 border-b border-b-000000/5">
                    <p className="md:text-sm font-MontserratNormal text-c12">
                      Tracking number:
                      <span className="text-c12 font-MontserratSemiBold">
                        {" "}
                        {trackingData?.tracking_number || "-"}{" "}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        handleCopyTrack(trackingData?.tracking_number);
                      }}
                      className="flex   items-center justify-center"
                    >
                      <Image src={Copy} alt="copy" width={12} height={12} />
                    </button>
                    {copiedtrackno && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="font-MontserratNormal pt-c24 text-sm text-000000 border-b pb-6 md:pb-0  border-b-000000/5">
                    <p className="text-sm md:mb-6 mb-3 font-MontserratSemiBold">
                      Address for delivery
                    </p>
                    <div className="space-y-2">
                      <p>{selectedAddress?.first_name}  {selectedAddress?.last_name}</p>
                      <p>{selectedAddress?.phone}</p>
                      <p>{selectedAddress?.address}</p>
                    </div>
                  </div>
                </div>
                <div className=" md:max-w-74  w-full overflow-y-auto  custom-scroll mb-c32 h-fit  md:max-h-105.5 md:pr-7.5">
                  <p className="text-sm font-MontserratSemiBold mb-c32">
                    Package details
                  </p>
                <div className="flex justify-between overflow-y-auto  custom-scroll h-fit max-h-54 ">
                    <OrderItemSummary orderItems={oderItems} />
                  </div>

                </div>
              </div>
            </div>
            <div className="w-full pt-c32  text-sm font-MontserratSemiBold text-000000">
              <h1>Tracking details</h1>
            </div>
            <div className="flex gap-c24 mt-c24 items-start ">
              <div className="w-4 h-fit max-h-120">
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-4 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
                <div className="relative w-fit flex flex-col h-fit items-center">
                  <p className="h-c48 w-c1 bg-000000/20"></p>
                  <p className="w-4 h-4 rounded-full bg-000000/20"></p>
                </div>
              </div>

              <div className="pt-3 space-y-5.5">
                <div className="space-y-1">
                  <p className="text-sm font-MontserratSemiBold">
                    Customs clearance completed
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Package arrived at airport
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Flight departure
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Shipped
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Your order is being picked in the warehouse
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    The warehouse has started preparing your order
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    15 May, 2025, 3:09 pm
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Paid Successfully
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    {formattedDate}
                  </p>
                </div>
                <div className="space-y-1 text-000000/70">
                  <p className="text-sm font-MontserratSemiBold ">
                    Order Submitted
                  </p>
                  <p className="text-c12 font-MontserratNormal">
                    {formattedCtreateDate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <div className="py-c32">
          <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
            More to love
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 ">
        
          </div>
        </div>
      </div>
    </motion.div>
  );
}
