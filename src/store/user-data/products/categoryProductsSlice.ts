import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

interface CategoryProductsState {
  items: Product[];
  loading: boolean;
}

const initialState: CategoryProductsState = {
  items: [],
  loading: false,
};

const categoryProductsSlice = createSlice({
  name: "categoryProducts",
  initialState,
  reducers: {
    setCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    clearCategoryProducts: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCategoryProducts,
  clearCategoryProducts,
} = categoryProductsSlice.actions;

export default categoryProductsSlice.reducer;
