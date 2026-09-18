"use client";

import Image from "next/image";
import Icon1 from "@/assets/icons/user-dashboard/orderHistory/icon1.svg";
import Icon2 from "@/assets/icons/user-dashboard/orderHistory/icon2.png";
import Icon3 from "@/assets/icons/user-dashboard/orderHistory/icon3.png";
import Icon4 from "@/assets/icons/user-dashboard/orderHistory/icon4.png";

import { useEffect, useState } from "react";
import { OrderHistoryItem, OrderItem } from "@/types/global";

import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import OrderEditAddressModal from "@/components/ui/Modals/orders/edit-address-order-modal";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";
import CartWithBoxesIcon from "@/components/ui/buyer-components/orders/CartWithBoxesIcon";
import AddCartModal from "@/components/ui/Modals/addToCart/addTocart-modal";
import { toast } from "sonner";
import { addOrderItemToCart } from "@/utils/addOrderItemToCart";
import { getBuyerOrderTrackingPath } from "@/utils/buyerOrderTracking";

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: any) => state.orders);

  const [open, setOpen] = useState(false);
   const { loading: confirming, sendHttpRequest: confirmReq } = useHttp();
  const [cancelOrderOpen, setCancelOrderOpen] = useState(false);
  const { fetchOrders } = useFetchOrders();

  const [loadingIds, setLoadingIds] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
