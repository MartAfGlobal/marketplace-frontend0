"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button/Button";
import SpeedOf from "@/assets/icons/speedof.png";
import Copy from "@/assets/icons/Copy.png";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import NavBack from "@/assets/icons/navBacksmall.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { setTrackingData } from "@/store/orders/tracking-slice";
import OrderItemSummary from "@/components/ui/buyer-components/orders/order-item-summary";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatStatus(status: string | undefined): string {
  if (!status) return "-";
  const map: Record<string, string> = {
    IN_TRANSIT_TO_HUB: "In transit to hub",
    RECEIVED_AT_HUB: "Received at hub",
    SHIPPED_TO_BUYER: "Shipped to buyer",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    FULFILLED: "Fulfilled",
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    PROCESSING: "Processing",
    PROCESSED: "Processed",
    CANCELLED: "Cancelled",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

function fmt(iso: string | null | undefined) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return null;
  }
}

// ─── component ──────────────────────────────────────────────────────────────

export default function TrackingDetail() {
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedTrackNo, setCopiedTrackNo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { trackingid } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest, loading } = useHttp();

  // ── mobile detection ──
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── data fetch ──
  useEffect(() => {
    if (!token || !trackingid) return;

    const rawId = String(trackingid).trim();

    // 1. Fetch order details from /orders/{id}/
    sendHttpRequest({
      requestConfig: {
        url: `/orders/${encodeURIComponent(rawId)}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (orderRes) => {
        const orderDetail = orderRes.data ?? orderRes;
        dispatch(setTrackingData(orderDetail));

        // 2. Use tracking_number to call /orders/{tracking_number}/track/
        const trackingNumber =
          orderDetail?.tracking_number ||
          orderDetail?.seller_tracking_id_to_hub ||
          orderDetail?.tracking_no;

        if (trackingNumber) {
          sendHttpRequest({
            requestConfig: {
              url: `/orders/${encodeURIComponent(String(trackingNumber).trim())}/track/`,
              method: "GET",
              token,
              isAuth: true,
              userType: "buyer",
            },
            successRes: (trackRes) => {
              const trackDetail = trackRes.data ?? trackRes;
              dispatch(
                setTrackingData({
                  ...orderDetail,
                  ...trackDetail,
                  // Ensure original tracking_number and order_id are preserved
                  tracking_number: trackingNumber,
                  order_id: orderDetail?.order_id || trackDetail?.order_id,
                })
              );
            },
            errorRes: (err) => {
              console.warn(
                "Could not fetch tracking events by tracking_number:",
                trackingNumber,
                err
              );
            },
          });
        }
      },
      errorRes: () => {
        // Fallback: in case trackingid itself was already a tracking_number
        sendHttpRequest({
          requestConfig: {
            url: `/orders/${encodeURIComponent(rawId)}/track/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "buyer",
          },
          successRes: (trackRes) => {
            const trackDetail = trackRes.data ?? trackRes;
            dispatch(setTrackingData(trackDetail));
          },
          errorRes: (err) => {
            console.error("Order tracking fetch failed:", err);
          },
        });
      },
    });
  }, [token, trackingid, dispatch]);

  const trackingData = useSelector((state: any) => state.tracking.trackingData);

  // Address
  const shippingAddress =
    typeof trackingData?.shipping_address === "object" &&
    trackingData?.shipping_address !== null
      ? trackingData.shipping_address
      : null;

  // Items
  const orderItems: any[] =
    trackingData?.order_items ?? trackingData?.items ?? [];

  // Active tracking number
  const trackingNumber =
    trackingData?.tracking_number ||
    trackingData?.seller_tracking_id_to_hub ||
    trackingData?.tracking_no ||
    "";

  // Display Order ID
  const displayOrderId =
    trackingData?.order_id ||
    trackingData?.payment_no ||
    (trackingid ? String(trackingid) : "-");

  // Dates
  const formattedCreatedAt = fmt(trackingData?.created_at);
  const formattedUpdatedAt = fmt(trackingData?.updated_at);

  // Estimated delivery range
  const deliveryDates = useMemo(() => {
    const baseDate = trackingData?.created_at
      ? new Date(trackingData.created_at)
      : new Date();

    const start = new Date(baseDate);
    start.setDate(start.getDate() + 3);

    const end = new Date(baseDate);
    end.setDate(end.getDate() + 7);

    return {
      startDay: start.getDate(),
      startMonthYear: start.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
      endDay: end.getDate(),
      endMonthYear: end.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
    };
  }, [trackingData?.created_at]);

