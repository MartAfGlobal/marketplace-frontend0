import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BuyerSliceParams,
  BuyerItem,
  Address,
  BuyerData,
} from "@/types/global";

// Initial buyer data
export const buyerInitialData: BuyerData = {
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
    phone: null,
    phone2: null,
    country: null,
    state: null,
    city: null,
    address: null,
    landmark: null,
    zip_code: null,
    loyalty_points: 0,
    preferred_payment_method: null,
    created_at: "",
  },
};

// Initial state
const buyerInitialState: BuyerSliceParams & {
  selectedAddressId?: string | null;
} = {
  BuyerData: buyerInitialData,
  BuyerItems: [],
  BuyerAddresses: [],
  selectedAddressId: null, // stores the selected address for checkout
};

// Slice
const buyerSlice = createSlice({
  name: "buyer",
  initialState: buyerInitialState,
  reducers: {
    setBuyerData(state, action: PayloadAction<BuyerSliceParams>) {
      state.BuyerData = action.payload.BuyerData;
      state.BuyerItems = action.payload.BuyerItems;
      state.BuyerAddresses = action.payload.BuyerAddresses;
    },

    updateBuyerData(
      state,
      action: PayloadAction<Partial<BuyerSliceParams["BuyerData"]>>
    ) {
      state.BuyerData = { ...state.BuyerData, ...action.payload };
    },

    setBuyerItems(state, action: PayloadAction<BuyerItem[]>) {
      state.BuyerItems = action.payload;
    },

    addBuyerItem(state, action: PayloadAction<BuyerItem>) {
      state.BuyerItems.push(action.payload);
    },

    setBuyerAddresses(state, action: PayloadAction<Address[]>) {
      state.BuyerAddresses = action.payload;
    },

    setDefaultBuyerAddress(state, action: PayloadAction<string>) {
      state.BuyerAddresses = state.BuyerAddresses.map((addr) => {
        if (!addr.id) return addr;
        const isDef = addr.id === action.payload;
        return { ...addr, defaultAddress: isDef, is_default: isDef };
      });
    },

    setSelectedAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload;
    },
    addBuyerAddress(state, action: PayloadAction<Address>) {
      state.BuyerAddresses.push(action.payload);
    },
    updateBuyerAddress(state, action: PayloadAction<Address>) {
      state.BuyerAddresses = state.BuyerAddresses.map((addr) =>
        addr.id === action.payload.id ? action.payload : addr
      );
    },
    removeBuyerAddress(state, action: PayloadAction<string>) {
      state.BuyerAddresses = state.BuyerAddresses.filter(
        (addr) => addr.id !== action.payload
      );

      // Optional: clear selected address if it was deleted
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = null;
      }
    },

    clearBuyer() {
      return buyerInitialState;
    },
  },
});

export const buyerActions = buyerSlice.actions;
export default buyerSlice.reducer;
