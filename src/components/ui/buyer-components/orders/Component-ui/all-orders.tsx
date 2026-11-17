"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

import Shoes from "@/assets/icons/user-dashboard/orderHistory/Shoes.png";
import { OrderDetails, OrderItem, TrackOrders } from "@/types/global";
import Link from "next/link";
import ProductCard from "@/components/ui/cards/ProductCard";
import Copy from "@/assets/icons/Copy.png";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
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
import { getOrderReviewState } from "@/utils/buyerOrderReview";
import OrdersListView from "./shared/OrdersListView";
import {
  AllOrderDesktopActions,
  AllOrderMobileActions,
} from "./all-orders-actions";
import OrderLineItemSummary from "./shared/OrderLineItemSummary";
import OrderItemsGridSummary, {
  OrderPreviewItem,
} from "./shared/OrderItemsGridSummary";

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
      <OrdersListView
        hasOrders={orders.length > 0}
        hasResults={filteredOrders.length > 0}
        emptyMessage="You haven’t made any orders yet"
        noResultsMessage="No matching orders found"
        contentClassName="w-full space-y-c24 mt-7 md:mt-c32"
      >
        {filteredOrders.map((item: OrderItem) => {
                  const orderItems =
                    item.order_items || (item as any).items || [];
                  const reviewState = getOrderReviewState(item);
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
                  const buyerStatus = String(item.buyer_status ?? item.status ?? "").toLowerCase();
                  const orderDate = getBuyerOrderDateLabel(item);

                  const storeName =
                    item.manufacturer ||
                    item.seller_name ||
                    ((item as any).sellers_count
                      ? `${(item as any).sellers_count} Store${(item as any).sellers_count > 1 ? "s" : ""}`
                      : "MartAf Order");

                  const actionProps = {
                    item,
                    totalPrice,
                    repaying,
                    selectedId,
                    reviewState,
                    onConfirmDelivery: () => handleClick(item.id),
                    onTrackOrder: () => handleTrackOrder(item.id),
                    onAddToCart: () => handleAddOrderItemToCart(item),
                    onReview: () => handleReview(item.id),
                    onEditAddress: () => handleEditAddress(item.id),
                    onCancel: () => {
                      setSelectedOrderId(item.id);
                      setOpenCancelModal(true);
                    },
                    onRepay: (expectedAmount: number) =>
                      handleRepay(item.id, expectedAmount),
                  };
                  const previewItems: OrderPreviewItem[] = orderItems.map(
                    (prod: any) => ({
                      id: prod.id,
                      productName: prod.product_name,
                      productImage: prod.product_image || "/placeholder.png",
                      quantity: prod.fulfilled_quantity ?? prod.quantity,
                    }),
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
                              href={`/dashboard/buyer/orders/${item.id}?mode=${buyerStatus}`}
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
                            <AllOrderMobileActions {...actionProps} />
                          </>
                        ) : isSingleItemOrder ? (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${buyerStatus}`}
                              className="flex flex-col md:flex-row gap-4 items-start  "
                            >
                              {orderItems.map((prod: any) => (
                                <OrderLineItemSummary
                                  key={prod.id}
                                  image={
                                    prod?.product_image || "/placeholder.png"
                                  }
                                  imageAlt={
                                    prod.product_name || "Product Image"
                                  }
                                  productName={prod.product_name}
                                  sellerName={
                                    item.manufacturer || item.seller_name
                                  }
                                  details={
                                    <>
                                      {prod.fulfilled_quantity ?? prod.quantity}
                                      Pc, {prod.variation_name || prod.product_name}
                                    </>
                                  }
                                  price={
                                    <>
                                      ₦
                                      {(
                                        (prod.price_at_purchase || 0) *
                                        (prod.fulfilled_quantity ??
                                          prod.quantity ??
                                          1)
                                      ).toLocaleString()}
                                    </>
                                  }
                                  imageClassName="h-24 w-24 object-cover rounded-lg"
                                  detailsClassName="rounded-c12 bg-000000/4 text-000000/68 py-2 px-4  w-fit font-MontserratSemiBold text-c10  md:text-c12 justify-center flex items-center "
                                />
                              ))}
                            </Link>
                            <AllOrderMobileActions {...actionProps} />
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/buyer/orders/${item.id}?mode=${buyerStatus}`}
                              className="flex gap-4 w-full"
                            >
                              <OrderItemsGridSummary
                                products={previewItems}
                                sellerName={item.manufacturer || item.seller_name}
                                itemCount={itemsCount}
                                totalPrice={totalPrice}
                                desktopImageClassName="w-24 h-24 object-cover rounded-lg"
                                mobileImageClassName="w-24 h-24 object-cover rounded-lg"
                              />
                            </Link>
                            <AllOrderMobileActions {...actionProps} />
                          </>
                        )}
                        <AllOrderDesktopActions {...actionProps} />
                      </div>
                    </motion.div>
                  );
        })}
      </OrdersListView>
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
