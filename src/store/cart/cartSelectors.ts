import { RootState } from "..";

export const selectCheckoutTotal = (state: RootState) => {
  return state.cart.checkoutItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return total + price * quantity;
  }, 0);
};
