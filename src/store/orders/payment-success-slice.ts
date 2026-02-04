import { SuccessOrderData, SuccessOrderState } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SuccessOrderState = {
  SuccessOrderData: null,
};

export const successOrderSlice = createSlice({
  name: "successOrder",
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<SuccessOrderData>) => {
      state.SuccessOrderData = action.payload;
    },

    clearOrderData: (state) => {
      state.SuccessOrderData = null;
    },
  },
});

export const { setOrderData, clearOrderData } = successOrderSlice.actions;
export default successOrderSlice.reducer;
