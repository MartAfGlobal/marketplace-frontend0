"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button/Button";

import { useSelector, useDispatch } from "react-redux";
import store, { RootState } from "@/store";
import QuantitySelector from "./cart/quantityControl";

import {
  addToCart,
  addGuestItemToCart,
  clearCart,
  setCheckoutItems,
  setCheckoutSummary,
  setCartItems,
  CartItem,
} from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./loading-spinner";
import { ProductVariation } from "@/types/global";
import CheckoutModal from "./cart/CheckoutModal";
import GuestCheckoutModal from "./Modals/guestCheckoutModal";
import AddressModal from "./Modals/new-address-modal";
import axios from "@/lib/axios";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

// export type SelectedVariationSize = {
//   variation_id: string;
//   size: string;
//   stock?: number;
//   sku?: string;
//   price: string;
//   main_value: string;
//   main_image?: string;
//   is_default?: boolean;
// };

// type ItemAddToCartProps = {

//   quantity: number;
//   selectedVariation: SelectedVariationSize | null; // received from parent
//   setSelectedQty: (qty: number) => void;
//   setSelectedVariation: (variation: SelectedVariationSize) => void;
// };

type addToCartProp = {
  selectedVariation: ProductVariation | null;
  isModal: boolean;
  onIncompleteVariation?: () => void;
  productId: string;
  product_slug: string;
  product_name: string;
  hideButtons?: boolean;
};

