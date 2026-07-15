import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KycVerificationData } from "@/types/global";

interface AdminKycState {
  adminKycDetails: KycVerificationData[]; // ✅ always an array
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminKycState = {
  adminKycDetails: [], // ✅ empty array instead of null
  totalCount: 0,
  loading: false,
  error: null,
};

const AdminKycDetailsSlice = createSlice({
  name: "adminkyc",
  initialState,
  reducers: {
    setAdminKycData(state, action: PayloadAction<{ results: KycVerificationData[]; count: number }>) {
      state.adminKycDetails = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminKycData(state) {
      state.adminKycDetails = []; // ✅ reset to empty array
      state.totalCount = 0;
      state.error = null;
    },

    setAdminKycDataLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminKycDataError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminKycData,
  clearAdminKycData,
  setAdminKycDataLoading,
  setAdminKycDataError,
} = AdminKycDetailsSlice.actions;

export const selectAdminKycTotalCount = (state: { adminKycDetails: AdminKycState }) =>
  state.adminKycDetails.totalCount;

export default AdminKycDetailsSlice.reducer;
