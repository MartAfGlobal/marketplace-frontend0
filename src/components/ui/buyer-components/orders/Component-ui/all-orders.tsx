"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { OrderDetails, OrderItem, TrackOrders } from "@/types/global";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/cards/ProductCard";
import Copy from "@/assets/icons/Copy.png";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import OrderEditAddressModal from "@/components/ui/Modals/orders/edit-address-order-modal";

import { useFetchOrders } from "@/helpers/fetchOrders";

export default function Orders() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false)
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(10); // Show 6 items by default
  const { orders} = useSelector((state: any) => state.orders);
  const oneItem = orders.filter((order: any) => order.items?.length === 1);
  const { fetchOrders } = useFetchOrders();

  const [loadingIds, setLoadingIds] = useState<string | null>(null);

  console.log("orders from redux store:", orders);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const showMore = () => setVisible((prev) => prev + 10);

  const token: string | undefined = useSelector(
    (state: RootState) => state.token?.token ?? undefined
  );

  const cartItems = useSelector((state: RootState) => state.cart.items);

  // const token = useSelector((state: any) => state.token?.token);
  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();
  const { sendHttpRequest: cancelReq } = useHttp();

  const handleRepay = (repay_order_id: any) => {
    console.log("checking item to pay", repay_order_id);
    repayReq({
      requestConfig: {
        url: "/orders/repay/",
        method: "POST",
        token,
        body: { repay_order_id: repay_order_id },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);

        if (res.data?.paystack_payment_url) {
          window.location.href = res.data.paystack_payment_url;
        } else {
          return;
        }
      },
    });
  };

  const handleTrackOrder = (orderId: string) => {
    router.push(`/dashboard/buyer/orders/tracking/${orderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleEditAddress = (id: string) => {
    setSelectedId(id);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      router.push(`/dashboard/buyer/orders/edit-address/${id}`);
    } else {
      setTimeout(() => setAddressOpen(true), 0);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setLoadingIds(orderId);
    console.log("checking item to cancel", orderId);
    if (!token) {
      setLoadingIds(orderId);
      return;
    }

    cancelReq({
      requestConfig: {
        url: `/orders/${orderId}/cancel/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User order cancel info:", res);
        setLoadingIds("");
        fetchOrders();
      },
    });
  };

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${id}`);
    } else {
      setOpen(true); // open modal on desktop
    }
  };
  console.log(
    "tracking id:",
    orders.filter((order: any) => order.id)
  );

  const fashionProducts = cartItems.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  const handleCopy = (orderNo: string) => {
    navigator.clipboard
      .writeText(orderNo)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // adjust breakpoint as needed
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-c24   w-full px-6 ">
      <div className="w-full ">
        <div className="w-full space-y-c24 mt-7 md:mt-c32 ">
          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="w-full text-center max-w-41.25 text-000000/60 font-MontserratMedium text-c18 leading-6.5">
                  You haven’t made any orders yet
                </p>
                <Button className="w-51">Start shopping</Button>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 ">
                  {fashionProducts.slice(0, visible).map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </motion.div>
            ) : (
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
                {orders.map((item: OrderItem) => {
                  const isSingleItemOrder = item.items?.length === 1;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                      className="h-64 border-b border-b-000000/10"
                    >
                      <div className="w-full   flex items-center justify-between md:gap-0 md:justify-between mb-3 md:mb-c32">
                        <div>
                          
                          <p className="text-sm font-MontserratSemiBold leading-c20 text-000000">
                            {item.status === "To Ship"
                              ? "Order is being processed"
                              : item.status === "Shipped"
                              ? "Order on its way"
                              : item.status === "Delivered"
                              ? "Order delivered"
                              : item.status === "Confirmed"
                              ? "Delivered"
                              : item.status === "Awaiting Confirmation" ||
                                item.status === "Processing" ||
                                item.status === "Awaiting Payment"
                              ? "Awaiting payment"
                              : item.status}
                          </p>
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12  font-MontserratNormal">
                              Order ID: {item.order_no || "Not available"}
                            </p>
                            <button
                              key={item.id}
                              onClick={() => handleCopy(item.order_no ?? "")}
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
                          Delivery:{" "}
                          {item.estimated_delivery_date || " May 15, 2025"}
                        </p>
                      </div>

                      <div className="w-full md:justify-between flex-col  pb-c32 flex md:flex-row">
                        {isSingleItemOrder ? (
                          <div className="flex flex-col md:flex-row gap-4 items-start  ">
                            {item.items?.map((prod) => (
                              <div
                                key={prod.id}
                                className="flex gap-4 items-start  w-full"
                              >
                                <Image
                                  src={
                                    prod.product?.image || "/placeholder.png"
                                  }
                                  alt={prod.product?.name || "Product Image"}
                                  width={96}
                                  height={96}
                                  className="h-24 w-24 "
                                />
                                <div className="w-full">
                                  <p className="font-MontserratSemiBold text-base mb-1">
                                    {prod.product?.name}
                                  </p>
                                  <p className=" text-c12 font-MontserratMedium mb-3">
                                    {item.manufacturer}
                                  </p>
                                  <p className="rounded-c12 bg-000000/10 text-000000/60  h-c32 py-2 w-fit min-w-24.5  px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center">
                                    {prod.quantity}Pc, {prod.variant?.color}
                                  </p>
                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦{item.total_price}
                                  </p>
                                  {/* <div className="w-full gap-4 pl flex md:hidden  mt-4 space-y-4">
                                    <button
                                      // onClick={() => {
                                      //   setEditingAddress(undefined);
                                      //   setIsModalOpen(true);
                                      // }}
                                      className="bg-transparent border h-c40 w-full rounded-c8 text-c10 border-ff715b text-ff715b"
                                    >
                                      Edit address
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleRepay(item.id);
                                      }}
                                      className="text-c10 text-ffffff bg-ff715b w-full h-c40 rounded-lg "
                                    >
                                      Confirm & pay
                                    </button>
                                  </div> */}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-4 w-full">
                            <div className="hidden sm:flex gap-4">
                              <div
                                className={`grid gap-4 ${
                                  item.items.length === 1
                                    ? "grid-cols-1"
                                    : item.items.length === 2
                                    ? "grid-cols-2"
                                    : "grid-cols-3"
                                }`}
                              >
                                {item.items?.slice(0, 3).map((prod) => (
                                  <div
                                    key={prod.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="w-24 h-24 relative">
                                      <Image
                                        src={
                                          prod.product?.image ||
                                          "/placeholder.png"
                                        }
                                        alt={
                                          prod.product?.name || "Product Image"
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
                                  {item.items
                                    ?.slice(0, 3)
                                    .map((prod, index) => (
                                      <span
                                        key={prod.id}
                                        className="flex items-center"
                                      >
                                        <span
                                          className="max-w-[110px] truncate inline-block align-middle"
                                          title={prod.product?.name}
                                        >
                                          {prod.product?.name}
                                        </span>
                                        {index <
                                          Math.min(item.items.length, 3) -
                                            1 && <span>,&nbsp;</span>}
                                      </span>
                                    ))}
                                  {item.items.length > 3 && <span>...</span>}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-3">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.items?.reduce(
                                    (sum, i) => sum + (i.quantity || 0),
                                    0
                                  )}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-3">
                                  ₦{item.total_price}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:hidden w-full items-start gap-4">
                              {item.items?.[0] && (
                                <Image
                                  src={
                                    item.items[0].product?.image ||
                                    "/placeholder.png"
                                  }
                                  alt={
                                    item.items[0].product?.name ||
                                    "Product Image"
                                  }
                                  width={96}
                                  height={96}
                                  className="w-24 h-24"
                                />
                              )}

                              <div className="w-full ">
                                <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                  {item.items?.[0]?.product?.name}
                                </p>

                                <p className="text-c12 font-MontserratMedium mb-2">
                                  {item.manufacturer}
                                </p>

                                <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                  {item.items?.length}{" "}
                                  <span className="pl-0.5">Items</span>
                                </p>

                                <p className="font-MontserratSemiBold text-c16 pt-2">
                                  ₦{item.total_price}
                                </p>
                                <div className="w-full gap-4 text-c10 pl flex md:hidden  mt-4 space-y-4">
                                  {item.status === "Shipped" && (
                                    <>
                                      <Button
                                        variant="secondary"
                                        key={item.id}
                                        onClick={() =>
                                          handleTrackOrder(item.id)
                                        }
                                      >
                                        Track order
                                      </Button>

                                      <Button
                                        onClick={() => handleClick(item.id)}
                                      >
                                        Confirm delivery
                                      </Button>
                                    </>
                                  )}

                                  {item.status === "To Ship" && (
                                    <>
                                      <Button
                                        onClick={() =>
                                          handleEditAddress(item.id)
                                        }
                                        variant="secondary"
                                        className=""
                                      >
                                        Edit address
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleCancelOrder(item.id)
                                        }
                                        variant="primary"
                                      >
                                        {loadingIds === item.id ? (
                                          <LoadingSpinner />
                                        ) : (
                                          "Cancel order"
                                        )}
                                      </Button>
                                    </>
                                  )}

                                  {item.status === "Delivered" && (
                                    <>
                                      <Button className="">Add to cart</Button>
                                      <Button variant="secondary" className="">
                                        Leave a review
                                      </Button>
                                    </>
                                  )}

                                  {(item.status === "Awaiting Confirmation" ||
                                    item.status === "Processing" ||
                                    item.status === "Awaiting Payment") && (
                                    <>
                                      <Button
                                        onClick={() =>
                                          handleEditAddress(item.id)
                                        }
                                        variant="secondary"
                                        className=""
                                      >
                                        Edit address
                                      </Button>
                                      <Button
                                        disabled={repaying}
                                        onClick={() => {
                                          handleRepay(item.id);
                                        }}
                                        className=""
                                      >
                                        {repaying ? (
                                          <LoadingSpinner />
                                        ) : (
                                          "Confirm & pay"
                                        )}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="w-full gap-4 pl hidden md:flex md:flex-col md:max-w-70 space-y-4">
                          {item.status === "Shipped" && (
                            <>
                              <Button
                                variant="secondary"
                                key={item.id}
                                onClick={() => handleTrackOrder(item.id)}
                              >
                                Track order
                              </Button>

                              <Button onClick={() => handleClick(item.id)}>
                                Confirm delivery
                              </Button>
                            </>
                          )}

                          {item.status === "To Ship" && (
                            <>
                              <Button
                                onClick={() => handleEditAddress(item.id)}
                                variant="secondary"
                                className=""
                              >
                                Edit address
                              </Button>
                              <Button
                                onClick={() => handleCancelOrder(item.id)}
                                variant="primary"
                              >
                                {" "}
                                {loadingIds === item.id ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Cancel order"
                                )}
                              </Button>
                            </>
                          )}

                          {item.status === "Delivered" && (
                            <>
                              <Button className="">Add to cart</Button>
                              <Button variant="secondary" className="">
                                Leave a review
                              </Button>
                            </>
                          )}

                          {(item.status === "Awaiting Confirmation" ||
                            item.status === "Processing" ||
                            item.status === "Awaiting Payment") && (
                            <>
                              <Button
                                onClick={() => handleEditAddress(item.id)}
                                variant="secondary"
                                className=""
                              >
                                Edit address
                              </Button>
                              <Button
                                disabled={repaying}
                                onClick={() => {
                                  handleRepay(item.id);
                                }}
                                className=""
                              >
                                {repaying ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Confirm & pay"
                                )}
                              </Button>
                            </>
                          )}

                          {/* Default fallback (optional)
                          {![
                            "Shipped",
                            "To Ship",
                            "Delivered",
                            "Awaiting Payment",
                          ].includes(item.status) && (
                            <Button variant="secondary" className="">
                              View details
                            </Button>
                          )} */}

                          <div className="w-full hidden md:flex justify-center">
                            <Link
                              href={`orders/${item.id}`}
                              className="text-c14 font-MontserratSemiBold text-ff715b"
                            >
                              Order details
                            </Link>
                          </div>
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
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onNo={() => setOpen(false)}
        onYes={() => {
          open;
        }}
      />
      <OrderEditAddressModal
        onClose={() => setAddressOpen(false)}
        isOpen={addressOpen}
        id={selectedId}

      />
    </div>
  );
}
