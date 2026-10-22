// src/firebase/fcm.ts
import { getFirebaseMessaging } from "./firebase";
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
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn("Firebase Messaging is not supported in this environment");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
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

export async function listenForForegroundMessages(
  callback: (payload: MessagePayload) => void
): Promise<void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.warn("Firebase Messaging is not supported in this environment");
    return;
  }

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
}
