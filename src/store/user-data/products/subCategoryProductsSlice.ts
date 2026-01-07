import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

interface SubCategoryProductsState {
  items: Product[];
  loading: boolean;
}

const initialState: SubCategoryProductsState = {
  items: [],
  loading: false,
};

const subCategoryProductsSlice = createSlice({
  name: "subCategoryProducts",
  initialState,
  reducers: {
    setsubCategoryProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    clearsubCategoryProducts: (state) => {
      state.items = [];
    },
  },
});

export const {
  setsubCategoryProducts,
  clearsubCategoryProducts,
} = subCategoryProductsSlice.actions;

export default subCategoryProductsSlice.reducer;
