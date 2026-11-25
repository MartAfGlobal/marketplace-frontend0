import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingsSectionKey =
  | "general"
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
  | "sellerVerification"
  | "support";

interface AdminSettingsState {
  sections: Partial<Record<SettingsSectionKey, Record<string, any>>>;
  checklist: any[];
  reasons: Record<string, any[]>; // keyed by reason group: account | product | verification | refund | cancellation
  kycRequirements: any[]; // Seller onboarding & KYC table rows (all categories)
}

const initialState: AdminSettingsState = {
  sections: {},
  checklist: [],
  reasons: {},
  kycRequirements: [],
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
    setKycRequirements(state, action: PayloadAction<any[]>) {
      state.kycRequirements = action.payload;
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
  setKycRequirements,
  clearAdminSettings,
} = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;
