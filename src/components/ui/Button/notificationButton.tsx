"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import DefaultNofication from "@/assets/icons/notificationIcon.svg";
import NotificationTray, {
  NotificationTrayItem,
} from "@/components/ui/notifications/NotificationTray";
import ConfirmModal from "@/components/ui/Modals/comfirmation-modal";

interface NotificationButtonProps {
  size?: number;
  image?: StaticImageData | string;
  showBadge?: boolean;
  userType?: "buyer" | "seller";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    if (typeof record[key] === "string") return record[key] as string;
    if (typeof record[key] === "number") return String(record[key]);
  }
  return fallback;
}

function parseNotifications(responseData: unknown): {
  notifications: NotificationTrayItem[];
  unreadCount: number;
} {
  let payload: unknown = responseData;
  for (let depth = 0; depth < 3; depth += 1) {
    const record = asRecord(payload);
    if (!record || record.data === undefined) break;
    payload = record.data;
  }

  const body = asRecord(payload);
  const results = Array.isArray(payload)
    ? payload
    : Array.isArray(body?.results)
      ? body.results
      : Array.isArray(body?.notifications)
        ? body.notifications
        : Array.isArray(body?.items)
          ? body.items
          : [];

  const notifications = results.flatMap((item, index) => {
    const record = asRecord(item);
    if (!record) return [];
    const isRead =
      typeof record.is_read === "boolean"
        ? record.is_read
        : typeof record.read === "boolean"
          ? record.read
          : String(record.status ?? "").toLowerCase() === "read";

    return [
      {
        id: getString(record, ["id", "uuid", "notification_id"], `notification-${index}`),
        title: getString(record, ["title", "subject"], "Notification"),
        message: getString(record, ["message", "body", "description", "content"]),
        created_at: getString(record, ["created_at", "timestamp", "sent_at"]),
        is_read: isRead,
        link: getString(record, ["link", "url", "action_url"]) || null,
        requires_action: record.requires_action === true,
      },
    ];
  });

  const unreadValue =
    body?.unread_count ??
    body?.unreadCount ??
    asRecord(body?.pagination)?.unread_count;
  const unreadCount =
    typeof unreadValue === "number" && Number.isFinite(unreadValue)
      ? unreadValue
      : notifications.filter((notification) => !notification.is_read).length;

  return { notifications, unreadCount };
}

export default function NotificationButton({
  size = 24,
  image = DefaultNofication,
  showBadge = true,
  userType = "buyer",
}: NotificationButtonProps) {
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationTrayItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [clearConfirmationOpen, setClearConfirmationOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchNotifications = useCallback((showLoading = true) => {
    if (!token) return;
    if (showLoading) setIsLoading(true);
    setRequestError(null);
    sendHttpRequest({
      requestConfig: {
        url: "/notifications/logs/?page=1",
        method: "GET",
        token,
        isAuth: true,
        userType,
      },
      successRes: (responseData: unknown) => {
        const parsed = parseNotifications(responseData);
        console.log("Notification logs:", parsed.notifications);
        setNotifications(parsed.notifications);
        setUnreadCount(parsed.unreadCount);
        if (showLoading) setIsLoading(false);
      },
      errorRes: (error: unknown) => {
        console.error("Failed to fetch notification logs:", error);
        if (showLoading) {
          setRequestError("Could not load notifications.");
          setIsLoading(false);
        }
      },
    });
  }, [sendHttpRequest, token, userType]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleOpen = () => {
    if (!isOpen) fetchNotifications();
    setIsOpen((previous) => !previous);
  };

  const handleNotificationClick = (notification: NotificationTrayItem) => {
    if (!token) return;

    setRequestError(null);
    sendHttpRequest({
      requestConfig: {
        url: `/notifications/logs/${encodeURIComponent(notification.id)}/read/`,
        method: "POST",
        token,
        isAuth: true,
        userType,
      },
      successRes: () => {
        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item,
          ),
        );
        if (!notification.is_read) {
          setUnreadCount((previous) => Math.max(0, previous - 1));
        }
        setIsOpen(false);
        fetchNotifications(false);
        if (
          notification.link &&
          notification.link.startsWith("/") &&
          !notification.link.startsWith("//")
        ) {
          router.push(notification.link);
        }
      },
      errorRes: (error: unknown) => {
        console.error("Failed to read notification:", error);
        setRequestError("Could not open this notification.");
      },
    });
  };

  const clearNotifications = () => {
    if (!token) return;
    setIsClearing(true);
    sendHttpRequest({
      requestConfig: {
        url: "/notifications/logs/clear/",
        method: "DELETE",
        token,
        isAuth: true,
        userType,
        body: { keep_days: 0 },
      },
      successRes: () => {
        setNotifications([]);
        setUnreadCount(0);
        setRequestError(null);
        setIsClearing(false);
        setClearConfirmationOpen(false);
      },
      errorRes: (error: unknown) => {
        console.error("Failed to clear notification logs:", error);
        setRequestError("Could not clear notifications.");
        setIsClearing(false);
        setClearConfirmationOpen(false);
      },
    });
  };

  return (
    <div className="w-fit h-fit relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        style={{ width: size, height: size }}
        className="flex items-center justify-center"
      >
        <Image
          src={image}
          alt="Notification Icon"
          width={size}
          height={size}
          className="object-cover"
        />
        {showBadge && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-[#CA0202] text-white rounded-full flex items-center justify-center text-[8px] font-MontserratSemiBold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationTray
        isOpen={isOpen}
        notifications={notifications}
        isLoading={isLoading}
        error={requestError}
        onClose={() => setIsOpen(false)}
        onNotificationClick={handleNotificationClick}
        onClearAll={() => setClearConfirmationOpen(true)}
        panelClassName="top-full mt-2"
      />

      <ConfirmModal
        isOpen={clearConfirmationOpen}
        onClose={() => setClearConfirmationOpen(false)}
        title="Clear all notifications?"
        description="All your notifications will be permanently removed. This can't be undone."
        onYes={clearNotifications}
        onNo={() => setClearConfirmationOpen(false)}
        yesText="Clear all"
        noText="Cancel"
        loading={isClearing}
      />
    </div>
  );
}
