import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminBuyerData } from "@/types/global";

interface AdminBuyerState {
  adminBuyerDetails: AdminBuyerData[]; // ✅ always an array
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminBuyerState = {
  adminBuyerDetails: [], // ✅ empty array instead of null
  totalCount: 0,
  loading: false,
  error: null,
};

const AdminBuyerDetailsSlice = createSlice({
  name: "sellerproduct",
  initialState,
  reducers: {
    setAdminBuyerData(state, action: PayloadAction<{ results: AdminBuyerData[]; count: number }>) {
      state.adminBuyerDetails = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminBuyerData(state) {
      state.adminBuyerDetails = []; // ✅ reset to empty array
      state.totalCount = 0;
      state.error = null;
    },

    setAdminBuyerDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminBuyerDataError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminBuyerData,
  clearAdminBuyerData,
  setAdminBuyerDataLoading,
  setAdminBuyerDataError,
} = AdminBuyerDetailsSlice.actions;

export const selectAdminBuyerTotalCount = (state: { adminBuyerDetails: AdminBuyerState }) =>
  state.adminBuyerDetails.totalCount;

export default AdminBuyerDetailsSlice.reducer;
