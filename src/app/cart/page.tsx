"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import GuestCheckoutModal from "@/components/ui/Modals/guestCheckoutModal";
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

import padlock from "@/assets/icons/padlock.png";
import NavBack from "@/assets/icons/navBacksmall.png";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import Trash from "@/assets/icons/trash.png";
import GoodMark from "@/assets/mobile/good.png";
import CaretDwn from "@/assets/mobile/carent-down.png";
import CloseX from "@/assets/mobile/closeX.png";

import QuantitySelector from "@/components/ui/cart/quantityControl";
import ProductCard from "@/components/ui/cards/ProductCard";
import { Button } from "@/components/ui/Button/Button";
import CheckoutModal from "@/components/ui/cart/CheckoutModal";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import EmptyCartIcon from "@/components/ui/cart/EmptyCartIcon";
import DotSpinner from "@/components/reloadSpinner/DotSpinner";
import { g, i } from "framer-motion/client";
import { Size } from "recharts/types/util/types";

import { setSelectedVariation } from "@/store/slices/variationSelectorSlice";
import CartSkeleton from "@/components/reloadSpinner/CartSkeleton";
import { stat } from "fs";

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const initialHydratedRef = useRef(false);
  const [deleting, setDeleting] = useState("");

  const checkingoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );

  const token = useSelector((state: RootState) => state.token?.token);
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const { loading, sendHttpRequest } = useHttp();
  const { sendHttpRequest: deleteReq } = useHttp();
  const { sendHttpRequest: toggleReq } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [syncingCart, setSyncingCart] = useState(false);
  const [localQty, setLocalQty] = useState<number>(0);
  const [hydratingCart, setHydratingCart] = useState(true);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
  };
  const hasSyncedGuestCart = useRef(false);

  const persistLocalCart = (items: any[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(items || []));
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

  const [guestCart, setGuestCart] = useState([]);
  const products = useSelector((state: RootState) => state.products.items);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setGuestCart(stored);
    } catch {
      setGuestCart([]);
    }
  }, []);

  console.log("Guest cart items:", guestCart);

  const mapGuestCartForSync = (items: any[]) =>
    items
      .filter((item) => item.variation_id && item.id) // only valid
      .map((item) => ({
        variation_id: item.variation_id,
        product_id: item.id,
        quantity: item.quantity || 1,
      }));

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
    const init = async () => {
      setHydratingCart(true);

      try {
        if (!token) {
          // Guest
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          dispatch(setCartItems(local));
          setSelectedItems(hydrateSelectionFromItems(local));
        } else {
          // Logged in
          await syncGuestCartAndFetch();
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
          console.log("🟩 Backend cart items:", backendItems);

          const mappedBackend: CartItem[] = backendItems.map(
            (item: any) => {
              return {
                id: item.id || item.product_id || "",
                product_id: item.product_id || item.id || "",
                variation_id: item.variation_id || null,
                product_name: item.product_name || item.name || "",
                price: item.price || item.unit_price || 0,
                price_at_purchase: item.price_at_purchase || item.price || item.unit_price || 0,
                quantity: item.quantity ?? 1,
                product_slug: item.product_slug || "",
                variation_display: (
                  item.variation_display || item.variation_name || ""
                ).toLowerCase(),

                product_image: item.product_image || item.image || "/placeholder.png",
                checked:
                  typeof item.checked === "boolean" ? item.checked : true,
              };
            },
          );

          console.log("cartItems local:", cartItems);

          const mapKey = (item: CartItem) =>
            `${item.product_id || item.id || "prod"}-${item.variation_id || "novar"}`;

          const mergedMap: Record<string, CartItem> = {};
          for (const item of mappedBackend) {
            const key = mapKey(item);
            mergedMap[key] = { ...item };
          }

          const merged = Object.values(mergedMap);
          console.log("✅ Final merged cart:", merged);

          dispatch(setCartItems(merged));
          persistLocalCart(merged);

          const newSelected: Record<string, boolean> = {};
          merged.forEach((mi) => {
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

  const syncGuestCartAndFetch = async () => {
    if (!token) return;

    // 1️⃣ Sync guest cart if any
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    const payload = mapGuestCartForSync(stored);

    if (payload.length > 0) {
      await sendHttpRequest({
        requestConfig: {
          url: "/cart/bulk_add/",
          method: "POST",
          token,
          isAuth: true,
          userType: "buyer",
          body: { items: payload },
        },
        successRes: () => {
          // ✅ only clear local cart AFTER backend confirms success
          localStorage.removeItem("cart");
          setGuestCart([]);
          hasSyncedGuestCart.current = true;
        },
      });
    }

    // 2️⃣ Fetch final backend cart
    await fetchBackendCart();
  };

  const handleToggleItem = async (item: any) => {
    const id = item.variation_id || item.id;

    const newChecked = !selectedItems[id];

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
    console.log("selectedIds for deletion:", selectedIds);

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
          body: { item_ids: selectedIds },
        },
        successRes: () => {},
      });
    } catch (err) {
      toast.error("Failed to delete selected items on server");
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

  const handleCheckout = () => {
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
    } else {
      router.push("/cart/checkout");
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
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pl-c56 pt-c20 z-40 hidden md:flex items-center w-full"
            style={{ top: "4rem" }}
          >
            <nav
              aria-label="breadcrumb"
              className="flex h-c32 w-full items-center gap-2"
            >
              <Link
                href="/"
                className="opacity-30 font-MontserratMedium text-c12"
              >
                Home
              </Link>
              <Image src={WnavRight} alt=">" width={16} height={16} />
              <span className="font-MontserratMedium text-c12">Cart</span>
            </nav>
          </motion.div>

          <div className="w-full md:px-15 px-0 pb-3 md:pb-0">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-4 pl-6  mt-3 md:mt-c32"
            >
              <Image
                src={NavBack}
                alt="<"
                width={9}
                height={16.5}
                className="brightness-20 w-2.25 h-[16.5px]"
              />
              <p className="font-MontserratSemiBold text-c16 text-161616">
                My Cart ({cartItems.length})
              </p>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCartIcon />
          ) : (
            <>
              <div className="md:pt-c48 pb-c64">
                <div className="md:flex gap-18 justify-center">
                  <div className="w-full max-w-207">
                    <div className="w-full h-c56 mb-4 md:mb-c32 flex px-6 justify-between items-center bg-947fff/10">
                      <div className="flex items-center gap-4">
                        {/* <input
                      type="checkbox"
                      className="h-5 w-5 border border-black rounded  accent-black checked:bg-black checked:text-white"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    /> */}

                        <button
                          onClick={handleSelectAll}
                          className={`w-5 h-5 rounded-c4 border-1 border-000000/32 flex items-center justify-center transition-colors ${
                            allSelected
                              ? "bg-ff715b"
                              : "border-000000/5 bg-transparent"
                          }`}
                        >
                          {allSelected && (
                            <Image
                              src={GoodMark}
                              alt="checked"
                              width={9.75}
                              height={7.13}
                            />
                          )}
                        </button>
                        <span className="text-c12 font-MontserratSemiBold">
                          Select All
                        </span>
                      </div>
                      {Object.values(selectedItems).some(
                        (isSelected) => isSelected,
                      ) && (
                        <button onClick={handleDeleteSelected}>
                          <Image
                            src={Trash}
                            alt="delete"
                            width={15}
                            height={16.25}
                          />
                        </button>
                      )}
                    </div>

                    <div className="flex px-6 w-full justify-between mb-15 md:mb-0">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: { opacity: 0, height: 0 },
                          visible: {
                            opacity: 1,
                            height: "auto",
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                        className="space-y-c24 w-full "
                      >
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.variation_id || item.id}
                            className="flex justify-between items-center md:border-b  border-gray-200 pb-4"
                          >
                            <div className="flex items-center md:items-start  gap-4 ">
                              <input
                                type="checkbox"
                                checked={
                                  !!selectedItems[item.variation_id || item.id]
                                }
                                onChange={() => handleToggleItem(item)}
                                className="custom-checkbox flex-shrink-0"
                              />
                              <button
                                onClick={() => handleClick(item)}
                                className="flex gap-4 items-center"
                              >
                                {item.product_image && (
                                  <Image
                                    src={
                                      item.product_image || "/placeholder.png"
                                    }
                                    alt={item.product_name || "Product image"}
                                    width={96}
                                    height={96}
                                    className="rounded md:h-24 md:w-24 w-c56 h-c56"
                                  />
                                )}

                                <div>
                                  <p className="font-MontserratSemiBold  text-c12 md:text-base mb-1">
                                    {item.product_name}
                                  </p>
                                  {!token ? (
                                    <p className="bg-000000/5 px-3 py-1 md:px-4 md:py-2 w-fit rounded-c12 text-000000/36 mb-3 text-c12 font-MontserratSemiBold">
                                      {item.quantity}pc,{" "}
                                      {item.variation_display || "black"}
                                    </p>
                                  ) : (
                                    <p className="bg-000000/5 px-3 py-1 md:px-4 md:py-2 w-fit rounded-c12 text-000000/36 mb-3 text-c12 font-MontserratSemiBold">
                                      {item.quantity}pc,{" "}
                                      {item.variation_display || "black"}
                                    </p>
                                  )}

                                  <p className="font-MontserratNormal text-base md:text-c12 text-gray-600 text-left">
                                    ₦{item.price}
                                  </p>
                                </div>
                              </button>
                            </div>

                            <motion.div
                              layout
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 25,
                              }}
                              className="flex flex-col items-end justify-center h-full space-y-9"
                            >
                              <motion.button
                                key="delete"
                                // disabled={
                                //   deleting === item.variation_id ||
                                //   deleting === item.id
                                // }
                                onClick={() => handleDeleteItem(item)}
                                className="ml-2 transition-opacity hover:opacity-70 z-10"
                              >
                                {deleting !== "" &&
                                deleting === item.variation_id ? (
                                  <LoadingSpinner color="border-ff715b" />
                                ) : (
                                  <Image
                                    src={Trash}
                                    alt="delete"
                                    width={15}
                                    height={16}
                                  />
                                )}
                              </motion.button>

                              <motion.div
                                layout
                                transition={{
                                  layout: {
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 25,
                                  },
                                }}
                                className="w-full flex justify-end"
                              >
                                <QuantitySelector
                                  productId={item.id}
                                  variation_id={item.variation_id || item.id}
                                  quantity={localQty}
                                  onChange={handleQtyChange}
                                />
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  {/* Order Summary (Desktop) */}
                  <div className="hidden md:flex w-full max-w-84.25">
                    <div className="w-full">
                      <h1 className="text-sm font-MontserratSemiBold mb-3">
                        Order Summary
                      </h1>
                      <div className="space-y-2 text-sm font-MontserratNormal h-23 border-b border-b-000000/10">
                        <div className="flex justify-between">
                          <p>Total items:</p>
                          <p>₦{totalPrice}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Discount:</p>
                          <p className="text-ca0202">0</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Subtotal:</p>
                          <p>₦{totalPrice}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-c32 border-b border-b-000000/10 pt-4">
                        <div className="w-full max-w-60">
                          <p>Total:</p>
                          <p className="text-c10 font-MontserratNormal leading-4">
                            Please refer to your final actual payment amount.
                          </p>
                        </div>
                        <p className="text-c32 font-MontserratSemiBold">
                          ₦{totalPrice}
                        </p>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        disabled={selectedCount === 0}
                        className="border-0"
                      >
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          <>Proceed ({selectedCount})</>
                        )}
                      </Button>
                      <div className="space-y-2.5 mt-c32">
                        <div className="flex items-center gap-2">
                          <Image
                            src={ShildCheck}
                            alt="shild check"
                            width={20}
                            height={20}
                          />
                          <p className="text-c12 font-MontserratSemiBold">
                            Secure payments
                          </p>
                        </div>
                        <p className="text-c12 font-MontserratNormal leading-4">
                          Every payment you make on MartAf is secured with
                          strict SSL encryption and PCI DSS data protection
                          protocols
                        </p>
                      </div>
                      <div className="space-y-2.5 mt-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src={padlock}
                            alt="shild check"
                            width={20}
                            height={20}
                          />
                          <p className="text-c12 font-MontserratSemiBold">
                            Secure privacy
                          </p>
                        </div>
                        <p className="text-c12 font-MontserratNormal leading-4">
                          Protecting your privacy is important to us! We will
                          only use your information in accordance with our
                          privacy policy.
                        </p>
                      </div>
                    </div>
                  </div>
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

              <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed bottom-0 md:hidden z-30 flex items-center gap-4 ">
                <div className="flex items-center gap-2 w-11">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      allSelected
                        ? "bg-ff715b border-ff715b"
                        : "border-ff715b bg-transparent"
                    }`}
                  >
                    {allSelected && (
                      <Image
                        src={GoodMark}
                        alt="checked"
                        width={9.75}
                        height={7.13}
                      />
                    )}
                  </button>
                  <p className="text-c12 font-semibold">All</p>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <div>
                    <p className="font-MontserratSemiBold text-c20">
                      ₦{totalPrice}
                    </p>
                    <p className="text-c12 font-MontserratNormal text-ca0202 line-through">
                      ₦1250.00
                    </p>
                  </div>
                  <button
                    className="w-full transition-transform"
                    onClick={() => setOpenModal((prev) => !prev)}
                  >
                    <motion.div animate={{ rotate: openModal ? 180 : 0 }}>
                      <Image src={CaretDwn} alt="view" width={16} height={16} />
                    </motion.div>
                  </button>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className="border-0 bg-black hover:bg-black/90 text-white rounded-xl"
                >
                  Proceed ({selectedCount})
                </Button>
              </div>

              <AnimatePresence>
                {openModal && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 300, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-30 w-full bg-ffffff z-40 px-6 overflow-hidden circle-shadow"
                  >
                    <div className="flex justify-between pt-6 ">
                      <p className="text-base font-MontserratSemiBold">
                        Checkout details
                      </p>
                      <button onClick={() => setOpenModal((prev) => !prev)}>
                        <Image
                          src={CloseX}
                          alt="close"
                          width={15}
                          height={15}
                        />
                      </button>
                    </div>

                    <div className="flex gap-2 overflow-x-scroll py-4">
                      {cartItems
                        .filter(
                          (item) => selectedItems[item.variation_id || item.id],
                        )
                        .map((item) => (
                          <Image
                            key={item.variation_id || item.id}
                            src={item.product_image || "/placeholder.png"}
                            alt={item.product_name || "product name"}
                            width={56}
                            height={56}
                            className="flex-shrink-0 rounded w-14 h-14"
                          />
                        ))}
                    </div>

                    <div className="space-y-2 text-sm font-MontserratNormal">
                      <div className="flex justify-between">
                        <p>Total items:</p>
                        <p>₦{totalPrice}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-MontserratSemiBold">Subtotal:</p>
                        <p>₦{totalPrice}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Discount:</p>
                        <p className="text-ca0202">0</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Shipping fee:</p>
                        <p>Free</p>
                      </div>
                      <div className="flex justify-between text-base font-MontserratSemiBold">
                        <p>Estimated total:</p>
                        <p>₦{totalPrice}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                onGuestCheckout={() => setOpen(true)}
              />
              <GuestCheckoutModal
                isEditing={false}
                isOpen={open}
                onClose={() => setOpen(false)}
                selectedItems={cartItems
                  .filter((item) => selectedItems[item.variation_id || item.id])
                  .map((item) => ({
                    product_id: item.id,
                    variation_id: item.variation_id,
                    quantity: item.quantity,
                    checked: true,
                  }))}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
