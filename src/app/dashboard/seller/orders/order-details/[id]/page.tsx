"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { useHttp } from "@/hooks/use-http";
import ProductSkeleton from "@/components/reloadSpinner/ProductsSkeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import backIcon from "@/assets/Seller/red-caret-left.png";
import downloadIcon from "@/assets/Seller/colourDownload.svg";
import CopyIcon from "@/assets/icons/Copy.png";
import UnprocessedIcon from "@/assets/Seller/unprocessed.svg";
import FufilledIcon from "@/assets/Seller/fufilledIcon.png";
import PlaneIcon from "@/assets/Seller/AirplaneTilt.svg";
import PackageIcon from "@/assets/Seller/fufilledIcon.svg";
import productIcon from "@/assets/Seller/proccessed.svg";
import truckIcon from "@/assets/Seller/delivered.svg";
import navBack from "@/assets/icons/navBacksmall.png";
import ResultModal from "@/components/ui/forms/resultModal";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const { fetchOrderById, acceptOrder, rejectOrder, fulfillOrder, fetchWarehouses, fetchDeliveryPartners, loading } =
    useFetchProducts();
  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState<"items" | "inventory">("items");

  // Accept Modal State
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [loadingDeliveryPartners, setLoadingDeliveryPartners] = useState(false);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);

  // Fulfill Modal State
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [parcelId, setParcelId] = useState("");
  const [fulfilling, setFulfilling] = useState(false);

  // Result Modal State
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    result: "success" as "success" | "error" | "warning",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!order) return;
    const lowerStatus = order.status?.toLowerCase();
    if ((lowerStatus === "pending" || lowerStatus === "unprocessed") && order.time_remaining_to_accept) {
      setTimeLeft(order.time_remaining_to_accept);
    } else if ((lowerStatus === "accepted" || lowerStatus === "processed" || lowerStatus === "partially_accepted") && order.time_remaining_to_fulfill) {
      setTimeLeft(order.time_remaining_to_fulfill);
    }
  }, [order]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (showAcceptModal) {
      if (warehouses.length === 0) {
        setLoadingWarehouses(true);
        fetchWarehouses((data) => {
          setWarehouses(data);
          setLoadingWarehouses(false);
        });
      }
      if (deliveryPartners.length === 0) {
        setLoadingDeliveryPartners(true);
        fetchDeliveryPartners((data) => {
          setDeliveryPartners(data);
          setLoadingDeliveryPartners(false);
        });
      }
    }
  }, [showAcceptModal]);

  const handleAccept = (e: any) => {
    e.preventDefault();
    if (!selectedWarehouse || !selectedDeliveryPartner) {
      alert("Please select a warehouse and a delivery partner");
      return;
    }

    setAccepting(true);
    acceptOrder(
      id as string,
      {
        warehouse_id: selectedWarehouse.id,
        delivery_partner: selectedDeliveryPartner.id,
      },
      () => {
        setAccepting(false);
        setShowAcceptModal(false);
        setResultModal({
          isOpen: true,
          result: "success",
          title: "Order accepted",
          message: "Remember to confirm order dispatch after the item is sent",
        });
        fetchOrderById(id as string, (data) => setOrder(data));
      },
      (err: any) => {
        setAccepting(false);
        setResultModal({
          isOpen: true,
          result: "error",
          title: "Failed to accept order",
          message:
            err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      },
    );
  };

  const handleReject = () => {
    if (id) {
      router.push(`/dashboard/seller/orders/reject-order/${id}`);
    }
  };

  const handleFulfill = (e: any) => {
    e.preventDefault();
    if (!parcelId.trim()) {
      alert("Please enter a valid Parcel ID");
      return;
    }

    setFulfilling(true);
    fulfillOrder(
      id as string,
      { parcel_id: parcelId },
      () => {
        setFulfilling(false);
        setShowFulfillModal(false);
        setParcelId("");
        setResultModal({
          isOpen: true,
          result: "success",
          title: "Order marked as shipped",
          message: "The order status has been updated successfully",
        });
        fetchOrderById(id as string, (data) => setOrder(data));
      },
      (err: any) => {
        setFulfilling(false);
        setResultModal({
          isOpen: true,
          result: "error",
          title: "Failed to mark order as shipped",
          message:
            err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    );
  };

  const handleDownload = async () => {
    if (!pdfRef.current || !order) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Preparing document generators...");

    try {
      // Use html-to-image as a superior modern alternative to html2canvas
      const { default: jsPDF } = await import("jspdf");
      const { toPng } = await import("html-to-image");
      
      toast.loading("Generating document...", { id: toastId });

      const element = pdfRef.current;
      
      // html-to-image uses SVG foreignObject which handles modern CSS (oklch, lab, etc) correctly
      const dataUrl = await toPng(element, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2, // high quality
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height to maintain aspect ratio
      const img = new window.Image();
      img.src = dataUrl;
      
      await new Promise((resolve) => (img.onload = resolve));
      
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`order-details-${order.order_no || order.id}.pdf`);
      
      toast.success("Download complete", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate document", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (id && token) {
      fetchOrderById(id as string, (data) => setOrder(data));
    }
  }, [id, token]);

  if (loading && !order) {
    return (
      <div className="p-8">
        <ProductSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-xl font-MontserratSemiBold text-ff715b">
          Order Not Found
        </p>
        <button onClick={() => router.back()} className="text-ff715b underline">
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "unprocessed":
      case "pending":
        return "bg-[#FFAC061A] text-[#FFAC06]";
      case "processed":
        return "bg-[#FFAC061A] text-[#FFAC06]";
      case "fulfilled":
        return "bg-[#0070E91A] text-[#0070E9]";
      case "shipped":
        return "bg-[#FF715B1A] text-[#FF715B]";
      case "delivered":
        return "bg-[#2D75651A] text-[#2D7565]";
      case "partially_accepted":
        return "bg-[#0070E91A] text-[#0070E9]";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const steps = [
    {
      label: "Unprocessed",
      icon: UnprocessedIcon,
      Width: 11.25,
      Height: 16.25,
    },
    { label: "Processed", icon: productIcon, Width: 20, Height: 20 },
    { label: "Fulfilled", icon: PackageIcon, Width: 20, Height: 20 },
    { label: "Shipped", icon: PlaneIcon, Width: 20, Height: 20 },
    { label: "Delivered", icon: truckIcon, Width: 20, Height: 20 },
  ];

  const getMappedStatus = (ord: any) => {
    if (ord?.order_timeline_stage) {
      return ord.order_timeline_stage.toLowerCase();
    }
    const status = ord?.status;
    if (!status) return "unprocessed";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "pending") return "unprocessed";
    if (lowerStatus === "accepted") return "processed";
    if (lowerStatus === "partially_accepted") return "partially accepted";
    if (lowerStatus === "in_transit_to_hub") return "fulfilled";
    return lowerStatus;
  };

  const currentStepIndex = steps.findIndex(
    (s) => s.label.toLowerCase() === getMappedStatus(order)
  );

  return (
    <div className="w-full rounded-c16  mx-auto p-4 md:p-8 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-start h-c64   border-b border-000000/10 justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center mt-1.75"
        >
          <span className="h-6 w-6 flex items-center justify-center mr-4 ">
            <Image src={navBack} width={9} height={16.5} alt="Back" />
          </span>

          <span className="text-base font-MontserratSemiBold">
            Order details
          </span>
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-2 border border-ff715b h-10 w-10 rounded-lg hover:bg-ff715b/5 disabled:opacity-50"
        >
          <Image
            src={downloadIcon}
            alt="download"
            width={10.67}
            height={10.67}
            className="w-5 h-5"
          />
        </button>
      </div>
      
      <div ref={pdfRef} className="space-y-8 bg-white">

      {/* Mobile Top Time Left */}
      <div className="lg:hidden w-full flex justify-between items-center bg-[#f9f9ff] p-4 rounded-xl -mt-4 mb-4 border border-[#e5e5f5]">
        <p className="font-MontserratSemiBold text-sm text-[#161616]">
          Time left for processing:
        </p>
        <span className={`font-MontserratSemiBold text-sm px-3 py-1 rounded-md ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 bg-white pt-4">
        {/* Left: Summary Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-MontserratSemiBold text-sm">
              Order ID: {order.order_no || order.id}
            </span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(order.order_no || order.id)
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Image src={CopyIcon} alt="copy" width={16} height={16} />
            </button>
          </div>
          <p className="text-sm font-MontserratNormal">
            Order date:{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="font-MontserratNormal text-sm">
            Order amount:{" "}
            <span className="text-base font-MontserratSemiBold">
              ₦{Number(order.total || order.subtotal).toLocaleString()}
            </span>
          </p>
          <div
            className={`inline-block px-4 py-1 rounded-full text-c12 font-MontserratSemiBold ${getStatusBadgeClass(order.status?.toLowerCase() || getMappedStatus(order))}`}
          >
            {order.status === "PARTIALLY_ACCEPTED" ? "Partial Accept" : getMappedStatus(order).charAt(0).toUpperCase() + getMappedStatus(order).slice(1)}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="hidden lg:flex flex-col min-w-[305px]">
          {/* Status-specific actions */}
          {(getMappedStatus(order) === "unprocessed") && (
            <div className="flex flex-col gap-4">
              <Button
                disabled={!order.can_accept}
                onClick={() => setShowAcceptModal(true)}
                className={`w-full py-4 bg-ff715b text-white rounded-xl  transition-all shadow-lg shadow-ff715b/20 ${!order.can_accept ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-ff715b/90"}`}
              >
                Accept order
              </Button>
              <Button
                disabled={!order.can_accept}
                onClick={handleReject}
                className={`w-full py-4 bg-white border border-ca0202 text-ca0202 rounded-xl  transition-all ${!order.can_accept ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-red-50"}`}
              >
                Reject order
              </Button>
              <div className="pt-4 space-y-2 flex items-center gap-2">
                <p className=" font-MontserratNormal text-sm ">
                  Time left for accepting order:
                </p>
                <div className="flex justify-center">
                  <span
                    className={`px-4 min-w-[93px] h-10 flex justify-center items-center rounded-c8 font-MontserratSemiBold text-base ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <p className="text-c12 font-MontserratNormal text-000000/68">
                {timeLeft > 0
                  ? "N/B: The order will automatically be cancelled after time elapses"
                  : "The order has been cancelled"}
              </p>
            </div>
          )}

          {(getMappedStatus(order) === "processed" || getMappedStatus(order) === "partially accepted") && (
            <div className="flex flex-col gap-4">
              <button 
                disabled={timeLeft <= 0}
                onClick={() => setShowFulfillModal(true)}
                className={`w-full py-4 text-white rounded-xl font-MontserratSemiBold transition-all shadow-lg ${timeLeft > 0 ? "bg-ff715b shadow-ff715b/20 hover:bg-ff715b/90" : "opacity-50 cursor-not-allowed bg-gray-400"}`}
              >
                Mark as shipped
              </button>
              <div className="pt-4 space-y-2 flex items-center gap-2">
                <p className=" font-MontserratNormal text-sm ">
                  Time left to fulfill order:
                </p>
                <div className="flex justify-center">
                  <span
                    className={`px-4 min-w-[93px] h-10 flex justify-center items-center rounded-c8 font-MontserratSemiBold text-base ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <p className="text-c12 font-MontserratNormal text-000000/68">
                {timeLeft > 0
                  ? "N/B: The order will automatically be cancelled after time elapses"
                  : "The order has been cancelled"}
              </p>
            </div>
          )}

          {getMappedStatus(order) === "fulfilled" && (
            <div className="w-full py-4 bg-000000/12 text-ffffff rounded-c8 flex items-center justify-center font-MontserratSemiBold text-sm">
              Order at warehouse
            </div>
          )}
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1  gap-8 pt-4 ">
        <div className="space-y-3">
          <h3 className="font-MontserratSemiBold text-sm">Buyer details</h3>
          <p className="font-MontserratNormal text-sm">
            Buyer name: {order.buyer?.first_name || order.buyer?.last_name 
              ? `${order.buyer.first_name} ${order.buyer.last_name}`.trim() 
              : order.shipping_address?.first_name 
                ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}`.trim() 
                : order.shipping_address_snapshot?.full_name || "N/A"}
          </p>
          <p className="font-MontserratNormal text-sm">
            Email address: {order.buyer?.email || order.shipping_address_snapshot?.email || "N/A"}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-MontserratSemiBold text-sm">Shipping details</h3>
          <p className="font-MontserratNormal text-sm line-clamp-2">
            Shipping address:{" "}
            {order.shipping_address?.address || order.shipping_address_snapshot?.address || "N/A"},{" "}
            {order.shipping_address?.state || order.shipping_address_snapshot?.state || ""} {order.shipping_address?.city || ""}
          </p>
          <p className="font-MontserratNormal text-sm">
            Shipping method: {order.delivery_partner || order.shipping_method || "N/A"}
          </p>
          <p className="font-MontserratNormal text-sm">
            Tracking number:{" "}
            <span className="text-ff715b">
              {order?.tracking_number || "To be provided"}
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-6 pt-8 overflow-x-auto pb-4">
        <h3 className="font-MontserratSemiBold text-sm">Order progress</h3>
        <div className="relative flex justify-between w-full min-w-[500px] lg:max-w-2xl mt-4 px-2">
          {/* Line behind steps */}
          <div className="absolute inset-x-0 top-5 px-5 -translate-y-1/2 z-0">
            <div className="relative w-full h-0.5 bg-gray-200">
              <div
                className="absolute top-0 left-0 h-full bg-6a0dad transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {steps.map((step, idx) => {
            const isActive = idx <= currentStepIndex;
            return (
              <div key={idx} className="relative z-10 flex flex-col  gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? "bg-6a0dad/68" : "bg-gray-200"}`}
                >
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={step.Width || 20}
                    height={step.Height || 20}
                    className={isActive ? "brightness-200" : "opacity-40"}
                  />
                </div>
                <span
                  className={`text-xs font-MontserratSemiBold ${isActive ? "text-6a0dad/68" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content: Items Table & Inventory Side by Side */}
      {/* Mobile view tabs */}
      <div className="lg:hidden flex border-b border-gray-200 mt-8 mb-4">
        <button 
          onClick={() => setMobileTab("items")} 
          className={`flex-1 pb-2 font-MontserratSemiBold text-sm border-b-2 transition-all ${mobileTab === "items" ? "border-[#6a0dad] text-[#6a0dad]" : "border-transparent text-gray-500"}`}
        >
          Order items
        </button>
        <button 
          onClick={() => setMobileTab("inventory")} 
          className={`flex-1 pb-2 font-MontserratSemiBold text-sm border-b-2 transition-all ${mobileTab === "inventory" ? "border-[#6a0dad] text-[#6a0dad]" : "border-transparent text-gray-500"}`}
        >
          Inventory
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-c48 lg:pt-8 lg:border-t border-gray-100 mb-24 lg:mb-0">
        {/* Left: Items Table */}
        <div className={`${mobileTab === "items" ? "block" : "hidden"} lg:block w-full max-w-154 space-y-c32`}>
          <h3 className="font-MontserratSemiBold text-sm hidden lg:block">Order items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#947fff] text-white font-MontserratSemiBold text-sm uppercase">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Items</th>
                  <th className="p-3 text-center">Unit price</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100  font-MontserratNormal">
                {order.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="">
                    <td className="pl-3 pr-1 py-3 text-sm font-MontserratNormal">
                      {item.variation_sku || item.product_sku || "N/A"}
                    </td>
                    <td className="pl-3 pr-1 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded bg-gray-50 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.product_image || productIcon}
                            alt="item"
                            width={64}
                            height={64}
                            unoptimized={true}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-MontserratNormal line-clamp-1">
                          {item.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="pl-3 pr-1 py-3 text-center text-sm">
                      ₦
                      {Number(
                        item.price_at_purchase || item.price,
                      ).toLocaleString()}
                    </td>
                    <td className="pl-3 pr-1 py-3 text-center text-sm">
                      <div className="flex flex-col items-center">
                        <span>{item.quantity}</span>
                        {order.status === "PARTIALLY_ACCEPTED" && (
                          <div className="text-[10px] flex flex-col items-center leading-tight">
                            <span className="text-green-600">Acc: {item.fulfilled_quantity || 0}</span>
                            <span className="text-red-500">Rej: {item.rejected_quantity || 0}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="pl-3 pr-1 py-3 text-right text-sm font-MontserratNormal">
                      ₦
                      {(
                        Number(item.price_at_purchase || item.price) *
                        item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-[1px] bg-gray-100 self-stretch" />

        {/* Right: Inventory Overview */}
        <div className={`${mobileTab === "inventory" ? "block" : "hidden"} lg:block w-full lg:w-[568px] mt-8 lg:mt-0 space-y-8`}>
          <h3 className="font-MontserratSemiBold text-sm hidden lg:block">Inventory</h3>
          <div className="space-y-6">
            {order.items?.map((item: any, idx: number) => {
              const inStock = (item.product_stock || 0) >= item.quantity;
              const isLow =
                (item.product_stock || 0) > 0 && (item.product_stock || 0) < 5;

              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-25 h-25  overflow-hidden flex-shrink-0 ">
                    <Image
                      src={item.product_image || productIcon}
                      alt="thumb"
                      width={100}
                      height={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-MontserratSemiBold line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-c12  uppercase font-MontserratMedium">
                        SKU: {item.variation_sku || item.product_sku}
                      </p>
                      <p className="text-c12 font-MontserratMedium">
                        Size: {item.attributes?.Size?.value || "N/A"}
                      </p>
                      <p className="text-c12 font-MontserratMedium">
                        Color: {item.attributes?.Color?.value || "N/A"}
                      </p>
                      {order.status === "PARTIALLY_ACCEPTED" && (
                        <div className="text-c12 font-MontserratMedium mt-2 p-2 bg-gray-50 rounded-lg space-y-1">
                          <p className="text-green-600">Accepted Quantity: {item.fulfilled_quantity || 0}</p>
                          <p className="text-red-500">Rejected Quantity: {item.rejected_quantity || 0}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <span
                        className={`text-sm  px-8 py-4 rounded-c12 font-MontserratMedium whitespace-nowrap ${
                          inStock
                            ? "bg-[#2D75651A] text-2d7565"
                            : isLow
                              ? "bg-[#FFAC061A] text-[#FFAC06]"
                              : "bg-red-50 text-ca0202"
                        }`}
                      >
                        {inStock
                          ? "In stock"
                          : isLow
                            ? "Low stock"
                            : "Out of stock"}
                      </span>
                      {!inStock && (
                        <button className="text-sm text-ff715b ">
                          Restock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.1)] z-40 border-t border-gray-100">
        <div className="flex gap-4 max-w-md mx-auto">
          {(getMappedStatus(order) === "unprocessed") && (
            <>
              <Button
                disabled={!order.can_accept}
                onClick={handleReject}
                className={`flex-1 py-3 bg-white border border-ca0202 text-ca0202 rounded-xl transition-all ${!order.can_accept ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-red-50"}`}
              >
                Reject
              </Button>
              <Button
                disabled={!order.can_accept}
                onClick={() => setShowAcceptModal(true)}
                className={`flex-1 py-3 bg-ff715b text-white rounded-xl transition-all shadow-lg shadow-ff715b/20 ${!order.can_accept ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-ff715b/90"}`}
              >
                Accept
              </Button>
            </>
          )}
          {(getMappedStatus(order) === "processed" || getMappedStatus(order) === "partially accepted") && (
            <button 
              disabled={timeLeft <= 0}
              onClick={() => setShowFulfillModal(true)}
              className={`w-full py-3 text-white rounded-xl font-MontserratSemiBold transition-all shadow-lg ${timeLeft > 0 ? "bg-ff715b shadow-ff715b/20 hover:bg-ff715b/90" : "opacity-50 cursor-not-allowed bg-gray-400"}`}
            >
              Mark as shipped
            </button>
          )}
        </div>
      </div>

      {/* Accept Order Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowAcceptModal(false)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
              >
                <Image src={XIcon} alt="close" width={20} height={20} />
              </button>

              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-c18 font-MontserratMedium text-000000">
                    Accept this order?
                  </h2>
                  <p className="text-c12 text-000000/68 font-MontserratNormal px-4">
                    You agree to fulfil and send this order to the closest
                    MartAf warehouse to your location
                  </p>
                </div>

                <form onSubmit={handleAccept} className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <Dropdown
                      label="Select warehouse location"
                      selected={selectedWarehouse?.name}
                      onSelect={(item) => setSelectedWarehouse(item)}
                      fetchItems={() => {}}
                      items={warehouses}
                      loading={loadingWarehouses}
                      placeholder="Select warehouse location"
                    />

                    <Dropdown
                      label="Select delivery partner"
                      selected={selectedDeliveryPartner?.name}
                      onSelect={(item) => setSelectedDeliveryPartner(item)}
                      fetchItems={() => {}}
                      items={deliveryPartners}
                      loading={loadingDeliveryPartners}
                      placeholder="Select delivery partner"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAcceptModal(false)}
                      variant = "secondary"
                  >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={accepting}
                      className=" disabled:cursor-not-allowed"
                    >
                      {accepting ? <LoadingSpinner /> : "Yes, I accept"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {showFulfillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowFulfillModal(false)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
              >
                <Image src={XIcon} alt="close" width={20} height={20} />
              </button>

              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-MontserratSemiBold text-000000">
                    Mark Order as Shipped
                  </h2>
                  <p className="text-sm text-gray-500 font-MontserratNormal px-4">
                    Please provide the parcel ID to track this shipment
                  </p>
                </div>

                <form onSubmit={handleFulfill} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-MontserratSemiBold block text-left">Parcel ID</label>
                    <input
                      type="text"
                      required
                      value={parcelId}
                      onChange={(e) => setParcelId(e.target.value)}
                      placeholder="e.g. PARCEL-67890"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-ff715b transition-colors"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowFulfillModal(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={fulfilling || !parcelId.trim()}
                      className="disabled:cursor-not-allowed"
                    >
                      {fulfilling ? <LoadingSpinner /> : "Confirm Shipment"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <ResultModal
        isOpen={resultModal.isOpen}
        result={resultModal.result}
        title={resultModal.title}
        message={resultModal.message}
        onCancel={() => setResultModal((prev) => ({ ...prev, isOpen: false }))}
        buttenText="Back to orders"
        onConfirm={() => {
          setResultModal((prev) => ({ ...prev, isOpen: false }));
          router.push("/dashboard/seller/orders");
        }}
      />
      </div>
    </div>
  );
}
