import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  email: string | null;
  token: string | null;
}

const initialState: RegistrationState = {
  email: null,
  token: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearRegistrationData() {
      return initialState;
    },
  },
});

export const registrationActions = registrationSlice.actions;
export default registrationSlice.reducer;
