import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LocalisationResource = "countries" | "currencies" | "languages" | "exchangeRates";

interface LocalisationState {
  countries: any[];
  currencies: any[];
  languages: any[];
  exchangeRates: any[];
}

const initialState: LocalisationState = {
  countries: [],
  currencies: [],
  languages: [],
  exchangeRates: [],
};

// Not persisted — same reasoning as the other admin settings slices: always
// reflect the server's current localisation config, never a stale cache.
const adminLocalisationSlice = createSlice({
  name: "adminLocalisation",
  initialState,
  reducers: {
    setLocalisationList(
      state,
      action: PayloadAction<{ resource: LocalisationResource; data: any[] }>,
    ) {
      state[action.payload.resource] = action.payload.data;
    },
    clearAdminLocalisation() {
      return initialState;
    },
  },
});

export const { setLocalisationList, clearAdminLocalisation } = adminLocalisationSlice.actions;
export default adminLocalisationSlice.reducer;
