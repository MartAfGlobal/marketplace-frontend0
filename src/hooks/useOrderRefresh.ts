import { useEffect, useRef } from "react";
import { ORDER_CHANGED_CHANNEL, ORDER_CHANGED_EVENT } from "@/utils/orderRefresh";

export function useOrderRefresh(callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const refresh = () => callbackRef.current();
    window.addEventListener(ORDER_CHANGED_EVENT, refresh);

    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel(ORDER_CHANGED_CHANNEL);
    channel?.addEventListener("message", refresh);

    return () => {
      window.removeEventListener(ORDER_CHANGED_EVENT, refresh);
      channel?.removeEventListener("message", refresh);
      channel?.close();
    };
  }, []);
}
