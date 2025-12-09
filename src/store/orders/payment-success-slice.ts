import { OrderData, OrderState } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OrderState = {
  orderData: null,
};


export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<OrderData>) => {
      state.orderData = action.payload;
    },

    clearOrderData: (state) => {
      state.orderData = null;
    },
  },
});


export const { setOrderData, clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
