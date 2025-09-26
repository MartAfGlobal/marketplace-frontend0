import { AddToCartParams } from "@/types/global";

export const addToCartBackend = async (
  { productId, quantity = 1, variationid }: AddToCartParams,
  sendHttpRequest: any,
  onSuccess?: (res: any) => void
) => {
  sendHttpRequest({
    requestConfig: {
      url: "/cart/add",
      method: "POST",
      body: { 
        product_id: productId,
        variation_id: variationid,
        quantity,
      },
   
      headers: { "Content-Type": "application/json" },
    },
    successRes: (res: any) => {
      console.log("Add to cart response:", res);
      if (onSuccess) onSuccess(res);
    },
  });
};
