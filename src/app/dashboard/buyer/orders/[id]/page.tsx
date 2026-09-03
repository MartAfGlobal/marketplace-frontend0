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
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CancelOrderModal from "@/components/ui/Modals/cancelOrder";
import AdressSkeleton from "@/components/reloadSpinner/addressSkeleton";
import { setShippingAddress } from "@/store/orders/order-slice";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  const { orders } = useSelector((state: any) => state.orders);
  const shippingAddress = useSelector(
    (state: RootState) => state.orders.shippingAddress,
  );

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [cancelOrderOpen, setCancelOrderOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { loading: repaying, sendHttpRequest: repayReq } = useHttp();
  const { loading: confirming, sendHttpRequest: confirmReq } = useHttp();
  const { sendHttpRequest: fetchOrderReq } = useHttp();

  // Resize listener for mobile check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch order details by id from backend
  useEffect(() => {
    if (!id || !token) return;

    // Check if order is already available in redux store
    const existing = orders?.find((o: any) => o.id === id);
    if (existing) {
      setOrder(existing);
    }

    setLoading(true);
    fetchOrderReq({
      requestConfig: {
        url: `/orders/buyer/${id}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res: any) => {
        const orderData = res?.data;
        if (orderData) {
          setOrder(orderData);
          if (orderData.shipping_address_snapshot) {
            dispatch(setShippingAddress(orderData.shipping_address_snapshot));
          }
        }
        setLoading(false);
      },
      errorRes: () => {
        setLoading(false);
      },
    });
  }, [id, token]);

  // Order Number / Order ID resolution
  const orderNumber =
    order?.order_no ||
    order?.order_number ||
    order?.reference ||
    order?.payment_no ||
    order?.id ||
    id;

  // Tracking ID resolution
  const trackingId =
    order?.latest_tracking?.tracking_id ||
    order?.latest_tracking?.tracking_number ||
    order?.latest_tracking?.id ||
    order?.tracking_id ||
    order?.tracking_number ||
    (order?.items?.[0] as any)?.tracking_id ||
    null;

  // Seller Name
  const sellerName =
    order?.manufacturer ||
    order?.seller_name ||
    order?.items?.[0]?.manufacturer_name ||
    order?.current_location?.location?.name ||
    "MartAf Seller";

  // Date Formatting
  const isoDate = order?.created_at;
  const formattedDate = isoDate
    ? new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Delivery Date
  const deliveryDateText =
    order?.estimated_delivery_date ||
    order?.delivery_date ||
    "Pending fulfillment";

  // Address Resolution
  const deliveryAddress =
    order?.shipping_address_snapshot ||
    order?.shipping_info ||
    order?.shipping_address ||
    shippingAddress ||
    (order?.current_location?.source === "buyer"
      ? order?.current_location?.location
      : null) ||
    order?.current_location?.location;

  const recipientName =
    deliveryAddress?.name ||
    deliveryAddress?.fullname ||
    (deliveryAddress?.first_name
      ? `${deliveryAddress.first_name} ${deliveryAddress.last_name || ""}`.trim()
      : "") ||
    (order?.buyer
      ? `${order.buyer.first_name || ""} ${order.buyer.last_name || ""}`.trim()
      : "Valued Customer");

  const recipientPhone =
    deliveryAddress?.phone || order?.buyer?.phone || "+2349065444323";

  const recipientAddress =
    deliveryAddress?.address ||
    deliveryAddress?.address_line_1 ||
    deliveryAddress?.address_line_2 ||
    (deliveryAddress?.city
      ? `${deliveryAddress.city}, ${deliveryAddress.state || ""}`
      : "Standard Shipping Address");

  // Order Items
  const orderItems = order?.items || order?.order_items || [];

  // Payment totals calculation
  const itemsTotal = orderItems.reduce(
    (acc: number, it: any) =>
      acc +
      Number(
        it.total_price ??
          Number(it.price_at_purchase || 0) * Number(it.quantity || 1),
      ),
    0,
  );

  const shippingCost = Number(
    order?.shipping_cost ??
      orderItems.reduce(
        (acc: number, it: any) => acc + Number(it.shipping_share || 0),
        0,
      ),
  );

  const discountAmount = Number(order?.discount_amount ?? 0);
  const subtotal = Number(order?.subtotal ?? itemsTotal);
  const grandTotal = Number(
    order?.total_price ??
      order?.refundable_amount ??
      itemsTotal + shippingCost - discountAmount,
  );

  // Status handling
  const status = (
    order?.status ||
    order?.seller_order_status ||
    "PENDING"
  ).toUpperCase();

  const handleCopy = () => {
    if (!orderNumber) return;
    navigator.clipboard
      .writeText(String(orderNumber))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCopyTracking = () => {
    if (!trackingId) return;
    navigator.clipboard
      .writeText(String(trackingId))
      .then(() => {
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy tracking: ", err);
      });
  };

  const handleTrackOrder = () => {
    router.push(`/dashboard/buyer/orders/tracking/${id}`);
  };

  const handleReturnAndRefund = (returnid: string) => {
    router.push(`/dashboard/buyer/orders/return-refund/${returnid}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelOrderOpen(true);
  };

  const handleConfirmDelivery = (orderId: string) => {
    if (isMobile) {
      router.push(`/dashboard/buyer/orders/confirm-delivery/${orderId}`);
    } else {
      setSelectedOrderId(orderId);
      setOpenConfirmModal(true);
    }
  };

  const executeConfirmDelivery = () => {
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
        setOpenConfirmModal(false);
        router.refresh();
      },
    });
  };

  const handleRepay = (repayOrderId: any) => {
    if (!token) return;
    repayReq({
      requestConfig: {
        url: "/checkout/repay/",
        method: "POST",
        token,
        body: {
          payment_id: repayOrderId,
          order_id: repayOrderId,
          repay_order_id: repayOrderId,
          expected_amount: grandTotal.toFixed(2),
        },
        isAuth: true,
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
        }
      },
    });
  };

  if (loading && !order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-sm font-MontserratMedium text-black/60">
          Loading order details...
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Breadcrumb */}
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
              Order ID {orderNumber}
            </span>
          </nav>
        </motion.div>

        {/* Back and Status Title */}
        <div className="w-full px-6 md:px-15">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-4 mt-4 md:mt-c32"
          >
            <Image
              src={NavBack}
              alt="<"
              width={9}
              height={16.5}
              className="brightness-20 w-2.25 h-[16.5px]"
            />
            <p
              className={`font-MontserratSemiBold text-c16 ${
                status === "CANCELLED"
                  ? "text-ca0202"
                  : status === "DELIVERED"
                    ? "text-2d7565"
                    : "text-161616"
              }`}
            >
              {status === "RECEIVED_AT_HUB" 
                ? "To ship"
                : status === "SHIPPED" 
                  ? "Order on its way"
                  : status === "DELIVERED"
                    ? "Order has been delivered"
                    : status === "AWAITING_PAYMENT"
                      ? "Awaiting payment"
                      : status === "PENDING" || status === "ACCEPTED" || status === "IN_TRANSIT_TO_HUB"
                        ? "Order is being processed"
                        : status === "CANCELLED"
                          ? "Cancelled"
                          : status}
            </p>
          </button>

          {/* Main Card */}
          <div className="md:pt-c32 pt-7 md:pb-c64 md:px-62.5">
            <div className="md:p-c32 md:rounded-2xl md:border border-000000/10">
              {/* Order Meta & Desktop Action Buttons */}
              <div className="flex justify-between space-y-c32">
                <div className="w-full md:max-w-57">
                  <div className="flex md:gap-2 md:mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Order ID: {orderNumber}
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
                    <p>Seller: {sellerName}</p>
                    <p>Order date: {formattedDate || "No date available"}</p>
                    <p>Delivery date: {deliveryDateText}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <p>
                        Tracking ID:{" "}
                        <span className="font-MontserratMedium">
                          {trackingId || "Not assigned yet"}
                        </span>
                      </p>
                      {trackingId && (
                        <button onClick={handleCopyTracking} title="Copy tracking ID">
                          <Image src={Copy} alt="copy" width={14} height={14} />
                        </button>
                      )}
                      {copiedTracking && (
                        <span className="text-green-600 text-c12 font-MontserratMedium">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex flex-col gap-c32 w-full max-w-84">
                  {status === "SHIPPED" && (
                    <>
                      <Button onClick={() => handleConfirmDelivery(order.id)}>
                        Confirm delivery
                      </Button>
                      <Button onClick={handleTrackOrder} variant="secondary">
                        Track order
                      </Button>
                    </>
                  )}

                  {status === "RECEIVED_AT_HUB"  && (
                    <Button onClick={handleTrackOrder} variant="secondary">
                      Track order
                    </Button>
                  )}

                  {status === "PENDING" && (
                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      variant="primary"
                    >
                      Cancel order
                    </Button>
                  )}

                  {status === "DELIVERED" && (
                    <>
                      <Button onClick={() => router.push("/cart")}>
                        Buy again
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/buyer/orders/leave-review/${id}`)
                        }
                        variant="secondary"
                      >
                        Leave a review
                      </Button>
                    </>
                  )}

                  {(status === "AWAITING_PAYMENT" ||
                    status === "AWAITING CONFIRMATION") && (
                    <Button
                      disabled={repaying}
                      onClick={() => handleRepay(order.id)}
                    >
                      {repaying ? <LoadingSpinner /> : "Confirm & pay"}
                    </Button>
                  )}

                  {status === "CANCELLED" && (
                    <Button
                      onClick={() => router.push("/cart")}
                      variant="primary"
                    >
                      Buy again
                    </Button>
                  )}
                </div>
              </div>

              {/* Delivery Address & Payment Method */}
              <div className="flex md:flex-row flex-col space-y-8 justify-between mt-8">
                <div className="w-full md:max-w-57">
                  <div className="flex gap-2 mt-2">
                    <p className="text-sm mb-3 font-MontserratSemiBold">
                      Address for delivery
                    </p>
                  </div>
                  {loading ? (
                    <AdressSkeleton />
                  ) : (
                    <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                      <p>{recipientName}</p>
                      <p>{recipientPhone}</p>
                      <p>{recipientAddress}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full max-w-84">
                  <p className="text-sm font-MontserratSemiBold">
                    Payment method
                  </p>
                  <p>Credit/Debit card</p>
                  <div className="flex justify-between items-center">
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
                      alt="shield check"
                      width={20}
                      height={20}
                    />
                    <p>Secure payments</p>
                  </div>
                  <p className="text-xs opacity-60">
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
              </div>

              {/* Package Details & Summary */}
              <div
                className={`flex flex-col ${
                  status === "DELIVERED"
                    ? "space-y-8 md:space-y-12"
                    : "md:flex-row md:justify-between space-y-8 md:space-y-0"
                } mt-8 md:mt-c64`}
              >
                <p className="text-sm font-MontserratSemiBold md:hidden">
                  Package details
                </p>

                {/* Items List */}
                <div
                  className={`w-full ${
                    status === "DELIVERED" ? "md:w-full" : "md:max-w-74"
                  }`}
                >
                  <div className="w-full">
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
                      {orderItems.map((item: any) => {
                        const productImage =
                          item.product_image ||
                          item.image ||
                          item.product?.image ||
                          item.product?.thumbnail ||
                          "/placeholder.png";

                        const productName =
                          item.product_name ||
                          item.name ||
                          item.product?.name ||
                          "Product";

                        const productSlug =
                          item.product_slug ||
                          item.product?.slug ||
                          item.slug ||
                          "";

                        const itemVariation =
                          item.variation_name ||
                          item.variation_display ||
                          (item.attributes
                            ? Object.values(item.attributes)
                                .map((a: any) => a.value || a.slug)
                                .join(" / ")
                            : "") ||
                          productName;

                        const itemPrice = Number(
                          item.total_price ??
                            Number(item.price_at_purchase || item.unit_price || 0) *
                              Number(item.quantity || 1),
                        );

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center justify-between gap-4 w-full"
                          >
                            <Link
                              href={{
                                pathname: `/product/${productSlug || "item"}`,
                                query: item.variation
                                  ? { variationId: item.variation }
                                  : undefined,
                              }}
                              className="flex items-center md:items-start gap-4 flex-1 min-w-0"
                            >
                              <div className="flex gap-4 items-center md:items-start min-w-0">
                                <Image
                                  src={productImage}
                                  alt={productName}
                                  width={100}
                                  height={100}
                                  className="hidden md:flex rounded-lg object-cover w-24 h-24 shrink-0"
                                />
                                <Image
                                  src={productImage}
                                  alt={productName}
                                  width={64}
                                  height={64}
                                  className="md:hidden rounded-lg object-cover w-16 h-16 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="md:font-MontserratSemiBold text-c12 font-MontserratNormal md:text-sm leading-c24 pb-3 text-000000 truncate">
                                    {productName}
                                  </p>

                                  <div className="w-fit p-2 justify-center md:text-nowrap rounded-c12 bg-black/3 flex items-center">
                                    <span className="text-black opacity-32 font-MontserratSemiBold text-c12">
                                      {item.quantity}PC, {itemVariation}
                                    </span>
                                  </div>
                                  <p className="font-MontserratSemiBold text-sm flex md:text-c18 pt-3 leading-6.5">
                                    ₦{itemPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {status === "DELIVERED" &&
                              item.status !== "PENDING" && (
                                <Button
                                  onClick={() => handleReturnAndRefund(item.id)}
                                  variant="secondary"
                                  className="w-36 md:w-47.5 shrink-0 whitespace-nowrap"
                                >
                                  Return/Refund
                                </Button>
                              )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>

                {/* Payment Details Column */}
                <div className="w-full max-w-84.25">
                  <p className="font-MontserratSemiBold text-sm leading-c24 pb-3 text-000000">
                    Payment details
                  </p>
                  <div className="md:space-y-3 space-y-2 md:mt-3 mb-4 border-b pb-4 border-000000/4">
                    <p className="text-c12 font-MontserratNormal md:text-sm md:font-MontserratSemiBold text-000000">
                      Total
                    </p>
                    <p className="font-MontserratSemiBold text-c20 md:text-c32">
                      ₦{grandTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="font-MontserratNormal text-sm text-000000 space-y-2">
                    <div className="flex justify-between">
                      <p className="tex-c12 font-MontserratNormal md:text-sm md:font-MontserratSemiBold">
                        Total items
                      </p>
                      <p>₦{itemsTotal.toLocaleString()}</p>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <p>Discounts</p>
                        <p>-₦{discountAmount.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-4 border-000000/4">
                      <p>Subtotal</p>
                      <p>₦{subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="font-MontserratNormal text-left text-sm mt-c24 text-000000 space-y-2">
                    <div className="flex justify-between border-b pb-4 border-000000/4">
                      <p>Shipping fee</p>
                      <p>₦{shippingCost.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between font-MontserratNormal ">
                      <p>Order total</p>
                      <p>₦{grandTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More to Love section */}
          <div className="py-c32 pb-35 md:pb-0">
            <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
              More to love
            </p>
          </div>
        </div>

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
          <div className="flex gap-4 items-center justify-center w-full text-c12 font-MontserratSemiBold">
            {status === "SHIPPED" && (
              <>
                <Button onClick={handleTrackOrder} variant="secondary">
                  Track order
                </Button>
                <Button
                  onClick={() => handleConfirmDelivery(order.id)}
                  variant="primary"
                >
                  Confirm delivery
                </Button>
              </>
            )}

            {status === "RECEIVED_AT_HUB" && (
              <Button onClick={handleTrackOrder} variant="secondary">
                Track order
              </Button>
            )}

            {status === "PENDING"  && (
              <Button
                onClick={() => handleCancelOrder(order.id)}
                variant="primary"
              >
                Cancel order
              </Button>
            )}

            {status === "DELIVERED" && (
              <>
                <Button onClick={() => router.push("/cart")}>
                  Buy again
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/buyer/orders/leave-review/${id}`)
                  }
                  variant="secondary"
                >
                  Leave a review
                </Button>
              </>
            )}

            {(status === "AWAITING_PAYMENT" ||
              status === "AWAITING CONFIRMATION") && (
              <Button
                disabled={repaying}
                onClick={() => handleRepay(order.id)}
              >
                {repaying ? <LoadingSpinner /> : "Confirm & pay"}
              </Button>
            )}

            {status === "CANCELLED" && (
              <Button onClick={() => router.push("/cart")} variant="primary">
                Buy again
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        title="Did you receive this package?"
        description="Confirming helps us complete your order and improve service."
        onNo={() => setOpenConfirmModal(false)}
        onYes={executeConfirmDelivery}
      />

      <CancelOrderModal
        isDispute={false}
        isOpen={cancelOrderOpen}
        orderId={selectedOrderId}
        onClose={() => setCancelOrderOpen(false)}
      />
    </>
  );
}
