"use client";

import { useEffect, useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { NotificationItem } from "@/types/global";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";

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

  /* ================= UI DATA ================= */

  const toggleEmailNotification: NotificationItem[] = [
    {
      id: "email_enabled",
      title: "Email notifications",
      description: "Confirmations, shipping, and refunds",
      type: "toggle",
    },
       {
      id: "order_updates_email",
      title: "Order Tracking",
      description: "Live updates on shipping and delivery.",
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

  /* ================= FETCH SETTINGS ================= */

  useEffect(() => {
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      router.replace(isMobile ? "/?showLogin=true" : "/auth/login");
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/notifications/toggles/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const data = res.data; // ✅ IMPORTANT

        setSettings({
          email_enabled: data.email_enabled,
          push_enabled: data.push_enabled,

          // EMAIL CHILDREN
          security_email: data.email_enabled ? data.email_security : false,
          promotions_email: data.email_enabled ? data.email_promotion : false,
          support_email: data.email_enabled ? data.email_support : false,
          features_email: data.email_enabled ? data.email_feature : false,
          order_updates_email: data.email_enabled ? data.email_order : false,

          // PUSH CHILDREN
          security_push: data.push_enabled ? data.push_security : false,
          promotions_push: data.push_enabled ? data.push_promotion : false,
          support_push: data.push_enabled ? data.push_support : false,
          features_push: data.push_enabled ? data.push_feature : false,
          order_updates_push: data.push_enabled ? data.push_order : false,
        });

        setLoading(false);
      },
    });
  }, [token]);

  /* ================= CATEGORY MAP ================= */

  const CATEGORY_MAP: Record<
    string,
    { channel: "email" | "push"; category: string }
  > = {
    security_email: { channel: "email", category: "security" },
    promotions_email: { channel: "email", category: "promotion" },
    support_email: { channel: "email", category: "support" },
    features_email: { channel: "email", category: "feature" },
    order_updates_email: { channel: "email", category: "order" },

    security_push: { channel: "push", category: "security" },
    promotions_push: { channel: "push", category: "promotion" },
    support_push: { channel: "push", category: "support" },
    features_push: { channel: "push", category: "feature" },
    order_updates_push: { channel: "push", category: "order" },
  };

  /* ================= TOGGLE HANDLER ================= */

  const toggleSetting = (id: keyof typeof settings) => {
    if (!token) return;

    if (isDisabled(id)) return;
    if (id === "email_enabled" || id === "push_enabled") {
      const channel = id === "email_enabled" ? "email" : "push";

      setSettings((prev) => {
        const turningOff = prev[id];

        if (id === "email_enabled") {
          return {
            ...prev,
            email_enabled: !turningOff,
            security_email: false,
            promotions_email: false,
            support_email: false,
            features_email: false,
            order_updates_email: false,
          };
        }

        if (id === "push_enabled") {
          return {
            ...prev,
            push_enabled: !turningOff,
            security_push: false,
            promotions_push: false,
            support_push: false,
            features_push: false,
            order_updates_push: false,
          };
        }

        return prev;
      });

      sendHttpRequest({
        requestConfig: {
          url: `/notifications/toggle_channel/${channel}/`,
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: (res) => {
          console.log(`Successfully toggled ${channel} notifications`, res);
        },
      });

      return;
    }

    // CATEGORY TOGGLE
    if (CATEGORY_MAP[id]) {
      const { channel, category } = CATEGORY_MAP[id];

      setSettings((prev) => ({ ...prev, [id]: !prev[id] }));

      sendHttpRequest({
        requestConfig: {
          url: `/notifications/toggle_channel_category/${channel}/${category}/`,
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: (res) => {
          console.log(
            `Successfully toggled ${category} for ${channel} notifications`
          );
        },
      });
    }
  };
  const isDisabled = (id: keyof typeof settings) => {
    if (id.endsWith("_email") && id !== "email_enabled") {
      return !settings.email_enabled;
    }

    if (id.endsWith("_push") && id !== "push_enabled") {
      return !settings.push_enabled;
    }

    return false;
  };

  /* ================= ANIMATIONS ================= */

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: {
    hidden: TargetAndTransition;
    visible: TargetAndTransition;
  } = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

 if (loading) {
  return (
    <div className="w-full animate-pulse ">
      <h2 className="text-base hidden md:flex leading-6 font-MontserratSemiBold text-black mb-6">
        Notification Settings
      </h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-27 ">
        {/* EMAIL SKELETON */}
        <div className="w-full space-y-4">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded hidden md:block" />
              </div>
              <div className="w-11.5 h-6 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* PUSH SKELETON */}
        <div className="w-full space-y-4 ">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded hidden md:block" />
              </div>
              <div className="w-11.5 h-6 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


  /* ================= UI ================= */

  return (
    <motion.div
      className="w-full "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-base hidden md:flex leading-6  font-MontserratSemiBold text-black mb-6">
        Notification Settings
      </h2>

      <div className="flex  flex-col md:flex-row gap-8 md:gap-27 items-center">
        {/* EMAIL */}
        <motion.div className="md:space-y-4 w-full ">
          <p className="text-sm font-MontserratNormal md:border-0 border-b py-3 md:py-0 leading-6 text-black/50 mb-4">
            Email notifications
          </p>

          {toggleEmailNotification.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex flex-row-reverse md:flex-row items-center  justify-between md:gap-4 md:justify-start border-b md:border-0 py-3"
            >
              <motion.button
                onClick={() => toggleSetting(item.id)}
                disabled={isDisabled(item.id)}
                className="relative w-11.5 h-6 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: settings[item.id] ? "#FF715B" : "#E5E7EB",
                  opacity: isDisabled(item.id) ? 0.4 : 1,
                  cursor: isDisabled(item.id) ? "not-allowed" : "pointer",
                }}
              >
                <motion.span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ x: settings[item.id] ? 24 : 0 }}
                />
              </motion.button>

              <div className="text-left">
                <h3 className="font-MontserratSemiBold text-left text-sm text-black/72">
                  {item.title}
                </h3>
                <p className="text-c12 font-MontserratNormal hidden md:flex text-black/60">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PUSH */}
        <motion.div className="md:space-y-4 w-full">
          <p className="text-sm font-MontserratNormal leading-6 text-black/50 mb-4">
            Push notifications
          </p>

          {toggleNotifications.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex flex-row-reverse md:flex-row items-center  justify-between  md:justify-start md:gap-4 border-b md:border-0 py-3"
            >
              <motion.button
                onClick={() => toggleSetting(item.id)}
                disabled={isDisabled(item.id)}
                className="relative w-11.5 h-6 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: settings[item.id] ? "#FF715B" : "#E5E7EB",
                  opacity: isDisabled(item.id) ? 0.4 : 1,
                  cursor: isDisabled(item.id) ? "not-allowed" : "pointer",
                }}
              >
                <motion.span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ x: settings[item.id] ? 24 : 0 }}
                />
              </motion.button>

              <div>
                <h3 className="font-MontserratSemiBold text-sm text-black/72">
                  {item.title}
                </h3>
                <p className="text-c12 font-MontserratNormal hidden md:flex text-black/60">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
