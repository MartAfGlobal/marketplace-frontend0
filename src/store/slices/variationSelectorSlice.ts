import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -------------------------------------------
// TYPES
// -------------------------------------------

export interface SelectedVariationPayload {
  slug: string;
  variation_id: string;
  variationData?: any; // full variation object (optional)
}

export interface SelectedVariationState {
  slug: string | null;
  variation_id: string | null;
  variationData : any

}

// -------------------------------------------
// INITIAL STATE
// -------------------------------------------

const initialState: SelectedVariationState = {
  slug: null,
  variation_id: null,
  variationData: null

};

// -------------------------------------------
// SLICE
// -------------------------------------------

export const variationSelectorSlice = createSlice({
  name: "variationSelector",
  initialState,
  reducers: {
    // Set a variation when navigating FROM cart, search, category, etc.
    setSelectedVariation: (state, action: PayloadAction<SelectedVariationPayload>) => {
      state.slug = action.payload.slug;
      state.variation_id = action.payload.variation_id;
       state.variationData = action.payload.variationData
   
    },

    // Update variation data (useful inside ProductPage when user selects manually)
    updateSelectedVariation: (
      state,
      action: PayloadAction<{ variation_id: string; variationData?: any; slug:string }>
    ) => {
      state.variation_id = action.payload.variation_id;
  
    },

    // Clear variation on leaving product page
    clearSelectedVariation: (state) => {
      state.slug = null;
      state.variation_id = null;
      state.variationData = null
      
    },
  },
});



export const {
  setSelectedVariation,
  updateSelectedVariation,
  clearSelectedVariation,
} = variationSelectorSlice.actions;


export default variationSelectorSlice.reducer;
