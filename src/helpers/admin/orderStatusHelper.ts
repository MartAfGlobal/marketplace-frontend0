/**
 * Helper utilities for determining and formatting order statuses across Admin Order views.
 */

/**
 * Check if an order has been fully rejected by the seller
 * (e.g. status is REJECTED or all items in the order have been rejected)
 */
export function isOrderFullyRejected(order: any): boolean {
  if (!order) return false;

  const rawStatus = (
    order.status ??
    order.order_timeline_stage ??
    order.order_status ??
    ""
  )
    .toUpperCase()
    .trim();

  // If status explicitly indicates active/accepted/partial/processing/fulfilled/delivered, it's NOT fully rejected
  if (
    rawStatus === "PARTIALLY_ACCEPTED" ||
    rawStatus === "ACCEPTED" ||
    rawStatus === "PROCESSED" ||
    rawStatus === "PROCESSING" ||
    rawStatus === "FULFILLED" ||
    rawStatus === "SHIPPED" ||
    rawStatus === "DELIVERED" ||
    rawStatus === "COMPLETED"
  ) {
    return false;
  }

  // If order explicitly has accepted items or positive accepted quantity
  if (
    Number(order.accepted_quantity ?? 0) > 0 ||
    Number(order.accepted_items_count ?? 0) > 0 ||
    Number(order.partially_accepted_items_count ?? 0) > 0 ||
    (order.admin_status ?? "").toLowerCase() === "processing"
  ) {
    return false;
  }

  if (rawStatus === "REJECTED") return true;

  const items = order.items || order.order_items || [];
  if (Array.isArray(items) && items.length > 0) {
    const allRejected = items.every((item: any) => {
      const itemStatus = (item.status || item.seller_order_status || "").toUpperCase();
      if (itemStatus === "REJECTED") return true;
      const qty = Number(item.quantity ?? 1);
      const rejQty = Number(item.rejected_quantity ?? 0);
      const accQty = Number(item.accepted_quantity ?? 0);
      // Item is rejected if rejected_quantity equals or exceeds quantity and accepted quantity is 0
      if (rejQty >= qty && qty > 0 && accQty === 0) return true;
      // Or if accepted_quantity is 0 and rejected_quantity > 0 and not partially accepted
      if (accQty === 0 && rejQty > 0 && !item.partially_accepted) return true;
      return false;
    });
    if (allRejected) return true;
  }

  // If order-level accepted quantity is 0 and rejected quantity > 0
  if (
    Number(order.rejected_quantity ?? 0) > 0 &&
    Number(order.accepted_quantity ?? 0) === 0 &&
    (!items.length || items.length === 1)
  ) {
    return true;
  }

  // If rejected_items_count > 0 and accepted_items_count === 0
  if (
    Number(order.rejected_items_count ?? 0) > 0 &&
    Number(order.accepted_items_count ?? 0) === 0 &&
    (!items.length || items.length === 1)
  ) {
    return true;
  }

  // If rejected_at is set without accepted_at or fulfilled_at, and status is not yet fulfilled / delivered
  if (
    order.rejected_at &&
    !order.accepted_at &&
    !order.fulfilled_at &&
    rawStatus !== "DELIVERED" &&
    rawStatus !== "IN_TRANSIT_TO_HUB" &&
    rawStatus !== "SHIPPED_TO_BUYER" &&
    rawStatus !== "RECEIVED_AT_HUB"
  ) {
    return true;
  }

  return false;
}

/**
 * Format raw order status string to human-readable label
 */
