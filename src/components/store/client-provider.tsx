"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ✅ Register Service Worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => console.log("✅ Service Worker registered:", reg))
          .catch((err) => console.log("❌ Service Worker registration failed:", err));
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
