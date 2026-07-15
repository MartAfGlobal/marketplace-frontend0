
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    mobileMenuOpen: false,
    resultModal: {
      isOpen: false,
      result: "success",
      title: "",
      message: "",
    },
  },
  reducers: {
    openGlobalResultModal(state, action) {
      state.resultModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeGlobalResultModal(state) {
      if (state.resultModal) {
        state.resultModal.isOpen = false;
      }
    },
    openMobileMenu(state) {
      state.mobileMenuOpen = true;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
  },
});

export const { openMobileMenu, closeMobileMenu, openGlobalResultModal, closeGlobalResultModal } = uiSlice.actions;
export default uiSlice.reducer;