const [itemId, setItemId] = useState("")
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [selectedVariationId, setSelectedVariationId] = useState("");

  const token: string | undefined = useSelector(
    (state: RootState) => state.token?.token ?? undefined,
  );

  // const token = useSelector((state: any) => state.token?.token);
  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();
  const { sendHttpRequest: cancelReq } = useHttp();
  const { sendHttpRequest: addToCartReq } = useHttp();

  const router = useRouter();

  const totalToShip = orders.filter(
    (order: OrderItem) => order.buyer_status === "Processing",
  ).length;
  const totalShipped = orders.filter(
    (order: OrderItem) => order.buyer_status === "Shipped",
  ).length;
  const totalDelivered = orders.filter(
    (order: OrderItem) => order.buyer_status === "Delivered",
  ).length;
  const totalAwaitingPayment = orders.filter(
    (order: OrderItem) => order.buyer_status === "AWAITING_PAYMENT",
  ).length;
  const totalCancelled = orders.filter(
    (order: OrderItem) => order.buyer_status === "Cancelled",
  ).length;

  const isAwaitingPayment = (order: OrderItem) =>
    [
      "AWAITING_PAYMENT",
      "Awaiting Payment",
      "awaiting_payment",
      "PENDING_PAYMENT",
    ].includes(order.status);

  // Filter for actual placed orders (excluding unpaid awaiting payment sessions)
  const placedOrders = orders.filter(
    (order: OrderItem) => !isAwaitingPayment(order),
  );

  // Sort newest first by creation date
  const sortedOrders = (placedOrders.length > 0 ? placedOrders : orders)
    .slice()
    .sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
      const dateB = new Date(b.created_at || b.updated_at || 0).getTime();
      return dateB - dateA;
    });

  const lastOrders = sortedOrders.slice(0, 2);

  const [isOpen, setIsOpen] = useState(false);

  const handleTrackOrder = (orderId: string) => {
    router.push(getBuyerOrderTrackingPath(orderId));
  };

  const Orderahistory: OrderHistoryItem[] = [
    {
      title: "Unpaid",
      icon: Icon1,
      total: totalAwaitingPayment,
    },
    {
      title: "To be shipped",
      icon: Icon2,
      total: totalToShip,
    },
    {
      title: "Shipped",
      icon: Icon3,
      total: totalShipped,
    },
    {
      title: "Awaiting review",
      icon: Icon4,
      total: totalDelivered,
    },
  ];

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  const handleEditAddress = (id: string) => {
    setSelectedId(id);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      router.push(`/dashboard/buyer/orders/edit-address/${id}`);
    } else {
      setTimeout(() => setAddressOpen(true), 1);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setSelectedId(orderId);
    setCancelOrderOpen(true);
  };

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${id}`);
    } else {
      setItemId(id)
      setOpen(true);

    }
  };
    const executeConfirmDelivery = (id:string) => {
    if (!token || !id) return;
    confirmReq({
      requestConfig: {
        url: `/orders/buyer/${id}/confirm-delivery/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Delivery confirmed successfully!",
      },
      successRes: () => {
        setOpen(false);
        router.refresh();
      },
    });
  }

  const handleReview = (id: string) => {
    router.push(`/dashboard/buyer/orders/leave-review/${id}`);
  };

  const handleAddToCart = (slug: string, varId?: string) => {
    if (!slug) {
      toast.error("Product information not available");
      return;
    }

    const mobileCheck =
      isMobile ||
      (typeof window !== "undefined" &&
        (window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)));

    if (mobileCheck) {
      const url = varId
        ? `/product/${slug}?variationId=${encodeURIComponent(varId)}`
        : `/product/${slug}`;
      router.push(url);
    } else {
      setSelectedProductSlug(slug);
      setSelectedVariationId(varId || "");
      setAddToCartOpen(true);
    }
  };

  const handleAddOrderItemToCart = async (item: any) => {
    await addOrderItemToCart(addToCartReq, token, item, dispatch);
  };

  const handleRepay = (repay_order_id: any) => {
    console.log("checking item to pay", repay_order_id);
    setSelectedId(repay_order_id);
    repayReq({
      requestConfig: {
        url: "/checkout/repay/",
        method: "POST",
        token,
        body: {
          payment_id: repay_order_id,
          order_id: repay_order_id,
          repay_order_id: repay_order_id,
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

  return (
    <div className="space-y-c24">
      <div className="flex justify-between">
        <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
          Orders
        </p>
        {orders.length > 0 && (
          <Link
            href="/dashboard/buyer/orders"
            className="font-MontserratSemiBold text-ff715b text-sm leading-c20"
          >
            view all
          </Link>
        )}
      </div>
      <div className="flex gap-8 w-full overflow-x-auto py-4   xl:gap-c32">
        {Orderahistory.map((item) => (
          <div key={item.title} className="h-fit w-fit relative  ">
            <div className="w-37.5 h-31.25 flex flex-col items-center justify-center gap-4 border border-ff715b rounded-c4 opacity-60">
              <Image
                src={item.icon}
                alt={item.title}
                width={30}
                height={30}
                className="h-7.5 w-7.5"
              />
              <p>{item.title}</p>
            </div>
            {item.total > 0 && (
              <div className="absolute -right-4 -top-3 w-10.25 h-10.25 rounded-full flex items-center justify-center bg-f50000 opacity-60">
                <p className="font-MontserratSemiBold text-base leading-c24 text-ffffff">
                  {item.total}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {lastOrders.length > 0 ? (
        <div className="w-full">
          <div className="flex justify-between">
            <h1 className="text-sm font-MontserratSemiBold leading-6.5 text-000000 opacity-32">
              Last orders
            </h1>
            {/* {orders.length > 0 && (
              <Link
                href="/dashboard/buyer/orders"
                className="font-MontserratSemiBold text-ff715b text-sm leading-c20"
              >
                view all
              </Link>
            )} */}
          </div>
          <div className="w-full space-y-c24 mt-c32">
            {lastOrders.map((item: OrderItem) => {
              const orderItems = item.order_items || (item as any).items || [];
              const hasOrderItems = orderItems.length > 0;
              const firstItem = orderItems[0] as any;
              const productImage =
                firstItem?.product_image ||
                firstItem?.image ||
                firstItem?.product?.image ||
                null;
              const productName =
                firstItem?.product_name ||
                firstItem?.name ||
                firstItem?.product?.name ||
                (item.order_no || (item as any).payment_no
                  ? `Order #${item.order_no || (item as any).payment_no}`
                  : "Order");
              const sellerName =
                item.manufacturer ||
                item.seller_name ||
                (item as any).seller?.store_name ||
                "";
              const variationName =
                firstItem?.variation_name || firstItem?.variation_display || "";
              const totalPrice =
                item.total_price ??
                (item as any).total ??
                (item as any).subtotal ??
                0;
              const itemsCount =
                (item as any).items_count ??
                (hasOrderItems ? orderItems.length : 1);
              const productSlug =
                firstItem?.product_slug ||
                firstItem?.product?.slug ||
                firstItem?.slug ||
                (firstItem?.product_name
                  ? firstItem.product_name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-")
                  : "");
              const variationId =
                (typeof firstItem?.variation === "string"
                  ? firstItem.variation
                  : firstItem?.variation?.id) ||
                firstItem?.variation_id ||
                firstItem?.variant_id ||
                (typeof firstItem?.product === "string"
                  ? firstItem.product
                  : "") ||
                "";

              return (
                <div key={item.id}>
                  <div className="w-full flex justify-between mb-c32">
                    <p
                      className={`font-MontserratSemiBold text-c16  ${
                        item.buyer_status === "CANCELLED"
                          ? "text-ca0202"
                          : item.buyer_status === "DELIVERED"
                            ? "text-2d7565"
                            : "text-161616"
                      }`}
                    >
                      {item.buyer_status === "RECEIVED_AT_HUB"
                        ? "Received at Central hub"
                        : item.buyer_status === "Shipped"
                          ? "Order on its way"
                          : item.buyer_status === "DELIVERED"
                            ? "Delivered"
                            : item.buyer_status === "Confirmed"
                              ? "Delivered"
                              : item.buyer_status === "AWAITING_PAYMENT"
                                ? "Awaiting payment"
                                : item.buyer_status === "PENDING" ||
                                    item.buyer_status === "ACCEPTED" ||
                                    item.buyer_status === "IN_TRANSIT_TO_HUB"
                                  ? "Order is being processed"
                                  : item.buyer_status === "CANCELLED"
                                    ? "Cancelled"
                                    : item.buyer_status}
                    </p>
                    <p className="text-c12 font-MontserratNormal leading-4 text-000000">
                      {item.estimated_delivery_date ||
                        (item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "pending")}
                    </p>
                  </div>
                  <div className="w-full justify-between flex">
                    <Link
                      href={`/dashboard/buyer/orders/${item.id}`}
                      className="flex flex-col md:flex-row gap-4 items-start  "
                    >
                      <div className="flex gap-4 items-start">
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={productName}
                            width={96}
                            height={96}
                            className="rounded-lg h-24 w-24 object-cover"
                          />
                        ) : (
                          <CartWithBoxesIcon
                            className="h-24 w-24"
                            itemsCount={itemsCount}
                          />
                        )}

                        <div className="w-full max-w-143.75">
                          <p className="font-MontserratSemiBold text-base leading-c24 pb-1 text-000000">
                            {productName}
                          </p>
                          {sellerName && (
                            <p className="font-MontserratMedium text-c12 leading-c16 pb-3 text-000000">
                              {sellerName}
                            </p>
                          )}
                          <div className="w-fit p-2 justify-center rounded-c12 bg-black/3 flex items-center">
                            <span className="text-black opacity-32 font-MontserratSemiBold text-c12 ">
                              {itemsCount}PC
                              {variationName ? `, ${variationName}` : ""}
                            </span>
                          </div>
                          <p className="font-MontserratSemiBold text-c16 pt-3 leading-6.5">
                            ₦{Number(totalPrice).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="w-full gap-4 pl hidden  md:flex md:flex-col md:max-w-50 xl:max-w-70 space-y-4">
                      {item.buyer_status === "Shipped" && (
                        <>
                          <Button onClick={() => handleClick(item.id)}>
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

                      {item.buyer_status === "Shipped" && (
                        <>
                          {/* <Button
                          onClick={() => handleEditAddress(item.id)}
                          variant="secondary"
                          className=""
                        >
                          Edit address
                        </Button> */}

                         
                        </>
                      )}
                      {item.buyer_status === "PENDING" && item.can_cancel && (
                        <>
                          {/* <Button
                          onClick={() => handleEditAddress(item.id)}
                          variant="secondary"
                          className=""
                        >
                          Edit address
                        </Button> */}
                          <Button
                            onClick={() => handleCancelOrder(item.id)}
                            variant="primary"
                          >
                            Cancel order
                          </Button>
                        </>
                      )}

                      {(item.buyer_status === "Delivered" ||
                        item.buyer_status === "Confirmed") && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddOrderItemToCart(item);
                            }}
                            className=""
                          >
                            Add to cart
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReview(item.id);
                            }}
                            className=""
                          >
                            Leave a review
                          </Button>
                        </>
                      )}

                      {(item.buyer_status === "Awaiting Confirmation" ||
                        item.buyer_status === "Processing" ||
                        item.buyer_status === "AWAITING_PAYMENT") && (
                        <>
                          {/* <Button
                          onClick={() => handleEditAddress(item.id)}
                          variant="secondary"
                          className=""
                        >
                          Edit address
                        </Button> */}
                          <Button
                            disabled={repaying}
                            onClick={() => {
                              handleRepay(item.id);
                            }}
                            className=""
                          >
                            {repaying ? <LoadingSpinner /> : "Confirm & pay"}
                          </Button>
                        </>
                      )}

                      {/* Default fallback (optional)
                          {![
                            "Shipped",
                            "To Ship",
                            "Delivered",
                            "AWAITING_PAYMENT",
                          ].includes(item.buyer_status) && (
                            <Button variant="secondary" className="">
                              View details
                            </Button>
                          )} */}
                    </div>
                    {/* Mobile action buttons */}
                    <div className="w-full gap-3 flex flex-row-reverse md:hidden mt-4">
                      {(item.buyer_status === "Delivered" ||
                        item.buyer_status === "Confirmed") && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddOrderItemToCart(item);
                            }}
                            className="flex-1 text-xs py-2 h-9"
                          >
                            Add to cart
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReview(item.id);
                            }}
                            className="flex-1 text-xs py-2 h-9"
                          >
                            Leave a review
                          </Button>
                        </>
                      )}
                      {item.buyer_status === "Shipped" && (
                        <>
                          <Button
                            onClick={() => handleClick(item.id)}
                            className="flex-1 text-xs py-2 h-9"
                          >
                            Confirm delivery
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleTrackOrder(item.id)}
                            className="flex-1 text-xs py-2 h-9"
                          >
                            Track order
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-40 flex justify-center items-center flex-col gap-4">
          <h1 className="text-sm font-MontserratSemiBold leading-6.5 text-000000 opacity-32">
            No orders yet
          </h1>

          <p className="text-sm font-MontserratNormal text-000000 opacity-20">
            When you place an order, it will appear here.
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={open}
        loading= {confirming}
        onClose={() => setOpen(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onYes={() => executeConfirmDelivery(itemId)}
        onNo={() => console.log("Cancelled")}
        yesText="Yes"
        noText="Cancel"
        className="w-full max-w-106.5 text-center"
      />
      {/* <OrderEditAddressModal
        onClose={() => setAddressOpen(false)}
        isOpen={addressOpen}
        id={selectedId}
      /> */}
      <CancelOrderModal
        isDispute={false}
        isOpen={cancelOrderOpen}
        orderId={selectedId}
        onClose={() => setCancelOrderOpen(false)}
      />
      <AddCartModal
        isOpen={addToCartOpen}
        onClose={() => setAddToCartOpen(false)}
        productSlug={selectedProductSlug}
        selectedVariationId={selectedVariationId}
      />
    </div>
  );
}
