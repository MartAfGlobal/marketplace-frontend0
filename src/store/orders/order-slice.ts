import { OrderItem } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface OrderState {
  orders: OrderItem[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  count: 0,
  next: null,
  previous: null,
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
    fetchOrdersSuccess(state, action: PayloadAction<any>) {
      state.loading = false;

      // ✅ handle both array and object responses gracefully
      if (Array.isArray(action.payload)) {
        state.orders = action.payload;
        state.count = action.payload.length;
        state.next = null;
        state.previous = null;
      } else {
        state.orders = action.payload.results || [];
        state.count = action.payload.count || action.payload.results?.length || 0;
        state.next = action.payload.next || null;
        state.previous = action.payload.previous || null;
      }
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
      state.error = null;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
