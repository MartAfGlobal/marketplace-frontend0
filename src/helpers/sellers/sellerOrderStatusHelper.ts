import { getOrderDisplayStatus } from "@/helpers/admin/orderStatusHelper";

/**
 * Returns the real/detailed status of a seller order for Order Details, Order Progress, and Mobile card lower status row.
 */
export function getSellerDetailedStatus(order: any): string {
  if (!order) return "Unprocessed";

  const hasDisputeExplicit =
    order.has_dispute === true ||
    (Array.isArray(order.disputes) && order.disputes.length > 0) ||
    (order.dispute && typeof order.dispute === "object" && Boolean(order.dispute.id || order.dispute.status)) ||
    Boolean(order.dispute_status && order.dispute_status.toString().trim() !== "");

  const rawStatus = (
    order.status ||
    order.order_timeline_stage ||
    order.order_status ||
    ""
  )
    .toString()
    .toUpperCase()
    .trim();

  const sellerStatus = (order.seller_status || "").toString().trim();
  const sellerStatusUpper = sellerStatus.toUpperCase();

  // If a real dispute is involved
  if (hasDisputeExplicit || rawStatus.includes("DISPUT") || rawStatus.includes("RETURN_")) {
    const disputeObj = order.dispute || (Array.isArray(order.disputes) ? order.disputes[0] : null);
    const disputeStatusUpper = (
      order.dispute_status ||
      disputeObj?.status ||
      disputeObj?.status_display ||
      ""
    ).toString().toUpperCase().trim();

    const isClosed =
      rawStatus === "DISPUTE_CLOSED" ||
      disputeStatusUpper === "CLOSED" ||
      disputeStatusUpper.includes("CLOSED");

    if (isClosed) return "Dispute closed";
    if (
      rawStatus === "RETURN_ACCEPTED" ||
      rawStatus === "DISPUTE_ONGOING" ||
      disputeStatusUpper.includes("ONGOING")
    ) {
      return "Dispute ongoing";
    }
    return "Dispute raised";
  }

  // Rejections / Cancellations
  if (rawStatus === "REJECTED" || sellerStatusUpper === "REJECTED") return "Rejected";
  if (rawStatus === "CANCELLED" || rawStatus === "CANCELED" || sellerStatusUpper === "CANCELLED") return "Cancelled";

  // Check seller_status
  if (sellerStatusUpper === "PAID OUT" || sellerStatusUpper === "PAID_OUT") return "Completed";
  if (sellerStatusUpper === "PROCESSING") return "Processing";
  if (sellerStatusUpper === "PROCESSED" || sellerStatusUpper === "ACCEPTED") return "Processed";
  if (sellerStatusUpper === "PARTIALLY_ACCEPTED") return "Partially Accepted";
  if (sellerStatusUpper === "TRACKING_SUBMITTED") return "Tracking Submitted";
  if (sellerStatusUpper === "IN_TRANSIT_TO_HUB" || sellerStatusUpper === "FULFILLED") return "Fulfilled";
  if (sellerStatusUpper === "RECEIVED_AT_HUB") return "Received at Hub";

  // Check rawStatus / order timeline
  switch (rawStatus) {
    case "COMPLETED":
    case "PAID":
    case "CLOSED":
      return "Completed";
    case "DELIVERED":
    case "RECEIVED BY BUYER":
    case "RECEIVED_BY_BUYER":
      return "Delivered";
    case "SHIPPED":
    case "SHIPPED_TO_BUYER":
    case "SENT FROM HUB":
    case "SENT_FROM_HUB":
    case "IN TRANSIT":
    case "IN_TRANSIT":
      return "Shipped";
    case "RECEIVED_AT_HUB":
    case "RECEIVED AT HUB":
      return "Received at Hub";
    case "IN_TRANSIT_TO_HUB":
    case "IN TRANSIT TO HUB":
    case "FULFILLED":
      return "Fulfilled";
    case "TRACKING_SUBMITTED":
    case "TRACKING SUBMITTED":
      return "Tracking Submitted";
    case "PARTIALLY_ACCEPTED":
    case "PARTIALLY ACCEPTED":
    case "PARTIAL ACCEPT":
      return "Partially Accepted";
    case "ACCEPTED":
    case "PROCESSED":
      return "Processed";
    case "PROCESSING":
      return "Processing";
    case "PENDING":
    case "UNPROCESSED":
    case "AWAITING ACCEPTANCE":
    case "AWAITING_ACCEPTANCE":
      return "Unprocessed";
    default:
      return "Unprocessed";
  }
}

/**
 * Returns the simplified table status for Seller order tables ("Unprocessed", "Ongoing", "Delivered", unless disputed/rejected/cancelled).
 */
export function getSellerTableStatus(order: any): string {
  const detailed = getSellerDetailedStatus(order);
  const s = detailed.toLowerCase().trim();

  if (s === "dispute closed") return "Dispute closed";
  if (s === "dispute raised" || s === "dispute ongoing" || s === "disputed") return "Disputed";
  if (s === "rejected") return "Rejected";
  if (s === "cancelled" || s === "failed") return "Cancelled";
  if (s === "unprocessed" || s === "pending" || s === "awaiting acceptance") return "Unprocessed";
  if (s === "delivered" || s === "completed" || s === "paid" || s === "received by buyer" || s === "paid out") return "Delivered";
  if (s === "delivered" || s === "completed" || s === "paid" || s === "received by buyer") return "Delivered";

  // All processing to shipped stages -> "Ongoing"
  return "Ongoing";
}

