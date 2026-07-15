import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminSellerData } from "@/types/global";

interface AdminSellerState {
  adminSellerDetails: AdminSellerData[]; // ✅ always an array
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminSellerState = {
  adminSellerDetails: [], // ✅ empty array instead of null
  totalCount: 0,
  loading: false,
  error: null,
};

const AdminSellerDetailsSlice = createSlice({
  name: "sellerproduct",
  initialState,
  reducers: {
    setAdminSellerData(state, action: PayloadAction<{ results: AdminSellerData[]; count: number }>) {
      state.adminSellerDetails = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminSellerData(state) {
      state.adminSellerDetails = []; // ✅ reset to empty array
      state.totalCount = 0;
      state.error = null;
    },

    setAdminSellerDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminSellerDataError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminSellerData,
  clearAdminSellerData,
  setAdminSellerDataLoading,
  setAdminSellerDataError,
} = AdminSellerDetailsSlice.actions;

export const selectAdminBuyerTotalCount = (state: { adminSellerDetails: AdminSellerState }) =>
  state.adminSellerDetails.totalCount;

export default AdminSellerDetailsSlice.reducer;
