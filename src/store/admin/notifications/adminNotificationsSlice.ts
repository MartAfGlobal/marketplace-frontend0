import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  category: string | null;
  event_type: string | null;
  link: string | null;
  requires_action: boolean;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  [key: string]: any;
}

// Admin notification bell/dropdown feed + unread badge count. Deliberately
// NOT persisted to localStorage (registered unpersisted in store/index.ts,
// like adminAccess) -- notification state should always come from the
// server, never from stale cached storage.
interface AdminNotificationsState {
  notifications: AdminNotificationItem[];
  totalCount: number;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminNotificationsState = {
  notifications: [],
  totalCount: 0,
  unreadCount: 0,
  loading: false,
  error: null,
};

const AdminNotificationsSlice = createSlice({
  name: "adminNotifications",
  initialState,
  reducers: {
    setAdminNotificationsData(
      state,
      action: PayloadAction<{ results: AdminNotificationItem[]; count: number }>
    ) {
      state.notifications = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    setAdminNotificationsUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },

    markAdminNotificationReadInState(state, action: PayloadAction<string>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.is_read) {
        notif.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAdminNotificationsReadInState(state) {
      state.notifications.forEach((n) => {
        n.is_read = true;
      });
      state.unreadCount = 0;
    },

    clearAdminNotificationsData(state) {
      state.notifications = [];
      state.totalCount = 0;
      state.unreadCount = 0;
      state.error = null;
    },

    setAdminNotificationsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminNotificationsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminNotificationsData,
  setAdminNotificationsUnreadCount,
  markAdminNotificationReadInState,
  markAllAdminNotificationsReadInState,
  clearAdminNotificationsData,
  setAdminNotificationsLoading,
  setAdminNotificationsError,
} = AdminNotificationsSlice.actions;

export default AdminNotificationsSlice.reducer;
