/* public/firebase-messaging-sw.js */

console.log("🔥 firebase-messaging-sw.js loaded");

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCbJBvPuLPLOPtIfQs8-KS_A9csKdomjtA",
  authDomain: "martaf-marketplace-7665e.firebaseapp.com",
  projectId: "martaf-marketplace-7665e",
  storageBucket: "martaf-marketplace-7665e.firebasestorage.app",
  messagingSenderId: "335627618741",
  appId: "1:335627618741:web:22e9b997c267cfda9271fc",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  self.registration.showNotification(
    payload.notification?.title ?? "New Notification",
    {
      body: payload.notification?.body,
      icon: "/logo.png",
    }
  );
});
