import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  AdminStaffListItem,
  AdminStaffSummary,
  AdminStaffByRole,
  AdminStaffActivityLogItem,
} from "@/types/admin";

interface AdminStaffState {
  adminStaff: AdminStaffListItem[];
  totalCount: number;
  summary: AdminStaffSummary | null;
  staffByRole: AdminStaffByRole[];
  recentActivity: AdminStaffActivityLogItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminStaffState = {
  adminStaff: [],
  totalCount: 0,
  summary: null,
  staffByRole: [],
  recentActivity: [],
  loading: false,
  error: null,
};

const adminStaffSlice = createSlice({
  name: "adminStaff",
  initialState,
  reducers: {
    setAdminStaffData(
      state,
      action: PayloadAction<{
        results: AdminStaffListItem[];
        count: number;
        summary?: AdminStaffSummary;
        staffByRole?: AdminStaffByRole[];
        recentActivity?: AdminStaffActivityLogItem[];
      }>,
    ) {
      state.adminStaff = action.payload.results;
      state.totalCount = action.payload.count;
      if (action.payload.summary) state.summary = action.payload.summary;
      if (action.payload.staffByRole) state.staffByRole = action.payload.staffByRole;
      if (action.payload.recentActivity) state.recentActivity = action.payload.recentActivity;
      state.error = null;
    },

    clearAdminStaffData(state) {
      state.adminStaff = [];
      state.totalCount = 0;
      state.summary = null;
      state.staffByRole = [];
      state.recentActivity = [];
      state.error = null;
    },

    setAdminStaffLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminStaffError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminStaffData,
  clearAdminStaffData,
  setAdminStaffLoading,
  setAdminStaffError,
} = adminStaffSlice.actions;

export default adminStaffSlice.reducer;
