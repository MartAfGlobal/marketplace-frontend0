"use client";

import { useEffect } from "react";

export default function FcmInit({ isLoggedIn }) { // pass this from your auth state
  useEffect(() => {
    const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY_PUBLIC;
    // Also gate on the actual Firebase project config, not just the VAPID
    // key: firebase/firebase.ts calls getMessaging() as soon as ../firebase/fcm
    // is imported below, and that throws its own (uncaught-looking, if not
    // for the try/catch further down) SDK error when projectId/apiKey/appId
    // are unset — which is the normal state for a local dev env that was
    // never given real Firebase credentials. Checking these upfront skips
    // that dynamic import entirely instead of reaching the SDK's own error.
    const hasFirebaseConfig =
      !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!VAPID_KEY || !hasFirebaseConfig) {
      console.log("FCM not configured for this environment, skipping.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      accessToken === "undefined" ||
      accessToken === "null" ||
      !isLoggedIn ||
      isLoggedIn === "undefined" ||
      isLoggedIn === "null"
    ) {
      console.log("No token or user not logged in, skipping FCM registration");
      return; // stop here
    }

    const init = async () => {
      try {
        const {
          requestNotificationPermission,
          generateFcmToken,
          listenForForegroundMessages,
        } = await import("../firebase/fcm");

        const permission = await requestNotificationPermission();
        if (!permission) return;

        const token = await generateFcmToken(VAPID_KEY);
        if (!token) return;

        // safe fetch
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/fcm/register/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!res.ok) {
          console.warn("FCM registration failed:", res.status);
          return;
        }

        listenForForegroundMessages((payload) => {
          alert(`New Notification: ${payload.notification?.title}`);
        });
      } catch (err) {
        console.error("FCM init failed:", err);
      }
    };

    init();
  }, [isLoggedIn]);
  return null;
}
