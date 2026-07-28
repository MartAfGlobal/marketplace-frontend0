import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminCategoryListItem } from "@/types/admin";

// Re-export so existing imports from this slice continue to work
export type { AdminCategoryListItem as AdminCategoryData };

interface AdminCategoriesState {
  adminCategories: AdminCategoryListItem[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminCategoriesState = {
  adminCategories: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    setAdminCategoriesData(
      state,
      action: PayloadAction<{ results: AdminCategoryListItem[]; count: number }>
    ) {
      state.adminCategories = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminCategoriesData(state) {
      state.adminCategories = [];
      state.totalCount = 0;
      state.error = null;
    },

    setAdminCategoriesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminCategoriesError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminCategoriesData,
  clearAdminCategoriesData,
  setAdminCategoriesLoading,
  setAdminCategoriesError,
} = adminCategoriesSlice.actions;

export default adminCategoriesSlice.reducer;
