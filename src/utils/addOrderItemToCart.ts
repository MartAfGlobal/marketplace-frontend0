import { CartItem, setCartItems } from "@/store/cart/cartSlice";

type OrderItemForCart = {
  order_items?: OrderItemForCart[];
  items?: OrderItemForCart[];
  id?: string;
  product?: string | { id?: string; slug?: string };
  product_id?: string;
  product_slug?: string;
  slug?: string;
  product_name?: string;
  name?: string;
  product_image?: string | null;
  image?: string | null;
  quantity?: number;
  fulfilled_quantity?: number;
  price_at_purchase?: number | string;
  unit_price?: number | string;
  price?: number | string;
  variation?: string | { id?: string; name?: string } | null;
  variation_id?: string | null;
  variant_id?: string | null;
  variation_name?: string;
  variation_display?: string;
};

type SendHttpRequest = (args: any) => Promise<unknown>;
type Dispatch = (action: any) => void;

export const addOrderItemToCart = async (
  sendHttpRequest: SendHttpRequest,
  token: string | null | undefined,
  item: OrderItemForCart,
  dispatch: Dispatch,
  showSuccessMessage = true,
): Promise<boolean> => {
  const orderItems = item.order_items || item.items;
  if (orderItems) {
    let added = false;
    let shouldShowSuccessMessage = showSuccessMessage;
    for (const orderItem of orderItems) {
      added =
        (await addOrderItemToCart(
          sendHttpRequest,
          token,
          orderItem,
          dispatch,
          shouldShowSuccessMessage,
        )) || added;
      shouldShowSuccessMessage = false;
    }
    return added;
  }

  const variationId =
    (typeof item.variation === "string" ? item.variation : item.variation?.id) ||
    item.variation_id ||
    item.variant_id ||
    null;
  const quantity = Number(item.quantity ?? item.fulfilled_quantity ?? 1);

  if (!variationId || !token) return false;

  return new Promise((resolve) => {
    sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: { variation_id: variationId, quantity },
        ...(showSuccessMessage && {
          successMessage: "Items added to cart successfully.",
        }),
      },
      successRes: () => {
        sendHttpRequest({
          requestConfig: {
            url: "/cart/",
            method: "GET",
            token,
            isAuth: true,
            userType: "buyer",
          },
          successRes: (res: any) => {
            const items: CartItem[] = (res?.data?.items || []).map(
              (cartItem: any) => ({
                id: cartItem.id || cartItem.product_id || "",
                product_id: cartItem.product_id || cartItem.id || "",
                variation_id: cartItem.variation_id || null,
                product_name: cartItem.product_name || cartItem.name || "",
                price: cartItem.price || cartItem.unit_price || 0,
                price_at_purchase:
                  cartItem.price_at_purchase || cartItem.price || 0,
                quantity: cartItem.quantity ?? 1,
                product_slug: cartItem.product_slug || "",
                variation_display:
                  cartItem.variation_display || cartItem.variation_name || "",
                product_image:
                  cartItem.product_image || cartItem.image || "/placeholder.png",
                checked:
                  typeof cartItem.checked === "boolean"
                    ? cartItem.checked
                    : true,
              }),
            );
            dispatch(setCartItems(items));
            resolve(true);
          },
          errorRes: () => resolve(true),
        });
      },
      errorRes: () => resolve(false),
    });
  });
};
