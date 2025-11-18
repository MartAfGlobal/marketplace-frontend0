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

  const [settings, setSettings] = useState({
    email_enabled: false,
    push_enabled: false,

    order_updates_email: false,
    security_email: false,
    promotions_email: false,
    support_email: false,
    features_email: false,

    order_updates_push: false,
    security_push: false,
    promotions_push: false,
    support_push: false,
    features_push: false,
  });

  const toggleEmailNotification: NotificationItem[] = [
    {
      id: "email_enabled",
      title: "Email notifications",
      description: "Confirmations, shipping, and refunds",
      type: "toggle",
    },
    {
      id: "security_email",
      title: "Security Alerts",
      description: "Login attempts, password changes, and suspicious activity.",
      type: "toggle",
    },
    {
      id: "promotions_email",
      title: "Promotions",
      description: "Discounts, new arrivals, and newsletters.",
      type: "toggle",
    },
    {
      id: "support_email",
      title: "Support Updates",
      description: "Responses to inquiries and feedback requests.",
      type: "toggle",
    },
    {
      id: "features_email",
      title: "Feature Updates",
      description: "New features, improvements, and important changes.",
      type: "toggle",
    },
  ];

  const toggleNotifications: NotificationItem[] = [
    {
      id: "push_enabled",
      title: "Push notifications",
      description: "Enable desktop and mobile push alerts.",
      type: "toggle",
    },
    {
      id: "order_updates_push",
      title: "Order Tracking",
      description: "Live updates on shipping and delivery.",
      type: "toggle",
    },
    {
      id: "security_push",
      title: "Security Alerts",
      description: "Login attempts, password changes, and suspicious activity.",
      type: "toggle",
    },
    {
      id: "promotions_push",
      title: "Promotions",
      description: "Discounts, new arrivals, and newsletters.",
      type: "toggle",
    },
    {
      id: "support_push",
      title: "Support Updates",
      description: "Responses to inquiries and feedback requests.",
      type: "toggle",
    },
    {
      id: "features_push",
      title: "Feature Updates",
      description: "New features, improvements, and important changes.",
      type: "toggle",
    },
  ];

  const mapBackendToState = (d: BackendNotificationSettings) => ({
    email_enabled: d.notification_method === "both" || d.notification_method === "email",
    push_enabled: d.notification_method === "both" || d.notification_method === "push",

    order_updates_email: d.order_tracking,
    security_email: d.security_alerts,
    promotions_email: d.promotions,
    support_email: d.support_updates,
    features_email: d.feature_updates,

    order_updates_push: d.order_tracking,
    security_push: d.security_alerts,
    promotions_push: d.promotions,
    support_push: d.support_updates,
    features_push: d.feature_updates,
  });

  const buildBackendPayload = () => ({
    notifications_enabled: settings.email_enabled || settings.push_enabled,

    order_tracking: settings.order_updates_email || settings.order_updates_push,
    security_alerts: settings.security_email || settings.security_push,
    promotions: settings.promotions_email || settings.promotions_push,
    support_updates: settings.support_email || settings.support_push,
    feature_updates: settings.features_email || settings.features_push,

    notification_method:
      settings.email_enabled && settings.push_enabled
        ? "both"
        : settings.email_enabled
        ? "email"
        : settings.push_enabled
        ? "push"
        : "",
  });

  const handleFetchNotification = () => {
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
        userType: "buyer",
      },
      successRes: (res) => {
        setSettings(mapBackendToState(res.data));
        setLoading(false);
      },
    });
  };

  const toggleSetting = (id: keyof typeof settings) => {
    const newState = { ...settings, [id]: !settings[id] };
    setSettings(newState);

    if (!token) return;

    if (id === "email_enabled") {
      sendHttpRequest({
        requestConfig: {
          url: "/notifications/settings/toggle-email",
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: () => {},
      });
      return;
    }

    if (id === "push_enabled") {
      sendHttpRequest({
        requestConfig: {
          url: "/notifications/settings/toggle-push/",
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: () => {},
      });
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/notifications/settings/",
        method: "PUT",
        token,
        isAuth: true,
        body: buildBackendPayload(),
        userType: "buyer",
      },
      successRes: () => {},
    });
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants: { hidden: TargetAndTransition; visible: TargetAndTransition } = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  useEffect(() => {
    if (!token || !loading) return;
    handleFetchNotification();
  }, [token]);

  return (
    <motion.div className="w-full" variants={containerVariants} initial="hidden" animate="visible">
      <h2 className="text-base leading-6 font-MontserratSemiBold text-black mb-6">Notification Settings</h2>

      <div className="flex gap-27 items-center">
        
        {/* EMAIL SECTION */}
        <motion.div className="space-y-4">
          <p className="text-sm font-MontserratNormal leading-6 text-black/50 mb-4">Email notifications</p>

          {toggleEmailNotification.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="flex items-center gap-4">
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

              <div>
                <h3 className="font-MontserratSemiBold text-sm text-black/72">{item.title}</h3>
                <p className="text-c12 font-MontserratNormal text-black/60">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PUSH SECTION */}
        <motion.div className="space-y-4 w-full">
          <p className="text-sm font-MontserratNormal leading-6 text-black/50 mb-4">Push notifications</p>

          {toggleNotifications.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="flex items-center gap-4">
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

              <div>
                <h3 className="font-MontserratSemiBold text-sm text-black/72">{item.title}</h3>
                <p className="text-c12 font-MontserratNormal text-black/60">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
