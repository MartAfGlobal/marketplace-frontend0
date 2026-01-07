import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductDetail } from "@/types/global";

interface ProductState {
  product: ProductDetail | null;
}

const initialState: ProductState = {
  product: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<ProductDetail>) {
      state.product = action.payload;
    },
    clearProduct(state) {
      state.product = null;
    },
  },
});

export const { setProduct, clearProduct } = productSlice.actions;
export default productSlice.reducer;
