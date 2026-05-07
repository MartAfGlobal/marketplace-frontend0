import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FinanceBalance {
  balance: string | number;
  sales: string | number;
  payouts: string | number;
  pending_sales: string | number;
  refunds: string | number;
}

interface FinanceState {
  balance: FinanceBalance | null;
  loading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  balance: null,
  loading: false,
  error: null,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearFinanceError(state) {
      state.error = null;
    },
    setBalance(state, action: PayloadAction<FinanceBalance>) {
      state.balance = action.payload;
    },
    setFinanceLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFinanceError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { clearFinanceError, setBalance, setFinanceLoading, setFinanceError } = financeSlice.actions;
export default financeSlice.reducer;
