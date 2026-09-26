export const ORDER_CHANGED_EVENT = "marketplace:orders-changed";
export const ORDER_CHANGED_CHANNEL = "marketplace:orders-changed";

export function notifyOrderChanged() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(ORDER_CHANGED_EVENT));

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(ORDER_CHANGED_CHANNEL);
    channel.postMessage(null);
    channel.close();
  }
}
