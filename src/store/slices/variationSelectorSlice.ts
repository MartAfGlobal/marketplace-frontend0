import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VariationState = {
  [productSlug: string]: {
    variationId: number | null;
    attributes: Record<string, string>;
  };
};

const initialState: VariationState = {};

const productVariationSlice = createSlice({
  name: "productVariation",
  initialState,
  reducers: {
    setSelectedVariation(
      state,
      action: PayloadAction<{
        productSlug: string;
        variationId: number | null;
        attributes: Record<string, string>;
      }>
    ) {
      state[action.payload.productSlug] = {
        variationId: action.payload.variationId,
        attributes: action.payload.attributes,
      };
    },

    clearSelectedVariation(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const {
  setSelectedVariation,
  clearSelectedVariation,
} = productVariationSlice.actions;

export default productVariationSlice.reducer;
