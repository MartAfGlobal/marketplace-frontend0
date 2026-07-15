import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminProductDetail } from "@/types/global";

interface AdminProductDetailState {
  product: AdminProductDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminProductDetailState = {
  product: null,
  loading: false,
  error: null,
};

const adminProductDetailSlice = createSlice({
  name: "adminProductDetail",
  initialState,
  reducers: {
    setAdminProductDetail(
      state,
      action: PayloadAction<AdminProductDetail>
    ) {
      state.product = action.payload;
      state.error = null;
    },

    clearAdminProductDetail(state) {
      state.product = null;
      state.error = null;
    },

    setAdminProductDetailLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminProductDetailError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminProductDetail,
  clearAdminProductDetail,
  setAdminProductDetailLoading,
  setAdminProductDetailError,
} = adminProductDetailSlice.actions;

export const selectAdminProductDetail = (state: {
  adminProductDetail: AdminProductDetailState;
}) => state.adminProductDetail.product;

export const selectAdminProductDetailLoading = (state: {
  adminProductDetail: AdminProductDetailState;
}) => state.adminProductDetail.loading;

export default adminProductDetailSlice.reducer;
