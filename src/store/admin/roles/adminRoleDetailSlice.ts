import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminRoleDetail } from "@/types/admin";

interface AdminRoleDetailState {
  adminRoleDetail: AdminRoleDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminRoleDetailState = {
  adminRoleDetail: null,
  loading: false,
  error: null,
};

const adminRoleDetailSlice = createSlice({
  name: "adminRoleDetail",
  initialState,
  reducers: {
    setAdminRoleDetail(state, action: PayloadAction<AdminRoleDetail>) {
      state.adminRoleDetail = action.payload;
      state.error = null;
    },

    clearAdminRoleDetail(state) {
      state.adminRoleDetail = null;
      state.error = null;
    },

    setAdminRoleDetailLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminRoleDetailError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminRoleDetail,
  clearAdminRoleDetail,
  setAdminRoleDetailLoading,
  setAdminRoleDetailError,
} = adminRoleDetailSlice.actions;

export default adminRoleDetailSlice.reducer;
