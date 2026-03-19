import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sellerProduct } from "@/types/global";

interface ProductState {
  product: sellerProduct[];   // ✅ always an array
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: [],   // ✅ empty array instead of null
  loading: false,
  error: null,
};

const SellerProductSlice = createSlice({
  name: "sellerproduct",
  initialState,
  reducers: {
    setSellerProduct(state, action: PayloadAction<sellerProduct[]>) {
      state.product = action.payload;
      state.error = null;
    },

    clearSellerProduct(state) {
      state.product = [];   // ✅ reset to empty array
      state.error = null;
    },

    setSellerProductLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setSellerProductError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSellerProduct,
  clearSellerProduct,
  setSellerProductLoading,
  setSellerProductError,
} = SellerProductSlice.actions;

export default SellerProductSlice.reducer;