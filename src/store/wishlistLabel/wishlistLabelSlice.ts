import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItem } from "../cart/wishlist-slice";

interface Label {
  id: string;
  name: string;
  created_at?: string;
  items: WishlistItem[];
}

interface WishlistLabelState {
  labels: Label[];
}

const initialState: WishlistLabelState = {
  labels: [],
};

const wishlistLabelSlice = createSlice({
  name: "wishlistLabels",
  initialState,
  reducers: {
    setWishlistLabels(state, action: PayloadAction<Label[]>) {
      state.labels = action.payload || [];
    },

    addWishlistLabel(state, action: PayloadAction<Label>) {
      state.labels.push(action.payload);
    },

    deleteWishlistLabel(state, action: PayloadAction<string>) {
      state.labels = state.labels.filter(
        (label) => label.id !== action.payload
      );
    },

    addItemToWishlistLabel(
      state,
      action: PayloadAction<{ labelId: string; item: WishlistItem }>
    ) {
      const label = state.labels.find((l) => l.id === action.payload.labelId);
      if (label) {
        const exists = label.items.some((i) => i.id === action.payload.item.id);
        if (!exists) label.items.push(action.payload.item);
      }
    },

    removeItemFromWishlistLabel(
      state,
      action: PayloadAction<{ labelId: string; itemId: string }>
    ) {
      const label = state.labels.find((l) => l.id === action.payload.labelId);
      if (label) {
        label.items = label.items.filter((i) => i.id !== action.payload.itemId);
      }
    },
    removeItemsFromWishlistLabel(
      state,
      action: PayloadAction<{ labelId: string; itemIds: string[] }>
    ) {
      const label = state.labels.find((l) => l.id === action.payload.labelId);
      if (label) {
        label.items = label.items.filter(
          (i) => !action.payload.itemIds.includes(String(i.id))
        );
      }
    },

    clearWishlistLabels(state) {
      state.labels = [];
    },
  },
});

export const {
  setWishlistLabels,
  addWishlistLabel,
  deleteWishlistLabel,
  addItemToWishlistLabel,
  removeItemFromWishlistLabel,
  removeItemsFromWishlistLabel,
  clearWishlistLabels,
} = wishlistLabelSlice.actions;

export default wishlistLabelSlice.reducer;
