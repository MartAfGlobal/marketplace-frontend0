import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingsSectionKey =
  | "security"
  | "orders"
  | "productOperations"
  | "productModeration"
  | "staffPolicy"
  | "finance"
  | "payouts"
  | "refunds"
  | "disputes"
  | "shippingOperations"
  | "support";

interface AdminSettingsState {
  sections: Partial<Record<SettingsSectionKey, Record<string, any>>>;
  checklist: any[];
  reasons: Record<string, any[]>; // keyed by reason group: account | product | verification | refund | cancellation
}

const initialState: AdminSettingsState = {
  sections: {},
  checklist: [],
  reasons: {},
};

// Deliberately not persisted -- same reasoning as adminAccessSlice: these
// values must always reflect the server's current state, not a stale
// local cache, especially since another admin could change them between
// page loads.
const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    setSettingsSection(
      state,
      action: PayloadAction<{ key: SettingsSectionKey; data: Record<string, any> }>,
    ) {
      state.sections[action.payload.key] = action.payload.data;
    },
    setSettingsChecklist(state, action: PayloadAction<any[]>) {
      state.checklist = action.payload;
    },
    setSettingsReasons(
      state,
      action: PayloadAction<{ group: string; data: any[] }>,
    ) {
      state.reasons[action.payload.group] = action.payload.data;
    },
    clearAdminSettings() {
      return initialState;
    },
  },
});

export const {
  setSettingsSection,
  setSettingsChecklist,
  setSettingsReasons,
  clearAdminSettings,
} = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;
