"use client";

import { useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { NotificationItem } from "@/types/global";


export default function NotificationSettings() {
  const [settings, setSettings] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: true,
    4: false,
    5: true,
    6: false,
    7: true,
  });

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

  const toggleSetting = (id: number) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: { hidden: TargetAndTransition; visible: TargetAndTransition } = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  return (
    <motion.div
      className="w-full" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-base leading-6 font-semibold text-black mb-6">Notification Settings</h2>
      <p className="text-base font-normal leading-6 text-black/50 mb-4">Notify me about</p>

     
      <motion.div className="space-y-4"> 
        {checkNotifications.map((item) => {
          const isActive = settings[item.id];

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex items-start gap-4"
            >
              <motion.button
                onClick={() => toggleSetting(item.id)}
                className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: "#FF715B",
                  backgroundColor: isActive ? "#FF715B" : "#FFFFFF",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>

              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-5 text-black/72 mb-1">{item.title}</h3>
                <p className="text-sm leading-4 text-black/60">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

  
      <motion.div className="space-y-4 mt-c32">
        {toggleNotifications.map((item) => {
          const isActive = settings[item.id];

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-black/72">{item.title}</h3>
                <p className="text-sm text-black/60">{item.description}</p>
              </div>

              <motion.button
                onClick={() => toggleSetting(item.id)}
                className="relative w-11.5 h-6 rounded-full  flex-shrink-0"
                style={{
                  borderColor: isActive ? "#FF715B" : "#D1D5DB",
                  backgroundColor: isActive ? "#FF715B" : "#E5E7EB",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ x: isActive ? 24 : 0 }}
                />
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
