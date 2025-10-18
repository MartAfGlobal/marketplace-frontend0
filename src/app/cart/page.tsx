"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import {
  removeFromCart,
  updateQuantity,
  setCheckoutItems,
  setCartItems,
  clearCart,
  updateCheckedState,
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

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(10);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const initialHydratedRef = useRef(false);

  const token = useSelector((state: RootState) => state.token?.token);
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const { loading, sendHttpRequest } = useHttp();
  const dispatch = useDispatch();
  const router = useRouter();

  // ---------- Helpers ----------
  const persistLocalCart = (items: any[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(items || []));
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  };

  const hydrateSelectionFromItems = (items: any[]) => {
    const selected: Record<string, boolean> = {};
    items.forEach((it: any) => {
      selected[it.id] = typeof it.checked === "boolean" ? it.checked : true;
    });
    return selected;
  };

  // Utility to update Redux + localStorage with a changed checked flag
  const applyCheckedToLocal = (id: string, checked: boolean) => {
    // update local Redux cartItems copy
    const updated = (cartItems || []).map((it: any) =>
      it.id === id ? { ...it, checked } : it
    );
    dispatch(setCartItems(updated));
    persistLocalCart(updated);

    // keep selectedItems UI in sync
    setSelectedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const applyBulkCheckedToLocal = (checked: boolean) => {
    const updated = (cartItems || []).map((it: any) => ({ ...it, checked }));
    dispatch(setCartItems(updated));
    persistLocalCart(updated);

    const updatedSelected: Record<string, boolean> = {};
    updated.forEach((it) => {
      updatedSelected[it.id] = checked;
    });
    setSelectedItems(updatedSelected);
  };

  // ---------- Initial load & sync ----------
  useEffect(() => {
    // On mount: if there's no token, load localStorage cart into Redux.
    // If there's a token, fetch backend cart.
    const init = async () => {
      if (!token) {
        try {
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          // ensure shape matches expected cart items (optional mapping)
          dispatch(setCartItems(local));
          const sel = hydrateSelectionFromItems(local);
          setSelectedItems(sel);
        } catch (e) {
          console.error("Failed to read local cart", e);
          dispatch(setCartItems([]));
          setSelectedItems({});
        }
      } else {
        // if token present, call fetchBackendCart which will set items & selection
        await fetchBackendCart();
      }
      initialHydratedRef.current = true;
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // If cartItems change in Redux because other parts of app updated it,
  // we should make sure selectedItems reflect the new items:
  // but don't clobber user toggles for unchanged items.
  useEffect(() => {
    // don't run until initial hydration happened
    if (!initialHydratedRef.current) return;

    // Build new selected map for items that are new or not presently in selectedItems
    const newSelected = { ...selectedItems };
    let changed = false;

    cartItems.forEach((it: any) => {
      const id = it.id;
      const serverChecked = typeof it.checked === "boolean" ? it.checked : true;
      // If we don't have this id in selectedItems (new item), adopt serverChecked
      if (newSelected[id] === undefined) {
        newSelected[id] = serverChecked;
        changed = true;
      } else {
        // if the server provided an explicit checked value that differs from our UI selection,
        // we should keep UI if user has recently toggled. To avoid flip-flop, only update if
        // serverChecked differs and our selectedItems equals old server value.
        // (This avoids overwriting user choice after they toggled).
        // For simplicity: do not overwrite existing selection here.
      }
    });

    // Remove selections for items that no longer exist
    const existingIds = new Set(cartItems.map((it: any) => it.id));
    Object.keys(newSelected).forEach((k) => {
      if (!existingIds.has(k)) {
        delete newSelected[k];
        changed = true;
      }
    });

    if (changed) {
      setSelectedItems(newSelected);
      // persist a merged cart to localStorage to keep fallback consistent
      const merged = cartItems.map((it: any) => ({
        ...it,
        checked: !!newSelected[it.id],
      }));
      persistLocalCart(merged);
      dispatch(setCartItems(merged));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        successRes: (res: any) => {
          const items = res?.data?.items || [];

          console.log("checking back ed cart:", items);
          const mapped = items.map((item: any) => {
            const variation = item.variation || {};
            return {
              id: item.id,
              product_id: item.product?.id,
              name:
                item.product_name ||
                item.product?.description ||
                "Unnamed Product",
              price:
                item.product?.discount_price || item.price_at_purchase || 0,
              quantity: item.quantity || 1,
              image: [item.product_image || "/placeholder.png"],
              variations_data: variation ? [variation] : [],
              variation_display: item.variation_display,
              color: variation.color || null,
              size: variation.size || null,
              product_image: item.product_image || "/placeholder.png",
              checked: typeof item.checked === "boolean" ? item.checked : true,
            };
          });

          dispatch(setCartItems(mapped));
          persistLocalCart(mapped);

          // Build selection map from backend's checked flags
          const newSelected: Record<string, boolean> = {};
          mapped.forEach((mi: any) => {
            newSelected[mi.id] =
              typeof mi.checked === "boolean" ? mi.checked : true;
          });

          setSelectedItems((prev) => {
            // Merge: prefer existing prev selections for items that already exist,
            // but adopt backend value for newly added items.
            const merged = { ...newSelected };
            Object.keys(prev).forEach((k) => {
              if (merged[k] !== undefined) merged[k] = prev[k];
            });
            return merged;
          });

          toast.success("Cart synced successfully");
        },
      });
    } catch (err) {
      console.error("fetchBackendCart failed", err);
      toast.error("Failed to fetch cart from server");
    }
  };

  // ---------- Toggle single item ----------
  const handleToggleItem = async (item: any) => {
    const newChecked = !selectedItems[item.id];

    // Optimistic UI + local persistence
    applyCheckedToLocal(item.id, newChecked);

    // If guest, only local changes needed
    if (!token) {
      // updateCheckedState action may update Redux slice (you already dispatch that elsewhere)
      // Keep Redux in sync already via setCartItems above
      try {
        dispatch(updateCheckedState({ id: item.id, checked: newChecked }));
      } catch (e) {
        console.error("Local update failed", e);
      }
      return;
    }

    // Logged-in: send change to server. Revert on failure.
    try {
      await sendHttpRequest({
        requestConfig: {
          url: `/cart/item/${item.id}/`,
          method: "PATCH",
          token,
          isAuth: true,
          userType: "buyer",
          body: { checked: newChecked, quantity: item.quantity },
        },
        successRes: (res) => {
          // Update Redux slice to reflect server ack (safe no-op if already matches)
          dispatch(updateCheckedState({ id: item.id, checked: newChecked }));
          // also ensure local storage matches server ack (we already persisted optimistically)
          // optionally we could call fetchBackendCart() here to re-sync fully
        },
      });
    } catch (error) {
      console.error("Error toggling item on server:", error);
      toast.error("Failed to update item selection on server. Reverting...");
      // revert optimistic
      applyCheckedToLocal(item.id, !newChecked);
    }
  };

  // ---------- Select All ----------
  const allSelected =
    cartItems.length > 0 && cartItems.every((i) => !!selectedItems[i.id]);

  const handleSelectAll = async () => {
    const newChecked = !allSelected;

    // Optimistic local update
    applyBulkCheckedToLocal(newChecked);

    if (!token) {
      // guest: dispatch updates to slice for consistency
      try {
        cartItems.forEach((it: any) =>
          dispatch(updateCheckedState({ id: it.id, checked: newChecked }))
        );
      } catch (e) {
        console.error("Guest update checked state failed", e);
      }
      return;
    }

    // logged-in: try updating server for each item
    try {
      // send requests in parallel but wait for all
      await Promise.all(
        cartItems.map((item: any) =>
          sendHttpRequest({
            requestConfig: {
              url: `/cart/item/${item.id}/`,
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
                updateCheckedState({ id: item.id, checked: newChecked })
              );
            },
          })
        )
      );
    } catch (err) {
      console.error("Error in handleSelectAll:", err);
      toast.error("Failed to update some items on server. Re-syncing...");
      // re-fetch from server to restore correct state
      await fetchBackendCart();
    }
  };

  // ---------- Delete Item ----------
  const handleDeleteItem = async (id: string) => {
    // remove locally immediately
    dispatch(removeFromCart(id));
    setSelectedItems((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });

    // persist local cart
    const updatedLocal = (cartItems || []).filter((it: any) => it.id !== id);
    persistLocalCart(updatedLocal);

    if (!token) return;
    try {
      await sendHttpRequest({
        requestConfig: {
          url: `/cart/item/${id}/remove/`,
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
        },
        successRes: fetchBackendCart,
      });
    } catch {
      toast.error("Failed to delete item on server");
      // try to re-sync
      await fetchBackendCart();
    }
  };

  // ---------- Delete Selected ----------
  const handleDeleteSelected = async () => {
    // 1️⃣ Collect only checked item IDs
    const selectedIds = Object.entries(selectedItems)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      toast.info("No items selected to delete.");
      return;
    }

    // 2️⃣ Remove locally
    selectedIds.forEach((id) => dispatch(removeFromCart(id)));

    const remaining = (cartItems || []).filter(
      (it) => !selectedIds.includes(it.id)
    );

    // 3️⃣ Persist locally
    persistLocalCart(remaining);
    setSelectedItems({});

    // 4️⃣ If guest user, stop here
    if (!token) return;

    // 5️⃣ Send delete request for selected IDs
    try {
      await sendHttpRequest({
        requestConfig: {
          url: `/cart/item/batch_delete/`, // ✅ Your delete endpoint
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
          body: { item_ids: selectedIds }, // ✅ pass selected IDs array
        },
        successRes: fetchBackendCart,
      });
    } catch (err) {
      toast.error("Failed to delete selected items on server");
      await fetchBackendCart();
    }
  };

  // ---------- Checkout ----------
  const handleCheckout = () => {
    if (token) router.push("/cart/checkout");
    else setCheckoutModalOpen(true);
  };

  // ---------- Derived values ----------
  const totalPrice = Number(
    (cartItems || [])
      .reduce(
        (acc, i) =>
          selectedItems[i.id] ? acc + (i.price || 0) * (i.quantity || 0) : acc,
        0
      )
      .toFixed(1)
  );

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const fashionProducts = cartItems.filter(
    (p) => (p as any).category === "Fashion and Apparel"
  );

  return (
    <div className="relative md: md:h-full h-dvh">
      {/* Desktop Breadcrumb */}
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
          <Link href="/" className="opacity-30 font-MontserratMedium text-c12">
            Home
          </Link>
          <Image src={WnavRight} alt=">" width={16} height={16} />
          <span className="font-MontserratMedium text-c12">Cart</span>
        </nav>
      </motion.div>

      <div className="w-full md:px-15 px-0 pb-3 md:pb-0">
        {/* Back Button */}
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
              {/* Cart Items */}
              <div className="w-full max-w-207">
                <div className="w-full h-c56 mb-4 md:mb-c32 flex px-6 justify-between items-center bg-947fff/10">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 border border-black rounded  accent-black checked:bg-black checked:text-white"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                    <span className="text-c12 font-MontserratSemiBold">
                      Select
                    </span>
                  </div>
                  {Object.values(selectedItems).some(
                    (isSelected) => isSelected
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

                <div className="flex px-6 w-full justify-between">
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
                    className="space-y-c24 w-full"
                  >
                    {cartItems.map((item) => (
                      <motion.div
                       key={`${item.id}-${item.variations_data?.[0]?.id ?? Math.random()}`}

                        className="flex justify-between items-start md:border-b border-gray-200 pb-4"
                      >
                        <div className="flex items-center md:items-start  gap-4">
                          <input
                            type="checkbox"
                            checked={!!selectedItems[item.id]}
                            onChange={() => handleToggleItem(item)}
                            className="custom-checkbox flex-shrink-0"
                          />

                          <Image
                            src={item.image[0] || "/placeholder.png"}
                            alt={item.name || "Product image"}
                            width={96}
                            height={96}
                            className="rounded md:h-24 md:w-24 w-c56 h-c56"
                          />

                          <div>
                            <p className="font-MontserratSemiBold text-c12 md:text-base mb-1">
                              {item.name}
                            </p>
                            <p className="bg-000000/5 px-3 py-1 md:px-4 md:py-2 w-fit rounded-c12 text-000000/36 mb-3 text-c12 font-MontserratSemiBold">
                              {item.quantity}pc,{" "}
                              {item.variations_data?.[0]?.color || "black"}
                            </p>

                            <p className="font-MontserratNormal text-base md:text-c12 text-gray-600">
                              ₦{item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between h-26 md:h-31.5 items-end  ">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="ml-2"
                          >
                            <Image
                              src={Trash}
                              alt="delete"
                              width={15}
                              height={16}
                            />
                          </button>
                          <QuantitySelector
                            productId={item.id} // cart item id
                            token={token ?? undefined}
                            quantity={item.quantity}
                            onChange={(q) =>
                              dispatch(
                                updateQuantity({ id: item.id, quantity: q })
                              )
                            }
                          />
                        </div>
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
                      <p className="text-ca0202">-₦50</p>
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
                      Every payment you make on MartAf is secured with strict
                      SSL encryption and PCI DSS data protection protocols
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
                      Protecting your privacy is important to us! We will only
                      use your information in accordance with our privacy
                      policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Products */}
          <div className="hidden w-full md:flex">
            <div className="w-full">
              <div className="py-c32">
                <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
                  More to love
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {fashionProducts.slice(0, visible).map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Footer */}
          <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed bottom-0 md:hidden z-50 flex items-center gap-4">
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

          {/* Mobile Checkout Modal */}
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
                    <Image src={CloseX} alt="close" width={15} height={15} />
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-scroll py-4">
                  {cartItems
                    .filter((item) => selectedItems[item.id])
                    .map((item) => (
                      <Image
                        key={item.id}
                        src={item.image[0]}
                        alt={item.name}
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
          />
        </>
      )}
    </div>
  );
}