/**
 * Class styling for status badges in seller tables
 */
export function getSellerStatusClass(status: string): string {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "dispute closed":
    case "closed":
      return "text-[#6A0DAD] bg-[#6A0DAD]/10 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "text-[#E8334A] bg-[#E8334A]/10 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
    case "awaiting_acceptance":
      return "text-[#FFAC06] bg-[#FFAC06]/10 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    case "ongoing":
    case "processed":
    case "processing":
    case "accepted":
    case "partially_accepted":
    case "partially accepted":
    case "partial accept":
    case "tracking_submitted":
    case "tracking submitted":
    case "fulfilled":
    case "in_transit_to_hub":
    case "received at hub":
    case "received_at_hub":
    case "shipped":
    case "sent from hub":
    case "sent_from_hub":
    case "shipped_to_buyer":
    case "in transit":
    case "in_transit":
      return "text-[#0070E9] bg-[#0070E9]/12 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    case "delivered":
    case "received by buyer":
    case "completed":
    case "paid":
      return "text-[#2D7565] bg-[#2D7565]/20 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    case "cancelled":
    case "rejected":
    case "failed":
      return "text-[#CA0202] bg-[#CA0202]/10 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
    default:
      return "text-gray-500 bg-gray-100 px-3 py-2 flex items-center justify-center rounded-c16 h-[33px] w-fit mx-auto";
  }
}

/**
 * Class styling for badge in order-details summary pill
 */
export function getSellerStatusBadgeClass(status: string): string {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "dispute closed":
    case "closed":
      return "bg-[#6A0DAD]/10 text-[#6A0DAD]";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "bg-[#E8334A]/10 text-[#E8334A]";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
    case "awaiting_acceptance":
      return "bg-[#FFAC06]/10 text-[#FFAC06]";
    case "ongoing":
    case "processed":
    case "processing":
    case "accepted":
    case "partially_accepted":
    case "partially accepted":
    case "partial accept":
    case "tracking_submitted":
    case "tracking submitted":
    case "fulfilled":
    case "in_transit_to_hub":
    case "received at hub":
    case "received_at_hub":
    case "shipped":
    case "sent from hub":
    case "sent_from_hub":
    case "shipped_to_buyer":
    case "in transit":
    case "in_transit":
      return "bg-[#0070E9]/12 text-[#0070E9]";
    case "delivered":
    case "received by buyer":
    case "completed":
    case "paid":
      return "bg-[#2D7565]/20 text-[#2D7565]";
    case "rejected":
    case "cancelled":
    case "failed":
      return "bg-[#CA0202]/10 text-[#CA0202]";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

/**
 * Class styling for status indicator bar/dot
 */
export function getSellerStatusClassBar(status: string): string {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "dispute closed":
    case "closed":
      return "bg-[#6A0DAD]";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "bg-[#E8334A]";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
    case "awaiting_acceptance":
      return "bg-[#FFAC06]";
    case "ongoing":
    case "processed":
    case "processing":
    case "accepted":
    case "partially_accepted":
    case "partially accepted":
    case "partial accept":
    case "tracking_submitted":
    case "tracking submitted":
    case "fulfilled":
    case "in_transit_to_hub":
    case "received at hub":
    case "received_at_hub":
    case "shipped":
    case "sent from hub":
    case "sent_from_hub":
    case "shipped_to_buyer":
    case "in transit":
    case "in_transit":
      return "bg-[#0070E9]";
    case "delivered":
    case "received by buyer":
    case "completed":
    case "paid":
      return "bg-[#2D7565]";
    case "cancelled":
    case "rejected":
    case "failed":
      return "bg-[#CA0202]";
    default:
      return "bg-gray-100";
  }
}

/**
 * Hex color value for dot indicators
 */
export function getSellerStatusColor(status: string): string {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "dispute closed":
    case "closed":
      return "#6A0DAD";
    case "disputed":
    case "dispute raised":
    case "dispute ongoing":
      return "#E8334A";
    case "unprocessed":
    case "pending":
    case "awaiting acceptance":
    case "awaiting_acceptance":
      return "#FFAC06";
    case "ongoing":
    case "processed":
    case "processing":
    case "accepted":
    case "partially_accepted":
    case "partially accepted":
    case "partial accept":
    case "tracking_submitted":
    case "tracking submitted":
    case "fulfilled":
    case "in_transit_to_hub":
    case "received at hub":
    case "received_at_hub":
    case "shipped":
    case "sent from hub":
    case "sent_from_hub":
    case "shipped_to_buyer":
    case "in transit":
    case "in_transit":
      return "#0070E9";
    case "delivered":
    case "received by buyer":
    case "completed":
    case "paid":
      return "#2D7565";
    case "cancelled":
    case "rejected":
    case "failed":
      return "#CA0202";
    default:
      return "#6B7280";
  }
}
