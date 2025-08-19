import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [], // populate this later
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

// Export the action(s)
export const { setProducts } = productSlice.actions;

// ✅ Export the reducer, not the slice
export default productSlice.reducer;
