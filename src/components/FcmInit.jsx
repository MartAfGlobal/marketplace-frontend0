"use client";

import { useEffect } from "react";
import {
  requestNotificationPermission,
  generateFcmToken,
  listenForForegroundMessages,
} from "../firebase/fcm";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY_PUBLIC;

if (!VAPID_KEY) {
  throw new Error("VAPID key is not set in environment variables");
}



export default function FcmInit() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // JWT from login
    if (!accessToken) return;

    async function setupFcm() {
      const permission = await requestNotificationPermission();
      if (!permission) return;

      const token = await generateFcmToken(VAPID_KEY);
      if (!token) return;

      console.log("FCM Token:", token);

      // Send token to Django backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/register-fcm-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Backend response:", data))
        .catch((err) => console.error("Backend error:", err));
    }

    setupFcm();

    listenForForegroundMessages((payload) => {
      alert(`New Notification: ${payload.notification?.title}`);
    });
  }, []);

  return null;
}
