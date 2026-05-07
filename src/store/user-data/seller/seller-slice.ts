import { SellerData } from "@/types/seller";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerVerification {
  percentage: number;
  isIncomplete: boolean;
  raw?: any; // keep full API response if needed
}

interface SellerState {
  data: SellerData | null;
  verificationStatus: SellerVerification | null;
}

const initialState: SellerState = {
  data: null,
  verificationStatus: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSellerData(state, action: PayloadAction<SellerData>) {
      state.data = action.payload;
    },
    updateSellerData(state, action: PayloadAction<Partial<SellerData>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },

    updateSellerVerification(
      state,
      action: PayloadAction<{
        percentage: number;
        raw?: any;
      }>
    ) {
      const { percentage, raw } = action.payload;

      state.verificationStatus = {
        percentage,
        isIncomplete: percentage < 65,
        raw,
      };
    },

    clearSellerData(state) {
      state.data = null;
      state.verificationStatus = null;
    },
  },
});

export const sellerActions = sellerSlice.actions;
export default sellerSlice.reducer;

