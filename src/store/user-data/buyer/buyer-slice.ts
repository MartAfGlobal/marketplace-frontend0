import { BuyerSliceParams } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const buyerInitialState: BuyerSliceParams = {
  BuyerData: {
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    account_status: "",
    date_created: "",
    date_joined: "",
    last_login: null,
    groups: [],
    is_accountant: false,
    is_active: false,
    is_agent: false,
    is_customer: false,
    is_google_user: false,
    is_manufacturer: false,
    is_staff: false,
    is_staff_member: false,
    is_superuser: false,
    profile_type: "",
    user_permissions: [],
    profile: {
      id: 0,
      profile_picture: null,
      first_name: "",
      last_name: "",
      name: "",
      phone: null,   // ✅ match API
      phone2: null,  // ✅ match API
      country: null, // ✅ API sends null, not ""
      state: null,
      city: null,
      address: null,
      landmark: null,
      zip_code: null,
      loyalty_points: 0,
      preferred_payment_method: null,
      created_at: "",
    },
  },
  BuyerItems: [],
};

const buyerSlice = createSlice({
  name: "buyer",
  initialState: buyerInitialState,
  reducers: {
    // ✅ Update entire buyer object
    setBuyerData(state, action: PayloadAction<BuyerSliceParams>) {
      state.BuyerData = action.payload.BuyerData;
      state.BuyerItems = action.payload.BuyerItems;
    },

    // ✅ Update only BuyerData (partial update)
    updateBuyerData(
      state,
      action: PayloadAction<Partial<BuyerSliceParams["BuyerData"]>>
    ) {
      state.BuyerData = { ...state.BuyerData, ...action.payload };
    },

    // ✅ Replace BuyerItems
    setBuyerItems(state, action: PayloadAction<any[]>) {
      state.BuyerItems = action.payload;
    },

    // ✅ Add item to BuyerItems
    addBuyerItem(state, action: PayloadAction<any>) {
      state.BuyerItems.push(action.payload);
    },

    // ✅ Clear buyer state (on logout, etc.)
    clearBuyer() {
      return buyerInitialState;
    },
  },
});

export const buyerActions = buyerSlice.actions;
export default buyerSlice.reducer;
