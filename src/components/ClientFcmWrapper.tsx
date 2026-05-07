"use client";

import { useEffect, useState } from "react";

import FcmInit from "@/components/FcmInit";

export default function ClientFcmWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("accessToken"));
    
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) =>
          console.error("Service Worker registration error:", err)
        );
    }
  }, []);

  return <FcmInit isLoggedIn={isLoggedIn} />;
}
