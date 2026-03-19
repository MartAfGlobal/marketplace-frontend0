import { ProductDraftPayload } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DraftState {
  draft: ProductDraftPayload[];   // ✅ always an array
  loading: boolean;
  error: string | null;
}

const initialState: DraftState = {
    draft: [],   
    loading: false,
    error: null,
}


const DraftSlice = createSlice({
    name: "draft",
    initialState,
    reducers: {
        setDraft(state, action: PayloadAction<ProductDraftPayload[]>) {
            state.draft = action.payload;
            state.error = null;
        },
        clearDraft(state) {
            state.draft = [];
            state.error = null;
        },
        setDraftLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setDraftError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

    },
});

export const { setDraft, clearDraft, setDraftLoading, setDraftError } = DraftSlice.actions;

export default DraftSlice.reducer;