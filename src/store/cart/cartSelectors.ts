import { RootState } from "..";

export const selectCheckoutTotal = (state: RootState) => {
  const items = Array.isArray(state.cart.checkoutItems)
    ? state.cart.checkoutItems
    : []; // ✅ fallback to empty array

  return items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return total + price * quantity;
  }, 0);
};
