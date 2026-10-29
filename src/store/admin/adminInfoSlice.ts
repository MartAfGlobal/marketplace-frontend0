import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminInfo = Record<string, unknown> & {
  admin?: {
    access?: {
      role?: string | null;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

interface AdminInfoState {
  data: AdminInfo | null;
}

const initialState: AdminInfoState = {
  data: null,
};

const adminInfoSlice = createSlice({
  name: "adminInfo",
  initialState,
  reducers: {
    setAdminInfo(state, action: PayloadAction<AdminInfo>) {
      state.data = action.payload;
    },
    clearAdminInfo() {
      return initialState;
    },
  },
});

export const { setAdminInfo, clearAdminInfo } = adminInfoSlice.actions;
export default adminInfoSlice.reducer;
