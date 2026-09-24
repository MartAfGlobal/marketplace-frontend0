"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

import CancelOrderModal from "@/components/ui/Modals/cancelOrder";
import CartWithBoxesIcon from "../CartWithBoxesIcon";
import AddCartModal from "@/components/ui/Modals/addToCart/addTocart-modal";
import { toast } from "sonner";
import { addOrderItemToCart } from "@/utils/addOrderItemToCart";
import { getBuyerOrderTrackingPath } from "@/utils/buyerOrderTracking";
import {
  getBuyerOrderDateLabel,
  getBuyerOrderStatusLabel,
} from "@/utils/buyerOrderDisplay";

interface OrdersProps {
  searchTerm: string;
}

export default function Orders({ searchTerm }: OrdersProps) {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(10); // Show 6 items by default
  const { orders } = useSelector((state: any) => state.orders);
  const disputes = useSelector((state: RootState) => state.orders.disputes);
  const oneItem = orders.filter((order: any) => order.items?.length === 1);
  const { fetchOrders, fetchDisputeList } = useFetchOrders();

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<string | null>(null);

  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [selectedVariationId, setSelectedVariationId] = useState("");

  console.log("orders from redux store:", orders);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const showMore = () => setVisible((prev) => prev + 10);

  const token: string | undefined = useSelector(
    (state: RootState) => state.token?.token ?? undefined,
  );

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();
  const { loading: comfirming, sendHttpRequest: ComfirmReq } = useHttp();
  const { sendHttpRequest: addToCartReq } = useHttp();
  const addingOrderIds = useRef(new Set<string>());

  const ordersWithoutDisputes = orders.filter((order: OrderItem) => {
    const orderItems = order.order_items || (order as any).items || [];
    const orderNumber = String(
      (order as any).order_no || (order as any).order_id || "",
    );
    const hasDispute = disputes.some(
      (dispute) =>
        String(dispute.order_number || "") === orderNumber ||
        orderItems.some(
          (item: any) =>
            String(item.id || item.order_item_id || "") ===
            String(dispute.order_item_id),
        ),
    );

    return !hasDispute;
  });

  const filteredOrders = ordersWithoutDisputes.filter((order: OrderItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchesOrderId = (order.order_no || order.id || "")
      .toLowerCase()
      .includes(term);

    const matchesStore = (order.manufacturer || "")
      .toLowerCase()
      .includes(term);

    const orderItems = order.order_items || (order as any).items || [];
    const matchesProduct = orderItems.some((item: any) =>
      item.product_name?.toLowerCase().includes(term),
    );

    return matchesOrderId || matchesStore || matchesProduct;
  });

  const handleRepay = (order_id: any, expected_amount: any) => {
    console.log("checking item to pay", order_id);
    setSelectedId(order_id);
    const amountNum = Number(expected_amount) || 0;
    repayReq({
      requestConfig: {
        url: "/checkout/repay/",
        method: "POST",
        token,
        body: {
          payment_id: order_id,
          order_id: order_id,
          repay_order_id: order_id,
          expected_amount: amountNum.toFixed(2),
        },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);
        const paymentUrl =
          res.data?.paystack_payment_url ||
          res.data?.payment_url ||
          res.data?.authorization_url ||
          res.data?.checkout_url ||
          res.data?.url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          return;
        }
      },
    });
  };

  const handleComfirmOder = (order_id: any) => {
    console.log("checking item to pay", order_id);
    ComfirmReq({
      requestConfig: {
        url: `/orders/buyer/${order_id}/confirm-delivery/`,
        method: "POST",
        token,
        body: {
          confirmed: true,
        },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("✅ User tracking info:", res);
        setIsOpen(false);
        fetchOrders();
      },
    });
  };

  const handleTrackOrder = (orderId: string) => {
    router.push(getBuyerOrderTrackingPath(orderId));
  };

  useEffect(() => {
    fetchOrders();
    fetchDisputeList();
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

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${id}`);
    } else {
      setSelectedId(id);
      setOpen(true);
    }
  };

  // const handleAddToCart = (slug: string, varId?: string) => {
  //   if (!slug) {
  //     toast.error("Product information not available");
  //     return;
  //   }
  //   const mobile =
  //     typeof window !== "undefined" &&
  //     (window.innerWidth < 768 ||
  //       /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  //   if (mobile) {
  //     router.push(
  //       varId
  //         ? `/product/${slug}?variationId=${encodeURIComponent(varId)}`
  //         : `/product/${slug}`,
  //     );
  //   } else {
  //     setSelectedProductSlug(slug);
  //     setSelectedVariationId(varId || "");
  //     setAddToCartOpen(true);
  //   }
  // };

  const handleAddOrderItemToCart = async (item: any) => {
    const orderId = String(item.id || item.order_id || "");
    if (addingOrderIds.current.has(orderId)) return;

    addingOrderIds.current.add(orderId);
    try {
      await addOrderItemToCart(addToCartReq, token, item, dispatch);
    } finally {
      addingOrderIds.current.delete(orderId);
    }
  };

  const handleReview = (id: string) => {
    router.push(`/dashboard/buyer/orders/leave-review/${id}`);
  };
  console.log(
    "tracking id:",
    orders.filter((order: any) => order.id),
  );

  const mode = filteredOrders.map((item: OrderItem) => item.buyer_status);

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
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
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
                key="empty-orders"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
              >
                <p className="text-center text-000000/60 font-MontserratMedium text-c18">
                  You haven’t made any orders yet
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
                  No matching orders found
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
                {filteredOrders.map((item: OrderItem) => {
                  const orderItems =
                    item.order_items || (item as any).items || [];
                  const hasOrderItems = orderItems.length > 0;
                  const isSingleItemOrder = orderItems.length === 1;

                  const itemsCount =
                    (item as any).items_count ??
                    (hasOrderItems
                      ? orderItems.reduce(
                          (sum: number, i: any) =>
                            sum + (i.fulfilled_quantity ?? i.quantity ?? 1),
                          0,
                        )
                      : 1);

                  const totalPrice = Number(
                    item.total_price ??
                      (hasOrderItems
                        ? orderItems.reduce(
                            (sum: number, i: any) =>
                              sum +
                              Number(i.price_at_purchase || 0) *
                                Number(i.fulfilled_quantity ?? i.quantity ?? 1),
                            0,
                          )
                        : 0),
                  );

                  const orderNo = item.order_id;
                  const orderDate = getBuyerOrderDateLabel(item);

                  const storeName =
                    item.manufacturer ||
                    item.seller_name ||
                    ((item as any).sellers_count
                      ? `${(item as any).sellers_count} Store${(item as any).sellers_count > 1 ? "s" : ""}`
                      : "MartAf Order");

                  const MobileActions = (
                    <div className="w-full gap-4 text-c10 flex flex-row-reverse md:hidden mt-4 space-y-4">
                      {(item.buyer_status?.toLowerCase() === "shipped" ||
                        item.buyer_status?.toLowerCase() ===
                          "shipped_to_buyer" ||
                        item.buyer_status?.toLowerCase() ===
                          "out_for_delivery") && (
                        <>
                          <Button onClick={() => handleClick(item.id)}>
                            Confirm delivery
                          </Button>
                          <Button variant="secondary" onClick={() => handleTrackOrder(item.id)}>
                            Track order
                          </Button>
                        </>
                      )}
                      {(item.buyer_status === "Completed" ||
                        item.buyer_status === "delivered" ||
                        item.buyer_status === "Cancelled") && (
                        <>
                          <div></div>
                          <Button
                            className=""
                            onClick={() => handleAddOrderItemToCart(item)}
                          >
                            Add to cart
                          </Button>
                        </>
                      )}
                      {item.buyer_status === "Delivered" && (
                        <>
                          <Button
                            onClick={() => handleAddOrderItemToCart(item)}
                          >
                            Add to cart
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleReview(item.id)}
                          >
                            Leave a review
                          </Button>
                        </>
                      )}
                      {item.buyer_status === "RECEIVED_AT_HUB" && (
                        <>
                          <div className="w-full"></div>
                          <Button
                            variant="secondary"
                            onClick={() => handleTrackOrder(item.id)}
                          >
                            Track order
                          </Button>
                        </>
                      )}
                      {item.buyer_status === "PENDING" && item.can_cancel && (
                        <>
                          <Button onClick={() => handleEditAddress(item.id)}>
                            Edit address
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setSelectedOrderId(item.id);
                              setOpenCancelModal(true);
                            }}
                          >
                            Cancel order
                          </Button>
                        </>
                      )}
                      {item.buyer_status === "Processing" &&
                        item.can_cancel && (
                          <Button
                            onClick={() => {
                              setSelectedOrderId(item.id);
                              setOpenCancelModal(true);
                            }}
                            variant="primary"
                          >
                            Cancel order
                          </Button>
                        )}
                      {item.buyer_status === "AWAITING_PAYMENT" && (
                        <>
                          <Button
                            disabled={repaying}
                            onClick={() => handleRepay(item.id, totalPrice)}
                          >
                            {selectedId === item.id && repaying ? (
                              <LoadingSpinner />
                            ) : (
                              "Confirm & pay"
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleEditAddress(item.id)}
                          >
                            Edit address
                          </Button>
                        </>
                      )}
                    </div>
                  );

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8 }}
                      className="min-h-64 pb-6 border-b border-b-000000/10"
                    >
                      <div className="w-full flex items-center justify-between md:gap-0 md:justify-between mb-3 md:mb-c32">
                        <div>
                          <p
                            className={`font-MontserratSemiBold text-c16  ${
                              item.buyer_status === "Cancelled"
                                ? "text-ca0202"
                                : item.buyer_status === "Delivered"
                                  ? "text-2d7565"
                                  : item.buyer_status === "Completed" &&
                                      item.status === "RETURN_CLOSED"
                                    ? "text-[#FFAC06]"
                                    : "text-161616"
                            }`}
                          >
                            {getBuyerOrderStatusLabel(item)}
                          </p>
                          <div className="md:flex hidden gap-2 mt-2">
                            <p className="text-c12 font-MontserratNormal">
                              Order ID: {orderNo || "Not available"}
                            </p>
                            <button
                              key={item.id}
                              onClick={() => handleCopy(orderNo ?? "")}
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
                        {item.buyer_status !== "Cancelled" && (
                          <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                            {orderDate.label}: {orderDate.date}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:justify-between flex-col pb-c32 flex md:flex-row">
                        {!hasOrderItems ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
                              className="flex flex-col md:flex-row gap-4 items-start flex-1"
                            >
                              <div className="flex gap-4 items-start w-full">
                                <CartWithBoxesIcon
                                  className="h-24 w-24"
                                  itemsCount={itemsCount}
                                />
                                <div className="w-full">
                                  <p className="font-MontserratSemiBold text-base mb-1 text-000000">
                                    Order #{item.order_id}
                                  </p>
                                  <p className="text-c12 font-MontserratMedium mb-2 text-000000/70">
                                    {storeName}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                    <p className="rounded-c12 bg-000000/10 text-000000/60 h-fit py-1.5 px-3 text-center font-MontserratSemiBold text-c12 flex items-center justify-center">
                                      {itemsCount}{" "}
                                      {itemsCount === 1 ? "Item" : "Items"}
                                    </p>
                                    {(item as any).shipping_cost > 0 && (
                                      <p className="text-c12 font-MontserratMedium text-000000/50">
                                        + ₦
                                        {Number(
                                          (item as any).shipping_cost,
                                        ).toLocaleString()}{" "}
                                        Shipping
                                      </p>
                                    )}
                                  </div>
                                  <p className="font-MontserratSemiBold text-c16 pt-3 text-000000">
                                    ₦{totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            {MobileActions}
                          </>
                        ) : isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
                              className="flex flex-col md:flex-row gap-4 items-start  "
                            >
                              {orderItems.map((prod: any) => (
                                <div
                                  key={prod.id}
                                  className="flex gap-4 items-start  w-full"
                                >
                                  <Image
                                    src={
                                      prod?.product_image || "/placeholder.png"
                                    }
                                    alt={prod.product_name || "Product Image"}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 object-cover rounded-lg"
                                  />
                                  <div className="w-full">
                                    <p className="font-MontserratSemiBold text-base mb-1">
                                      {prod.product_name}
                                    </p>
                                    <p className=" text-c12 font-MontserratMedium mb-3">
                                      {item.manufacturer || item.seller_name}
                                    </p>
                                    <p className="rounded-c12 bg-000000/10 text-000000/60 p-2  w-fit font-MontserratSemiBold text-c12 flex items-center ">
                                      {prod.fulfilled_quantity ?? prod.quantity}
                                      Pc,
                                      {prod.variation_name || prod.product_name}
                                    </p>
                                    <p className="font-MontserratSemiBold text-c16 pt-3">
                                      ₦
                                      {(
                                        (prod.price_at_purchase || 0) *
                                        (prod.fulfilled_quantity ??
                                          prod.quantity ??
                                          1)
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </Link>
                            {MobileActions}
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
                              className="flex gap-4 w-full"
                            >
                              <div className="hidden sm:flex gap-4">
                                <div
                                  className={`grid gap-4 ${
                                    orderItems.length === 1
                                      ? "grid-cols-1"
                                      : orderItems.length === 2
                                        ? "grid-cols-2"
                                        : "grid-cols-3"
                                  }`}
                                >
                                  {orderItems.slice(0, 3).map((prod: any) => (
                                    <div
                                      key={prod.id}
                                      className="flex flex-col items-center"
                                    >
                                      <div className="w-24 h-24 relative">
                                        <Image
                                          src={
                                            prod.product_image ||
                                            "/placeholder.png"
                                          }
                                          alt={
                                            prod.product_name || "Product Image"
                                          }
                                          width={96}
                                          height={96}
                                          className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <p className="absolute bottom-2 text-c12 font-MontserratNormal flex items-center justify-center left-4 translate-x-1/2 text-center bg-000000 rounded-c12 text-ffffff  w-7.5 h-6">
                                          {`x${prod.fulfilled_quantity ?? prod.quantity}`}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="font-MontserratSemiBold text-base mb-2 flex flex-wrap gap-1">
                                    {orderItems
                                      .slice(0, 3)
                                      .map((prod: any, index: number) => (
                                        <span
                                          key={prod.id}
                                          className="flex items-center"
                                        >
                                          <span
                                            className="max-w-[110px] truncate inline-block align-middle"
                                            title={prod.product_name}
                                          >
                                            {prod.product_name}
                                          </span>
                                          {index <
                                            Math.min(orderItems.length, 3) -
                                              1 && <span>,&nbsp;</span>}
                                        </span>
                                      ))}
                                    {orderItems.length > 3 && <span>...</span>}
                                  </p>
                                  <p className="text-c12 font-MontserratMedium mb-3">
                                    {item.manufacturer || item.seller_name}
                                  </p>
                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {itemsCount}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>
                                  <p className="font-MontserratSemiBold text-c16 pt-3">
                                    ₦{totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex sm:hidden w-full items-start gap-4">
                                {orderItems[0] && (
                                  <Image
                                    src={
                                      orderItems[0].product_image ||
                                      "/placeholder.png"
                                    }
                                    alt={
                                      orderItems[0].product_name ||
                                      "Product Image"
                                    }
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 object-cover rounded-lg"
                                  />
                                )}
                                <div className="w-full ">
                                  <p className="font-MontserratSemiBold text-base mb-1 truncate max-w-[150px]">
                                    {orderItems[0]?.product_name}
                                  </p>
                                  <p className="text-c12 font-MontserratMedium mb-2">
                                    {item.manufacturer || item.seller_name}
                                  </p>
                                  <p className="rounded-c12 bg-000000/10 h-c32 py-2 w-fit min-w-24.5 px-4 text-center font-MontserratSemiBold text-c12 flex items-center justify-center text-000000/60">
                                    {itemsCount}{" "}
                                    <span className="pl-0.5">Items</span>
                                  </p>
                                  <p className="font-MontserratSemiBold text-c16 pt-2">
                                    ₦{totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            {MobileActions}
                          </>
                        )}
                        <div className="hidden w-full gap-4 pl-4 md:flex md:flex-col md:max-w-70 space-y-4">
                          {(item.buyer_status?.toLowerCase() === "shipped" ||
                            item.buyer_status?.toLowerCase() ===
                              "shipped_to_buyer" ||
                            item.buyer_status?.toLowerCase() ===
                              "out_for_delivery") && (
                            <>
                              <Button
                                onClick={() => handleClick(item.id)}
                              >
                                Confirm delivery
                              </Button>
                              <Button
                                variant="secondary"
                                key={item.id}
                                onClick={() => handleTrackOrder(item.id)}
                              >
                                Track order
                              </Button>
                            </>
                          )}

                          {item.buyer_status === "Delivered" && (
                            <>
                              <Button
                                className=""
                                onClick={() => handleAddOrderItemToCart(item)}
                              >
                                Add to cart
                              </Button>
                              <Button
                                onClick={() => handleReview(item.id)}
                                variant="secondary"
                                className=""
                              >
                                Leave a review
                              </Button>
                            </>
                          )}

                          {(item.buyer_status === "Completed" ||
                            item.buyer_status === "delivered" ||
                            item.buyer_status === "Cancelled") && (
                            <>
                              <div></div>
                              <Button
                                className=""
                                onClick={() => handleAddOrderItemToCart(item)}
                              >
                                Add to cart
                              </Button>
                            </>
                          )}
                          {item.buyer_status === "RECEIVED_AT_HUB" && (
                            <>
                              <Button
                                variant="secondary"
                                key={item.id}
                                onClick={() => handleTrackOrder(item.id)}
                              >
                                Track order
                              </Button>
                            </>
                          )}

                          {item.buyer_status === "Processing" &&
                            item.can_cancel && (
                              <>
                                {/* <Button
                                onClick={() => handleEditAddress(item.id)}
                              >
                                Edit address
                              </Button> */}
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedOrderId(item.id);
                                    setOpenCancelModal(true);
                                  }}
                                >
                                  Cancel order
                                </Button>
                              </>
                            )}

                          {item.buyer_status === "Processing" &&
                            item.can_cancel && (
                              <Button
                                onClick={() => {
                                  setSelectedOrderId(item.id);
                                  setOpenCancelModal(true);
                                }}
                                variant="primary"
                              >
                                Cancel order
                              </Button>
                            )}

                          {item.buyer_status === "AWAITING_PAYMENT" && (
                            <>
                              <Button
                                variant="secondary"
                                onClick={() => handleEditAddress(item.id)}
                              >
                                Edit address
                              </Button>
                              <Button
                                disabled={repaying}
                                onClick={() => {
                                  handleRepay(item.id, item.total_price);
                                }}
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
                          ].includes(item.buyer_status) && (
                            <Button variant="secondary" className="">
                              View details
                            </Button>
                          )} */}

                          <div className="w-full hidden md:flex justify-center">
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${item.buyer_status.toLowerCase()}`}
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
          handleComfirmOder(selectedId);
        }}
        loading={comfirming}
      />
      {/* <OrderEditAddressModal
        onClose={() => setAddressOpen(false)}
        isOpen={addressOpen}
        id={selectedId}
      /> */}
      <CancelOrderModal
        isDispute={false}
        isOpen={openCancelModal}
        orderId={selectedOrderId}
        onClose={() => setOpenCancelModal(false)}
      />
    </div>
  );
}