export function formatOrderStatus(statusStr?: string): string {
  if (!statusStr) return "Pending";
  const s = statusStr.toUpperCase().trim();
  if (s === "TRACKING_SUBMITTED") return "Tracking Submitted";
  if (s === "IN_TRANSIT_TO_HUB") return "In Transit To Hub";
  if (s === "RECEIVED_AT_HUB") return "Received at Hub";
  if (
    s === "SHIPPED_TO_BUYER" ||
    s === "SHIPPED" ||
    s === "SENT_FROM_HUB" ||
    s === "SENT FROM HUB"
  )
    return "Sent from Hub";
  if (
    s === "DELIVERED" ||
    s === "RECEIVED_BY_BUYER" ||
    s === "RECEIVED BY BUYER"
  )
    return "Received by Buyer";
  if (s === "COMPLETED") return "Completed";
  if (s === "CLOSED" || s === "DISPUTE_CLOSED" || s === "DISPUTE CLOSED")
    return "Dispute closed";
  if (s === "CANCELLED" || s === "CANCELED") return "Cancelled";
  if (s === "REJECTED") return "Rejected";
  if (s === "PARTIALLY_ACCEPTED") return "Partially Accepted";
  if (s === "RETURN_ACCEPTED") return "Return Accepted";
  if (s === "RETURN_REQUESTED") return "Return Requested";
  if (s === "PENDING" || s === "UNPROCESSED") return "Pending";
  if (s === "PROCESSING" || s === "PROCESSED") return "Processing";
  if (s === "FULFILLED") return "Fulfilled";
  if (s === "ONGOING" || s === "DISPUTE ONGOING" || s === "DISPUTE_ONGOING")
    return "Dispute ongoing";
  if (s === "DISPUTED" || s === "DISPUTE") return "Disputed";

  return s
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get display status for an order object, taking into account seller rejection
 */
export function getOrderDisplayStatus(order: any): string {
  if (!order) return "Pending";

  const rawStatus = (
    order.status ??
    order.order_timeline_stage ??
    order.order_status ??
    ""
  )
    .toUpperCase()
    .trim();

  const disputeStatus = (
    order.dispute_status ??
    order.dispute?.status ??
    order.dispute?.status_display ??
    ""
  )
    .toString()
    .trim();
  const adminStatus = (order.admin_status ?? "").trim();
  const adminStatusUpper = adminStatus.toUpperCase();
  const disputeStatusUpper = disputeStatus.toUpperCase();
  const items = order.items || order.order_items || [];
  const hasDisputeFlag = (value: any): boolean =>
    value === true ||
    value === 1 ||
    value === "1" ||
    (value !== null && typeof value === "object" && Object.keys(value).length > 0);
  const hasItemDispute = Array.isArray(items)
    ? items.some(
        (item: any) =>
          hasDisputeFlag(item?.dispute) || hasDisputeFlag(item?.has_dispute),
      )
    : false;

  const hasDispute =
    rawStatus === "RETURN_REQUESTED" ||
    rawStatus === "RETURN_ACCEPTED" ||
    rawStatus === "DISPUTED" ||
    rawStatus === "DISPUTE" ||
    rawStatus === "DISPUTE_RAISED" ||
    rawStatus === "DISPUTE_ONGOING" ||
    rawStatus === "DISPUTE_CLOSED" ||
    rawStatus === "CLOSED" ||
    hasDisputeFlag(order.has_dispute) ||
    hasDisputeFlag(order.dispute) ||
    hasItemDispute ||
    disputeStatusUpper.includes("DISPUT") ||
    disputeStatusUpper.includes("CLOSED") ||
    adminStatusUpper === "DISPUTE RAISED" ||
    adminStatusUpper === "DISPUTE PENDING" ||
    adminStatusUpper === "DISPUTE ONGOING" ||
    adminStatusUpper === "DISPUTE CLOSED" ||
    adminStatusUpper.includes("ONGOING") ||
    adminStatusUpper.includes("DISPUT") ||
    adminStatusUpper.includes("CLOSED") ||
    adminStatusUpper === "DISPUTED" ||
    adminStatusUpper === "DISPUTE";

  const isDisputeClosed =
    rawStatus === "CLOSED" ||
    rawStatus === "DISPUTE_CLOSED" ||
    disputeStatusUpper === "CLOSED" ||
    disputeStatusUpper.includes("CLOSED") ||
    adminStatusUpper === "DISPUTE CLOSED" ||
    adminStatusUpper === "CLOSED" ||
    adminStatusUpper.includes("CLOSED");

  // ── Dispute Closed ────────────────────────────────────────────────────────
  if (isDisputeClosed && (hasDispute || order.dispute || order.has_dispute || order.dispute_status)) {
    return "Dispute closed";
  }

  // ── Dispute / Return Requested — always takes priority ────────────────────
  if (hasDispute) {
    if (
      rawStatus === "RETURN_ACCEPTED" ||
      rawStatus === "DISPUTE_ONGOING" ||
      disputeStatusUpper.includes("ONGOING") ||
      adminStatusUpper === "DISPUTE ONGOING" ||
      adminStatusUpper.includes("ONGOING")
    ) {
      return "Dispute ongoing";
    }
    return "Dispute raised";
  }

  // If backend provided admin_status as Received by Buyer, or order status is DELIVERED
  if (
    adminStatusUpper === "RECEIVED BY BUYER" ||
    adminStatusUpper === "RECEIVED_BY_BUYER" ||
    rawStatus === "DELIVERED"
  ) {
    return "Received by Buyer";
  }

  // If backend provided admin_status as Sent from Hub, or order is shipped to buyer / shipped
  if (
    adminStatusUpper === "SENT FROM HUB" ||
    adminStatusUpper === "SENT_FROM_HUB" ||
    rawStatus === "SHIPPED_TO_BUYER" ||
    rawStatus === "SHIPPED"
  ) {
    return "Sent from Hub";
  }

  // If the order is accepted or partially accepted, or backend admin_status is Processing,
  // show "Processing" on the admin side
  if (
    rawStatus === "ACCEPTED" ||
    rawStatus === "PARTIALLY_ACCEPTED" ||
    rawStatus === "PROCESSED" ||
    rawStatus === "PROCESSING" ||
    adminStatusUpper === "PROCESSING"
  ) {
    return "Processing";
  }

  if (isOrderFullyRejected(order)) {
    return "Rejected";
  }

  if (adminStatus) {
    return formatOrderStatus(adminStatus);
  }

  return formatOrderStatus(rawStatus || "PENDING");
}
