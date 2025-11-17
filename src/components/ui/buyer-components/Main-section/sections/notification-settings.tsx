"use client";

import { useEffect, useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { NotificationItem } from "@/types/global";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";

interface BackendNotificationSettings {
  notifications_enabled: boolean;
  security_alerts: boolean;
  promotions: boolean;
  order_tracking: boolean;
  feature_updates: boolean;
  support_updates: boolean;
  email_verified: boolean;
  notification_method: "both" | "email" | "sms" | "push" | "";
}

export default function NotificationSettings() {
  const token = useSelector((state: RootState) => state.token.token);
  const router = useRouter();
  const { sendHttpRequest } = useHttp();

  const [loading, setLoading] = useState(true);

  // UI STATE
  const [settings, setSettings] = useState<Record<number, boolean>>({
    1: false, // Email Alerts
    2: false, // Desktop Alerts (push)
    3: false, // Order Updates
    4: false, // Security Alerts
    5: false, // Promotions
    6: false, // Order Updates (duplicate)
    7: false, // Promotions (duplicate)
  });

  // LIST DEFINITIONS (unchanged)
  const checkNotifications: NotificationItem[] = [
    { id: 3, title: "New Message", description: "Notify when you receive a new message", type: "check" },
    { id: 4, title: "Friend Request", description: "Notify when someone sends a friend request", type: "check" },
    { id: 5, title: "Comments", description: "Notify when someone comments on your post", type: "check" },
    { id: 6, title: "Mentions", description: "Notify when someone mentions you", type: "check" },
    { id: 7, title: "Promotions", description: "Notify about promotions and offers", type: "check" },
  ];

  const toggleNotifications: NotificationItem[] = [
    { id: 1, title: "Email Alerts", description: "Receive notifications via email", type: "toggle" },
    { id: 2, title: "Desktop Alerts", description: "Receive desktop notifications", type: "toggle" },
  ];

  // MAP BACKEND RESPONSE → UI
  const mapBackendToState = (data: BackendNotificationSettings) => {
    return {
      1: data.notification_method === "both" || data.notification_method === "email",
      2: data.notification_method === "both" || data.notification_method === "push", // mapped (backend ignores)
      3: data.order_tracking,
      4: data.security_alerts,
      5: data.promotions,
      6: data.order_tracking,
      7: data.promotions,
    };
  };

  // MAP UI STATE → BACKEND PAYLOAD
  const buildBackendPayload = () => {
    return {
      notifications_enabled: settings[1] || settings[2], // if any delivery method enabled
      security: settings[4],
      promotion: settings[5],
      order_updates: settings[3] || settings[6],
      notification_method:
        settings[1] && settings[2]
          ? "both"
          : settings[1]
          ? "email"
          : settings[2]
          ? "push"
          : "",
    };
  };

  // FETCH SETTINGS ON LOAD
  useEffect(() => {
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      router.replace(isMobile ? "/?showLogin=true" : "/auth/login");
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/notifications/settings/",
        method: "GET",
        token,
        isAuth: true,
      },
      successRes: (res) => {
        const mapped = mapBackendToState(res.data);
        setSettings(mapped);
        setLoading(false);

        console.log("Mapped UI Settings →", mapped);
      },
    });
  }, []);

  // HANDLE TOGGLE UI → BACKEND
  const toggleSetting = (id: number) => {
    const newState = { ...settings, [id]: !settings[id] };
    setSettings(newState);

    const payload = buildBackendPayload();
    if (!token){
      return
    }

    // Email toggle = special endpoint
    if (id === 1) {
      sendHttpRequest({
        requestConfig: {
          url: "/notifications/toggle-email/",
          method: "POST",
          token,
          isAuth: true,
        },
        successRes: (res) => {
          console.log("Email toggled:", res.data);
        },
      });
      return;
    }

    // Everything else uses PUT settings
    sendHttpRequest({
      requestConfig: {
        url: "/notifications/settings/",
        method: "PUT",
        token,
        isAuth: true,
        body: payload,
      },
      successRes: (res) => {
        console.log("Updated settings:", res.data);
      },
    });
  };

  // ANIMATION
  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants: { hidden: TargetAndTransition; visible: TargetAndTransition } = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

 

  return (
    <motion.div className="w-full" variants={containerVariants} initial="hidden" animate="visible">
      <h2 className="text-base leading-6 font-semibold text-black mb-6">Notification Settings</h2>
      <p className="text-base font-normal leading-6 text-black/50 mb-4">Notify me about</p>

     <div>
   <motion.div className="space-y-4">
        {checkNotifications.map((item) => (
          <motion.div key={item.id} variants={itemVariants} className="flex items-start gap-4">
            <motion.button
              onClick={() => toggleSetting(item.id)}
              className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: "#FF715B",
                backgroundColor: settings[item.id] ? "#FF715B" : "#FFFFFF",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {settings[item.id] && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </motion.button>

            <div className="flex-1">
              <h3 className="font-semibold text-sm leading-5 text-black/72 mb-1">{item.title}</h3>
              <p className="text-sm leading-4 text-black/60">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="space-y-4 mt-c32">
        {toggleNotifications.map((item) => (
          <motion.div key={item.id} variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black/72">{item.title}</h3>
              <p className="text-sm text-black/60">{item.description}</p>
            </div>

            <motion.button
              onClick={() => toggleSetting(item.id)}
              className="relative w-11.5 h-6 rounded-full flex-shrink-0"
              style={{
                borderColor: settings[item.id] ? "#FF715B" : "#D1D5DB",
                backgroundColor: settings[item.id] ? "#FF715B" : "#E5E7EB",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ x: settings[item.id] ? 24 : 0 }}
              />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
     </div>
   
    </motion.div>
  );
}
