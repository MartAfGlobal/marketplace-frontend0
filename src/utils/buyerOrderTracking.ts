export const getBuyerOrderTrackingPath = (orderId: string | number) =>
  `/dashboard/buyer/orders/tracking/${encodeURIComponent(String(orderId))}`;

export const getBuyerOrderTrackingEndpoint = (orderId: string | number) =>
  `/orders/${encodeURIComponent(String(orderId))}/track/`;