"use client";

import { useEffect } from "react";

export default function FcmInit() {
  useEffect(() => {
    const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY_PUBLIC;

    if (!VAPID_KEY) {
      console.error("Missing VAPID key");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const init = async () => {
      const {
        requestNotificationPermission,
        generateFcmToken,
        listenForForegroundMessages,
      } = await import("../firebase/fcm");

      const permission = await requestNotificationPermission();
      if (!permission) return;

      const token = await generateFcmToken(VAPID_KEY);
      if (!token) return;

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/register-fcm-token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      listenForForegroundMessages((payload) => {
        alert(`New Notification: ${payload.notification?.title}`);
      });
    };

    init();
  }, []);

  return null;
}
