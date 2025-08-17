"use client";

import { useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { NotificationItem } from "@/types/global";

export default function DeleteAccount() {
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
    {
      id: 3,
      title: "Permanently delete your account, including order history, saved payment methods, and preferences. This action cannot be undone.",
      description: "Confirm that I want to delete my account",
      type: "check",
    },
  ];

  const toggleSetting = (id: number) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
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
  return (
  <div >
    <h2 className="text-base leading-6 font-semibold text-black mb-6">Delete account</h2>
      <motion.div className="space-y-4">
      
      {checkNotifications.map((item) => {
        const isActive = settings[item.id];

        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex items-start flex-col gap-4"
          >
              <h3 className="font-semibold text-sm leading-5 text-black/72 mb-1">
                {item.title}
              </h3>
           <div className="flex gap-6">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </motion.button>
            <div className="flex-1">
              <p className="text-sm leading-4 text-black/60">
                {item.description}
              </p>
            </div>
           </div>

            
          </motion.div>
        );
      })}
    </motion.div>
    <button className="text-c12 font-MontserratSemiBold text-ff715b w-47.75 h-c40 border border-ff715b rounded-c8 mt-c24">
        Delete account
    </button>
  </div>
  );
}
