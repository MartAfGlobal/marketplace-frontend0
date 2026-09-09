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

  if (rawStatus === "REJECTED") return true;

  const items = order.items || order.order_items || [];
  if (Array.isArray(items) && items.length > 0) {
    const allRejected = items.every((item: any) => {
      const itemStatus = (item.status || item.seller_order_status || "").toUpperCase();
      if (itemStatus === "REJECTED") return true;
      const qty = Number(item.quantity ?? 1);
      const rejQty = Number(item.rejected_quantity ?? 0);
      const accQty = Number(item.accepted_quantity ?? 0);
      // Item is rejected if rejected_quantity equals or exceeds quantity
      if (rejQty >= qty && qty > 0) return true;
      // Or if accepted_quantity is 0 and rejected_quantity > 0
      if (accQty === 0 && rejQty > 0) return true;
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
  if (s === "IN_TRANSIT_TO_HUB") return "In Transit To Hub";
  if (s === "RECEIVED_AT_HUB") return "Received at Hub";
  if (s === "SHIPPED_TO_BUYER" || s === "SHIPPED") return "Shipped";
  if (s === "DELIVERED") return "Delivered";
  if (s === "COMPLETED") return "Completed";
  if (s === "CANCELLED" || s === "CANCELED") return "Cancelled";
  if (s === "REJECTED") return "Rejected";
  if (s === "PARTIALLY_ACCEPTED") return "Partially Accepted";
  if (s === "PENDING" || s === "UNPROCESSED") return "Pending";
  if (s === "PROCESSING" || s === "PROCESSED") return "Processing";
  if (s === "FULFILLED") return "Fulfilled";
  if (s === "ONGOING") return "Ongoing";
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
  if (isOrderFullyRejected(order)) {
    return "Rejected";
  }

  const rawStatus = (
    order.status ??
    order.order_timeline_stage ??
    order.order_status ??
    ""
  ).trim();

  return formatOrderStatus(rawStatus || "PENDING");
}
