import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminSellerDetailsData } from "@/types/global";

interface AdminSellerByIdState {
  adminSellerById: AdminSellerDetailsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminSellerByIdState = {
  adminSellerById: null,
  loading: false,
  error: null,
};

const AdminSellerByIdSlice = createSlice({
  name: "adminSellerById",
  initialState,
  reducers: {
    setAdminSellerById(state, action: PayloadAction<AdminSellerDetailsData>) {
      state.adminSellerById = action.payload;
      state.error = null;
    },

    clearAdminSellerById(state) {
      state.adminSellerById = null;
      state.error = null;
    },

    setAdminSellerByIdLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminSellerByIdError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminSellerById,
  clearAdminSellerById,
  setAdminSellerByIdLoading,
  setAdminSellerByIdError,
} = AdminSellerByIdSlice.actions;

export default AdminSellerByIdSlice.reducer;
