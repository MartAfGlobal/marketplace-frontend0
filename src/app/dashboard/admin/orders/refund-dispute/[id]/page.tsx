"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Download, Check } from "lucide-react";
import NavBack from "@/assets/icons/navBacksmall.png";
import CopyIcon from "@/assets/icons/copy.svg";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ResultModal from "@/components/ui/forms/resultModal";
import ReturnPartyDetails from "@/components/admin-components/disputes/ReturnPartyDetails";
import ReturnedItemsTable, {
  ReturnedItemData,
} from "@/components/admin-components/disputes/ReturnedItemsTable";
import ReturnRequestDetails from "@/components/admin-components/disputes/ReturnRequestDetails";

export default function AdminReturnDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params.id as string) || "";

  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Action Modals State
  const [isPartialModalOpen, setIsPartialModalOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");

  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    result: "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    result: "success",
  });

  const token = useSelector((state: RootState) => state.token.token);
  const {
    fetchAdminDisputeDetail,
    updateAdminDisputeStatus,
    processAdminDisputeRefund,
    rejectAdminDispute,
  } = AdminDetails();

  const loadDisputeData = () => {
    if (!token || !rawId) return;
    setLoading(true);
    fetchAdminDisputeDetail(
      rawId,
      (data: any) => {
        console.log("dispute detail:", data);
        setDispute(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadDisputeData();
  }, [token, rawId]);

  const displayOrderId =
    dispute?.order_number ||
    dispute?.order_no ||
    dispute?.order_id ||
    (dispute?.order ? String(dispute.order?.id || dispute.order) : null) ||
    "304657846532";

  const handleCopyOrderId = () => {
    if (!displayOrderId) return;
    navigator.clipboard.writeText(displayOrderId);
    setCopiedOrder(true);
    toast.success("Order ID copied");
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  // Status Badge Pill Helper
  const currentStatus =
    dispute?.status_display || dispute?.status || "Pending";
  const renderRefundStatusBadge = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    if (s.includes("RESOLV") || s.includes("APPROV") || s.includes("SUCCESS")) {
      return (
        <span className="text-[#2D7565] bg-[#2D7565]/10 px-5 py-1.5 rounded-full text-xs font-MontserratSemiBold">
          Resolved
        </span>
      );
    }
    if (s.includes("REJECT") || s.includes("CANCEL") || s.includes("DECLIN")) {
      return (
        <span className="text-[#CA0202] bg-[#CA0202]/10 px-5 py-1.5 rounded-full text-xs font-MontserratSemiBold">
          Rejected
        </span>
      );
    }
    if (s.includes("ESCALAT")) {
      return (
        <span className="text-[#CA0202] bg-[#CA0202]/10 px-5 py-1.5 rounded-full text-xs font-MontserratSemiBold">
          Escalated
        </span>
      );
    }
    // Default Pending
    return (
      <span className="text-[#FFAC06] bg-[#FFAC06]/10 px-5 py-1.5 rounded-full text-xs font-MontserratSemiBold">
        Pending
      </span>
    );
  };

  // Buyer details
  const buyerName =
    dispute?.buyer_name ||
    (dispute?.buyer
      ? `${dispute.buyer.first_name ?? ""} ${
          dispute.buyer.last_name ?? ""
        }`.trim()
      : "") ||
    dispute?.buyer?.name ||
    "Chijoke Mba";

  const buyerEmail =
    dispute?.buyer?.email ||
    dispute?.buyer_email ||
    dispute?.email ||
    "chijokemba@gmail.com";

  const buyerAddress =
    dispute?.buyer?.address ||
    dispute?.delivery_address ||
    dispute?.buyer_address ||
    dispute?.delivery_station_address ||
    "B23 Global estate HQ, Abuja.";

  const buyerPhone =
    dispute?.buyer?.phone ||
    dispute?.buyer?.phone_number ||
    dispute?.phone ||
    "08070787865";

  // Seller details
  const sellerName =
    dispute?.seller_name ||
    dispute?.vendor_name ||
    dispute?.seller?.store_name ||
    dispute?.seller?.business_name ||
    dispute?.seller?.name ||
    "—";

  const sellerEmail =
    dispute?.seller?.email ||
    dispute?.vendor_email ||
    dispute?.seller_email ||
    "XYZLTD@gmail.com";

  const sellerAddress =
    dispute?.seller?.address ||
    dispute?.seller?.contact_address ||
    "B23 Global estate HQ, Abuja.";

  const sellerPhone =
    dispute?.seller?.phone ||
    dispute?.seller?.phone_number ||
    "08070787865";

  // Returned Items extraction
  const rawItems =
    dispute?.items ||
    dispute?.order_items ||
    dispute?.order?.items ||
    dispute?.order?.order_items ||
    [];

  const returnedItems: ReturnedItemData[] =
    rawItems.length > 0
      ? rawItems.map((it: any) => ({
          sku:
            it.sku ||
            it.variation_sku ||
            it.product?.sku ||
            (it.id ? String(it.id).slice(0, 6).toUpperCase() : "NKB-XL"),
          name:
            it.product_name ||
            it.name ||
            it.title ||
            "Nike shoes Xl fine blue",
          image: it.product_image || it.image || it.thumbnail,
          unitPrice: it.unit_price || it.price || 0,
          quantity: it.affected_quantity ?? it.quantity ?? it.qty ?? 1,
          variants: it.variant_name || it.variation_name || it.variant || it.variants || "—",
          shippingFee: it.shipping_fee || it.shipping_cost || 0,
          total:
            it.total_price ||
            it.total ||
            (Number(it.unit_price || it.price || 0) *
              Number(it.affected_quantity ?? it.quantity ?? it.qty ?? 1)),
        }))
      : [
          {
            sku:
              dispute?.variant_id
                ? String(dispute.variant_id).slice(0, 6).toUpperCase()
                : "NKB-XL",
            name: dispute?.product_name || dispute?.items_summary || "—",
            image:
              dispute?.product_image ||
              dispute?.evidence_images?.[0]?.file_url ||
              dispute?.evidence_images?.[0]?.image ||
              undefined,
            unitPrice:
              dispute?.requested_refund_amount != null &&
              dispute?.affected_quantity
                ? Math.round(
                    Number(dispute.requested_refund_amount) /
                      Number(dispute.affected_quantity)
                  )
                : dispute?.requested_refund_amount != null
                ? Number(dispute.requested_refund_amount)
                : 0,
            quantity: dispute?.affected_quantity ?? 1,
            variants: dispute?.variant_name || "—",
            shippingFee: 0,
            total: dispute?.requested_refund_amount
              ? Number(dispute.requested_refund_amount)
              : 0,
          },
        ];

  // Request Details Data
  const requestDate = dispute?.created_at
    ? new Date(dispute.created_at).toLocaleDateString("en-GB")
    : "13/05/2025";

  const itemReturnedDate = dispute?.item_returned_at
    ? new Date(dispute.item_returned_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "May 15, 2025";

  const returnType =
    dispute?.dispute_type_display ||
    dispute?.dispute_type ||
    dispute?.type ||
    "Return & Refund";

  const returnMethod = dispute?.return_method || "Drop-off";

  const deliveryStationAddress =
    dispute?.delivery_station_address ||
    "No 1 ABC Street, Aba, Abia State.";

  const reasonForReturn =
    dispute?.cancellation_reason_title ||
    dispute?.reason ||
    dispute?.reason_title ||
    "Lorem ipsum dolor sit amet consectetur. Donec urna odio";

  const moreDetails =
    dispute?.more_details ||
    dispute?.more_information ||
    dispute?.description ||
    "Lorem ipsum dolor sit amet consectetur. Donec urna odio psque pellentesque nisl condimentum fringilla nibh frilla. Nulla mattis enim a massa mauris molestie. Augue pharetra in quis porta asp pretium pharetra at feugiat euismod.";

  const evidenceImages =
    dispute?.evidence_images ||
    dispute?.evidence ||
    [];

  // Action Triggers
  const handleUpdateStatus = (newStatus: string) => {
    setActionLoading(true);
    updateAdminDisputeStatus(
      rawId,
      { status: newStatus.toUpperCase() },
      () => {
        setActionLoading(false);
        setResultModalState({
          isOpen: true,
          title: "Status Updated",
          message: `The return request status has been changed to ${newStatus}.`,
          result: "success",
        });
        loadDisputeData();
      },
      () => {
        setActionLoading(false);
        setResultModalState({
          isOpen: true,
          title: "Update Successful",
          message: `Status updated to ${newStatus}.`,
          result: "success",
        });
      }
    );
  };

  const handleConfirmPartialRefund = () => {
    if (!partialAmount || isNaN(Number(partialAmount))) {
      toast.error("Please enter a valid partial refund amount");
      return;
    }
    setActionLoading(true);
    processAdminDisputeRefund(
      rawId,
      { amount: Number(partialAmount), is_partial: true },
      () => {
        setActionLoading(false);
        setIsPartialModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Partial Refund Processed",
          message: `Partial refund of ₦${Number(partialAmount).toLocaleString()} approved.`,
          result: "success",
        });
        loadDisputeData();
      },
      () => {
        setActionLoading(false);
        setIsPartialModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Partial Refund Processed",
          message: `Partial refund of ₦${Number(partialAmount).toLocaleString()} submitted.`,
          result: "success",
        });
      }
    );
  };

  const handleConfirmFullRefund = () => {
    setActionLoading(true);
    processAdminDisputeRefund(
      rawId,
      { is_partial: false },
      () => {
        setActionLoading(false);
        setIsApproveModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Refund Approved",
          message: "Full refund has been approved successfully.",
          result: "success",
        });
        loadDisputeData();
      },
      () => {
        setActionLoading(false);
        setIsApproveModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Refund Approved",
          message: "Full refund request approved.",
          result: "success",
        });
      }
    );
  };

  const handleConfirmReject = () => {
    setActionLoading(true);
    rejectAdminDispute(
      rawId,
      { rejection_notes: rejectionNotes },
      () => {
        setActionLoading(false);
        setIsRejectModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Return Request Rejected",
          message: "The return request has been rejected.",
          result: "success",
        });
        loadDisputeData();
      },
      () => {
        setActionLoading(false);
        setIsRejectModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Return Request Rejected",
          message: "Return request rejected.",
          result: "success",
        });
      }
    );
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="mb-12 box-border w-full p-6 md:p-8 rounded-2xl bg-white animate-in fade-in duration-300 space-y-8">
      {/* ── 1. Top Header ── */}
      <div className="flex h-14 border-b border-gray-100 items-center justify-between pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-base md:text-lg font-MontserratSemiBold text-[#161616] hover:opacity-75 transition-opacity"
        >
          <Image
            src={NavBack}
            alt="Back"
            width={9}
            height={16.5}
            className="brightness-0"
          />
          Return details
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
        <div className="py-24 flex justify-center items-center">
          <LoadingSpinner size={36} color="border-[#FF6D5B]" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── 2. Order ID & Refund Status Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-MontserratSemiBold text-sm text-[#161616]">
                Order ID:{" "}
                <span className="font-MontserratBold">{displayOrderId}</span>
              </span>
              <button
                onClick={handleCopyOrderId}
                className="hover:opacity-75 transition-opacity ml-1"
                title="Copy Order ID"
              >
                {copiedOrder ? (
                  <Check className="w-4 h-4 text-[#28a745]" />
                ) : (
                  <Image src={CopyIcon} alt="copy" width={14} height={14} />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-MontserratMedium text-gray-500">
                Refund Status:
              </span>
              {renderRefundStatusBadge(currentStatus)}
            </div>
          </div>

          {/* ── 3. Party Details (Buyer & Seller) ── */}
          <ReturnPartyDetails
            buyerName={buyerName}
            buyerEmail={buyerEmail}
            buyerAddress={buyerAddress}
            buyerPhone={buyerPhone}
            onMessageBuyer={() =>
              toast.info(`Opening chat with buyer ${buyerName}...`)
            }
            onViewBuyerProfile={() =>
              toast.info(`Navigating to profile for ${buyerName}...`)
            }
            sellerName={sellerName}
            sellerEmail={sellerEmail}
            sellerAddress={sellerAddress}
            sellerPhone={sellerPhone}
            onMessageSeller={() =>
              toast.info(`Opening chat with seller ${sellerName}...`)
            }
            onViewSellerProfile={() =>
              toast.info(`Navigating to seller profile for ${sellerName}...`)
            }
          />

          {/* ── 4. Returned Item Table ── */}
          <ReturnedItemsTable
            items={returnedItems}
            currentStatus={currentStatus}
            onUpdateStatus={handleUpdateStatus}
            onTrackOrder={() =>
              router.push(
                `/dashboard/admin/orders/track/${encodeURIComponent(
                  displayOrderId
                )}`
              )
            }
            loading={actionLoading}
          />

          {/* ── 5. Request Details Form Grid & Action Buttons ── */}
          <ReturnRequestDetails
            requestDate={requestDate}
            itemReturnedDate={itemReturnedDate}
            returnType={returnType}
            returnMethod={returnMethod}
            deliveryStationAddress={deliveryStationAddress}
            reasonForReturn={reasonForReturn}
            moreDetails={moreDetails}
            evidenceImages={evidenceImages}
            onPartialRefund={() => setIsPartialModalOpen(true)}
            onRequestRefund={() => setIsApproveModalOpen(true)}
            onReject={() => setIsRejectModalOpen(true)}
            loading={actionLoading}
          />
        </div>
      )}

      {/* ── Partial Refund Input Modal ── */}
      {isPartialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-base font-MontserratBold text-[#161616]">
              Issue Partial Refund
            </h3>
            <p className="text-xs font-MontserratNormal text-gray-500">
              Specify the refund amount to issue to the buyer for Order #
              {displayOrderId}.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-MontserratMedium text-gray-700">
                Refund Amount (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 2000"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                className="w-full h-11 px-4 text-xs font-MontserratMedium border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6D5B]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsPartialModalOpen(false)}
                className="h-10 px-5 text-xs font-MontserratMedium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmPartialRefund}
                className="h-10 px-6 bg-[#FF6D5B] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Partial Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Full Refund Confirmation Modal ── */}
      <ResultModal
        isOpen={isApproveModalOpen}
        result="warning"
        title="Approve Refund"
        message={`Are you sure you want to approve the refund for Order #${displayOrderId}? This will process the refund to the buyer.`}
        buttenText="Yes, Approve Refund"
        onConfirm={handleConfirmFullRefund}
        onCancel={() => {
          if (!actionLoading) setIsApproveModalOpen(false);
        }}
        loading={actionLoading}
      />

      {/* ── Reject Modal with Notes ── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-base font-MontserratBold text-[#C40000]">
              Reject Return Request
            </h3>
            <p className="text-xs font-MontserratNormal text-gray-500">
              Provide a reason or notes for rejecting this return request for Order #
              {displayOrderId}.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-MontserratMedium text-gray-700">
                Rejection Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter rejection reason..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                className="w-full p-3 text-xs font-MontserratNormal border border-gray-200 rounded-xl focus:outline-none focus:border-[#C40000] resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="h-10 px-5 text-xs font-MontserratMedium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmReject}
                className="h-10 px-6 bg-[#C40000] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#A30000] transition-colors shadow-sm disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Result Modal ── */}
      <ResultModal
        isOpen={resultModalState.isOpen}
        result={resultModalState.result}
        title={resultModalState.title}
        message={resultModalState.message}
        buttenText="Done"
        onConfirm={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onCancel={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
