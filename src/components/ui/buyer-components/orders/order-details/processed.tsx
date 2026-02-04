"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import { Button } from "@/components/ui/Button/Button";
import VisaCard from "@/assets/icons/visa_inc_logo.svg.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";

import Copy from "@/assets/icons/Copy.png";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ui/cards/ProductCard";
import { useParams, useRouter } from "next/navigation";
import {
  DisputePayload,
  Items,
  OrderDetailsPageProps,
  OrderItem,
  OrderLineItem,
} from "@/types/global";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFetchOrders } from "@/helpers/fetchOrders";
import AdressSkeleton from "@/components/reloadSpinner/addressSkeleton";
import { fetchDisputeDetails } from "@/store/orders/order-slice";
export default function ProessedOrderDetails({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const { orders } = useSelector((state: any) => state.orders);
  const { fetchOrderDetails, loading } = useFetchOrders(id);
  const order = orders.find((o: OrderItem) => o.id === id);
  const router = useRouter();
  const orderid = order.order_no;
  const [visible, setVisible] = useState(10);
  const [isDispute, setIsDisput] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest,   loading:fetching } = useHttp();

  const shippingAddress = useSelector(
    (state: RootState) => state.orders.shippingAddress,
  );

  const isoDate = order.created_at;
  const formattedDate = new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    } else return;
  }, [id]);
  const [isMobile, setIsMobile] = useState(false);

  const orderItems = order.order_items;

  console.log("order item", order);

  const handleReturnAndRefund = (returnid: string) => {




    router.push(`/dashboard/buyer/orders/return-refund/${returnid}`);
  };
  const viewDisputeDetails = (disputeid: string) => {
    if (!token) return;
  
   console.log("dispute details fetchib=ng")


   
    sendHttpRequest({
      requestConfig: {
        url: `/disputes/buyer/?order_item_id=${disputeid}`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (responseData: any) => {
        const datas = responseData.data.results
        const filteredDispute = datas.find((item:DisputePayload)=> item.order_item_id === disputeid)
        console.log("dispute detailsssss", filteredDispute.id); 
       
          router.push(`/dashboard/buyer/orders/dispute-details/${filteredDispute.id}?item`);
      },
    });


   

  };
  const handleReview = (id: string) => {
    router.push(`/dashboard/buyer/orders/leave-review/${id}`);
  };

  const showMore = () => setVisible((prev) => prev + 10);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // adjust breakpoint as needed
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(orderid)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pl-c56 pt-c20 z-40 hidden md:flex items-center w-full"
          style={{ top: "4rem" }}
        >
          <nav
            aria-label="breadcrumb"
            className="flex h-c32 w-full items-center gap-2"
          >
            <Link
              href="/"
              className="opacity-30 font-MontserratMedium text-c12"
            >
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
              Order ID {orderid}
            </span>
          </nav>
        </motion.div>

        <div className="w-full px-6 md:px-15 ">
          <button
            onClick={() => router.back()}
            className="flex  items-center gap-4 mt-4 md:mt-c32"
          >
            <Image
              src={NavBack}
              alt="<"
              width={9}
              height={16.5}
              className="brightness-20 w-2.25 h-[16.5px]"
            />
            <p className="font-MontserratSemiBold text-c16  text-161616">
              Order has been delivered
            </p>
          </button>
          <div className="md:pt-c32  pt-7 md:pb-c64 md:px-62.5 ">
            <div className="md:p-c32  md:rounded-2xl md:border border-000000/10">
              <div className="flex justify-between space-y-c32">
                <div className="w-full md:max-w-57">
                  <div className="flex md:gap-2 md:mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Order ID: {order.order_no}
                    </p>
                    <button onClick={handleCopy}>
                      <Image src={Copy} alt="copy" width={16} height={16} />
                    </button>
                    {copied && (
                      <span className="text-green-600 text-c12 font-MontserratMedium">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="font-MontserratNormal w-full text-sm text-000000 space-y-1 md:space-y-2">
                    <p>Seller: {order.manufacturer}</p>
                    <p>Order date: {formattedDate || "no delivery"}</p>
                    <p>Delivery date: June 15, 2025 - July 25, 2025</p>
                  </div>
                </div>
                <div className=" hidden md:flex flex-col gap-c32 w-full max-w-84">
                  <>
                    <Button className="">Add to cart</Button>
                    <Button
                      onClick={() => handleReview(order.id)}
                      variant="secondary"
                      className=""
                    >
                      Leave a review
                    </Button>
                  </>
                </div>
              </div>
              <div className="flex md:flex-row flex-col space-y-8 justify-between">
                <div className="w-full max-w-57">
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Address delivered to
                    </p>
                  </div>
                  {loading ? (
                    <AdressSkeleton />
                  ) : (
                    <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                      <p>
                        {shippingAddress?.first_name}{" "}
                        {shippingAddress?.first_name}
                      </p>
                      <p>{shippingAddress?.phone}</p>
                      <p>{shippingAddress?.address}</p>
                    </div>
                  )}
                </div>
                <div className=" flex flex-col gap-3 w-full max-w-84">
                  <p className="text-sm font-MontserratSemiBold">
                    Payment method
                  </p>
                  <p>Credit/Debit card</p>
                  <div className="flex justify-between">
                    <p>534780******7167</p>
                    <Image
                      src={VisaCard}
                      alt="visa card"
                      width={32}
                      height={18.35}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={ShildCheck}
                      alt="shild check"
                      width={20}
                      height={20}
                    />
                    <p>Secure payments</p>
                  </div>
                  <p>
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
              </div>

              <div className="flex md:flex-row flex-col space-y-8 md:justify-between mt-8 md:mt-c64">
                <p className="text-sm font-MontserratSemiBold md:hidden">
                  Package details
                </p>

                <div
                  className={`w-full mb-4  ${order.status === "DELIVERED" ? "md:w-full" : "md:max-w-74"}`}
                >
                  <div className=" w-full">
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
                      className="md:space-y-c24 space-y-7 w-full"
                    >
                      {orderItems.map((item: OrderLineItem) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                          className=" flex flex-col md:flex-row justify-between "
                        >
                          <Link
                            href={{
                              pathname: `/product/${item.product_slug}`,
                              query:
                                item.variation || item.product
                                  ? { variationId: item.variation }
                                  : { variationId: item.product },
                            }}
                            className="w-full justify-between md:pb-8 flex"
                          >
                            <div className="flex gap-4 items-center md:items-start">
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={100}
                                height={100}
                                className="hidden md:flex"
                              />
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={64}
                                height={64}
                                className="md:hidden"
                              />
                              <div className="w-full max-w-143.75">
                                <p className="md:font-MontserratSemiBold text-c12 font-MontserratNormal md:text-sm leading-c24 pb-3 text-000000">
                                  {item.product_name}
                                </p>

                                <div className="w-fit p-2 justify-center md:text-nowrap rounded-c12 bg-black/3 flex items-center">
                                  <span className="text-black opacity-32 font-MontserratSemiBold text-c12">
                                    {item.quantity}PC,{" "}
                                    {item.variation_name || item.product_name}
                                  </span>
                                </div>
                                <p className="font-MontserratSemiBold text-sm flex md:text-c18 pt-3 leading-6.5">
                                  ₦{item.total_price}
                                </p>
                              </div>
                            </div>
                          </Link>

                          {item.has_dispute ? (
                            <div className="space-y-4 flex md:flex-col gap-4 mt-4 md:mt-0 w-full md:max-w-48.5">
                              {/* <Button
                              disabled={fetching}
                                onClick={() => viewDisputeDetails(item.id)}
                              >
                              {fetching? <LoadingSpinner/>: "Dispute details"}
                              </Button>
                              <Button variant="secondary">
                                Cancel dispute
                              </Button> */}
                              <p className="text-ff715b text-sm font-MontserratSemiBold ">In dispute</p>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleReturnAndRefund(item.id)}
                              variant="secondary"
                              className="max-w-47.5"
                            >
                              Return/Refund
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4 max-w-84.25">
                <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                  Payment details
                </p>
                <div className="md:space-y-3 space-y-2 md:mt-3 mb-7 md:mb-c32">
                  <p className="text-c12 font-MontserratNormal md:text-sm md:font-MontserratSemiBold text-000000">
                    Total
                  </p>
                  <p className="font-MontserratSemiBold text-c20 md:text-c32 ">
                    ₦{order.total_price}
                  </p>
                </div>
                <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                  <div className="flex justify-between">
                    <p className="tex-c12 font-MontserratNormal md:text-sm md:font-MontserratSemiBold">
                      Total items
                    </p>
                    <p>₦{order.total_price}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Discounts</p>
                    <p>-₦{order.discount_amount}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>₦{order.subtotal}</p>
                  </div>
                </div>
                <div className="font-MontserratNormal text-left text-sm mt-c24 text-000000 space-y-2">
                  <div className="flex justify-between">
                    <p>Shipping fee</p>
                    <p>₦{order.shipping_cost}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Order total</p>
                    <p>₦{order.total_price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-c32   pb-35 md:pb-0">
            <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
              More to love
            </p>
          </div>
        </div>
        <div className="w-full  h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
          <div className="flex gap-4 items-center justify-center w-full text-c12 font-MontserratSemiBold">
            <>
              <Button className="">Add to cart</Button>
              <Button variant="secondary" className="">
                Leave a review
              </Button>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
