import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessRegisterParams } from "@/types/global";

interface RegistrationState {
  businessStep?: BusinessRegisterParams;
}

const initialState: RegistrationState = {
  businessStep: undefined,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setBusinessStep(
      state,
      action: PayloadAction<BusinessRegisterParams>
    ) {
      state.businessStep = action.payload;
    },

    clearRegistration(state) {
      state.businessStep = undefined;
    },
  },
});

export const {
  setBusinessStep,
  clearRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
