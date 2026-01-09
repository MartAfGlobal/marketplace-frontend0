"use client";

import { useEffect } from "react";

export default function FcmInit({ isLoggedIn }) { // pass this from your auth state
  useEffect(() => {
    const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY_PUBLIC;
    if (!VAPID_KEY) return console.error("Missing VAPID key");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !isLoggedIn) {
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
