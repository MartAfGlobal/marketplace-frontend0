// Centralize encoded buyer tracking URLs so cards and order details navigate consistently.
export const getBuyerOrderTrackingPath = (orderId: string | number) =>
  `/dashboard/buyer/orders/tracking/${encodeURIComponent(String(orderId))}`;

export const getBuyerOrderTrackingEndpoint = (orderId: string | number) =>
  `/orders/${encodeURIComponent(String(orderId))}/track/`;