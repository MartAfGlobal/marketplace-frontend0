import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FinanceBalance {
  wallet_balance: string | number;
}

export interface WalletOverview {
  sales: string | number;
  payouts: string | number;
  pending_sales: string | number;
  refunds: string | number;
}

interface FinanceState {
  wallet_balance: FinanceBalance | null;
  wallet_overview: WalletOverview | null;
  overview_loading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  wallet_balance: null,
  wallet_overview: null,
  overview_loading: false,
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
      state.wallet_balance = action.payload;
    },
    setWalletOverview(state, action: PayloadAction<WalletOverview>) {
      state.wallet_overview = action.payload;
    },
    setOverviewLoading(state, action: PayloadAction<boolean>) {
      state.overview_loading = action.payload;
    },
    setFinanceLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFinanceError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  clearFinanceError,
  setBalance,
  setWalletOverview,
  setOverviewLoading,
  setFinanceLoading,
  setFinanceError,
} = financeSlice.actions;
export default financeSlice.reducer;
