import { RootState } from "..";

// This selector is used as a safety net when a checkout or cart summary is not yet available from the
// backend. It derives a total directly from the locally stored checkout snapshot so the UI can still
// display totals while the server response is loading or when a fallback path is used.
export const selectCheckoutTotal = (state: RootState) => {
  // Some checkout flows temporarily keep items in Redux before the server summary is hydrated; the
  // selector must gracefully handle missing or malformed payloads instead of throwing.
  const items = Array.isArray(state.cart.checkoutItems)
    ? state.cart.checkoutItems
    : [];

  return items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return total + price * quantity;
  }, 0);
};
