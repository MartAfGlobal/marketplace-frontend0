"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  Copy,
  Check,
  MoreVertical,
  SquarePen,
  Hourglass,
  Truck,
  Package,
  Plane,
  Home,
  CheckCircle2,
} from "lucide-react";
import VerifiedIcon from "@/assets/icons/verifiedIcon.svg";

import CopyIcon from "@/assets/icons/copy.svg";
import Image from "next/image";
import NavBack from "@/assets/icons/navBacksmall.png";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import UpdateOrderStatusModal from "@/components/ui/Modals/admin/UpdateOrderStatusModal";
import AdminCancelOrderModal from "@/components/ui/Modals/admin/AdminCancelOrderModal";
import { Button } from "@/components/ui/Button/Button";

/* ─────────────── Helpers ─────────────── */
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
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const PROGRESS_STEPS = [
  { key: "unprocessed", label: "Unprocessed", icon: Hourglass },
  { key: "processed", label: "Processed", icon: Truck },
  { key: "fulfilled", label: "Fulfilled", icon: Package },
  { key: "shipped", label: "Shipped", icon: Plane },
  { key: "delivered", label: "Delivered", icon: Home },
];

function getProgressIndex(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("deliver") || s.includes("complet")) return 4;
  if (s.includes("ship") || s.includes("transit")) return 3;
  if (s.includes("fulfil")) return 2;
  if (s.includes("process")) return 1;
  return 0; // Unprocessed / pending
}

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params.id as string) || "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);

  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const token = useSelector((state: RootState) => state.token.token);
  const { fetchAdminOrderDetail } = AdminDetails();

  useEffect(() => {
    if (token && rawId) {
      setLoading(true);
      fetchAdminOrderDetail(
        rawId,
        (data: any) => {
          setOrder(data);
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    }
  }, [token, rawId]);

  const handleTrackOrder = () => {
    router.push(
      `/dashboard/admin/orders/track/${encodeURIComponent(displayOrderId)}`,
    );
  };

  const handleConfirmStatusUpdate = async (newStatus: string) => {
    setUpdateStatusLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Order status updated to "${newStatus}" successfully.`);
      setUpdateStatusOpen(false);
    } catch {
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setCancelModalOpen(true);
  };

  const handleDownload = () => {
    toast.info("Downloading order details...");
  };

  const handleCopyOrderId = () => {
    if (!displayOrderId || displayOrderId === "N/A") return;
    navigator.clipboard.writeText(displayOrderId).then(() => {
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    });
  };

  const handleCopyTxnId = () => {
    if (!transactionId || transactionId === "N/A") return;
    navigator.clipboard.writeText(transactionId).then(() => {
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    });
  };

  /* ─────────────── Derived Backend Values ─────────────── */
  const displayOrderId =
    order?.order_no ||
    order?.order_number ||
    order?.payment_no ||
    order?.id ||
    rawId ||
    "N/A";

  const transactionId =
    order?.payment_reference ||
    order?.payment ||
    order?.transaction_id ||
    order?.payment_no ||
    (order?.id ? `TNX-${order.id.slice(0, 8).toUpperCase()}` : "N/A");

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : order?.date || "N/A";

  const paymentDate = order?.paid_at
    ? new Date(order.paid_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : orderDate;

  const rawStatus = (
    order?.status ??
    order?.order_status ??
    "PENDING"
  ).toLowerCase();
  const currentStep = getProgressIndex(rawStatus);

  const displayStatus = formatStatusText(
    order?.status || order?.order_status || "PENDING",
  );
  const paymentMethod =
    order?.payment_method || (order?.payment ? "Card" : "Card");
  const rawPaymentStatus = (
    order?.payment_status ||
    (order?.payout_status === "ESCROWED" ? "PAID" : order?.payout_status) ||
    (order?.paid_at ? "PAID" : "PAID")
  ).toUpperCase();
  const displayPaymentStatus = formatStatusText(rawPaymentStatus);

  /* ── Buyer Info ── */
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

  /* ── Shipping Info ── */
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
    order?.delivery_partner ||
    order?.shipping_breakdown?.shipping_method ||
    "MartAf Express";

  const trackingNumber =
    order?.tracking_number ||
    order?.tracking_no ||
    order?.parcel_id ||
    null;

  /* ── Order Items Extraction ── */
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

  /* ── Seller Info (from seller_orders, seller object, seller_name, or items) ── */
  const firstSellerOrder =
    Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
      ? order.seller_orders[0]
      : null;

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

  /* ── Financials ── */
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
  const rawTotal = grandTotalAmount;

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

  /* ── Payment ID (for cancellation endpoint) ── */
  const paymentId =
    typeof order?.payment === "string"
      ? order.payment
      : order?.payment?.id || null;

  /* ── Button visibility logic ── */
  const isCancelled =
    (order?.status ?? "").toUpperCase() === "CANCELLED" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "CANCELLED";

  const isPending =
    (order?.status ?? "").toUpperCase() === "PENDING" ||
    (order?.order_timeline_stage ?? "").toUpperCase() === "PENDING";

  /** Acceptance window has closed but order is still pending — admin can manually cancel */
  const isExpired = !isCancelled && isPending && order?.can_accept === false;

  /** Show Track button only when there is a real tracking number */
  const hasTracking = Boolean(trackingNumber);

  return (
    <div className="mb-12 box-border w-full p-6  rounded-2xl bg-white animate-in fade-in duration-300 space-y-8">
      {/* ── 1. Top Header ── */}
      <div className="flex h-c64 border-b border-b-000000/4 items-start justify-between ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-base md:text-lg font-MontserratSemiBold  hover:opacity-75 transition-opacity"
        >
          <Image
            src={NavBack}
            alt="Back"
            width={9}
            height={16.5}
            className="brightness-0"
          />
          Order details
        </button>
        <button
          onClick={handleDownload}
          className="w-10 h-10 border border-[#FF6D5B]/40 hover:border-[#FF6D5B] rounded-lg flex items-center justify-center transition-colors group"
          title="Download"
        >
          <Download className="w-4 h-4 text-[#FF6D5B] group-hover:scale-105 transition-transform" />
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <LoadingSpinner size={36} color="border-[#FF6D5B]" />
        </div>
      ) : (
        <>
          {/* ── 2. Top Summary & Actions (3 Columns) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-c64 items-start  w-full">
            {/* Column 1: Order Info */}
            <div className="space-y-3 text-sm font-MontserratNormal w-full">
              <div className="flex items-center gap-2 flex-nowrap ">
                <span className="font-MontserratSemiBold text-sm text-000000/68 min-w-0">
                  Order ID:{" "}
                  <span className="text-000000 pl-2 break-all">{displayOrderId}</span>
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="flex-shrink-0 hover: transition-colors"
                  title="Copy Order ID"
                >
                  {copiedOrder ? (
                    <Check className="w-3.5 h-3.5 text-28a745 flex-shrink-0" />
                  ) : (
                    <Image src={CopyIcon} alt="copy" width={12} height={12} className="flex-shrink-0" />
                  )}
                </button>
              </div>
              <div className="flex justify-between w-full">
                <span>Order date:</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Total amount:</span>
                <span className="font-MontserratSemiBold">
                  {formatCurrency(rawTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span>Order Status:</span>
                <span className="px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold bg-[#FFAC06]/12 text-000000/12">
                  {displayStatus}
                </span>
              </div>
            </div>

            {/* Column 2: Payment Info */}
            <div className="space-y-3 text-sm font-MontserratNormal w-full">
              <div className="flex items-center gap-2 flex-nowrap">
                <span className="font-MontserratSemiBold text-000000/68 text-sm min-w-0">
                  Transaction ID:{" "}
                  <span className="font-MontserratSemiBold text-black pl-2 break-all">
                    {transactionId}
                  </span>
                </span>
                <button
                  onClick={handleCopyTxnId}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                  title="Copy Transaction ID"
                >
                  {copiedTxn ? (
                    <Check className="w-3.5 h-3.5 text-28a745" />
                  ) : (
                    <Image src={CopyIcon} alt="copy" width={12} height={12} className="flex-shrink-0" />
                  )}
                </button>
              </div>
              <div className="flex justify-between w-full ">
                <span>Payment date:</span>
                <span className=" font-MontserratNormal text-sm">
                  {paymentDate}
                </span>
              </div>
              <div className="flex justify-between w-full ">
                <span>Payment Method:</span>
                <span className=" font-MontserratNormal text-sm">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span>Payment Status:</span>
                <span
                  className={`px-4 py-2 rounded-2xl text-xs font-MontserratMedium min-w-20 flex items-center justify-center ${
                    rawPaymentStatus === "PAID"
                      ? "bg-[#2D7565]/12 text-[#28A745]"
                      : "bg-[#FFF4E5] text-[#D97706]"
                  }`}
                >
                  {displayPaymentStatus}
                </span>
              </div>
            </div>

            {/* Column 3: Action Buttons */}
            <div className="space-y-6 flex flex-col justify-center w-full md:col-span-2 lg:col-span-1">
              {/* Track Order — only shown when a real tracking number exists */}
              {hasTracking && (
                <Button
                  onClick={handleTrackOrder}
                  className=" bg-[#FF6D5B] hover:bg-[#ff5a43]  "
                >
                  Track Order
                </Button>
              )}

              {/* Expired badge — acceptance window passed, order still pending */}
              {isExpired && (
                <div className="flex flex-col gap-3">
                  <span className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold bg-[#FF6D5B]/12 text-[#C00000]">
                    Expired — acceptance deadline passed
                  </span>
                  <Button
                    onClick={handleCancelOrder}
                    className="bg-[#C00000] hover:bg-[#a60000]"
                  >
                    Cancel order
                  </Button>
                </div>
              )}

              {/* Cancel Order — only shown when NOT already cancelled and NOT in expired state */}
              {!isCancelled && !isExpired && (
                <Button
                  onClick={handleCancelOrder}
                  className="bg-[#C00000] hover:bg-[#a60000]"
                >
                  Cancel order
                </Button>
              )}
            </div>
          </div>

          {/* ── 3. 3-Column Details Row (Buyer | Shipping | Seller) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-8">
            {/* Buyer Details Card */}
            <div className="space-y-3 text-sm font-MontserratNormal">
              <div className="flex items-center justify-between pb-3">
                <h3 className="text-sm font-MontserratSemiBold ">
                  Buyer Details
                </h3>
                <button className="flex items-center gap-1 text-xs text-[#FF715B] font-MontserratMedium hover:opacity-80 transition-opacity">
                  <span>Edit Address</span>
                  <SquarePen className="w-6 h-6" />
                </button>
              </div>

              {/* Buyer Profile */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#6A0DAD]/10 flex items-center justify-center text-[#6A0DAD] font-MontserratSemiBold border border-gray-200">
                  {buyerAvatar ? (
                    <img
                      src={buyerAvatar}
                      alt={buyerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{buyerName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-base font-MontserratSemiBold ">
                    {buyerName}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[12px] text-[#2D7565] font-MontserratSemiBold">
                    <span>Verified</span>
                    <Image
                      src={VerifiedIcon}
                      alt="Verified"
                      width={16}
                      height={20}
                    />
                  </span>
                </div>
              </div>

              {/* Buyer Contact Text */}
              <div className="space-y-3 ">
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Email Address:
                  </span>{" "}
                  {buyerEmail}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">Phone:</span>{" "}
                  {buyerPhone}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Delivery Address:
                  </span>{" "}
                  {buyerAddress}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-3">
                <Button className="" variant="secondary">
                  View Profile
                </Button>
                <Button className="">Message Buyer</Button>
              </div>
            </div>

            {/* Shipping details Card */}
            <div className="space-y-6 text-xs font-MontserratNormal">
              <h3 className="text-sm font-MontserratSemiBold ">
                Shipping details
              </h3>

              <div className="space-y-3  ">
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Shipping Address:
                  </span>{" "}
                  {shippingAddress}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Shipping Method:
                  </span>{" "}
                  {shippingMethod}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Tracking Number:
                  </span>{" "}
                  <span className="text-ff715b font-MontserratSemiBold ">
                    {trackingNumber || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {/* Seller Details Card */}
            <div className="space-y-3 text-xs font-MontserratNormal">
              <h3 className="text-sm font-MontserratSemiBold  ">
                Seller Details
              </h3>

              {/* Seller Profile */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#FFAC06] flex items-center justify-center text-white text-xs font-MontserratBold border border-gray-200">
                  {sellerAvatar ? (
                    <img
                      src={sellerAvatar}
                      alt={sellerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    sellerName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-base font-MontserratSemiBold ">
                    {sellerName}
                  </span>
                  {isSellerVerified && (
                    <span className="inline-flex items-center gap-2 text-[12px] text-[#2D7565] font-MontserratSemiBold">
                      <span>Verified</span>
                      <Image
                        src={VerifiedIcon}
                        alt="Verified"
                        width={16}
                        height={20}
                      />
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Contact Text */}
              <div className="space-y-3 ">
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Email Address:
                  </span>{" "}
                  {sellerEmail}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">Phone:</span>{" "}
                  {sellerPhone}
                </p>
                <p>
                  <span className=" font-MontserratNormal text-sm">
                    Contact Address:
                  </span>{" "}
                  {sellerAddress}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-3">
                <Button className="" variant="secondary">
                  View Profile
                </Button>
                <Button className="">Message Seller</Button>
              </div>
            </div>
          </div>

          {/* ── 4. Order Progress Section ── */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-MontserratSemiBold">Order progress</h3>

            <div className="w-full max-w-2xl py-2 overflow-x-auto">
              <div className="relative flex justify-between items-start w-full min-w-[500px]">
                {/* Continuous Progress Line Behind the Circles */}
                <div className="absolute top-5 left-5 right-5 -translate-y-1/2 h-[1.5px] bg-[#E5E7EB] z-0">
                  <div
                    className="h-full bg-[#6A0DAD] transition-all duration-300"
                    style={{
                      width: `${(Math.min(currentStep, PROGRESS_STEPS.length - 1) / (PROGRESS_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {PROGRESS_STEPS.map((step, index) => {
                  const isCurrentOrPassed = index <= currentStep;
                  const isFirst = index === 0;
                  const isLast = index === PROGRESS_STEPS.length - 1;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`relative z-10 flex flex-col ${
                        isFirst
                          ? "items-start"
                          : isLast
                            ? "items-end"
                            : "items-center"
                      }`}
                    >
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCurrentOrPassed
                            ? "bg-[#6A0DAD]/68 text-white shadow-sm"
                            : "bg-000000/12 text-ffffff"
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>

                      {/* Step Label */}
                      <span
                        className={`mt-2 text-xs font-MontserratMedium whitespace-nowrap ${
                          isFirst
                            ? "text-left pl-0.5"
                            : isLast
                              ? "text-right pr-0.5"
                              : "text-center"
                        } ${
                          isCurrentOrPassed
                            ? "text-[#6A0DAD]/68"
                            : "text-000000/12"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 5. Order Items & Order Summary Section ── */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Order Items Table (Left ~8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-sm font-MontserratSemiBold ">
                  Order items
                </h3>

                <div className="overflow-x-auto ">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#947FFF] text-white text-xs font-MontserratSemiBold h-10">
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Items</th>
                        <th className="px-4 py-2">Unit price</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-MontserratNormal ">
                      {orderItems.length > 0 ? (
                        orderItems.map((item: any, idx: number) => {
                          const itemSku =
                            item.variation_sku ||
                            item.product_sku ||
                            item.sku ||
                            item.product?.sku ||
                            (typeof item.product === "string"
                              ? item.product.slice(0, 8).toUpperCase()
                              : item.product?.id?.slice(0, 8)) ||
                            item.id?.slice(0, 8).toUpperCase() ||
                            "N/A";

                          const itemName =
                            item.product_name ||
                            item.name ||
                            item.title ||
                            item.product?.name ||
                            item.product?.title ||
                            "Item";

                          const variationText = item.variation_name
                            ? ` (${item.variation_name})`
                            : "";

                          const rawImg =
                            item.product_image ||
                            item.image ||
                            item.thumbnail ||
                            item.product?.product_image ||
                            item.product?.image ||
                            item.product?.thumbnail ||
                            (Array.isArray(item.product?.images)
                              ? typeof item.product.images[0] === "string"
                                ? item.product.images[0]
                                : item.product.images[0]?.image
                              : null);

                          const itemImg = rawImg || "";
                          const itemUnitPrice = Number(
                            item.price_at_purchase ??
                              item.unit_price ??
                              item.price ??
                              0,
                          );
                          const itemQty = Number(
                            item.quantity ??
                              item.qty ??
                              1,
                          );
                          const itemTotal = Number(
                            item.total_price ??
                              item.total ??
                              itemUnitPrice * itemQty,
                          );

                          const isOrderRejected =
                            (order?.status ?? "").toUpperCase() === "REJECTED" ||
                            (order?.order_timeline_stage ?? "").toUpperCase() === "REJECTED";
                          const isOrderCancelled =
                            (order?.status ?? "").toUpperCase() === "CANCELLED" ||
                            (order?.order_timeline_stage ?? "").toUpperCase() === "CANCELLED";

                          let acceptedQty = 0;
                          let rejectedQty = 0;

                          if (isOrderRejected) {
                            acceptedQty = 0;
                            rejectedQty = Number(
                              item.rejected_quantity ??
                                (orderItems.length === 1 ? order.rejected_quantity : itemQty) ??
                                itemQty
                            );
                          } else if (isOrderCancelled) {
                            acceptedQty = 0;
                            rejectedQty = 0;
                          } else {
                            acceptedQty =
                              item.accepted_quantity !== undefined && item.accepted_quantity !== null
                                ? Number(item.accepted_quantity)
                                : order?.accepted_quantity !== undefined && order?.accepted_quantity !== null && orderItems.length === 1
                                ? Number(order.accepted_quantity)
                                : order?.accepted_at
                                ? Number(item.fulfilled_quantity ?? itemQty)
                                : 0;

                            rejectedQty =
                              item.rejected_quantity !== undefined && item.rejected_quantity !== null
                                ? Number(item.rejected_quantity)
                                : order?.rejected_quantity !== undefined && order?.rejected_quantity !== null && orderItems.length === 1
                                ? Number(order.rejected_quantity)
                                : 0;
                          }

                          const productId =
                            typeof item.product === "string"
                              ? item.product
                              : item.product?.id || item.product_id || item.id;

                          return (
                            <tr
                              key={item.id || idx}
                              onClick={() =>
                                productId &&
                                router.push(
                                  `/dashboard/admin/products/listings/${productId}`,
                                )
                              }
                              className={`transition-colors text-sm h-16 ${
                                productId
                                  ? "hover:bg-gray-50 cursor-pointer"
                                  : "hover:bg-gray-50/60"
                              }`}
                            >
                              <td className="px-4 py-2 font-MontserratMedium text-xs">
                                {itemSku}
                              </td>
                              <td className="px-4 py-2 ">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12  overflow-hidden flex-shrink-0flex items-center justify-center">
                                    {itemImg ? (
                                      <img
                                        src={itemImg}
                                        alt={itemName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[14px] ">
                                        N/A
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className="font-MontserratNormal line-clamp-1 max-w-[200px]"
                                    title={`${itemName}${variationText}`}
                                  >
                                    {itemName}
                                    {variationText}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 font-MontserratNormal ">
                                {formatCurrencyShort(itemUnitPrice)}
                              </td>
                              <td className="px-4 py-2 text-center font-MontserratNormal ">
                                <div className="flex flex-col items-center">
                                  <span>{itemQty}</span>
                                  {(acceptedQty > 0 || rejectedQty > 0) && (
                                    <div className="text-[10px] flex flex-col items-center leading-tight">
                                      {acceptedQty > 0 && (
                                        <span className="text-green-600 font-MontserratMedium">
                                          Acc: {acceptedQty}
                                        </span>
                                      )}
                                      {rejectedQty > 0 && (
                                        <span className="text-red-500 font-MontserratMedium">
                                          Rej: {rejectedQty}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2 font-MontserratSemiBold ">
                                <div className="flex flex-col">
                                  <span
                                    className={
                                      acceptedQty < itemQty && (acceptedQty > 0 || rejectedQty > 0)
                                        ? "line-through text-gray-400 text-xs font-MontserratNormal"
                                        : ""
                                    }
                                  >
                                    {formatCurrencyShort(itemTotal)}
                                  </span>
                                  {acceptedQty < itemQty && (acceptedQty > 0 || rejectedQty > 0) && (
                                    <span
                                      className={`${acceptedQty > 0 ? "text-green-600" : "text-red-500"} font-MontserratSemiBold`}
                                    >
                                      {formatCurrencyShort(itemUnitPrice * acceptedQty)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center cursor-pointer">
                                <MoreVertical className="w-4 h-4" />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center font-MontserratNormal text-sm"
                          >
                            No order items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary Card (Right ~4 cols) */}
              <div className="lg:col-span-4 space-y-4 pt-0 lg:pt-12">
                <h3 className="text-sm font-MontserratSemiBold ">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs font-MontserratNormal ">
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span>Total Amount</span>
                      <span className="font-MontserratMedium ">
                        {formatCurrencyShort(subtotalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Total items</span>
                      <span className="font-MontserratMedium ">
                        {totalItemsCount}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Discounts</span>
                      <span className="font-MontserratMedium text-[#FF6D5B]">
                        {discountAmount > 0
                          ? `-${formatCurrencyShort(discountAmount)}`
                          : "₦0"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Subtotal</span>
                      <span className="font-MontserratMedium ">
                        {formatCurrencyShort(subtotalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Shipping Fee</span>
                      <span className="font-MontserratMedium ">
                        {formatCurrencyShort(shippingFeeAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-4 border-t border-000000/4 flex justify-between items-baseline">
                    <span className="text-sm font-MontserratMedium ">
                      Grand Total
                    </span>
                    <span className="text-xl md:text-2xl font-MontserratBold text-black">
                      {formatCurrencyShort(grandTotalAmount)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Modal for updating order status if needed */}
      <UpdateOrderStatusModal
        isOpen={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        loading={updateStatusLoading}
      />

      {/* Admin cancellation modal */}
      <AdminCancelOrderModal
        isOpen={cancelModalOpen}
        paymentId={paymentId}
        onClose={() => setCancelModalOpen(false)}
        onSuccess={() => {
          // Re-fetch the order so the UI reflects the new CANCELLED status
          if (token && rawId) {
            fetchAdminOrderDetail(
              rawId,
              (data: any) => setOrder(data),
              () => {},
            );
          }
        }}
      />
    </div>
  );
}
