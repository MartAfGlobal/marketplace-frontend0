import { SellerData } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerVerification {
  percentage: number;
  isIncomplete: boolean;
  raw?: any; // keep full API response if needed
}

interface SellerState {
  data: Record<string, any>;
  verificationStatus: SellerVerification | null;
}

const initialState: SellerState = {
  data: {},
  verificationStatus: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    updateSellerData(state, action: PayloadAction<SellerData>) {
      state.data = { ...state.data, ...action.payload };
    },

    updateSellerVerification(
      state,
      action: PayloadAction<{
        percentage: number;
        raw?: any;
      }>
    ) {
      const {percentage, raw }= action.payload;

      state.verificationStatus = {
        percentage,
        isIncomplete: percentage < 65, 
        raw,
      };
    },

    clearSellerData(state) {
      state.data = {};
      state.verificationStatus = null;
    },
  },
});

export const sellerActions = sellerSlice.actions;
export default sellerSlice.reducer;
