import { Product } from "@/types/global"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [], // You will populate this with dummy or fetched data
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

export const { setProducts } = productSlice.actions;
export default productSlice;
