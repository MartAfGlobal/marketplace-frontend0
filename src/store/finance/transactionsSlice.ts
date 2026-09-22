import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id?: number | string;
  transaction_id: string;    // e.g. 'TXN-XXXXXXXXXX'
  date?: string;             // fallback ISO string
  created_at?: string;       // ISO string from API e.g. '2026-09-20T19:40:20.640335Z'
  amount: string | number;
  type?: string;
  transaction_type?: string; // 'Credit' | 'Debit'
  status?: string;
  category?: string;
  linked_entity?: string;
  linked_entity_type?: string;
  linked_entity_id?: string;
  reference?: string;
  running_balance?: string;
  transaction_fee?: string;
  description?: string;
  [key: string]: unknown;    // allow any extra fields the API returns
}

interface TransactionsState {
  items: Transaction[];
  currentPage: number;
  totalCount: number;      // total rows from API (for pagination)
  pageSize: number;        // rows per page
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  currentPage: 1,
  totalCount: 0,
  pageSize: 10,
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(
      state,
      action: PayloadAction<{ items: Transaction[]; totalCount: number; page: number }>,
    ) {
      state.items = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.page;
    },
    setTransactionsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTransactionsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearTransactionsError(state) {
      state.error = null;
    },
  },
});

export const {
  setTransactions,
  setTransactionsLoading,
  setTransactionsError,
  clearTransactionsError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
