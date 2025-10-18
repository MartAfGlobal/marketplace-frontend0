import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, Variations } from "@/types/global";

// Extend Product with cart-specific fields
export interface CartItem extends Product {
  quantity: number;
  checked?: boolean;
  subtotal?: number; // numeric subtotal from backend
  formatted_subtotal?: string; // formatted subtotal e.g. "₦10.00"
  price_at_purchase?: number;
  variation_display?: string; // for cases like “XL / Black”
  product_image?: string;
  selectedVariation?: Variations;
}

// -------------------- LocalStorage Helpers --------------------
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        return parsed.map(item => ({
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

// -------------------- Slice State --------------------
interface CartState {
  items: CartItem[];
  checkoutItems: CartItem[];
  checkoutSummary: {
    all_addresses: any[];
    applied_coupon: string | null;
    discount_amount: string;
    shipping_address: any | null;
    shipping_cost: string;
    shipping_methods: any[];
    subtotal: string;
    total: string;
  } | null;
}

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  checkoutItems: [],
  checkoutSummary: null,
};

// -------------------- Slice --------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
 addToCart: (state, action: PayloadAction<CartItem>) => {
  const existing = state.items.find(
    (item) =>
      item.id === action.payload.id &&
      item.variation_display === action.payload.variation_display // optional: treat variation as unique
  );

  if (existing) {
    existing.quantity += action.payload.quantity; // add quantity
  } else {
    state.items.push({ ...action.payload, checked: true });
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

    updateCheckedState: (
      state,
      action: PayloadAction<{ id: string; checked: boolean }>
    ) => {
      const { id, checked } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.checked = checked;
      }
      saveCartToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.map((item) => {
        const price = item.price_at_purchase ?? (item as any).price ?? 0;
        const subtotal = price * item.quantity;
        return {
          ...item,
          checked: item.checked ?? true,
          subtotal,
          formatted_subtotal: `₦${subtotal.toFixed(2)}`,
        };
      });
      saveCartToLocalStorage(state.items);
    },

    setCheckoutItems: (state, action: PayloadAction<CartItem[]>) => {
      state.checkoutItems = action.payload.map((item) => {
        const subtotal =
          item.subtotal ?? (item.price_at_purchase ?? 0) * item.quantity;
        return {
          ...item,
          subtotal,
          formatted_subtotal: `₦${subtotal.toLocaleString()}`,
        };
      });
    },

    // ✅ New reducer: store full cart summary from backend
    setCheckoutSummary: (
      state,
      action: PayloadAction<CartState["checkoutSummary"]>
    ) => {
      state.checkoutSummary = action.payload;
    },
  },
});

// -------------------- Export --------------------
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  setCheckoutItems,
  updateCheckedState,
  setCheckoutSummary,
} = cartSlice.actions;

export default cartSlice.reducer;
