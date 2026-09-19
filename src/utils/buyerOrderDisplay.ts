import { OrderItem } from "@/types/global";

const formatOrderDate = (date?: string | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const isReturnedBuyerOrder = (order: OrderItem) => {
  const items = order.order_items || (order as any).items || [];

  return (
    (order.buyer_status || "").toLowerCase() === "completed" &&
    (order.status || "").toUpperCase() === "RETURN_CLOSED" &&
    items.length === 1
  );
};

export const getBuyerOrderStatusLabel = (order: OrderItem) => {
  if (isReturnedBuyerOrder(order)) return "Returned";

  const status = (order.buyer_status || order.status || "").toUpperCase();

  if (status === "RECEIVED_AT_HUB") return "To ship";
  if (status === "SHIPPED" || status === "SHIPPED_TO_BUYER") {
    return "Order on its way";
  }
  if (status === "DELIVERED" || status === "CONFIRMED") return "Delivered";
  if (status === "AWAITING_PAYMENT") return "Awaiting payment";
  if (
    status === "PENDING" ||
    status === "ACCEPTED" ||
    status === "PROCESSING" ||
    status === "TRACKING_SUBMITTED"
  ) {
    return "Order is being processed";
  }
  if (status === "CANCELLED") return "Cancelled";

  return order.buyer_status || order.status || "";
};

export const getBuyerOrderDateLabel = (order: OrderItem) => {
  const status = (order.buyer_status || order.status || "").toLowerCase();
  const isDelivered = status === "delivered" || status === "completed";

  return {
    label: isDelivered ? "Delivered" : "Delivery",
    date: isDelivered
      ? formatOrderDate(order.delivered_at)
      : order.estimated_delivery_date || formatOrderDate(order.created_at),
  };
};