interface TimelineStep {
  title: string;
  description?: string;
  time?: string | null;
  active?: boolean;
}

  // Derived timeline steps
  const timelineSteps = useMemo<TimelineStep[]>(() => {
    const steps: TimelineStep[] = [];

    // Check for explicit backend tracking history array
    const backendEvents =
      (Array.isArray(trackingData?.trackings) && trackingData.trackings) ||
      (Array.isArray(trackingData?.tracking_events) && trackingData.tracking_events) ||
      (Array.isArray(trackingData?.tracking_updates) && trackingData.tracking_updates) ||
      (Array.isArray(trackingData?.events) && trackingData.events) ||
      null;

    if (backendEvents && backendEvents.length > 0) {
      return backendEvents.map((evt: any, idx: number): TimelineStep => ({
        title: evt.status ? formatStatus(evt.status) : evt.title || "Tracking update",
        description: evt.comments || evt.notes || evt.location || evt.description,
        time: fmt(evt.created_at || evt.timestamp || evt.date),
        active: idx === 0,
      }));
    }

    const currentStatus = String(trackingData?.status || "").toUpperCase();

    // 1. Current Seller Notes / Update
    if (trackingData?.seller_tracking_notes) {
      steps.push({
        title: `Seller update: "${trackingData.seller_tracking_notes}"`,
        description: trackingNumber ? `Tracking No: ${trackingNumber}` : undefined,
        time: formattedUpdatedAt,
        active: true,
      });
    }

    // 2. Current Status
    if (trackingData?.status) {
      steps.push({
        title: `Order status: ${formatStatus(trackingData.status)}`,
        description: trackingData?.warehouse?.name
          ? `Hub: ${trackingData.warehouse.name}`
          : undefined,
        time: formattedUpdatedAt,
        active: !trackingData?.seller_tracking_notes,
      });
    }

    // 3. Shipped / In transit
    if (
      currentStatus.includes("TRANSIT") ||
      currentStatus.includes("SHIP") ||
      currentStatus.includes("HUB") ||
      currentStatus.includes("DELIVER") ||
      trackingNumber
    ) {
      steps.push({
        title: "Order Shipped by Seller",
        description: trackingNumber ? `Tracking: ${trackingNumber}` : undefined,
        time: formattedUpdatedAt || formattedCreatedAt,
      });
    }

    // 4. Warehouse preparation
    if (trackingData?.warehouse?.name) {
      steps.push({
        title: "Order routed to Hub",
        description: `Destination: ${trackingData.warehouse.name}`,
        time: formattedCreatedAt,
      });
    }

    // 5. Payment completed
    steps.push({
      title: "Order Paid Successfully",
      description: trackingData?.payment_no ? `Payment No: ${trackingData.payment_no}` : undefined,
      time: formattedCreatedAt,
    });

    // 6. Placed
    steps.push({
      title: "Order Placed",
      description: `Order ID: ${displayOrderId}`,
      time: formattedCreatedAt,
    });

    return steps;
  }, [trackingData, trackingNumber, formattedUpdatedAt, formattedCreatedAt, displayOrderId]);

  // Copy helpers
  const handleCopyOrder = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 1500);
    });
  };

  const handleCopyTrack = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTrackNo(true);
      setTimeout(() => setCopiedTrackNo(false), 1500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pl-c56 hidden pt-c20 z-40 md:flex items-center w-full"
        style={{ top: "4rem" }}
      >
        <nav aria-label="breadcrumb" className="flex h-c32 w-full items-center gap-2">
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">Home</Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link href="/dashboard/buyer" className="opacity-30 font-MontserratMedium text-c12">Account</Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <Link href="/dashboard/buyer/orders" className="opacity-30 font-MontserratMedium text-c12">Orders</Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratSemiBold text-c12 text-1a1a1a">Tracking</span>
        </nav>
      </motion.div>

      <div className="w-full px-6 md:px-15">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mt-4 md:mt-c32 cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src={NavBack} alt="<" width={9} height={16.5} className="brightness-20 w-2.25 h-[16.5px]" />
          <p className="font-MontserratSemiBold hidden md:flex text-c16 text-161616">Order tracking</p>
          <p className="font-MontserratSemiBold md:hidden text-c16 text-161616">Track order</p>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:pt-c32 md:pb-c64 md:px-62.5"
        >
          <div className="py-7 md:py-c32">
            <div className="md:flex md:justify-between md:border-b border-b-000000/20 space-y-c32 md:space-y-0">

              {/* ── Left Column: Delivery & Shipping ── */}
              <div className="w-full md:max-w-84.25">
                <p className="text-sm mb-6 font-MontserratSemiBold">Delivery</p>

                {/* Estimated Delivery Dates */}
                <div className="flex gap-4 items-center text-6a0dad">
                  <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                    <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">
                      {deliveryDates.startDay}
                    </p>
                    <p className="text-c12 font-MontserratSemiBold">
                      {deliveryDates.startMonthYear}
                    </p>
                  </div>
                  <p className="font-MontserratNormal text-sm text-000000">-</p>
                  <div className="md:max-w-20.25 w-full max-w-16.25 h-fit flex items-center gap-1">
                    <p className="md:text-5xl md:font-MontserratBold font-MontserratSemiBold text-c32">
                      {deliveryDates.endDay}
                    </p>
                    <p className="text-c12 font-MontserratSemiBold">
                      {deliveryDates.endMonthYear}
                    </p>
                  </div>
                </div>

                {/* Shipping Method / Speed Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <Image
                    src={SpeedOf}
                    alt="speed of"
                    width={82.96}
                    height={26.76}
                    className="w-16 h-[20.65px] md:w-[82.96px] md:h-[26.76px]"
                  />
                  {trackingData?.shipping_method && (
                    <span className="text-c12 font-MontserratSemiBold text-000000/60 uppercase tracking-wide">
                      {trackingData.shipping_method}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                {trackingData?.status && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-6a0dad/10 text-6a0dad text-c12 font-MontserratSemiBold">
                      {formatStatus(trackingData.status)}
                    </span>
                  </div>
                )}

                {/* Order ID */}
                <div className="flex gap-2 mt-4 items-center">
                  <p className="text-sm font-MontserratNormal">
                    Order ID:{" "}
                    <span className="text-c12 font-MontserratSemiBold">
                      {displayOrderId}
                    </span>
                  </p>
                  <button
                    onClick={() => handleCopyOrder(displayOrderId)}
                    className="cursor-pointer hover:opacity-75"
                    aria-label="Copy order ID"
                  >
                    <Image src={Copy} alt="copy" width={12} height={12} />
                  </button>
                  {copiedOrderId && (
                    <span className="text-green-600 text-c12 font-MontserratMedium">Copied!</span>
                  )}
                </div>

                {/* Tracking Number */}
                <div className="flex gap-2 mt-2 md:items-center pb-6 border-b border-b-000000/5">
                  <p className="md:text-sm font-MontserratNormal text-c12">
                    Tracking number:{" "}
                    <span className="text-c12 font-MontserratSemiBold">
                      {trackingNumber || "-"}
                    </span>
                  </p>
                  {trackingNumber && (
                    <button
                      onClick={() => handleCopyTrack(trackingNumber)}
                      className="flex items-center justify-center cursor-pointer hover:opacity-75"
                      aria-label="Copy tracking number"
                    >
                      <Image src={Copy} alt="copy" width={12} height={12} />
                    </button>
                  )}
                  {copiedTrackNo && (
                    <span className="text-green-600 text-c12 font-MontserratMedium">Copied!</span>
                  )}
                </div>

                {/* Seller tracking notes */}
                {trackingData?.seller_tracking_notes && (
                  <div className="mt-3 pb-4 border-b border-b-000000/5">
                    <p className="text-c12 font-MontserratMedium text-000000/50">Seller Notes:</p>
                    <p className="text-c12 font-MontserratNormal text-000000/80 italic mt-0.5">
                      "{trackingData.seller_tracking_notes}"
                    </p>
                  </div>
                )}

                {/* Hub / Warehouse */}
                {trackingData?.warehouse?.name && (
                  <div className="mt-3 pb-4 border-b border-b-000000/5">
                    <p className="text-c12 font-MontserratNormal">
                      Hub:{" "}
                      <span className="font-MontserratSemiBold">
                        {trackingData.warehouse.name}
                      </span>
                    </p>
                  </div>
                )}

                {/* Address for Delivery */}
                <div className="font-MontserratNormal pt-c24 text-sm text-000000 border-b pb-6 border-b-000000/5">
                  <p className="text-sm md:mb-4 mb-3 font-MontserratSemiBold">
                    Address for delivery
                  </p>
                  {shippingAddress ? (
                    <div className="space-y-1 text-000000/80">
                      {(shippingAddress.first_name || shippingAddress.last_name) && (
                        <p className="font-MontserratSemiBold text-000000">
                          {shippingAddress.first_name} {shippingAddress.last_name}
                        </p>
                      )}
                      {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
                      {shippingAddress.address && <p>{shippingAddress.address}</p>}
                      {(shippingAddress.city || shippingAddress.state) && (
                        <p>
                          {[shippingAddress.city, shippingAddress.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {shippingAddress.country && <p>{shippingAddress.country}</p>}
                    </div>
                  ) : (
                    <p className="text-000000/40 text-c12">No delivery address found</p>
                  )}
                </div>
              </div>

              {/* ── Right Column: Package Details ── */}
              <div className="md:max-w-74 w-full overflow-y-auto custom-scroll mb-c32 h-fit md:max-h-105.5 md:pr-7.5">
                <p className="text-sm font-MontserratSemiBold mb-6">Package details</p>
                <div className="flex justify-between overflow-y-auto custom-scroll h-fit max-h-54">
                  <OrderItemSummary orderItems={orderItems} />
                </div>
              </div>

            </div>

            {/* ── Bottom Section: Tracking Timeline ── */}
            <div className="w-full pt-c32 text-sm font-MontserratSemiBold text-000000">
              <h1>Tracking details</h1>
            </div>

            <div className="relative pl-6 mt-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-000000/15">
              {timelineSteps.map((step: TimelineStep, idx: number) => {
                const isLatest = idx === 0;
                return (
                  <div key={idx} className="relative flex flex-col gap-1">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white ${
                        isLatest ? "bg-6a0dad ring-4 ring-6a0dad/20" : "bg-000000/20"
                      }`}
                    />
                    <p
                      className={`text-sm font-MontserratSemiBold ${
                        isLatest ? "text-161616" : "text-000000/70"
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-c12 font-MontserratNormal text-000000/70">
                        {step.description}
                      </p>
                    )}
                    {step.time && (
                      <p className="text-c12 font-MontserratNormal text-000000/50">
                        {step.time}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>

        {/* More to love placeholder */}
        <div className="py-c32">
          <p className="font-MontserratNormal text-c18 text-161616 mb-c32">More to love</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5" />
        </div>
      </div>
    </motion.div>
  );
}
