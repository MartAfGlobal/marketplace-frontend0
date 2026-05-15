"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import OrderDetailsSkeleton from "@/components/reloadSpinner/OrderDetailsSkeleton";
import ResultModal from "@/components/ui/forms/resultModal";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Components
import { OrderHeader } from "./components/OrderHeader";
import { OrderSummary } from "./components/OrderSummary";
import { OrderActions } from "./components/OrderActions";
import { OrderInfoSections } from "./components/OrderInfoSections";
import { OrderProgress } from "./components/OrderProgress";
import { OrderItemsList } from "./components/OrderItemsList";
import { AcceptOrderModal } from "./components/AcceptOrderModal";
import { FulfillOrderModal } from "./components/FulfillOrderModal";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);
  const {
    fetchOrderById,
    acceptOrder,
    rejectOrder,
    fulfillOrder,
    fetchWarehouses,
    fetchDeliveryPartners,
    loading,
  } = useFetchProducts();
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
    if (
      (lowerStatus === "pending" || lowerStatus === "unprocessed") &&
      order.time_remaining_to_accept
    ) {
      setTimeLeft(order.time_remaining_to_accept);
    } else if (
      (lowerStatus === "accepted" ||
        lowerStatus === "processed" ||
        lowerStatus === "partially_accepted") &&
      order.time_remaining_to_fulfill
    ) {
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
            err?.response?.data?.message || "Something went wrong. Please try again.",
        });
      }
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
            err?.response?.data?.message || "Something went wrong. Please try again.",
        });
      }
    );
  };

  const handleDownload = async () => {
    if (!pdfRef.current || !order) return;

    setIsDownloading(true);
    const toastId = toast.loading("Preparing document generators...");

    try {
      const { default: jsPDF } = await import("jspdf");
      const { toPng } = await import("html-to-image");

      toast.loading("Generating document...", { id: toastId });

      const element = pdfRef.current;

      const dataUrl = await toPng(element, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

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
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
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
      <div className="w-full lg:rounded-c16 mx-auto lg:p-8 lg:space-y-8 lg:bg-white min-h-screen bg-[#F8F8F8] px-4 py-6 lg:py-4 space-y-6">
        <div className="bg-white rounded-[16px] p-[24px] lg:p-0 lg:rounded-none min-h-[60vh]">
          <OrderDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-xl font-MontserratSemiBold text-ff715b">Order Not Found</p>
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

  return (
    <div className="w-full lg:rounded-c16 mx-auto lg:p-8 lg:space-y-8 lg:bg-white min-h-screen  py-6 lg:py-4 space-y-6">
      <OrderHeader onDownload={handleDownload} isDownloading={isDownloading} />

      <div ref={pdfRef} className="bg-white rounded-[16px] p-[24px] lg:p-0 lg:rounded-none">
        {/* Mobile Layout (lg:hidden) */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Time Left */}
          <div className="w-full flex justify-between items-center mb-2">
            <p className="font-MontserratSemiBold text-sm text-[#161616]">
              Time left for processing:
            </p>
            <span
              className={`font-MontserratSemiBold text-sm px-3 py-1 rounded-md ${timeLeft > 0 ? "bg-[#2D75651A] text-2d7565" : "bg-red-50 text-ca0202"}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <OrderProgress order={order} getMappedStatus={getMappedStatus} />

          <OrderSummary
            order={order}
            timeLeft={timeLeft}
            formatTime={formatTime}
            getStatusBadgeClass={getStatusBadgeClass}
            getMappedStatus={getMappedStatus}
          />

          <OrderInfoSections order={order} />

          <OrderItemsList
            order={order}
            mobileTab={mobileTab}
            setMobileTab={setMobileTab}
          />
        </div>

        {/* Desktop Layout (hidden lg:block) */}
        <div className="hidden lg:block space-y-8">
          <OrderSummary
            order={order}
            timeLeft={timeLeft}
            formatTime={formatTime}
            getStatusBadgeClass={getStatusBadgeClass}
            getMappedStatus={getMappedStatus}
          />

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <OrderInfoSections order={order} />

            <OrderActions
              order={order}
              getMappedStatus={getMappedStatus}
              onAcceptClick={() => setShowAcceptModal(true)}
              onRejectClick={handleReject}
              onFulfillClick={() => setShowFulfillModal(true)}
              timeLeft={timeLeft}
              formatTime={formatTime}
              isDesktop={true}
            />
          </div>

          <OrderProgress order={order} getMappedStatus={getMappedStatus} />

          <OrderItemsList
            order={order}
            mobileTab={mobileTab}
            setMobileTab={setMobileTab}
          />
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      <OrderActions
        order={order}
        getMappedStatus={getMappedStatus}
        onAcceptClick={() => setShowAcceptModal(true)}
        onRejectClick={handleReject}
        onFulfillClick={() => setShowFulfillModal(true)}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isDesktop={false}
      />

      <AnimatePresence>
        {showAcceptModal && (
          <AcceptOrderModal
            key="accept-modal"
            isOpen={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
            onAccept={handleAccept}
            warehouses={warehouses}
            loadingWarehouses={loadingWarehouses}
            selectedWarehouse={selectedWarehouse}
            setSelectedWarehouse={setSelectedWarehouse}
            deliveryPartners={deliveryPartners}
            loadingDeliveryPartners={loadingDeliveryPartners}
            selectedDeliveryPartner={selectedDeliveryPartner}
            setSelectedDeliveryPartner={setSelectedDeliveryPartner}
            accepting={accepting}
          />
        )}

        {showFulfillModal && (
          <FulfillOrderModal
            key="fulfill-modal"
            isOpen={showFulfillModal}
            onClose={() => setShowFulfillModal(false)}
            onFulfill={handleFulfill}
            parcelId={parcelId}
            setParcelId={setParcelId}
            fulfilling={fulfilling}
          />
        )}
      </AnimatePresence>

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
  );
}
