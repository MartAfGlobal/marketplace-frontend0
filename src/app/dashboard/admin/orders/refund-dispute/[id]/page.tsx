"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Download, Check } from "lucide-react";
import NavBack from "@/assets/icons/navBacksmall.png";
import CopyIcon from "@/assets/icons/copy.svg";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/Button/Button";
import ResultModal from "@/components/ui/forms/resultModal";
import ReturnPartyDetails from "@/components/admin-components/disputes/ReturnPartyDetails";
import ReturnedItemsTable, {
  ReturnedItemData,
} from "@/components/admin-components/disputes/ReturnedItemsTable";
import ReturnRequestDetails from "@/components/admin-components/disputes/ReturnRequestDetails";
import {
  ConfirmRefundRequestDrawer,
  RequestPartialRefundDrawer,
} from "@/components/admin-components/disputes/RefundActionDrawers";
import UpdateReturnStatusModal, {
  ReturnActionType,
} from "@/components/ui/Modals/admin/UpdateReturnStatusModal";

export default function AdminReturnDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params.id as string) || "";
  const detailType = searchParams.get("type"); // "refund" or "dispute"

  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Update Status Modal State
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedReturnAction, setSelectedReturnAction] =
    useState<ReturnActionType>("MARK_RETURN_RECEIVED");
  const [selectedResolutionType, setSelectedResolutionType] = useState<
    "FULL_REFUND" | "PARTIAL_REFUND"
  >("FULL_REFUND");

  // Refund Drawer States
  const [confirmRefundOpen, setConfirmRefundOpen] = useState(false);
  const [partialRefundOpen, setPartialRefundOpen] = useState(false);

  // Pending Refund Status State (from GET /refunds/admin/?status=PENDING&search=<payment_no>)
  const [pendingRefundStatus, setPendingRefundStatus] = useState<string | null>(null);
  const [hasPendingRefund, setHasPendingRefund] = useState<boolean | null>(null);

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
    fetchAdminRefundDetail,
    fetchAdminRefundsList,
    processAdminDisputeRefund,
    approveAdminDispute,
    createAdminRefund,
    processAdminRefund,
    rejectAdminRefund,
  } = AdminDetails();

  const checkPendingRefundStatus = (disputeObj: any) => {
    const paymentNo =
      disputeObj?.payment_no ||
      disputeObj?.payment_number ||
      disputeObj?.payment_reference ||
      disputeObj?.payment_id ||
      disputeObj?.order_number ||
      disputeObj?.order_no ||
      disputeObj?.order?.payment_no ||
      disputeObj?.order?.order_number ||
      disputeObj?.refund_reference ||
      rawId;

    if (!paymentNo || !token) return;

    console.log(`Executing: GET /refunds/admin/?status=PENDING&search=${paymentNo}`);

    fetchAdminRefundsList(
      { status: "PENDING", search: String(paymentNo) },
      (responseData: any) => {
        console.log(
          `GET /refunds/admin/?status=PENDING&search=${paymentNo} result:`,
          responseData
        );
        const results =
          responseData?.results ??
          responseData?.data?.results ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);

        const list = Array.isArray(results) ? results : [];
        const pendingItem =
          list.find((item: any) => {
            const st = (item?.status || item?.status_display || "").toUpperCase();
            return st === "PENDING" || st.includes("PENDING");
          }) || (list.length > 0 ? list[0] : null);

        const derivedStatus =
          pendingItem?.status_display || pendingItem?.status || "Pending";

        if (pendingItem) {
          console.log(
            `Status for paymentNo ${paymentNo} is PENDING:`,
            pendingItem,
            "Status display:",
            derivedStatus
          );
          setHasPendingRefund(true);
          setPendingRefundStatus(derivedStatus);
        } else {
          console.log(
            `No pending refund status found for paymentNo: ${paymentNo}`
          );
          setHasPendingRefund(false);
          setPendingRefundStatus(null);
        }
      },
      (err: any) => {
        console.error("Fetch pending refund status error:", err);
        setHasPendingRefund(false);
        setPendingRefundStatus(null);
      }
    );
  };

  const loadDisputeData = () => {
    if (!token || !rawId) return;
    setLoading(true);

    if (detailType === "refund") {
      fetchAdminRefundDetail(
        rawId,
        (data: any) => {
          console.log("refund detail:", data);
          setDispute(data);
          setLoading(false);
          checkPendingRefundStatus(data);
        },
        () => {
          // Fallback to dispute detail if refund endpoint fails
          fetchAdminDisputeDetail(
            rawId,
            (fbData: any) => {
              setDispute(fbData);
              setLoading(false);
              checkPendingRefundStatus(fbData);
            },
            () => setLoading(false),
          );
        },
      );
    } else {
      fetchAdminDisputeDetail(
        rawId,
        (data: any) => {
          console.log("dispute detail:", data);
          setDispute(data);
          setLoading(false);
          checkPendingRefundStatus(data);
        },
        () => {
          // Fallback to refund detail if dispute endpoint fails
          fetchAdminRefundDetail(
            rawId,
            (fbData: any) => {
              setDispute(fbData);
              setLoading(false);
              checkPendingRefundStatus(fbData);
            },
            () => setLoading(false),
          );
        },
      );
    }
  };

  useEffect(() => {
    loadDisputeData();
  }, [token, rawId, detailType]);

  const displayOrderId =
    dispute?.order_number ||
    dispute?.order_no ||
    dispute?.order_id ||
    dispute?.payment_number ||
    (dispute?.order ? String(dispute.order?.id || dispute.order) : null) ||
    (dispute?.refund_reference ? dispute.refund_reference : null) ||
    dispute?.id ||
    "—";

  const handleCopyOrderId = () => {
    if (!displayOrderId) return;
    navigator.clipboard.writeText(displayOrderId);
    setCopiedOrder(true);
    toast.success("Order ID copied");
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  // Status Badge Pill Helper
  const currentStatus =
    pendingRefundStatus ||
    dispute?.status_display ||
    dispute?.status ||
    "Pending";
  const renderRefundStatusBadge = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    if (s.includes("RESOLV") || s.includes("APPROV") || s.includes("SUCCESS")) {
      return (
        <span className="text-[#2D7565] bg-[#2D7565]/12 px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold">
          Resolved
        </span>
      );
    }
    if (s.includes("REJECT") || s.includes("CANCEL") || s.includes("DECLIN")) {
      return (
        <span className="text-[#CA0202] bg-[#CA0202]/12 px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold">
          Rejected
        </span>
      );
    }
    if (s.includes("ESCALAT")) {
      return (
        <span className="text-[#CA0202] bg-[#CA0202]/12 px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold">
          Escalated
        </span>
      );
    }
    // Default Pending
    return (
      <span className="text-[#FFAC06] bg-[#FFAC06]/12 px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold">
        Pending
      </span>
    );
  };

  const sUpper = currentStatus.toUpperCase();

  const isApproved =
    sUpper.includes("APPROV") ||
    sUpper.includes("IN_TRANSIT") ||
    sUpper.includes("ITEM_RETURNED") ||
    sUpper.includes("RETURN_APPROVED");

  const isResolved =
    sUpper.includes("RESOLV") ||
    sUpper.includes("SUCCESS") ||
    sUpper.includes("COMPLET");

  const isRejected =
    sUpper.includes("REJECT") ||
    sUpper.includes("CANCEL") ||
    sUpper.includes("DECLIN");

  const isRequested = !isApproved && !isResolved && !isRejected;

  const isRefundTable =
    detailType === "refund" ||
    Boolean(
      dispute?.refund_reference ||
      dispute?.refund_type ||
      dispute?.refund_type_display
    );

  // Check pending refund condition from GET /refunds/admin/?status=PENDING&search=<payment_no>
  const isPendingRefundConditionMet =
    hasPendingRefund === true ||
    (hasPendingRefund === null && (isRefundTable || isResolved));

  const showRefundActions = isPendingRefundConditionMet && !isRejected;

  const canUpdateStatus = !isResolved && !isRejected;

  console.log("Refund Details Status Summary:", {
    currentStatus,
    pendingRefundStatus,
    hasPendingRefund,
    isPendingRefundConditionMet,
    showRefundActions,
    canUpdateStatus,
  });

  // Buyer details
  const buyerName =
    dispute?.buyer_name ||
    (dispute?.buyer
      ? `${dispute.buyer.first_name ?? ""} ${
          dispute.buyer.last_name ?? ""
        }`.trim()
      : "") ||
    dispute?.buyer?.name ||
    "—";

  const buyerAvatar =
    dispute?.buyer_avatar ||
    dispute?.buyer?.avatar ||
    dispute?.buyer?.image ||
    dispute?.buyer?.profile_image ||
    undefined;

  const buyerEmail =
    dispute?.buyer?.email || dispute?.buyer_email || dispute?.email || "—";

  const buyerAddress =
    dispute?.buyer_address ||
    dispute?.buyer?.address ||
    dispute?.delivery_address ||
    dispute?.delivery_station_address ||
    "—";

  const buyerPhone =
    dispute?.buyer_phone ||
    dispute?.buyer?.phone ||
    dispute?.buyer?.phone_number ||
    dispute?.phone ||
    "—";

  // Seller details
  const sellerName =
    dispute?.seller_name ||
    dispute?.vendor_name ||
    dispute?.seller?.store_name ||
    dispute?.seller?.business_name ||
    dispute?.seller?.name ||
    dispute?.order_item?.manufacturer_name ||
    "—";

  const sellerAvatar =
    dispute?.seller_avatar ||
    dispute?.seller?.avatar ||
    dispute?.seller?.image ||
    dispute?.seller?.profile_image ||
    dispute?.seller?.store_logo ||
    undefined;

  const sellerEmail =
    dispute?.seller_email ||
    dispute?.seller?.email ||
    dispute?.vendor_email ||
    dispute?.order_item?.manufacturer_email ||
    "—";

  const sellerAddress =
    dispute?.seller_address ||
    dispute?.seller?.address ||
    dispute?.seller?.contact_address ||
    "—";

  const sellerPhone =
    dispute?.seller_phone ||
    dispute?.seller?.phone ||
    dispute?.seller?.phone_number ||
    "—";

  // Returned Items extraction
  const rawItems =
    (Array.isArray(dispute?.items) && dispute.items.length > 0 ? dispute.items : null) ||
    (Array.isArray(dispute?.order_items) && dispute.order_items.length > 0 ? dispute.order_items : null) ||
    (Array.isArray(dispute?.order?.items) && dispute.order.items.length > 0 ? dispute.order.items : null) ||
    (Array.isArray(dispute?.order?.order_items) && dispute.order.order_items.length > 0 ? dispute.order.order_items : null) ||
    (dispute?.order_item ? [dispute.order_item] : []);

  const returnedItems: ReturnedItemData[] =
    rawItems.length > 0
      ? rawItems.map((it: any) => ({
          sku:
            it.variation_sku ||
            it.product_sku ||
            it.sku ||
            it.item_sku ||
            (it.id ? String(it.id).slice(0, 6).toUpperCase() : "—"),
          name:
            it.item_name || it.product_name || it.name || it.title || "—",
          image: it.product_image || it.image || it.thumbnail,
          unitPrice:
            it.unit_price ||
            it.price_at_purchase ||
            it.price ||
            (it.item_amount && it.quantity
              ? Math.round(Number(it.item_amount) / Number(it.quantity))
              : dispute?.item_amount && (it.quantity || dispute?.quantity)
                ? Math.round(Number(dispute.item_amount) / Number(it.quantity || dispute.quantity))
                : 0),
          quantity: it.affected_quantity ?? it.quantity ?? it.qty ?? dispute?.quantity ?? 1,
          variants:
            it.variation_name ||
            it.variant_name ||
            it.variant ||
            it.variants ||
            "—",
          shippingFee:
            it.shipping_fee || it.shipping_cost || it.shipping_share || 0,
          total:
            it.total_price ||
            it.total ||
            it.item_amount ||
            (it.price_at_purchase && (it.quantity || dispute?.quantity)
              ? Number(it.price_at_purchase) * Number(it.quantity || dispute?.quantity || 1)
              : dispute?.item_amount != null
                ? Number(dispute.item_amount)
                : Number(it.unit_price || it.price || 0) *
                  Number(it.affected_quantity ?? it.quantity ?? it.qty ?? 1)),
        }))
      : [
          {
            sku:
              dispute?.order_item?.variation_sku ||
              dispute?.order_item?.product_sku ||
              dispute?.item_sku ||
              dispute?.sku ||
              (dispute?.variant_id
                ? String(dispute.variant_id).slice(0, 6).toUpperCase()
                : dispute?.refund_reference || "—"),
            name:
              dispute?.order_item?.item_name ||
              dispute?.order_item?.product_name ||
              dispute?.item_name ||
              dispute?.product_name ||
              dispute?.items_summary ||
              dispute?.reason ||
              "—",
            image:
              dispute?.order_item?.product_image ||
              dispute?.product_image ||
              dispute?.evidence_images?.[0]?.file_url ||
              dispute?.evidence_images?.[0]?.image ||
              undefined,
            unitPrice:
              dispute?.order_item?.price_at_purchase != null
                ? Number(dispute.order_item.price_at_purchase)
                : dispute?.item_amount != null && dispute?.quantity
                  ? Math.round(Number(dispute.item_amount) / Number(dispute.quantity))
                  : dispute?.amount != null && dispute?.quantity
                    ? Math.round(Number(dispute.amount) / Number(dispute.quantity))
                    : dispute?.requested_refund_amount != null &&
                        dispute?.affected_quantity
                      ? Math.round(
                          Number(dispute.requested_refund_amount) /
                            Number(dispute.affected_quantity),
                        )
                      : dispute?.item_amount != null
                        ? Number(dispute.item_amount)
                        : dispute?.amount != null
                          ? Number(dispute.amount)
                          : dispute?.requested_refund_amount != null
                            ? Number(dispute.requested_refund_amount)
                            : 0,
            quantity: dispute?.order_item?.quantity ?? dispute?.quantity ?? dispute?.affected_quantity ?? 1,
            variants:
              dispute?.order_item?.variation_name ||
              dispute?.variant_name ||
              dispute?.refund_type_display ||
              "—",
            shippingFee:
              dispute?.order_item?.shipping_share ??
              dispute?.shipping_amount ??
              dispute?.breakdown?.shipping_amount ??
              0,
            total:
              dispute?.order_item?.total_price != null
                ? Number(dispute.order_item.total_price)
                : dispute?.item_amount != null
                  ? Number(dispute.item_amount)
                  : dispute?.amount != null
                    ? Number(dispute.amount)
                    : dispute?.requested_refund_amount != null
                      ? Number(dispute.requested_refund_amount)
                      : 0,
          },
        ];

  // Request Details Data
  const requestDate = dispute?.created_at
    ? new Date(dispute.created_at).toLocaleDateString("en-GB")
    : "—";

  const itemReturnedDate = dispute?.item_returned_at
    ? new Date(dispute.item_returned_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  const returnType =
    dispute?.refund_type_display ||
    dispute?.refund_type ||
    dispute?.dispute_type_display ||
    dispute?.dispute_type ||
    dispute?.type ||
    "Return & Refund";

  const returnMethod = dispute?.return_method || "Drop-off";

  const deliveryStationAddress =
    dispute?.delivery_station_address || "—";

  const reasonForReturn =
    dispute?.cancellation_reason_title ||
    dispute?.reason ||
    dispute?.reason_title ||
    "—";

  const moreDetails =
    dispute?.more_details ||
    dispute?.more_information ||
    dispute?.description ||
    "";

  const evidenceImages = dispute?.evidence_images || dispute?.evidence || [];

  const orderItemPrice =
    dispute?.item_amount != null
      ? Number(dispute.item_amount)
      : dispute?.breakdown?.item_amount != null
        ? Number(dispute.breakdown.item_amount)
        : returnedItems.reduce(
            (acc, it) =>
              acc + Number(it.unitPrice || 0) * Number(it.quantity || 1),
            0
          );
  const orderDeliveryFee = Number(
    dispute?.shipping_amount ??
      dispute?.breakdown?.shipping_amount ??
      dispute?.delivery_fee ??
      dispute?.shipping_fee ??
      dispute?.order?.delivery_fee ??
      dispute?.order?.shipping_fee ??
      0
  );
  const orderTotalAmount =
    Number(
      dispute?.breakdown?.total ??
        dispute?.total_amount ??
        dispute?.order?.total_amount ??
        dispute?.order?.total
    ) || orderItemPrice + orderDeliveryFee;
  const orderRefundAmount = Number(
    dispute?.amount != null
      ? dispute.amount
      : dispute?.requested_refund_amount != null
        ? dispute.requested_refund_amount
        : orderItemPrice
  );

  const handleApproveRefund = (adminNotes?: string) => {
    setActionLoading(true);
    const targetId = String(dispute?.id || rawId || "");

    processAdminRefund(
      targetId,
      { admin_notes: adminNotes || "Reviewed and approved." },
      () => {
        setActionLoading(false);
        setConfirmRefundOpen(false);
        setPartialRefundOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Refund Approved & Processed",
          message: "The refund has been approved and processed via Paystack.",
          result: "success",
        });
        loadDisputeData();
      },
      (err: any) => {
        setActionLoading(false);
        if (err?.status === 403 || err?.response?.status === 403) {
          toast.error(
            "Permission denied: Only super-admins can process/approve refunds."
          );
        } else {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.response?.data?.error ||
            err?.data?.message ||
            err?.data?.detail ||
            err?.message ||
            "Failed to process refund via Paystack.";
          toast.error(msg);
        }
      }
    );
  };

  const handleRejectRefund = (adminNotes?: string) => {
    setActionLoading(true);
    const targetId = String(dispute?.id || rawId || "");

    rejectAdminRefund(
      targetId,
      { admin_notes: adminNotes || "Not eligible -- past the return window." },
      () => {
        setActionLoading(false);
        setConfirmRefundOpen(false);
        setPartialRefundOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Refund Request Rejected",
          message: "The refund request status has been updated to REJECTED.",
          result: "success",
        });
        loadDisputeData();
      },
      (err: any) => {
        setActionLoading(false);
        if (err?.status === 403 || err?.response?.status === 403) {
          toast.error(
            "Permission denied: Only super-admins can reject refund requests."
          );
        } else {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.response?.data?.error ||
            err?.data?.message ||
            err?.data?.detail ||
            err?.message ||
            "Failed to reject refund request.";
          toast.error(msg);
        }
      }
    );
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="mb-12 box-border w-full p-6 md:p-8 rounded-2xl bg-white animate-in fade-in duration-300 space-y-8">
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
            <div className="flex items-center gap-1">
              <span className="font-MontserratSemiBold text-sm ">
                Order ID: <span className="">{displayOrderId}</span>
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

            <div className="flex items-center gap-6">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Refund Status:
              </span>
              {renderRefundStatusBadge(currentStatus)}
            </div>
          </div>

          {/* ── 3. Party Details (Buyer & Seller) ── */}
          <ReturnPartyDetails
            buyerName={buyerName}
            buyerAvatar={buyerAvatar}
            buyerEmail={buyerEmail}
            buyerAddress={buyerAddress}
            buyerPhone={buyerPhone}
            onMessageBuyer={() =>
              toast.info(`Opening chat with buyer ${buyerName}...`)
            }
            onViewBuyerProfile={() => {
              const buyerId =
                dispute?.buyer_id ||
                dispute?.buyer?.id ||
                dispute?.user_id ||
                dispute?.user?.id ||
                dispute?.customer_id;
              if (buyerId) {
                router.push(`/dashboard/admin/users/buyers/${buyerId}?from=Return+details`);
              } else {
                router.push(
                  `/dashboard/admin/users?type=buyers${buyerName ? `&search=${encodeURIComponent(buyerName)}` : ""}`
                );
              }
            }}
            sellerName={sellerName}
            sellerAvatar={sellerAvatar}
            sellerEmail={sellerEmail}
            sellerAddress={sellerAddress}
            sellerPhone={sellerPhone}
            onMessageSeller={() =>
              toast.info(`Opening chat with seller ${sellerName}...`)
            }
            onViewSellerProfile={() => {
              const sellerId =
                dispute?.seller_id ||
                dispute?.seller?.id ||
                dispute?.store_id ||
                dispute?.shop_id ||
                dispute?.vendor_id ||
                dispute?.order_item?.manufacturer_id ||
                dispute?.manufacturer_id;
              if (sellerId) {
                router.push(`/dashboard/admin/users/sellers/${sellerId}?from=Return+details`);
              } else {
                router.push(
                  `/dashboard/admin/users?type=sellers${sellerName ? `&search=${encodeURIComponent(sellerName)}` : ""}`
                );
              }
            }}
          />

          {/* ── 4. Returned Item Table ── */}
          <ReturnedItemsTable
            items={returnedItems}
            currentStatus={currentStatus}
            onTrackOrder={() =>
              router.push(
                `/dashboard/admin/orders/track/${encodeURIComponent(
                  displayOrderId,
                )}`,
              )
            }
            loading={actionLoading}
          />

          {/* ── Update Return Status Section (Matching Order Details UI & Flow) ── */}
          <div className="space-y-4">
            <h3 className="text-sm font-MontserratSemiBold">
              Update Return Status
            </h3>

            <div className="flex items-start gap-4">
              {/* Current return status indicator */}
              <div
                className={`flex items-center justify-between w-full max-w-[240px] h-c44 px-4 border rounded-c8 text-sm font-MontserratMedium transition-colors ${
                  canUpdateStatus
                    ? "border-[#E5E7EB] bg-white text-[#000000]/68 cursor-pointer hover:border-[#FF6D5B]"
                    : "border-[#E5E7EB] bg-[#F9FAFB] text-[#000000]/30 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (canUpdateStatus) {
                    setSelectedReturnAction(
                      isApproved ? "MARK_RETURN_RECEIVED" : "APPROVE_RETURN"
                    );
                    setUpdateStatusOpen(true);
                  }
                }}
              >
                <span>{currentStatus}</span>
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => {
                    setSelectedReturnAction(
                      isApproved ? "MARK_RETURN_RECEIVED" : "APPROVE_RETURN"
                    );
                    setUpdateStatusOpen(true);
                  }}
                  disabled={!canUpdateStatus}
                  className="w-auto px-6 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </Button>
                {/* Reason the button is disabled or current step indication */}
                {isResolved && (
                  <span className="text-xs font-MontserratNormal text-[#2D7565]">
                    Return dispute resolved
                  </span>
                )}
                {isRejected && (
                  <span className="text-xs font-MontserratNormal text-[#CA0202]">
                    Return request rejected
                  </span>
                )}
                {isRequested && (
                  <span className="text-xs font-MontserratNormal text-[#000000]/40">
                    Next: Approve or reject return
                  </span>
                )}
                {isApproved && (
                  <span className="text-xs font-MontserratNormal text-[#FF6D5B]">
                    Next: Receive return at warehouse
                  </span>
                )}
              </div>
            </div>
          </div>

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
            showRefundActions={showRefundActions}
            onApproveRefund={
              showRefundActions ? () => setConfirmRefundOpen(true) : undefined
            }
            onRejectRefund={
              showRefundActions ? () => handleRejectRefund() : undefined
            }
            onApprove={
              canUpdateStatus && !showRefundActions
                ? () => {
                    setSelectedReturnAction("APPROVE_RETURN");
                    setUpdateStatusOpen(true);
                  }
                : undefined
            }
            onReject={
              !isRejected && (showRefundActions || canUpdateStatus)
                ? () => {
                    setSelectedReturnAction("REJECT_RETURN");
                    setUpdateStatusOpen(true);
                  }
                : undefined
            }
            loading={actionLoading}
          />
        </div>
      )}

      {/* ── Update Return Status Modal (Matching Order Details UI & Flow) ── */}
      <UpdateReturnStatusModal
        isOpen={updateStatusOpen}
        onClose={() => setUpdateStatusOpen(false)}
        disputeId={rawId}
        currentDisputeStatus={currentStatus}
        defaultAction={selectedReturnAction}
        defaultResolutionType={selectedResolutionType}
        initialTrackingNumber={
          dispute?.tracking_number ||
          dispute?.tracking_no ||
          dispute?.order?.tracking_number ||
          ""
        }
        initialAmount={
          dispute?.amount != null
            ? dispute.amount
            : dispute?.requested_refund_amount != null
              ? dispute.requested_refund_amount
              : returnedItems?.[0]?.total
                ? returnedItems[0].total
                : ""
        }
        onSuccess={(msg?: string) => {
          loadDisputeData();
          setResultModalState({
            isOpen: true,
            title: "Success",
            message:
              typeof msg === "string" && msg
                ? msg
                : "Return status has been updated successfully.",
            result: "success",
          });
        }}
      />

      {/* ── Confirm Refund Request Drawer ── */}
      <ConfirmRefundRequestDrawer
        isOpen={confirmRefundOpen}
        onClose={() => setConfirmRefundOpen(false)}
        orderId={displayOrderId}
        itemPrice={orderItemPrice}
        deliveryFee={orderDeliveryFee}
        orderTotal={orderTotalAmount}
        refundAmount={orderRefundAmount}
        onConfirm={() => handleApproveRefund("Reviewed and approved.")}
        loading={actionLoading}
      />

      {/* ── Request Partial Refund Drawer ── */}
      <RequestPartialRefundDrawer
        isOpen={partialRefundOpen}
        onClose={() => setPartialRefundOpen(false)}
        orderId={displayOrderId}
        itemPrice={orderItemPrice}
        deliveryFee={orderDeliveryFee}
        orderTotal={orderTotalAmount}
        onConfirm={(data) => handleApproveRefund(data.moreInfo || "Reviewed and approved.")}
        loading={actionLoading}
      />

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
