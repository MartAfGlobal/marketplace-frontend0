"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Copy, Check, Search, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import NavBack from "@/assets/icons/navBacksmall.png";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/* ─────────────── helpers ─────────────── */
function fmt(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) return "₦0";
  return `₦${Number(val).toLocaleString()}`;
}

function formatStatusText(str: string) {
  if (!str) return "Unprocessed";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const STATUS_STEPS = [
  { key: "unprocessed", label: "Unprocessed" },
  { key: "processed", label: "Processed" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_COLORS: Record<string, string> = {
  unprocessed: "bg-[#FFAC06] text-[#FFAC06]",
  pending: "bg-[#FFAC06] text-[#FFAC06]",
  processed: "bg-[#0070E9] text-[#0070E9]",
  processing: "bg-[#0070E9] text-[#0070E9]",
  fulfilled: "bg-[#28A745] text-[#28A745]",
  shipped: "bg-[#6A0DAD] text-[#6A0DAD]",
  delivered: "bg-[#28A745] text-[#28A745]",
  completed: "bg-[#28A745] text-[#28A745]",
  disputed: "bg-[#E8334A] text-[#E8334A]",
  cancelled: "bg-[#E8334A] text-[#E8334A]",
};

function getStepIndex(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("deliver") || s.includes("complet")) return 4;
  if (s.includes("ship") || s.includes("transit")) return 3;
  if (s.includes("fulfil")) return 2;
  if (s.includes("process")) return 1;
  return 0;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const colorClass = STATUS_COLORS[s] || "bg-gray-200 text-gray-600";
  const bg = colorClass.split(" ")[0];
  const text = colorClass.split(" ")[1];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-MontserratMedium ${text} ${bg}/10`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${bg}`} />
      {formatStatusText(status)}
    </span>
  );
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
  const [copied, setCopied] = useState(false);

  // Search bar
  const [searchInput, setSearchInput] = useState("");

  // Add Tracking Update form
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingDate, setTrackingDate] = useState("");
  const [trackingTime, setTrackingTime] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");
  const [trackingNotes, setTrackingNotes] = useState("");
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        () => setLoading(false),
      );
    }
  }, [token, rawId]);

  /* ── derived backend values ── */
  const displayOrderId =
    order?.payment_no || order?.order_id || order?.order_number || order?.id || rawId || "N/A";

  const rawStatus = (order?.status ?? order?.order_status ?? "PENDING").toLowerCase();
  const currentStep = getStepIndex(rawStatus);

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : order?.date || "N/A";

  const estimatedDelivery = order?.estimated_delivery_date || order?.estimated_delivery
    ? new Date(order.estimated_delivery_date || order.estimated_delivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : order?.delivery_date || orderDate;

  // Buyer & Shipping Info
  const buyer = order?.buyer;
  const shippingInfo = order?.shipping_info || order?.guest_shipping_address;

  const buyerFullName = [buyer?.first_name, buyer?.last_name].filter(Boolean).join(" ").trim();
  const shippingFullName = [shippingInfo?.first_name, shippingInfo?.last_name].filter(Boolean).join(" ").trim();

  const buyerName =
    buyerFullName || shippingFullName || (buyer?.email ? buyer.email.split("@")[0] : null) || order?.buyer_name || "Buyer";
  const buyerEmail = buyer?.email || shippingInfo?.email || order?.buyer_email || "N/A";
  const buyerPhone =
    shippingInfo?.phone_number || shippingInfo?.phone || buyer?.phone_number || buyer?.phone || "N/A";

  const buyerAddress =
    [shippingInfo?.address || shippingInfo?.line1, shippingInfo?.city, shippingInfo?.state, shippingInfo?.country]
      .filter(Boolean)
      .join(", ") ||
    order?.delivery_address?.address ||
    order?.shipping_address?.address ||
    "N/A";

  const buyerAvatar = buyer?.avatar || buyer?.profile_picture || buyer?.image || "";

  // Shipping
  const shippingAddress =
    [shippingInfo?.address || shippingInfo?.line1, shippingInfo?.city, shippingInfo?.state, shippingInfo?.country]
      .filter(Boolean)
      .join(", ") ||
    order?.shipping_address?.address ||
    order?.delivery_address?.address ||
    "N/A";

  const shippingMethod = order?.shipping_method || order?.shipping_breakdown?.shipping_method || "MartAf Express";
  const trackingNumber =
    order?.tracking_number || order?.tracking_no || order?.payment_no || order?.payment_reference || "N/A";

  // Seller
  const firstSellerOrder =
    Array.isArray(order?.seller_orders) && order.seller_orders.length > 0 ? order.seller_orders[0] : null;

  const seller =
    firstSellerOrder?.seller ||
    firstSellerOrder?.vendor ||
    firstSellerOrder?.manufacturer ||
    (Array.isArray(order?.sellers) && order.sellers.length > 0 ? order.sellers[0] : null) ||
    order?.seller ||
    order?.vendor ||
    null;

  const sellerName =
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
    seller?.email || seller?.user?.email || firstSellerOrder?.vendor_email || order?.vendor_email || "N/A";
  const sellerPhone = seller?.phone_number || seller?.phone || firstSellerOrder?.vendor_phone || "N/A";
  const sellerAddress =
    seller?.business_address ||
    seller?.address ||
    [seller?.city, seller?.state, seller?.country].filter(Boolean).join(", ") ||
    firstSellerOrder?.vendor_address ||
    "N/A";
  const sellerAvatar = seller?.avatar || seller?.logo || seller?.profile_picture || seller?.image || "";
  const isSellerVerified = seller?.is_verified ?? true;

  // Items + Summary
  const extractedItems =
    Array.isArray(order?.order_items) && order.order_items.length > 0
      ? order.order_items
      : Array.isArray(order?.items) && order.items.length > 0
      ? order.items
      : Array.isArray(order?.seller_orders) && order.seller_orders.length > 0
      ? order.seller_orders.flatMap((so: any) => so.order_items || so.items || (so.product ? [so] : []))
      : [];

  const orderItems = extractedItems;

  const subtotal = Number(order?.subtotal ?? 0);
  const discountAmt = Number(order?.discount_amount ?? order?.discount ?? 0);
  const shippingFee = Number(order?.shipping_cost ?? order?.shipping_fee ?? 0);
  const grandTotal = Number(order?.total_price ?? order?.total_amount ?? (subtotal + shippingFee - discountAmt));
  const totalAmount = grandTotal;

  const totalItems =
    order?.items_count ??
    (orderItems.length > 0
      ? orderItems.reduce(
          (acc: number, it: any) => acc + (Number(it.quantity ?? it.qty ?? it.fulfilled_quantity) || 1),
          0
        )
      : 1);

  // Timeline
  const timeline: Array<{ status: string; date: string; time: string; location?: string; note?: string }> =
    order?.tracking_updates || order?.timeline || order?.order_timeline || [];

  /* ── handlers ── */
  const handleCopyId = () => {
    navigator.clipboard.writeText(displayOrderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/dashboard/admin/orders/track/${searchInput.trim()}`);
  };

  const handleAddTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmAccurate) { toast.warning("Please confirm that the tracking update is accurate."); return; }
    if (!trackingStatus) { toast.warning("Please select a tracking status."); return; }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Tracking update added successfully.");
      setTrackingStatus(""); setTrackingDate(""); setTrackingTime("");
      setTrackingLocation(""); setTrackingNotes(""); setConfirmAccurate(false);
    } catch { toast.error("Failed to add tracking update."); }
    finally { setSubmitting(false); }
  };

  /* ── avatar helper ── */
  function AvatarCircle({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
    const initials = name && name !== "N/A" ? name.slice(0, 2).toUpperCase() : "NA";
    return src ? (
      <img src={src} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover flex-shrink-0" />
    ) : (
      <span style={{ width: size, height: size }} className="rounded-full flex-shrink-0 bg-[#947FFF]/20 flex items-center justify-center text-xs font-MontserratMedium text-[#6A0DAD]">
        {initials}
      </span>
    );
  }

  /* ─────────────── render ─────────────── */
  return (
    <div className="mb-12 space-y-6 animate-in fade-in duration-300">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-sm md:text-base font-MontserratSemiBold text-gray-900 hover:opacity-70 transition-opacity"
        >
          <Image src={NavBack} alt="Back" width={9} height={16.5} className="brightness-0" />
          Track Order details
        </button>
        <button
          onClick={() => toast.info("Downloading order details...")}
          className="w-9 h-9 border border-000000/12 rounded-c8 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4 text-000000/44" />
        </button>
      </div>

      {/* ── Find Order ── */}
      <div className="bg-white rounded-2xl p-6 space-y-3">
        <p className="text-sm font-MontserratSemiBold text-000000/80">Find Order</p>
        <p className="text-xs text-000000/44 font-MontserratNormal">
          Enter Order ID or Tracking Number to track order status.
        </p>
        <form onSubmit={handleSearch} className="flex items-center gap-3 mt-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Order ID / Tracking No."
            className="flex-1 max-w-xs h-10 border border-000000/12 rounded-c8 px-3 text-sm font-MontserratNormal outline-none focus:border-[#947FFF] transition-colors"
          />
          <button
            type="submit"
            className="h-10 px-5 bg-[#ff715b] text-white rounded-c8 text-sm font-MontserratSemiBold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            Track Order
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-16 flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size={36} color="border-[#ff715b]" />
        </div>
      ) : (
        <>
          {/* ── Order ID + status + dates + progress ── */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-MontserratSemiBold text-000000/80">
                Order ID: <span className="text-000000">{displayOrderId}</span>
              </span>
              <button onClick={handleCopyId} className="hover:opacity-70">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-000000/44" />}
              </button>
              <StatusBadge status={rawStatus} />
            </div>
            <div className="flex flex-wrap justify-between text-xs text-000000/44 font-MontserratNormal gap-2">
              <span>Order Placed on: {orderDate}</span>
              <span>Estimated Delivery: {estimatedDelivery}</span>
            </div>

            {/* Progress stepper */}
            <div className="mt-2">
              <p className="text-xs font-MontserratSemiBold text-000000/68 mb-4">Order progress</p>
              <div className="flex items-start overflow-x-auto pb-1">
                {STATUS_STEPS.map((step, i) => {
                  const isActive = i <= currentStep;
                  const isLast = i === STATUS_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex items-center min-w-fit">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-MontserratSemiBold transition-colors ${
                            isActive ? "bg-[#6A0DAD] text-white" : "bg-000000/8 text-000000/28"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={`text-[10px] font-MontserratNormal whitespace-nowrap ${
                            isActive ? "text-[#6A0DAD] font-MontserratMedium" : "text-000000/44"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {!isLast && (
                        <div
                          className={`h-px w-12 sm:w-16 mt-[-14px] mx-1 transition-colors ${
                            i < currentStep ? "bg-[#6A0DAD]" : "bg-000000/12"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Buyer | Shipping | Seller ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buyer */}
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-MontserratSemiBold text-000000/80">Buyer Details</p>
                <button className="flex items-center gap-1 text-xs text-[#947FFF] font-MontserratMedium hover:opacity-80">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Address
                </button>
              </div>
              <div className="flex items-center gap-3">
                <AvatarCircle name={buyerName} src={buyerAvatar} size={36} />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-MontserratMedium text-000000/80">{buyerName}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-[#28A745] bg-[#28A745]/10 px-1.5 py-0.5 rounded-full font-MontserratMedium">
                    <CheckCircle2 className="w-3 h-3 text-[#28A745]" />
                    Verified
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-MontserratNormal">
                <p className="text-000000/44">Email Address: <span className="text-000000/68">{buyerEmail}</span></p>
                <p className="text-000000/44">Phone: <span className="text-000000/68">{buyerPhone}</span></p>
                <p className="text-000000/44">Delivery Address: <span className="text-000000/68">{buyerAddress}</span></p>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 h-8 border border-000000/20 rounded-c8 text-xs font-MontserratMedium text-000000/68 hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 h-8 bg-[#ff715b] text-white rounded-c8 text-xs font-MontserratSemiBold hover:opacity-90 transition-opacity">
                  Message Buyer
                </button>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <p className="text-sm font-MontserratSemiBold text-000000/80">Shipping details</p>
              <div className="space-y-3 text-xs font-MontserratNormal">
                <div>
                  <p className="text-000000/44 mb-0.5">Shipping Address</p>
                  <p className="text-000000/68">{shippingAddress}</p>
                </div>
                <div>
                  <p className="text-000000/44 mb-0.5">Shipping Method</p>
                  <p className="text-000000/68">{shippingMethod}</p>
                </div>
                <div>
                  <p className="text-000000/44 mb-0.5">Tracking Number</p>
                  <p className="text-[#FF6D5B] font-MontserratMedium break-all">{trackingNumber}</p>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <p className="text-sm font-MontserratSemiBold text-000000/80">Seller Details</p>
              <div className="flex items-center gap-3">
                <AvatarCircle name={sellerName} src={sellerAvatar} size={36} />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-MontserratMedium text-000000/80">{sellerName}</span>
                  {isSellerVerified && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#28A745] bg-[#28A745]/10 px-1.5 py-0.5 rounded-full font-MontserratMedium">
                      <CheckCircle2 className="w-3 h-3 text-[#28A745]" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-xs font-MontserratNormal">
                <p className="text-000000/44">Email Address: <span className="text-000000/68">{sellerEmail}</span></p>
                <p className="text-000000/44">Phone: <span className="text-000000/68">{sellerPhone}</span></p>
                <p className="text-000000/44">Contact Address: <span className="text-000000/68">{sellerAddress}</span></p>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 h-8 border border-000000/20 rounded-c8 text-xs font-MontserratMedium text-000000/68 hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 h-8 bg-[#ff715b] text-white rounded-c8 text-xs font-MontserratSemiBold hover:opacity-90 transition-opacity">
                  Message Seller
                </button>
              </div>
            </div>
          </div>

          {/* ── Timeline + Add Tracking Update ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Order Timeline */}
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <p className="text-sm font-MontserratSemiBold text-000000/80">Order Timeline</p>
              {timeline.length > 0 ? (
                <ol className="relative border-l-2 border-000000/8 ml-3 space-y-6">
                  {timeline.map((event, i) => (
                    <li key={i} className="ml-5 relative">
                      <span className="absolute -left-[26px] top-0.5 w-4 h-4 bg-[#28A745] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                      <p className="text-xs font-MontserratSemiBold text-000000/80">{event.status}</p>
                      <p className="text-[10px] text-000000/44 mt-0.5">{event.date} • {event.time}{event.location ? ` — ${event.location}` : ""}</p>
                      {event.note && <p className="text-[10px] text-000000/68 mt-0.5">{event.note}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <ol className="relative border-l-2 border-000000/8 ml-3 space-y-6">
                  {[
                    { label: "Order Placed", note: "Order successfully placed by the buyer" },
                    { label: "Order Processing", note: "Package arrived at sorting facility" },
                    { label: "Order Processed", note: "Package processed and verified" },
                    { label: "Shipped", note: "Package in transit", current: true },
                  ].map((ev, i) => (
                    <li key={i} className="ml-5 relative">
                      <span className="absolute -left-[26px] top-0.5 w-4 h-4 bg-[#28A745] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-MontserratSemiBold text-000000/80">{ev.label}</p>
                        {ev.current && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#28A745]/10 text-[#28A745] rounded-full font-MontserratMedium">Current</span>
                        )}
                      </div>
                      <p className="text-[10px] text-000000/44 mt-0.5">{orderDate} • 10:30 AM</p>
                      <p className="text-[10px] text-000000/68 mt-0.5">{ev.note}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Add Tracking Update */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-sm font-MontserratSemiBold text-000000/80">Add Tracking Update</p>
                <p className="text-xs text-000000/44 font-MontserratNormal mt-1">
                  Record a new shipment event to update the delivery progress.
                </p>
              </div>

              <form onSubmit={handleAddTracking} className="space-y-4">
                <div>
                  <label className="block text-xs text-000000/44 font-MontserratNormal mb-1">Admin</label>
                  <input
                    readOnly
                    placeholder="Auto-filled Admin Name - Role"
                    className="w-full h-9 border border-000000/12 rounded-c8 px-3 text-xs font-MontserratNormal bg-000000/4 text-000000/44 cursor-default outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-000000/44 font-MontserratNormal mb-1">Tracking Status</label>
                    <select
                      value={trackingStatus}
                      onChange={(e) => setTrackingStatus(e.target.value)}
                      className="w-full h-9 border border-000000/12 rounded-c8 px-2 text-xs font-MontserratNormal outline-none focus:border-[#947FFF] bg-white"
                    >
                      <option value="">Select Status</option>
                      {TRACKING_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-000000/44 font-MontserratNormal mb-1">Date &amp; Time</label>
                    <div className="flex gap-1">
                      <input
                        type="date"
                        value={trackingDate}
                        onChange={(e) => setTrackingDate(e.target.value)}
                        className="flex-1 h-9 border border-000000/12 rounded-c8 px-2 text-xs font-MontserratNormal outline-none focus:border-[#947FFF]"
                      />
                      <input
                        type="time"
                        value={trackingTime}
                        onChange={(e) => setTrackingTime(e.target.value)}
                        className="w-20 h-9 border border-000000/12 rounded-c8 px-2 text-xs font-MontserratNormal outline-none focus:border-[#947FFF]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-000000/44 font-MontserratNormal mb-1">Location</label>
                    <input
                      type="text"
                      value={trackingLocation}
                      onChange={(e) => setTrackingLocation(e.target.value)}
                      placeholder="Aba Distribution Center"
                      className="w-full h-9 border border-000000/12 rounded-c8 px-3 text-xs font-MontserratNormal outline-none focus:border-[#947FFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-000000/44 font-MontserratNormal mb-1">Notes</label>
                    <input
                      type="text"
                      value={trackingNotes}
                      onChange={(e) => setTrackingNotes(e.target.value)}
                      placeholder="Package arrived at facility."
                      className="w-full h-9 border border-000000/12 rounded-c8 px-3 text-xs font-MontserratNormal outline-none focus:border-[#947FFF]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmAccurate}
                    onChange={(e) => setConfirmAccurate(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-000000/20 accent-[#ff715b]"
                  />
                  <span className="text-xs text-000000/68 font-MontserratNormal">
                    I confirm that this tracking update is accurate.
                  </span>
                </label>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingStatus(""); setTrackingDate(""); setTrackingTime("");
                      setTrackingLocation(""); setTrackingNotes(""); setConfirmAccurate(false);
                    }}
                    className="flex-1 h-10 border border-000000/20 rounded-c8 text-sm font-MontserratMedium text-000000/68 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-10 bg-[#ff715b] text-white rounded-c8 text-sm font-MontserratSemiBold hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {submitting ? "Adding..." : "Add Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Order Items + Summary ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="space-y-6 bg-white rounded-2xl p-6 pb-8">
                <h3 className="text-sm text-000000/68 font-MontserratNormal">Order items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                        <th className="p-3">SKU</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Unit price</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-MontserratNormal">
                      {orderItems.length > 0 ? (
                        orderItems.map((item: any, index: number) => {
                          const sku = item.sku || item.product_sku || item.product?.sku || "N/A";
                          const name = item.name || item.title || item.product_name || item.product?.name || item.product?.title || "Item";
                          const rawImg =
                            item.image ||
                            item.thumbnail ||
                            item.product?.image ||
                            item.product?.thumbnail ||
                            (Array.isArray(item.product?.images)
                              ? typeof item.product.images[0] === "string"
                                ? item.product.images[0]
                                : item.product.images[0]?.image
                              : null);
                          const unitPrice = Number(item.unit_price ?? item.price ?? item.price_at_purchase ?? 0);
                          const qty = Number(item.quantity ?? item.qty ?? item.fulfilled_quantity ?? 1);
                          const total = Number(item.total_price ?? item.total ?? unitPrice * qty);

                          return (
                            <tr key={item.id || index} className="h-16 border-b border-gray-50">
                              <td className="px-3 font-MontserratMedium text-xs">{sku}</td>
                              <td className="px-3">
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                                    {rawImg ? (
                                      <img src={rawImg} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[10px] text-gray-400">N/A</span>
                                    )}
                                  </div>
                                  <span className="line-clamp-1 max-w-[200px]">{name}</span>
                                </div>
                              </td>
                              <td className="px-3 font-MontserratMedium">{fmt(unitPrice)}</td>
                              <td className="px-3 text-center font-MontserratMedium">{qty}</td>
                              <td className="px-3 font-MontserratSemiBold">{fmt(total)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-000000/44 font-MontserratMedium">
                            No items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 space-y-3 h-fit">
              <p className="text-sm font-MontserratSemiBold text-000000/80">Order Summary</p>
              <div className="space-y-2 text-xs font-MontserratNormal text-000000/68">
                <div className="flex justify-between py-1">
                  <span>Total Amount</span>
                  <span className="font-MontserratMedium">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Total Items</span>
                  <span className="font-MontserratMedium">{totalItems}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Discounts</span>
                  <span className="font-MontserratMedium text-[#E8334A]">
                    {discountAmt > 0 ? `-${fmt(discountAmt)}` : "₦0"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Subtotal</span>
                  <span className="font-MontserratMedium">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Shipping Fee</span>
                  <span className="font-MontserratMedium">{fmt(shippingFee)}</span>
                </div>
              </div>
              <div className="border-t border-000000/8 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-MontserratSemiBold text-000000/80">Grand Total</span>
                <span className="text-c20 font-MontserratSemiBold text-000000">{fmt(totalAmount)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
