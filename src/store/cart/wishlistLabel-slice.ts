// store/cart/wishlistLabel-slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItem } from "./wishlist-slice";

export interface WishlistLabel {
  id: string | number;
  name: string;
  items: WishlistItem[];
}

interface WishlistLabelState {
  labels: WishlistLabel[];
}

const initialState: WishlistLabelState = {
  labels: [],
};

const wishlistLabelSlice = createSlice({
  name: "wishlistLabel",
  initialState,
  reducers: {
    // CREATE LIST
    createLabel: (
      state,
      action: PayloadAction<{ id: string | number; name: string }>
    ) => {
      state.labels.push({ id: action.payload.id, name: action.payload.name, items: [] });
    },

    // DELETE LIST
    deleteLabel: (state, action: PayloadAction<string | number>) => {
      state.labels = state.labels.filter((label) => label.id !== action.payload);
    },

    // ADD ITEM TO LIST
    addItemToLabel: (
      state,
      action: PayloadAction<{ labelId: string | number; item: WishlistItem }>
    ) => {
      const label = state.labels.find((l) => l.id === action.payload.labelId);
      if (label) {
        // Prevent duplicates
        const exists = label.items.some((i) => i.id === action.payload.item.id);
        if (!exists) label.items.push(action.payload.item);
      }
    },

    // REMOVE ITEM FROM LIST
    removeItemFromLabel: (
      state,
      action: PayloadAction<{ labelId: string | number; itemId: string | number }>
    ) => {
      const label = state.labels.find((l) => l.id === action.payload.labelId);
      if (label) {
        label.items = label.items.filter((i) => i.id !== action.payload.itemId);
      }
    },

    // SET all labels from API
    setLabels: (state, action: PayloadAction<WishlistLabel[]>) => {
      state.labels = action.payload || [];
    },
  },
});

export const {
  createLabel,
  deleteLabel,
  addItemToLabel,
  removeItemFromLabel,
  setLabels,
} = wishlistLabelSlice.actions;

export default wishlistLabelSlice.reducer;
