import { BuyerDispute, DisputePayload, OrderItem, OrderShippingAddress } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orders: OrderItem[];
  shippingAddress: OrderShippingAddress | null;
  disputes: BuyerDispute[];
  disputeDetails: DisputePayload | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  disputeDetails: null,
  disputes: [],
  shippingAddress: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchOrdersSuccess(state, action: PayloadAction<OrderItem[]>) {
      state.loading = false;
      state.orders = action.payload;
    },

    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchDisputesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDisputesSuccess(state, action: PayloadAction<BuyerDispute[]>) {
      state.loading = false;
      state.disputes = action.payload;
    },

    fetchDisputesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchDisputeDetails(state, action: PayloadAction<DisputePayload>){
      state.loading = false
      state.disputeDetails = action.payload
    },
    setShippingAddress(state, action: PayloadAction<OrderShippingAddress>) {
      state.shippingAddress = action.payload;
    },

    clearOrders(state) {
      state.shippingAddress = null;
      state.orders = [];
      state.disputes = [];
      state.error = null;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchDisputesStart,
  fetchDisputesSuccess,
  setShippingAddress,
  fetchDisputesFailure,
  clearOrders,
  fetchDisputeDetails,
} = orderSlice.actions;

export default orderSlice.reducer;
