import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminAccess } from "@/types/admin";

interface AdminAccessState {
  access: AdminAccess | null;
  /** True once the server has answered (successfully or not) for this session. */
  loaded: boolean;
}

const initialState: AdminAccessState = { access: null, loaded: false };

// Deliberately not persisted: the menus must always reflect what the server says
// *now* (a role can be changed or suspended at any time), so it's re-fetched on
// every load rather than trusted from storage.
const adminAccessSlice = createSlice({
  name: "adminAccess",
  initialState,
  reducers: {
    setAdminAccess(state, action: PayloadAction<AdminAccess | null>) {
      state.access = action.payload;
      state.loaded = true;
    },
    clearAdminAccess() {
      return initialState;
    },
  },
});

export const { setAdminAccess, clearAdminAccess } = adminAccessSlice.actions;
export default adminAccessSlice.reducer;
