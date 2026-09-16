import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminStaffDetail } from "@/types/admin";

interface AdminStaffDetailState {
  adminStaffDetail: AdminStaffDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminStaffDetailState = {
  adminStaffDetail: null,
  loading: false,
  error: null,
};

const adminStaffDetailSlice = createSlice({
  name: "adminStaffDetail",
  initialState,
  reducers: {
    setAdminStaffDetail(state, action: PayloadAction<AdminStaffDetail>) {
      state.adminStaffDetail = action.payload;
      state.error = null;
    },

    clearAdminStaffDetail(state) {
      state.adminStaffDetail = null;
      state.error = null;
    },

    setAdminStaffDetailLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminStaffDetailError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminStaffDetail,
  clearAdminStaffDetail,
  setAdminStaffDetailLoading,
  setAdminStaffDetailError,
} = adminStaffDetailSlice.actions;

export default adminStaffDetailSlice.reducer;
