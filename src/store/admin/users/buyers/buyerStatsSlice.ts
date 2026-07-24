import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminBuyerStats {
  total_customers: number;
  active_customers: number;
  inactive_customers: number;
  suspended_customers: number;
}

interface AdminBuyerStatsState {
  stats: AdminBuyerStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminBuyerStatsState = {
  stats: null,
  loading: false,
  error: null,
};

const adminBuyerStatsSlice = createSlice({
  name: "adminBuyerStats",
  initialState,
  reducers: {
    setAdminBuyerStats(state, action: PayloadAction<AdminBuyerStats>) {
      state.stats = action.payload;
      state.error = null;
    },
    clearAdminBuyerStats(state) {
      state.stats = null;
      state.error = null;
    },
    setAdminBuyerStatsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAdminBuyerStatsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminBuyerStats,
  clearAdminBuyerStats,
  setAdminBuyerStatsLoading,
  setAdminBuyerStatsError,
} = adminBuyerStatsSlice.actions;

export default adminBuyerStatsSlice.reducer;
