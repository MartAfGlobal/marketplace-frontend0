"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import axios from "@/lib/axios";
import { selectCheckedItems, setCheckoutSummary } from "@/store/cart/cartSlice";
import {
  removeFromCart,
  updateQuantity,
  setCheckoutItems,
  setCartItems,
  clearCart,
  updateCheckedState,
  CartItem,
} from "@/store/cart/cartSlice";

import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import EmptyCartIcon from "@/components/ui/cart/EmptyCartIcon";
import CartSkeleton from "@/components/reloadSpinner/CartSkeleton";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import { useFetchOrders } from "@/helpers/fetchOrders";
import { mapBackendCartItems } from "@/utils/cart";
import CartPageHeader from "@/components/ui/cart/CartPageHeader";
import CartItemsSection from "@/components/ui/cart/CartItemsSection";
import CartOrderSummary from "@/components/ui/cart/CartOrderSummary";
import CartMobileSummary from "@/components/ui/cart/CartMobileSummary";
import CartPageDialogs from "@/components/ui/cart/CartPageDialogs";

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  // Desktop address modal for users with no saved address
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  // True while the checkout guard is running (fetch address + fetch summary)
  const [checkoutGuarding, setCheckoutGuarding] = useState(false);
  const initialHydratedRef = useRef(false);
  const [deleting, setDeleting] = useState("");

  const checkingoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );

  const token = useSelector((state: RootState) => state.token?.token);
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses,
  );
  const selectedAddressId = useSelector(
    (state: RootState) => state.buyer.selectedAddressId,
  );
  const { loading, sendHttpRequest } = useHttp();
  const { sendHttpRequest: deleteReq } = useHttp();
  const { sendHttpRequest: toggleReq } = useHttp();
  // Dedicated hook for checkout-summary pre-fetch (shows loading on the Proceed button)
  const { loading: summaryLoading, sendHttpRequest: summarySendRequest } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [syncingCart, setSyncingCart] = useState(false);
  const [localQty, setLocalQty] = useState<number>(0);
  const [hydratingCart, setHydratingCart] = useState(true);

  const { fetchAddress } = useFetchOrders();

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
  };
  const persistLocalCart = (items: any[]) => {
    // Guest carts are persisted in the browser; authenticated carts are authoritative on the server.
    try {
      if (!token) {
        localStorage.setItem("cart", JSON.stringify(items || []));
      } else {
        localStorage.removeItem("cart");
      }
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  };

  const hydrateSelectionFromItems = (items: CartItem[]) => {
    const selected: Record<string, boolean> = {};
    items.forEach((it) => {
      const key = it.variation_id || it.id;
      selected[key] = typeof it.checked === "boolean" ? it.checked : true;
    });
    return selected;
  };

  const products = useSelector((state: RootState) => state.products.items);

  console.log("products items in Redux:", products);

  const applyCheckedToLocal = (id: string, checked: boolean) => {
    const updated = cartItems.map((it) =>
      (it.variation_id || it.id) === id ? { ...it, checked } : it,
    );

    dispatch(setCartItems(updated));
    persistLocalCart(updated);

    setSelectedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const applyBulkCheckedToLocal = (checked: boolean) => {
    const updated = cartItems.map((it) => ({ ...it, checked }));
    dispatch(setCartItems(updated));
    persistLocalCart(updated);

    const selected: Record<string, boolean> = {};
    updated.forEach((it) => {
      const key = it.variation_id || it.id;
      selected[key] = checked;
    });

    setSelectedItems(selected);
  };

  useEffect(() => {
    // Restore guest carts locally; logged-in buyers use the server cart.
    const init = async () => {
      setHydratingCart(true);

      try {
        if (!token) {
          // Guest
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          dispatch(setCartItems(local));
          setSelectedItems(hydrateSelectionFromItems(local));
        } else {
          // The backend cart is authoritative for logged-in buyers.
          await fetchBackendCart();
        }
      } catch (err) {
        console.error("Cart hydration failed", err);
      } finally {
        initialHydratedRef.current = true;
        setHydratingCart(false);
      }
    };

    init();
  }, [token]);

  useEffect(() => {
    if (!initialHydratedRef.current) return;

    let newSelected = { ...selectedItems };
    let changed = false;

    cartItems.forEach((it: any) => {
      const id = it.variation_id || it.id;
      const checked = typeof it.checked === "boolean" ? it.checked : true;

      if (newSelected[id] === undefined) {
        newSelected[id] = checked;
        changed = true;
      }
    });

    const existingIds = new Set(
      cartItems.map((it: any) => it.variation_id || it.id),
    );
    Object.keys(newSelected).forEach((k) => {
      if (!existingIds.has(k)) {
        delete newSelected[k];
        changed = true;
      }
    });

    if (changed) {
      setSelectedItems(newSelected);

      // ❗ REMOVE THIS (no more updating cartItems here)
      // dispatch(setCartItems(merged));
      // persistLocalCart(merged);
    }
  }, [cartItems]);

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
          const mappedBackend = mapBackendCartItems(backendItems);

          dispatch(setCartItems(mappedBackend));

          const newSelected: Record<string, boolean> = {};
          mappedBackend.forEach((mi) => {
            newSelected[mi.variation_id || mi.id] =
              typeof mi.checked === "boolean" ? mi.checked : true;
          });
          setSelectedItems(newSelected);

          setSyncingCart(false);
        },
      });
    } catch (err) {
      console.error("fetchBackendCart failed", err);
      toast.error("Failed to sync cart with server");
      setSyncingCart(false);
    }
  };

  const handleToggleItem = async (item: any) => {
    const id = item.variation_id || item.id;

    const newChecked = !selectedItems[id];

    // Update the UI immediately; roll back the optimistic selection if the server rejects it.
    applyCheckedToLocal(item.variation_id || item.id, newChecked);

    if (!token) {
      try {
        dispatch(
          updateCheckedState({
            variation_id: item.variation_id || item.id,
            checked: newChecked,
          }),
        );
      } catch (e) {
        console.error("Local update failed", e);
      }
      return;
    }

    try {
      await toggleReq({
        requestConfig: {
          url: `/cart/item/${item.variation_id || item.id || item.product_id}/`,
          method: "PATCH",
          token,
          isAuth: true,
          userType: "buyer",
          body: { checked: newChecked, quantity: item.quantity },
        },
        successRes: (res) => {
          console.log("patching check response", res);
        },
      });
    } catch (error) {
      console.error("Error toggling item on server:", error);
      toast.error("Failed to update item selection on server. Reverting...");
      applyCheckedToLocal(item.variation_id || item.id, !newChecked);
    }
  };

  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((i) => !!selectedItems[i.variation_id || i.id]);

  const handleSelectAll = async () => {
    const newChecked = !allSelected;

    applyBulkCheckedToLocal(newChecked);

    if (!token) {
      try {
        cartItems.forEach((it: any) =>
          dispatch(
            updateCheckedState({
              variation_id: it.variation_id,
              checked: newChecked,
            }),
          ),
        );
      } catch (e) {
        console.error("Guest update checked state failed", e);
      }
      return;
    }

    try {
      await Promise.all(
        cartItems.map((item: any) =>
          toggleReq({
            requestConfig: {
              url: `/cart/item/${item.variation_id || item.id}/`,
              method: "PATCH",
              token,
              isAuth: true,
              userType: "buyer",
              body: { checked: newChecked, quantity: item.quantity },
            },
            successRes: (res) => {
              console.log("patching check response", res);
              // for each success, update redux (we already did optimistic)
              dispatch(
                updateCheckedState({
                  variation_id: item.variation_id,
                  checked: newChecked,
                }),
              );
            },
          }),
        ),
      );
    } catch (err) {
      console.error("Error in handleSelectAll:", err);
      toast.error("Failed to update some items on server. Re-syncing...");

      await fetchBackendCart();
    }
  };

  const handleDeleteItem = async (item: CartItem) => {
    if (!token) {
      console.log("Deleting item locally:", item);
      setDeleting("");
      dispatch(
        removeFromCart({
          variation_id: item.variation_id || item.id,
        }),
      );
    }

    setSelectedItems((p) => {
      const copy = { ...p };
      delete copy[item.variation_id || item.id];
      return copy;
    });

    const updatedLocal = (cartItems || []).filter(
      (it: any) => it.variation_id !== item.variation_id,
    );
    persistLocalCart(updatedLocal);
    console.log("Deleting item on server:", item);

    if (!token) return;
    setDeleting(item.variation_id || item.id);
    try {
      await deleteReq({
        requestConfig: {
          url: `/cart/item/${item.variation_id || item.id || item.product_id}/remove/`,
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: (res) => {
          dispatch(
            removeFromCart({
              variation_id: item.variation_id || item.id,
            }),
          );
          setDeleting("");
        },
      });
    } catch {
      toast.error("Failed to delete item on server");
      setDeleting("");
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.entries(selectedItems)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      toast.info("No items selected to delete.");
      return;
    }

    const itemsToDelete = (cartItems || []).filter(
      (it) => selectedItems[it.variation_id || it.id],
    );

    const payloadItemIds = itemsToDelete.map((item) => ({
      variation_id: item.variation_id || item.id || item.product_id || "",
    }));

    // Optimistically update local state & Redux
    selectedIds.forEach((id) => dispatch(removeFromCart({ variation_id: id })));

    const remaining = (cartItems || []).filter(
      (it) => !selectedIds.includes(it.variation_id || it.id),
    );

    persistLocalCart(remaining);
    setSelectedItems({});

    if (!token) return;

    try {
      await sendHttpRequest({
        requestConfig: {
          url: `/cart/item/batch_delete/`,
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
          body: { item_ids: payloadItemIds },
        },
        successRes: () => {},
      });
    } catch {
      try {
        await Promise.allSettled(
          itemsToDelete.map((item) => {
            const targetId = item.variation_id || item.id || item.product_id;
            return axios.delete(`/cart/item/${targetId}/remove/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }),
        );
      } catch (err) {
        console.error("Error deleting items from backend:", err);
      }
    } finally {
      await fetchBackendCart();
    }
  };

  const totalPrice = Number(
    (cartItems || [])
      .reduce((acc, i) => {
        if (!selectedItems[i.variation_id || i.id]) return acc;

        const price = Number(i.price) || 0;
        const qty = Number(i.quantity) || 0;

        return acc + price * qty;
      }, 0)
      .toFixed(1),
  );

  const checkoutItems = (cartItems || [])
    .filter((item) => selectedItems[item.variation_id || item.id])
    .map((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const subtotal = price * qty;

      return {
        ...item,
        subtotal, // ✅ overwrite null
        formatted_subtotal: `₦${subtotal.toLocaleString()}`,
      };
    });

  const fetchSummaryAndNavigate = async (addrId: string) => {
    if (!addrId) {
      setCheckoutGuarding(false);
      return;
    }

    try {
      // Ask the backend to price the selected cart lines against the chosen address before opening checkout.
      const summaryPayload = {
        shipping_address_id: addrId,
        discount_amount: "0.00",
      };

      console.log("summary id", summaryPayload)
      console.log("Fetching checkout summary", {
        url: "/checkout/summary/",
        payload: summaryPayload,
      });
      const summaryRes = await axios.post(
        "/checkout/summary/",
        summaryPayload,
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
      setCheckoutGuarding(false);
      router.push("/cart/checkout");
    } catch (err: any) {
      console.error("Error fetching checkout summary:", err);
      console.error("Checkout summary request config:", {
        method: "POST",
        url: "/checkout/summary/",
        data: {
          shipping_address_id: String(addrId),
          discount_amount: "0.00",
        },
      });
      console.error("Checkout summary error response:", {
        status: err?.response?.status,
        data: err?.response?.data,
        headers: err?.response?.headers,
      });
      const errMsg =
        err?.response?.data?.details ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong fetching order summary. Please try again.";
      toast.error(typeof errMsg === "string" ? errMsg : "Something went wrong fetching order summary.");
      setCheckoutGuarding(false);
    }
  };

  const handleAddressSaved = async (savedAddr: any) => {
    // Handle both flat {id, ...} and wrapped {data: {id, ...}} shapes
    const addr = savedAddr?.id ? savedAddr : savedAddr?.data?.id ? savedAddr.data : savedAddr;
    const newId = addr?.id ? String(addr.id) : null;
    if (newId) {
      const addressesRes = await axios.get("/shipping/shipping-addresses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawAddresses = Array.isArray(addressesRes?.data)
        ? addressesRes.data
        : Array.isArray(addressesRes?.data?.results)
        ? addressesRes.data.results
        : [];
      const addresses = rawAddresses.map((address: any) => ({
        ...address,
        id: String(address.id),
        defaultAddress: address.is_default || address.defaultAddress || false,
        is_default: address.is_default || address.defaultAddress || false,
      }));

      dispatch(buyerActions.setBuyerAddresses(addresses));
      dispatch(buyerActions.setSelectedAddress(newId));
      setCheckoutGuarding(true);
      await fetchSummaryAndNavigate(newId);
    }
  };

  const handleCheckout = async () => {
    // Freeze the selected cart lines as the checkout snapshot before address and pricing checks begin.
    dispatch(setCheckoutItems(checkoutItems));

    if (!token) {
      dispatch(
        setCheckoutSummary({
          all_addresses: [],
          discount_amount: "0.00",
          shipping_address: null,
          shipping_cost: "0.00",
          shipping_methods: [],
          subtotal: totalPrice.toLocaleString(),
          total: totalPrice.toLocaleString(),
        }),
      );

      setCheckoutModalOpen(true);
      return;
    }

    setCheckoutGuarding(true);

    try {
      // 1. Always fetch addresses from server first
      const res = await axios.get("/shipping/shipping-addresses/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Addresses API response:", res?.data);

      const rawAddresses = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      console.log("Parsed addresses count:", rawAddresses.length);

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

      // 2. If buyer has no address, prompt them with the form
      if (addresses.length === 0) {
        setCheckoutGuarding(false);
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        if (isMobile) {
          router.push("/dashboard/buyer/mobile/addresses/add-address?redirect=checkout");
        } else {
          setAddressModalOpen(true);
        }
        return;
      }

      // 3. User has address: select default or existing selection
      const exists = addresses.some((a: any) => String(a.id) === String(selectedAddressId));
      const defaultAddr = addresses.find((a: any) => a.is_default || a.defaultAddress);
      const chosenAddr = (exists ? addresses.find((a: any) => String(a.id) === String(selectedAddressId)) : null) || defaultAddr || addresses[0];
      const chosenId = String(chosenAddr.id);
      dispatch(buyerActions.setSelectedAddress(chosenId));

      // 4. Pre-fetch summary during button load before routing
      await fetchSummaryAndNavigate(chosenId);
    } catch (err: any) {
      console.error("Error during address check:", err);
      toast.error("Failed to verify address. Please try again.");
      setCheckoutGuarding(false);
    }
  };

  console.log("cartItems:", cartItems);

  const variationSelector = useSelector(
    (state: RootState) => state.selectedVariation,
  );

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const handleClick = (item: CartItem) => {
    const variationId = item.variation_id; // or whatever your field is

    // Build the URL string manually
    const url = `/product/${item.product_slug}${variationId ? `?variationId=${variationId}` : ""}`;

    router.push(url);

    console.log("item clicked", item, variationId);
  };

  return (
    <>
      {hydratingCart ? (
        <CartSkeleton />
      ) : (
        <div className="relative md: md:h-full h-dvh">
          <CartPageHeader
            itemCount={cartItems.length}
            onBack={() => router.back()}
          />

          {cartItems.length === 0 ? (
            <EmptyCartIcon />
          ) : (
            <>
              <div className="md:pt-c48 pb-c64 md:px-15">
                <div className="md:flex gap-18 justify-center">
                  <CartItemsSection
                    cartItems={cartItems}
                    selectedItems={selectedItems}
                    allSelected={allSelected}
                    token={token}
                    deleting={deleting}
                    onSelectAll={handleSelectAll}
                    onDeleteSelected={handleDeleteSelected}
                    onToggleItem={handleToggleItem}
                    onItemClick={handleClick}
                    onDeleteItem={handleDeleteItem}
                    onQtyChange={handleQtyChange}
                  />
                  <CartOrderSummary
                    totalPrice={totalPrice}
                    selectedCount={selectedCount}
                    checkoutGuarding={checkoutGuarding}
                    loading={loading}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>

              <div className="hidden w-full md:flex">
                <div className="w-full">
                  <div className="py-c32">
                    <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
                      More to love
                    </p>
                  </div>
                </div>
              </div>

              <CartMobileSummary
                cartItems={cartItems}
                selectedItems={selectedItems}
                totalPrice={totalPrice}
                selectedCount={selectedCount}
                allSelected={allSelected}
                checkoutGuarding={checkoutGuarding}
                open={openModal}
                onSelectAll={handleSelectAll}
                onToggleDetails={() => setOpenModal((prev) => !prev)}
                onCheckout={handleCheckout}
              />
              <CartPageDialogs
                checkoutModalOpen={checkoutModalOpen}
                guestModalOpen={open}
                addressModalOpen={addressModalOpen}
                cartItems={cartItems}
                selectedItems={selectedItems}
                onCloseCheckout={() => setCheckoutModalOpen(false)}
                onOpenGuestCheckout={() => setOpen(true)}
                onCloseGuestCheckout={() => setOpen(false)}
                onCloseAddress={() => {
                  setAddressModalOpen(false);
                  setCheckoutGuarding(false);
                }}
                onSaveAddress={handleAddressSaved}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
