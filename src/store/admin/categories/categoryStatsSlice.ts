import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminCategoryStats {
  total_categories?: number;
  totalCategories?: number;
  total_category_count?: number;
  total?: number;
  active_categories?: number;
  activeCategories?: number;
  active_category_count?: number;
  active?: number;
  total_subcategories?: number;
  totalSubcategories?: number;
  total_sub_categories?: number;
  subcategories_count?: number;
  subcategories?: number;
  hidden_categories?: number;
  hiddenCategories?: number;
  inactive_categories?: number;
  inactiveCategories?: number;
  hidden_count?: number;
  hidden?: number;
  inactive?: number;
  [key: string]: any;
}

interface AdminCategoryStatsState {
  stats: AdminCategoryStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminCategoryStatsState = {
  stats: null,
  loading: false,
  error: null,
};

const adminCategoryStatsSlice = createSlice({
  name: "adminCategoryStats",
  initialState,
  reducers: {
    setAdminCategoryStats(state, action: PayloadAction<AdminCategoryStats>) {
      state.stats = action.payload;
      state.error = null;
    },
    clearAdminCategoryStats(state) {
      state.stats = null;
      state.error = null;
    },
    setAdminCategoryStatsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAdminCategoryStatsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminCategoryStats,
  clearAdminCategoryStats,
  setAdminCategoryStatsLoading,
  setAdminCategoryStatsError,
} = adminCategoryStatsSlice.actions;

export default adminCategoryStatsSlice.reducer;
