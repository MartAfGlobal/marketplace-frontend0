import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  email: string | null;
  token: string | null;
}

const getInitialState = (): RegistrationState => {
  if (typeof window !== "undefined") {
    return {
      email: localStorage.getItem("registration_email"),
      token: localStorage.getItem("registration_token"),
    };
  }
  return {
    email: null,
    token: null,
  };
};

const registrationSlice = createSlice({
  name: "registration",
  initialState: getInitialState(),
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("registration_email", action.payload);
      }
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("registration_token", action.payload);
      }
    },
    clearRegistrationData(state) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("registration_email");
        localStorage.removeItem("registration_token");
      }
      state.email = null;
      state.token = null;
    },
  },
});

export const registrationActions = registrationSlice.actions;
export default registrationSlice.reducer;
