import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/global";

// Extend Product with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Helper to load cart from localStorage
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        return JSON.parse(stored) as CartItem[];
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }
  return [];
};

// Helper to save cart to localStorage
const saveCartToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

interface CartState {
  items: CartItem[];
  checkoutItems: CartItem[]; // ✅ properly typed array
}

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  checkoutItems: [], // ✅ initialized correctly
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToLocalStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
    // ✅ For restoring cart from backend or elsewhere
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCartToLocalStorage(state.items);
    },
    // ✅ For storing checkout items after successful checkout
    setCheckoutItems: (state, action: PayloadAction<CartItem[]>) => {
      state.checkoutItems = action.payload;
    },
  },
});

// ✅ Export actions correctly
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  setCheckoutItems, // ✅ include this
} = cartSlice.actions;

export default cartSlice.reducer;
