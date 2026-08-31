"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  Check,
  Hourglass,
  Truck,
  BarChart3,
  Plane,
  Home,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react";
import Image from "next/image";
import CopyIcon from "@/assets/icons/copy.svg";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import OrderPartyDetails from "@/components/admin-components/orders/OrderPartyDetails";
import OrderItemsAndSummary from "@/components/admin-components/orders/OrderItemsAndSummary";
import OrderProgressBar, {
  getProgressIndex,
} from "@/components/admin-components/orders/OrderProgressBar";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";

/* ─────────────── helpers ─────────────── */
function formatCurrency(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) return "₦0.00";
  return `₦${Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCurrencyShort(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) return "₦0";
  return `₦${Number(val).toLocaleString()}`;
}

function formatStatusText(str: string) {
  if (!str) return "Unprocessed";
  const formatted = str.replace(/_/g, " ").toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const TRACKING_STATUSES = [
  "Order Placed",
  "Order Processing",
  "Order Processed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function AdminTrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params.id as string) || "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Search bar
  const [searchInput, setSearchInput] = useState("");

  // Modal for Add Tracking Update
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingDate, setTrackingDate] = useState("");
  const [trackingTime, setTrackingTime] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");
  const [trackingNotes, setTrackingNotes] = useState("");
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrderTracking } = AdminDetails();

  useEffect(() => {
    if (token && rawId) {
      setLoading(true);
      fetchOrderTracking(
        rawId,
        (data: any) => {
          setOrder(data);
          setLoading(false);
        },
        (err: any) => {
          console.error("Order tracking fetch error:", err);
          setLoading(false);
        },
      );
    }
  }, [token, rawId]);

  /* ── derived backend values ── */
  const displayOrderId =
    order?.payment_no ||
    order?.order_id ||
    order?.order_number ||
    order?.id ||
    rawId ||
    "N/A";

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : order?.date || "N/A";

  const estimatedDeliveryDate = order?.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : orderDate;

  const rawStatus = (
    order?.order_timeline_stage ||
    order?.status ||
    order?.order_status ||
    "UNPROCESSED"
  ).toLowerCase();

  const currentStep = getProgressIndex(rawStatus);

  // Buyer Info
  const buyer = order?.buyer;
  const shippingInfo =
    order?.shipping_address ||
    order?.shipping_info ||
    order?.guest_shipping_address;

  const buyerFullName = [buyer?.first_name, buyer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const shippingFullName = [shippingInfo?.first_name, shippingInfo?.last_name]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx)
    .join(" ")
    .trim();

  const buyerName =
    buyerFullName ||
    shippingFullName ||
    (buyer?.email ? buyer.email.split("@")[0] : null) ||
    order?.buyer_name ||
    "Buyer";

  const buyerEmail =
    buyer?.email || shippingInfo?.email || order?.buyer_email || "N/A";

  const buyerPhone =
    shippingInfo?.phone ||
    shippingInfo?.phone_number ||
    buyer?.phone ||
    buyer?.phone_number ||
    order?.delivery_address?.phone ||
    order?.delivery_address?.phone_number ||
    "N/A";

  const buyerAddress =
    [
      shippingInfo?.address || shippingInfo?.line1,
      shippingInfo?.city,
      shippingInfo?.state,
      shippingInfo?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    order?.delivery_address?.address ||
    order?.shipping_address?.address ||
    "N/A";

  const buyerAvatar =
    buyer?.avatar || buyer?.profile_picture || buyer?.image || "";

  // Shipping Info
  const shippingAddress =
    [
      shippingInfo?.address || shippingInfo?.line1,
      shippingInfo?.city,
      shippingInfo?.state,
      shippingInfo?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    order?.shipping_address?.address ||
    order?.delivery_address?.address ||
    "N/A";

  const shippingMethod =
    order?.shipping_method ||
    order?.shipping_breakdown?.shipping_method ||
    "MartAf Express";

  const trackingNumber =
    order?.tracking_number ||
    order?.tracking_no ||
    order?.parcel_id ||
    rawId ||
    "N/A";

  // Seller Info
  const firstSellerOrder =
    Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
      ? order.seller_orders[0]
      : null;

  const extractedItems =
    Array.isArray(order?.items) && order.items.length > 0
      ? order.items
      : Array.isArray(order?.order_items) && order.order_items.length > 0
        ? order.order_items
        : Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
          ? order.seller_orders.flatMap(
              (so: any) =>
                so.order_items || so.items || (so.product ? [so] : []),
            )
          : [];

  const orderItems = extractedItems;
  const firstItem = orderItems[0] as any;

  const seller =
    typeof order?.seller === "object"
      ? order.seller
      : firstSellerOrder?.seller ||
        firstSellerOrder?.vendor ||
        firstSellerOrder?.manufacturer ||
        (Array.isArray(order?.sellers) && order.sellers.length > 0
          ? order.sellers[0]
          : null) ||
        null;

  const sellerName =
    order?.seller_name ||
    firstItem?.manufacturer_name ||
    seller?.business_name ||
    seller?.shop_name ||
    seller?.store_name ||
    firstSellerOrder?.business_name ||
    firstSellerOrder?.vendor_name ||
    [seller?.first_name, seller?.last_name].filter(Boolean).join(" ").trim() ||
    seller?.name ||
    order?.vendor_name ||
    "MartAf Store";

  const sellerEmail =
    firstItem?.manufacturer_email ||
    seller?.email ||
    seller?.user?.email ||
    order?.seller_email ||
    firstSellerOrder?.vendor_email ||
    order?.vendor_email ||
    "seller@martaf.com";

  const sellerPhone =
    firstItem?.manufacturer_phone ||
    seller?.phone ||
    seller?.phone_number ||
    order?.seller_phone ||
    firstSellerOrder?.vendor_phone ||
    "+2348000000000";

  const sellerAddress =
    seller?.business_address ||
    seller?.address ||
    [seller?.city, seller?.state, seller?.country].filter(Boolean).join(", ") ||
    firstSellerOrder?.vendor_address ||
    order?.seller_address ||
    "MartAf Verified Merchant";

  const sellerAvatar =
    seller?.avatar ||
    seller?.logo ||
    seller?.profile_picture ||
    seller?.image ||
    "";

  const isSellerVerified = seller?.is_verified ?? true;

  // Financials
  const subtotalAmount = Number(order?.subtotal ?? 0);
  const discountAmount = Number(order?.discount_amount ?? order?.discount ?? 0);
  const shippingFeeAmount = Number(
    order?.shipping_cost ?? order?.shipping_fee ?? 0,
  );
  const grandTotalAmount = Number(
    order?.total_amount ??
      order?.total_price ??
      subtotalAmount + shippingFeeAmount - discountAmount,
  );

  const totalItemsCount =
    order?.accepted_quantity ||
    order?.items_count ||
    (orderItems.length > 0
      ? orderItems.reduce(
          (acc: number, it: any) =>
            acc +
            (Number(
              it.quantity ??
                it.qty ??
                it.fulfilled_quantity ??
                it.accepted_quantity,
            ) || 1),
          0,
        )
      : 1);

  // Timeline Helper: Format event ISO datetime to "Month Day, Year • Time"
  const formatEventTime = (isoString?: string | null) => {
    if (!isoString) return `${orderDate} • 10:30 AM`;
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return `${orderDate} • 10:30 AM`;
      const datePart = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${datePart} • ${timePart}`;
    } catch {
      return `${orderDate} • 10:30 AM`;
    }
  };

  const timelineStage = (
    order?.order_timeline_stage ||
    order?.status ||
    order?.order_status ||
    "UNPROCESSED"
  ).toUpperCase();

  const isDelivered =
    timelineStage.includes("DELIVER") || timelineStage.includes("COMPLET");
  const isShipped =
    isDelivered ||
    timelineStage.includes("SHIP") ||
    timelineStage.includes("TRANSIT") ||
    timelineStage.includes("OUT_FOR_DELIVERY");
  const isFulfilled = isShipped || timelineStage.includes("FULFIL");
  const isProcessed =
    isFulfilled ||
    timelineStage === "PROCESSED" ||
    timelineStage.includes("PROCESS");
  const isProcessing =
    isProcessed ||
    timelineStage === "ACCEPTED" ||
    timelineStage === "PROCESSING" ||
    timelineStage === "PARTIALLY_ACCEPTED" ||
    !!order?.accepted_at;

  const derivedTimelineEvents: Array<{
    label: string;
    note: string;
    location?: string;
    datetime: string;
    current?: boolean;
  }> = [];

  // Step 1: Order Placed
  derivedTimelineEvents.push({
    label: "Order Placed",
    note: "Order successfully placed by the buyer",
    datetime: formatEventTime(order?.created_at),
  });

  // Step 2: Order Processing
  if (isProcessing) {
    derivedTimelineEvents.push({
      label: "Order Processing",
      location: "Lagos Sorting Center",
      note: "Package arrived at facility",
      datetime: formatEventTime(order?.accepted_at || order?.created_at),
    });
  }

  // Step 3: Order Processed
  if (isProcessed) {
    derivedTimelineEvents.push({
      label: "Order Processed",
      location: "Lagos Sorting Center",
      note: "Package arrived at facility",
      datetime: formatEventTime(
        order?.updated_at || order?.accepted_at || order?.created_at,
      ),
    });
  }

  // Step 4: Shipped
  if (isShipped) {
    derivedTimelineEvents.push({
      label: "Shipped",
      location: "Lagos Sorting Center",
      note: "Package arrived at facility",
      datetime: formatEventTime(order?.updated_at),
    });
  }

  // Step 5: Delivered
  if (isDelivered) {
    derivedTimelineEvents.push({
      label: "Delivered",
      note: "Package delivered to buyer",
      datetime: formatEventTime(order?.updated_at),
    });
  }

  // Mark the current (latest active) event
  if (derivedTimelineEvents.length > 0) {
    derivedTimelineEvents[derivedTimelineEvents.length - 1].current = true;
  }

  /* ── handlers ── */
  const handleCopyOrderId = () => {
    if (!displayOrderId || displayOrderId === "N/A") return;
    navigator.clipboard.writeText(displayOrderId).then(() => {
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
      toast.success("Order ID copied to clipboard!");
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(
      `/dashboard/admin/orders/track/${encodeURIComponent(searchInput.trim())}`,
    );
  };

  const handleAddTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmAccurate) {
      toast.warning("Please confirm that the tracking update is accurate.");
      return;
    }
    if (!trackingStatus) {
      toast.warning("Please select a tracking status.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Tracking update added successfully.");
      setTrackingStatus("");
      setTrackingDate("");
      setTrackingTime("");
      setTrackingLocation("");
      setTrackingNotes("");
      setConfirmAccurate(false);
      setIsUpdateModalOpen(false);
    } catch {
      toast.error("Failed to add tracking update.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-12 w-full p-4 md:p-8 rounded-2xl bg-white animate-in fade-in duration-300 ">
      {/* ── 1. Top Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-000000/4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-base md:text-lg font-MontserratSemiBold text-black hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
          Track Order details
        </button>
        <button
          onClick={() => toast.info("Downloading order details...")}
          className="w-9 h-9 border border-[#FF6D5B]/30 hover:border-[#FF6D5B] rounded-lg flex items-center justify-center transition-colors group text-[#FF6D5B]"
          title="Download"
        >
          <Download className="w-4 h-4 group-hover:scale-105 transition-transform" />
        </button>
      </div>

      {/* ── 2. Find Order Search Bar ── */}
      <div className="border border-000000/4 rounded-2xl lg:pb-c64 p-6 sm:p-8 space-y-c48 mb-c64">
        <div className="space-y-6">
          <h2 className="text-sm font-MontserratSemiBold text-black">
            Find Order
          </h2>
          <p className="text-xs text-gray-500 font-MontserratNormal mt-1">
            Enter Order ID or Tracking Number to track order status.
          </p>
        </div>
        <form onSubmit={handleSearch} className="max-w-120">
          <div className="flex flex-col sm:flex-row   sm:items-center gap-3 pt-2">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID / Tracking No."
              className="md:w-76"
            />
            <Button type="submit" className="w-c160">
              Track Order
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <LoadingSpinner size={36} color="border-[#FF6D5B]" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── 3. Top Summary & Progress Card (All in 1 container) ── */}
          <div className="border border-000000/4 rounded-2xl lg:pb-c64 p-6 sm:p-8 space-y-12">
            {/* Header info: Order ID + Status + Dates */}
            <div className="space-y-6">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 ">
                  <span className="text-sm font-MontserratSemiBold text-000000/64">
                    Order ID:{" "}
                    <span className=" text-black pl-2">{displayOrderId}</span>
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="text-000000 hover:text-000000/90 transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedOrder ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Image
                        src={CopyIcon}
                        alt="copy"
                        width={12}
                        height={12}
                        className="flex-shrink-0"
                      />
                    )}
                  </button>
                </div>

                <span className="bg-[#FFAC06]/12 text-000000/64 px-4 py-3 rounded-2xl text-xs font-MontserratSemiBold capitalize">
                  {formatStatusText(rawStatus)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-000000 font-MontserratNormal ">
                <span>
                  Order Placed on:{" "}
                  <span className="">
                    {orderDate}
                  </span>
                </span>
                <span>
                  Estimated Delivery:{" "}
                  <span className="text-gray-900 font-MontserratMedium">
                    {estimatedDeliveryDate}
                  </span>
                </span>
              </div>
            </div>

            {/* Order Progress Section */}
            <OrderProgressBar currentStep={currentStep} />

            {/* 3-Column Party Details Row (Buyer | Shipping | Seller) */}
            <div className="">
              <OrderPartyDetails
                buyerName={buyerName}
                buyerAvatar={buyerAvatar}
                buyerEmail={buyerEmail}
                buyerPhone={buyerPhone}
                buyerAddress={buyerAddress}
                shippingAddress={shippingAddress}
                shippingMethod={shippingMethod}
                trackingNumber={trackingNumber}
                sellerName={sellerName}
                sellerAvatar={sellerAvatar}
                isSellerVerified={isSellerVerified}
                sellerEmail={sellerEmail}
                sellerPhone={sellerPhone}
                sellerAddress={sellerAddress}
              />
            </div>
          </div>

          {/* ── 4. Middle Section: Timeline + Add Tracking Update ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch px-6 sm:px-8">
            {/* Order Timeline (Left) */}
            <div className=" space-y-6">
              <h3 className="text-sm font-MontserratSemiBold text-black">
                Order Timeline
              </h3>

              <div className="space-y-0">
                {derivedTimelineEvents.map((ev, i) => {
                  const isLast = i === derivedTimelineEvents.length - 1;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      {/* Left Column: Circle Icon + Connecting Line directly below */}
                      <div className="flex flex-col items-center flex-shrink-0 self-stretch">
                        <div className="w-7 h-7 rounded-full bg-[#6A0DAD] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        {!isLast && (
                          <div className="w-[4px] bg-[#6A0DAD] flex-1 my-4 rounded-full min-h-[52px]" />
                        )}
                      </div>

                      {/* Right Column: Event Content */}
                      <div className={`space-y-1 ${!isLast ? "pb-6" : ""}`}>
                        <div className="flex items-center w-67 justify-between">
                          <span className="text-xs font-MontserratMedium text-black">
                            {ev.label}
                          </span>
                          {ev.current && (
                            <span className="text-ff715b bg-[#FFAC06]/12 text-[10px] font-MontserratMedium px-2 py-0.5 rounded-c8">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-000000/68 font-MontserratMedium">
                          <span>{ev.datetime.split(" • ")[0]}</span>
                          <span className="w-1 h-1 rounded-full bg-000000/68"></span>
                          <span>{ev.datetime.split(" • ")[1]}</span>
                        </div>
                        {ev.location && (
                          <p className="text-xs text-000000/68 font-MontserratMedium">
                            {ev.location}
                          </p>
                        )}
                        {ev.note && (
                          <p className="text-xs text-000000/68 font-MontserratMedium">
                            {ev.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Tracking Update Card (Right) */}
            <div className="h-fit border border-000000/4 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
              <h3 className="text-sm font-MontserratSemiBold text-black mb-6">
                Add Tracking Update
              </h3>
              <p className="text-xs text-000000 font-Mo4ntserratNormal  mb-12">
                Record a new shipment event to update the delivery progress.
              </p>
              <Button
                type="button"
                onClick={() => setIsUpdateModalOpen(true)}
                className="bg-[#FF6D5B] hover:bg-[#e05d4a] text-white font-MontserratMedium text-sm py-2.5 px-8 rounded-lg w-full max-w-xs transition-colors"
              >
                Add Tracking Update
              </Button>
            </div>
          </div>

          {/* ── 5. Order Items & Order Summary Section ── */}
          <OrderItemsAndSummary
            order={order}
            orderItems={orderItems}
            totalItemsCount={totalItemsCount}
            discountAmount={discountAmount}
            subtotalAmount={subtotalAmount}
            shippingFeeAmount={shippingFeeAmount}
            grandTotalAmount={grandTotalAmount}
          />
        </div>
      )}

      {/* ── Add Tracking Update Modal ── */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl sm:rounded-2xl p-8 sm:p-12 w-full max-w-[668px] shadow-2xl relative space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pt-2">
               <h3 className="text-sm font-MontserratSemiBold text-black mb-6">
                Add Tracking Update
              </h3>
              <p className="text-xs text-000000 font-Mo4ntserratNormal  ">
                Record a new shipment event to update the delivery progress.
              </p>
            </div>

            {/* Admin Auto-filled Pill (Right-aligned) */}
            <div className="flex justify-end items-center gap-2 ">
              <span className="text-sm font-MontserratSemiBold text-000000/68">
                Admin:
              </span>
              <div className="border h-12 border-000000/12 text-000000/68 rounded-c8 p-4 text-xs font-MontserratMedium bg-white ">
                Auto-filled Admin Name - Role
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTracking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {/* Tracking Status */}
                <div className="relative">
                  <label className="block text-xs font-MontserratMedium text-gray-700 mb-1.5">
                    Tracking Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
                    className="w-full h-12 bg-white border border-gray-200 rounded-lg px-4 flex items-center justify-between text-xs font-MontserratNormal text-left outline-none focus:border-[#FF6D5B] transition-colors cursor-pointer"
                  >
                    <span
                      className={
                        trackingStatus
                          ? "text-gray-900 font-MontserratMedium"
                          : "text-gray-600"
                      }
                    >
                      {trackingStatus || "Select Status"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isStatusDropdownOpen ? "rotate-180 text-[#FF6D5B]" : ""
                      }`}
                    />
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                      {TRACKING_STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setTrackingStatus(s);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-MontserratNormal hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                            trackingStatus === s
                              ? "bg-[#FF6D5B]/10 text-[#FF6D5B] font-MontserratMedium"
                              : "text-gray-700"
                          }`}
                        >
                          <span>{s}</span>
                          {trackingStatus === s && (
                            <Check className="w-3.5 h-3.5 text-[#FF6D5B]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-xs font-MontserratMedium text-gray-700 mb-1.5">
                    Date &amp; Time
                  </label>
                  <div className="w-full h-12 bg-white border border-gray-200 rounded-lg px-4 flex items-center justify-between text-xs font-MontserratNormal text-gray-700">
                    <span>{trackingDate || "12/12/2025 (auto-filled)"}</span>
                    <span>{trackingTime || "12:25 pm"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Location */}
                <div>
                  <label className="block text-xs font-MontserratMedium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={trackingLocation}
                    onChange={(e) => setTrackingLocation(e.target.value)}
                    placeholder="Aba Distribution Center"
                    className="w-full h-12 border border-gray-200 rounded-lg px-4 text-xs font-MontserratNormal outline-none focus:border-[#FF6D5B] placeholder-gray-400 bg-white"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-MontserratMedium text-gray-700 mb-1.5">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    placeholder="Package arrived at Aba facility."
                    className="w-full h-12 border border-gray-200 rounded-lg px-4 text-xs font-MontserratNormal outline-none focus:border-[#FF6D5B] placeholder-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* Confirmation checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmAccurate}
                    onChange={(e) => setConfirmAccurate(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#FF6D5B] cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-MontserratNormal">
                    I confirm that this tracking update is accurate.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 h-12 border border-[#FF6D5B] text-[#FF6D5B] rounded-xl text-sm font-MontserratMedium hover:bg-[#FF6D5B]/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-12 bg-[#FF6D5B] text-white rounded-xl text-sm font-MontserratMedium hover:bg-[#e05d4a] transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Adding..." : "Add Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
