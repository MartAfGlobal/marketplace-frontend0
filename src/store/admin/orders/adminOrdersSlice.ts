import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminOrderItem {
  id: string;
  [key: string]: any;
}

// Paginated admin order queue with request state used by the order-management screens.
interface AdminOrdersState {
  adminOrders: AdminOrderItem[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrdersState = {
  adminOrders: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const AdminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    setAdminOrdersData(
      state,
      action: PayloadAction<{ results: AdminOrderItem[]; count: number }>
    ) {
      // Store current page rows and API-wide count together for consistent pagination.
      state.adminOrders = action.payload.results;
      state.totalCount = action.payload.count;
      state.error = null;
    },

    clearAdminOrdersData(state) {
      state.adminOrders = [];
      state.totalCount = 0;
      state.error = null;
    },

    setAdminOrdersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setAdminOrdersError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setAdminOrdersData,
  clearAdminOrdersData,
  setAdminOrdersLoading,
  setAdminOrdersError,
} = AdminOrdersSlice.actions;

export default AdminOrdersSlice.reducer;