export default function ItemAddToCart({
  selectedVariation,
  isModal,
  product_slug,
  productId,
  product_name,
  onIncompleteVariation,
  hideButtons = false,
}: addToCartProp) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, sendHttpRequest } = useHttp();
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [guestCheckoutOpen, setGuestCheckoutOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const token = useSelector((state: RootState) => state.token.token);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId,
  );

  // const variationId = selectedVariation?.variation_id;

  const selectedVariationId = selectedVariation?.id;

  const existingCartItem = useSelector((state: RootState) =>
    selectedVariationId
      ? state.cart.items.find(
          (item) => item.variation_id === selectedVariationId
        )
      : null
  );

  const [localQty, setLocalQty] = useState<number>(0);

  useEffect(() => {
    setLocalQty(existingCartItem?.quantity ?? 0);
  }, [existingCartItem]);

  // Build display string
  const variationDisplay = selectedVariation?.name;

  // Handle quantity change
  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
  };

  const handleAddToCart = async () => {
    if (!selectedVariationId) {
      if (onIncompleteVariation) {
        onIncompleteVariation(); // scroll & highlight missing attribute
      } else {
        toast.error("Please select a variation");
      }
      return;
    }
    const newQty = (existingCartItem?.quantity || 0) + 1;
    setLocalQty(newQty);

    // 🔹 Guest user
    if (!token) {
      dispatch(
        addGuestItemToCart({
          product_slug,
          id: productId,
          variation_id: selectedVariationId,
          quantity: 1,
          variation_display: selectedVariation.name,
          product_name,
          product_image: selectedVariation.main_image_url,
          price: selectedVariation.final_price ?? selectedVariation.base_price,
          checked: true,
        })
      );

      toast.success(
        existingCartItem ? "Quantity updated" : "Item added to cart"
      );
      return;
    }

    // 🔹 Logged-in user
    try {
      await sendHttpRequest({
        requestConfig: {
          url: "/cart/add",
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
          body: {
            variation_id: selectedVariationId,
            quantity: 1,
          },
        },
        successRes: (res) => {
          console.log("Add to cart response:", res);
          fetchBackendCart();
        },
      });

      toast.success(
        existingCartItem ? "Quantity updated" : "Item added successfully"
      );
    } catch {
      toast.error("Network error — updated locally");
    }
  };

  const request = (requestConfig: any) =>
    new Promise<boolean>((resolve) => {
      sendHttpRequest({
        requestConfig,
        successRes: () => resolve(true),
        errorRes: () => resolve(false),
      });
    });

  const handleBuyNow = async () => {
    if (!selectedVariationId || !selectedVariation) return;

    setBuyNowLoading(true);
    const quantity = Math.max(localQty || 1, 1);
    const buyNowItem: CartItem = {
      product_slug,
      id: productId,
      variation_id: selectedVariationId,
      quantity,
      variation_display: selectedVariation.name,
      product_name,
      product_image: selectedVariation.main_image_url,
      price:
        selectedVariation.final_price ?? selectedVariation.base_price,
      price_at_purchase:
        selectedVariation.final_price ?? selectedVariation.base_price,
      checked: true,
    };

    if (!token) {
      dispatch(clearCart());
      dispatch(
        addGuestItemToCart({
          product_slug,
          id: productId,
          variation_id: selectedVariationId,
          quantity,
          variation_display: selectedVariation.name,
          product_name,
          product_image: selectedVariation.main_image_url,
          price:
            selectedVariation.final_price ?? selectedVariation.base_price,
          checked: true,
        }),
      );
      dispatch(setCheckoutItems([buyNowItem]));
      setBuyNowLoading(false);
      setCheckoutModalOpen(true);
      return;
    }

    const itemIds = cartItems
      .map((item) => item.variation_id || item.id)
      .filter(Boolean);

    if (itemIds.length > 0) {
      const cleared = await request({
        url: "/cart/item/batch_delete/",
        method: "DELETE",
        token,
        isAuth: true,
        userType: "buyer",
        body: { item_ids: itemIds.map((id) => ({ variation_id: id })) },
      });

      if (!cleared) {
        setBuyNowLoading(false);
        return;
      }
    } else {
      dispatch(clearCart());
    }

    const added = await request({
      url: "/cart/add",
      method: "POST",
      token,
      isAuth: true,
      userType: "buyer",
      body: { variation_id: selectedVariationId, quantity },
    });

    if (!added) {
      setBuyNowLoading(false);
      return;
    }

    // Seed checkout immediately; the checkout page replaces this with the
    // backend summary once the buyer's address is available.
    dispatch(setCheckoutItems([buyNowItem]));

    await new Promise<void>((resolve) => {
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
            (item: any) => ({
              id: item.id || item.product_id || "",
              product_id: item.product_id || item.id || "",
              variation_id: item.variation_id || null,
              product_name: item.product_name || item.name || "",
              price: item.price || item.unit_price || 0,
              price_at_purchase:
                item.price_at_purchase || item.price || item.unit_price || 0,
              quantity: item.quantity ?? 1,
              product_slug: item.product_slug || "",
              variation_display:
                item.variation_display || item.variation_name || "",
              product_image: item.product_image || item.image || "/placeholder.png",
              checked: true,
            }),
          );
          dispatch(setCartItems(items.length > 0 ? items : [buyNowItem]));
          if (items.length > 0) dispatch(setCheckoutItems(items));
          resolve();
        },
        errorRes: () => resolve(),
      });
    });

    try {
      const res = await axios.get("/shipping/shipping-addresses/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Addresses API response (BuyNow):", res?.data);

      const rawAddresses = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      console.log("Parsed addresses count (BuyNow):", rawAddresses.length);

      const addresses = rawAddresses.map((addr: any) => ({
        id: String(addr.id),
        country: addr.country_name || addr.country,
        first_name: addr.first_name,
        last_name: addr.last_name,
        phone: addr.phone,
        state: addr.state,
        city: addr.city,
        postal_code: addr.postal_code,
        address: addr.address,
        defaultAddress: addr.is_default || addr.defaultAddress || false,
        is_default: addr.is_default || addr.defaultAddress || false,
      }));

      dispatch(buyerActions.setBuyerAddresses(addresses));

      if (addresses.length === 0) {
        setBuyNowLoading(false);
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        if (isMobile) {
          router.push("/dashboard/buyer/mobile/addresses/add-address?redirect=checkout");
        } else {
          setAddressModalOpen(true);
        }
        return;
      }

      const exists = addresses.some((a: any) => String(a.id) === String(selectedAddressId));
      const defaultAddr = addresses.find((a: any) => a.is_default || a.defaultAddress);
      const chosenAddr = (exists ? addresses.find((a: any) => String(a.id) === String(selectedAddressId)) : null) || defaultAddr || addresses[0];
      const chosenId = String(chosenAddr.id);
      dispatch(buyerActions.setSelectedAddress(chosenId));

      await fetchSummaryAndNavigate(chosenId);
    } catch (err: any) {
      console.error("Error during address check in buy now:", err);
      toast.error("Failed to verify address. Please try again.");
      setBuyNowLoading(false);
    }
  };

  const fetchSummaryAndNavigate = async (addrId: string) => {
    if (!addrId) {
      setBuyNowLoading(false);
      return;
    }

    try {
      const summaryRes = await axios.post(
        "/checkout/summary/",
        {
          shipping_address_id: addrId,
          discount_amount: "0.00",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const backendCart = summaryRes?.data?.data || summaryRes?.data;
      if (backendCart) {
        const mappedItems = (backendCart.items || []).map((item: any) => ({
          id: item.product_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          quantity: item.quantity,
          subtotal: Number(item.total_price),
          unit_price: Number(item.unit_price),
          total_price: Number(item.total_price),
          variation_display: item.variation_name,
          variation_id: item.variation_id,
        }));

        dispatch(setCheckoutItems(mappedItems));
        dispatch(
          setCheckoutSummary({
            all_addresses: backendCart.all_addresses || [],
            applied_coupon: backendCart.applied_coupon || null,
            discount_amount: backendCart.discount_amount || "0.00",
            shipping_address: backendCart.shipping_address || null,
            shipping_cost: backendCart.shipping_cost || "0.00",
            shipping_methods: backendCart.shipping_methods || [],
            subtotal: backendCart.subtotal || "0.00",
            total: backendCart.total || "0.00",
          }),
        );
      }
      setBuyNowLoading(false);
      router.push("/cart/checkout");
    } catch (err: any) {
      console.error("Error fetching checkout summary in buy now:", err);
      const errMsg =
        err?.response?.data?.details ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong fetching order summary. Please try again.";
      toast.error(typeof errMsg === "string" ? errMsg : "Something went wrong fetching order summary.");
      setBuyNowLoading(false);
    }
  };

  const handleAddressSaved = async (savedAddr: any) => {
    // Handle both flat {id, ...} and wrapped {data: {id, ...}} shapes
    const addr = savedAddr?.id ? savedAddr : savedAddr?.data?.id ? savedAddr.data : savedAddr;
    const newId = addr?.id ? String(addr.id) : null;
    if (newId) {
      dispatch(buyerActions.setSelectedAddress(newId));
      setBuyNowLoading(true);
      await fetchSummaryAndNavigate(newId);
    }
  };

  const fetchBackendCart = async () => {
    if (!token) return;

    try {
      await sendHttpRequest({
        requestConfig: {
          url: "/cart/",
          method: "GET",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: async (res: any) => {
          const backendItems = res?.data?.items || [];
          console.log("🟩 Backend cart items:", backendItems);

          const mappedBackend: CartItem[] = backendItems.map(
            (item: CartItem) => {
              return {
                variation_id: item.variation_id,
                id: item.id || "",
                product_id: item.id || "",
                product_name: item.product_name || "",
                price: item.price || 0,
                price_at_purchase: item.price_at_purchase || item.price || 0,
                quantity: item.quantity ?? 1,
                product_slug: item.product_slug,
                variation_display: (
                  item.variation_display || "default"
                ).toLowerCase(),
                product_image: item.product_image || "/placeholder.png",
                stock:
                  (item as any).stock !== undefined
                    ? Number((item as any).stock)
                    : (item as any).inventory_count !== undefined
                      ? Number((item as any).inventory_count)
                      : (item as any).variation_stock !== undefined
                        ? Number((item as any).variation_stock)
                        : undefined,
                checked:
                  typeof item.checked === "boolean" ? item.checked : true,
              };
            }
          );

          dispatch(setCartItems(mappedBackend));
        },
      });
    } catch (err) {
      console.error("fetchBackendCart failed", err);
      toast.error("Failed to sync cart with server");
    }
  };

  return (
    <>
      {isModal && (
        <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-end gap-4 pt-4 pb-4 px-1 mt-6 z-10">
          {existingCartItem ? (
            <QuantitySelector
              quantity={localQty}
              onChange={handleQtyChange}
              variation_id={selectedVariationId}
              productId={productId}
            />
          ) : (
            <Button onClick={handleAddToCart} disabled={loading}>
              {loading ? <LoadingSpinner /> : "Add to cart"}
            </Button>
          )}

          <Button
            onClick={() => router.push(`/product/${product_slug}`)}
            variant="secondary"
          >
            View Product
          </Button>
        </div>
      )}
      {!isModal && (
        <div className="flex flex-col gap-6">
          {existingCartItem && (
            <div className="md:flex hidden gap-4 flex-col mt-6">
              <p className="font-MontserratSemiBold text-c12">Quantity</p>
              <QuantitySelector
                quantity={localQty}
                onChange={handleQtyChange}
                variation_id={selectedVariationId}
                productId={productId}
              />
              <span className="text-c12 font-MontserratMedium  text-000000/60">
                {selectedVariation
                  ? `${selectedVariation.stock} in stock`
                  : "Select options"}
              </span>
            </div>
          )}
          <div className="  w-full items-center gap-3 hidden md:flex">
            {existingCartItem ? (
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => router.push("/car")}
              >
                View to cart
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="secondary"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : "Add to cart"}
              </Button>
            )}

            <Button
              onClick={handleBuyNow}
              disabled={!selectedVariationId || loading || buyNowLoading}
            >
              Buy now
            </Button>
          </div>
          <div className=" flex w-full md:hidden items-center gap-3  ">
            {existingCartItem ? (
              <QuantitySelector
                quantity={localQty}
                onChange={handleQtyChange}
                variation_id={selectedVariationId}
                productId={productId}
              />
            ) : (
              <Button
                className="w-full"
                variant="secondary"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? <LoadingSpinner color="border-ff715b" /> : "Add to cart"}
              </Button>
            )}

            <Button
              onClick={handleBuyNow}
              disabled={!selectedVariationId || loading || buyNowLoading}
            >
              {buyNowLoading ? <LoadingSpinner color="border-ffffff" /> : "Buy now"}
            </Button>
          </div>
        </div>
      )}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onGuestCheckout={() => {
          setCheckoutModalOpen(false);
          setGuestCheckoutOpen(true);
        }}
      />
      <GuestCheckoutModal
        isEditing={false}
        isOpen={guestCheckoutOpen}
        onClose={() => setGuestCheckoutOpen(false)}
        selectedItems={[
          {
            product_id: productId,
            variation_id: selectedVariationId,
            quantity: Math.max(localQty || 1, 1),
            checked: true,
          },
        ]}
      />
      <AddressModal
        isOpen={addressModalOpen}
        isEdit={false}
        onClose={() => {
          setAddressModalOpen(false);
          setBuyNowLoading(false);
        }}
        onSave={handleAddressSaved}
      />
    </>
  );
}
