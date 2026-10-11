import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminProductData } from "@/types/global";

// Holds the current page of products in the admin catalog and moderation queues.
interface AdminProductsState {
  adminProducts: AdminProductData[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminProductsState = {
  adminProducts: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setAdminProductsData(
      state,
      action: PayloadAction<{ results: AdminProductData[]; count: number }>
    ) {
      // The page rows and total count are updated together from the paginated API response.
      state.adminProducts = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminProductsData(state) {
      state.adminProducts = [];
      state.totalCount = 0;
      state.error = null;
    },

    setAdminProductsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminProductsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminProductsData,
  clearAdminProductsData,
  setAdminProductsLoading,
  setAdminProductsError,
} = AdminProductsSlice.actions;

export const selectAdminProductsTotalCount = (state: {
  adminProducts: AdminProductsState;
}) => state.adminProducts.totalCount;

export default AdminProductsSlice.reducer;
