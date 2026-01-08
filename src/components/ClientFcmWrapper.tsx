"use client";

import { useEffect } from "react";
import FcmInit from "@/components/FcmInit";

export default function ClientFcmWrapper() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.error("Service Worker registration error:", err));
    }
  }, []);

  return <FcmInit />;
}
