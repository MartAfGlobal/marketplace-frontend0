import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminRoleListItem, AdminRolesSummary } from "@/types/admin";

interface AdminRolesState {
  adminRoles: AdminRoleListItem[];
  totalCount: number;
  summary: AdminRolesSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminRolesState = {
  adminRoles: [],
  totalCount: 0,
  summary: null,
  loading: false,
  error: null,
};

const adminRolesSlice = createSlice({
  name: "adminRoles",
  initialState,
  reducers: {
    setAdminRolesData(
      state,
      action: PayloadAction<{
        results: AdminRoleListItem[];
        count: number;
        summary?: AdminRolesSummary;
      }>,
    ) {
      state.adminRoles = action.payload.results;
      state.totalCount = action.payload.count;
      if (action.payload.summary) state.summary = action.payload.summary;
      state.error = null;
    },

    clearAdminRolesData(state) {
      state.adminRoles = [];
      state.totalCount = 0;
      state.summary = null;
      state.error = null;
    },

    setAdminRolesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminRolesError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminRolesData,
  clearAdminRolesData,
  setAdminRolesLoading,
  setAdminRolesError,
} = adminRolesSlice.actions;

export default adminRolesSlice.reducer;
