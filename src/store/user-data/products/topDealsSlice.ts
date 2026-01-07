import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

interface TopDealsState {
  items: Product[];
}

const initialState: TopDealsState = {
  items: [],
};

const topDealsSlice = createSlice({
  name: "topDeals",
  initialState,
  reducers: {
    setTopDeals: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setTopDeals } = topDealsSlice.actions;
export default topDealsSlice.reducer;
