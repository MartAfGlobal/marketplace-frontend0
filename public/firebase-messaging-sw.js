/* public/firebase-messaging-sw.js */

console.log("🔥 firebase-messaging-sw.js loaded");

importScripts("/firebase/firebase-app-compat.js");
importScripts("/firebase/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7cZ-VJ1s9XDZ67j_Rin21I_qS9OUmpEg",
  authDomain: "martaf-ca7e6.firebaseapp.com",
  projectId: "martaf-ca7e6",
  storageBucket: "martaf-ca7e6.appspot.com",
  messagingSenderId: "90196099652",
  appId: "1:90196099652:web:bb3cf96b4ad58cc92db211",
});

let messaging;
try {
  messaging = firebase.messaging();
  console.log("✅ Firebase messaging ready");
} catch (e) {
  console.error("❌ Messaging init failed", e);
}

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(
      payload.notification?.title ?? "New Notification",
      {
        body: payload.notification?.body,
        icon: "/logo.png",
      }
    );
  });
}
