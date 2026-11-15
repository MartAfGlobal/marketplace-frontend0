"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type NotificationTrayItem = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  link?: string | null;
  requires_action?: boolean;
};

interface NotificationTrayProps {
  isOpen: boolean;
  notifications: NotificationTrayItem[];
  onClose: () => void;
  onNotificationClick: (notification: NotificationTrayItem) => void;
  onClearAll: () => void;
  onMarkAllRead?: () => void;
  isLoading?: boolean;
  error?: string | null;
  panelClassName?: string;
}

function formatNotificationTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationTray({
  isOpen,
  notifications,
  onClose,
  onNotificationClick,
  onClearAll,
  onMarkAllRead,
  isLoading = false,
  error,
  panelClassName = "top-14",
}: NotificationTrayProps) {
  const [expandedItems, setExpandedItems] = useState<
    Record<string, boolean | undefined>
  >({});

  const toggleExpanded = (id: string, event: MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-0 ${panelClassName} w-96 max-w-[90vw] rounded-lg z-50 shadow-lg bg-white border border-gray-100 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-MontserratSemiBold text-sm text-000000">
              Notifications
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Loading notifications...
              </p>
            ) : error ? (
              <p className="text-sm text-red-500 text-center py-8">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => {
                const isExpanded = !!expandedItems[notification.id];
                const isLongMessage = notification.message.length > 100;
                return (
                  <div
                    key={notification.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onNotificationClick(notification)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onNotificationClick(notification);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                      notification.is_read ? "" : "bg-purple-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.is_read && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-6a0dad flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-MontserratSemiBold text-c14 text-000000 truncate">
                            {notification.title}
                          </p>
                          <span className="text-c10 text-gray-400 flex-shrink-0 whitespace-nowrap">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                        </div>
                        <p
                          className={`text-c12 text-gray-500 whitespace-pre-wrap break-words ${
                            isExpanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {isLongMessage && (
                            <button
                              type="button"
                              onClick={(event) =>
                                toggleExpanded(notification.id, event)
                              }
                              className="text-c10 text-gray-400 hover:text-6a0dad hover:underline font-MontserratSemiBold"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                          {notification.link && (
                            <span className="text-c10 text-6a0dad font-MontserratSemiBold">
                              {notification.requires_action
                                ? "Action needed"
                                : "View"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 text-c12">
            {onMarkAllRead ? (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-6a0dad hover:underline font-MontserratSemiBold"
              >
                Mark all as read
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClearAll}
              className="text-gray-400 hover:text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
