// selectedProductSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

interface SelectedProductState {
  product: Product | null;
}

const initialState: SelectedProductState = {
  product: null,
};

const selectedProductSlice = createSlice({
  name: "selectedProduct",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.product = null;
    },
  },
});

export const { setSelectedProduct, clearSelectedProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;
