/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7cZ-VJ1s9XDZ67j_Rin21I_qS9OUmpEg",
  authDomain: "martaf-ca7e6.firebaseapp.com",
  projectId: "martaf-ca7e6",
  storageBucket: "martaf-ca7e6.firebasestorage.app",
  messagingSenderId: "90196099652",
  appId: "1:90196099652:web:bb3cf96b4ad58cc92db211",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
