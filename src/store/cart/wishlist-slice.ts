// store/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";


export interface WishlistItem extends Product {
  quantity: number;
}

// Helper to load cart from localStorage
const loadCartFromLocalStorage = (): WishlistItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        return JSON.parse(stored) as WishlistItem[];
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }
  return [];
};

// Helper to save cart to localStorage
const saveWishlistToLocalStorage = (items: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }
};

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: loadCartFromLocalStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveWishlistToLocalStorage(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToLocalStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveWishlistToLocalStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, updateQuantity, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
