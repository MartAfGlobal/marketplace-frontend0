import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";

// --------------------------------------
// Types
// --------------------------------------

export interface CartItem {
  product_slug: string;
  id: string;
  quantity: number;
  size?: string;
  product_name: string;
  product_image: string | StaticImageData | null;
  price: string | number;
  price_at_purchase: string | number;
  subtotal?: number;
  formatted_subtotal?: string;
  variation_id?: string | null;
  variation_display?: string;

  checked: boolean;
}

export interface GuestCartItem {
  product_slug: string;
  id: string;
  variation_id?: string;
  quantity: number;
  variation_display?: string;
  checked: boolean;
  price: string | number; // must be string
  product_name: string;
  product_image?: string;
  size?: string;
  variation?: string;
  price_at_purchase?: number;
  subtotal?: number;
  formatted_subtotal?: string;
}

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        return parsed.map((item) => ({
          ...item,
          quantity: Number(item.quantity || 0),
        }));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }
  return [];
};

const saveCartToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

// --------------------------------------
// State
// --------------------------------------

interface CartState {
  items: CartItem[];
  checkoutItems: CartItem[];
  checkoutSummary: {
    all_addresses?: any[];
    applied_coupon?: string | null;
    discount_amount: string;
    shipping_address?: any | null;
    shipping_cost?: string;
    guest_address?: GuestCheckoutAddress ;
    shipping_methods?: any[];
    subtotal: string;
    total: string;
  } | null;
}

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  checkoutItems: [],
  checkoutSummary: null,
};

// --------------------------------------
// Slice
// --------------------------------------

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ---------------------------------------------------------
    // LOGGED-IN ADD
    // Backend returns full CartItem; we simply insert or update
    // ---------------------------------------------------------
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const incoming = action.payload;

      const existing = state.items.find(
        (i) =>
          i.id === incoming.id &&
          i.variation_id === incoming.variation_id

      );

      if (existing) {
        existing.quantity += incoming.quantity;
        existing.subtotal =
          Number(existing.quantity) * Number(existing.price_at_purchase);
        existing.formatted_subtotal = `₦${existing.subtotal.toFixed(2)}`;
      } else {
        state.items.push({ ...incoming, checked: true });
      }

      saveCartToLocalStorage(state.items);
    },

    addGuestItemToCart: (state, action: PayloadAction<GuestCartItem>) => {
      const data = action.payload;

      const existing = state.items.find(
        (i) =>
          i.id === data.id &&
          i.variation_id === data.variation_id
      );

      if (existing) {
        existing.quantity += data.quantity;
        existing.subtotal =
          Number(existing.quantity) * Number(existing.price_at_purchase);
        existing.formatted_subtotal = `₦${existing.subtotal.toFixed(2)}`;
      } else {
        state.items.push({
          product_slug:data.product_slug,
          id: data.id,
          variation_id: data.variation_id, 
          quantity: data.quantity,
          size: data.size,
          product_name: data.product_name,
          product_image: data.product_image || null,
          variation_display: data.variation_display || "",

          price: Number(data.price),
          price_at_purchase: Number(data.price),

          subtotal: data.subtotal ?? Number(data.price) * data.quantity,
          formatted_subtotal:
            data.formatted_subtotal ??
            `₦${(Number(data.price) * data.quantity).toFixed(2)}`,

          

          checked: true,
        });
      }

      saveCartToLocalStorage(state.items);
    },

    // ---------------------------------------------------------
    removeFromCart: (
      state,
      action: PayloadAction<{ variation_id?: string }>
    ) => {
      const { variation_id } = action.payload;

      state.items = state.items.filter(
        (item) => item.variation_id !== variation_id
      );

      saveCartToLocalStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ variation_id?: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.variation_id === action.payload.variation_id
      );

      if (item) {
        item.quantity = Number(action.payload.quantity);
        item.subtotal = Number(item.quantity) * Number(item.price_at_purchase);
        item.formatted_subtotal = `₦${item.subtotal.toFixed(2)}`;
      }

      saveCartToLocalStorage(state.items);
    },

    // ---------------------------------------------------------
    updateCheckedState: (
      state,
      action: PayloadAction<{
        variation_id?: string;
        checked: boolean;
      }>
    ) => {
      const { variation_id, checked } = action.payload;

      const item = state.items.find((i) => i.variation_id === variation_id);

      if (item) item.checked = checked;

      saveCartToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },

    // ---------------------------------------------------------
    // Backend "sync my cart" response
    // ---------------------------------------------------------
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCartToLocalStorage(state.items);
    },

    // ---------------------------------------------------------
    setCheckoutItems: (state, action: PayloadAction<CartItem[]>) => {
      state.checkoutItems = action.payload;
    },

    setCheckoutSummary: (
      state,
      action: PayloadAction<CartState["checkoutSummary"]>
    ) => {
      state.checkoutSummary = action.payload;
    },

    setOrderDetails: (state, action: PayloadAction<any>) => {},

    removeCheckedOutItems: (state) => {
      state.items = state.items.filter((item) => !item.checked);
      state.checkoutItems = [];
      state.checkoutSummary = null;

      saveCartToLocalStorage(state.items);
    },
  },
});

// --------------------------------------
// Exports
// --------------------------------------

export const {
  addToCart,
  addGuestItemToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  setCheckoutItems,
  updateCheckedState,
  setCheckoutSummary,
  removeCheckedOutItems,
} = cartSlice.actions;

export default cartSlice.reducer;

import { RootState } from "@/store";
import { object } from "framer-motion/client";
import { GuestCheckoutAddress } from "@/types/global";

export const selectCheckedItems = (state: RootState) =>
  state.cart.items.filter((item) => item.checked);
