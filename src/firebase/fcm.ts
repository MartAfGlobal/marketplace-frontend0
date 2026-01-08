// src/firebase/fcm.ts
import { messaging } from "./firebase";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";

export async function requestNotificationPermission(): Promise<boolean> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission NOT granted");
    return false;
  }
  return true;
}

export async function generateFcmToken(vapidKey: string): Promise<string | null> {
  try {
    const token = await getToken(messaging, { vapidKey });
    if (!token) {
      console.warn("No FCM token received");
      return null;
    }
    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}

export function listenForForegroundMessages(callback: (payload: MessagePayload) => void) {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
}
