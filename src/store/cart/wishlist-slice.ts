// store/cart/wishlist-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product,  } from "@/types/global";

export interface WishlistItem {
  id: number | string;            
  product: Product;               
 
  image?: string;                
  label?: string | null;
  price?: number;
  quantity: number;
  checked?: boolean;
  subtotal?: number;
  formatted_subtotal?: string;
  price_at_purchase?: number;
  variation_display?: string;
 
  
}


const loadWishlistFromLocalStorage = (): WishlistItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        return JSON.parse(stored) as WishlistItem[];
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
  }
  return [];
};


const saveWishlistToLocalStorage = (items: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }
};

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: loadWishlistFromLocalStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ Add or increment a single item
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToLocalStorage(state.items);
    },

    // ✅ New reducer to set full wishlist (used after fetching from API)
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload || [];
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

export const {
  addToWishlist,
  setWishlist, // ✅ export new reducer
  removeFromWishlist,
  updateQuantity,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
