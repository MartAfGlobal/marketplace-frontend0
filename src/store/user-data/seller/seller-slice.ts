import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    data: {},                // seller profile info
    verificationStatus: null, // full verification response
    isIncomplete: true,       // verification flag
  },
  reducers: {
    updateSellerData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
    updateSellerVerification(state, action) {
      state.verificationStatus = action.payload.status;
      state.isIncomplete = action.payload.isIncomplete;
    },
    clearSellerData(state) {
      state.data = {};
      state.verificationStatus = null;
      state.isIncomplete = true;
    },
  },
});

export const sellerActions = sellerSlice.actions;
export default sellerSlice.reducer;
