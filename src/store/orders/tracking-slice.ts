
import { createSlice } from "@reduxjs/toolkit";

const trackingSlice = createSlice({
  name: "tracking",
  initialState: {
    trackingData: null,
  },
  reducers: {
    setTrackingData: (state, action) => {
      state.trackingData = action.payload;
    },
    clearTrackingData: (state) => {
      state.trackingData = null;
    },
  },
});

export const { setTrackingData, clearTrackingData } = trackingSlice.actions;
export default trackingSlice.reducer;
