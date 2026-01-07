"use client";

import Image from "next/image";
import GoodMark from "@/assets/mobile/good.png";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartButton from "@/assets/mobile/coloureCart.png";
import Filter from "@/assets/icons/filter.png";
import { addToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { Product } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/Button/Button";
import GoodCheckOrange from "@/assets/Icons2/GoodCheckOrange.svg";
import close from "@/assets/Icons2/cancel.svg";
import CreateListModal from "@/components/ui/Modals/create-wishlist-list-modal";
import {
  removeFromWishlist,
  setWishlist,
  WishlistItem,
} from "@/store/cart/wishlist-slice";
import { addItemToWishlistLabel } from "@/store/wishlistLabel/wishlistLabelSlice";
import AddCartModal from "@/components/ui/Modals/addToCart/addTocart-modal";

interface AllWishlistProps {
  onSelectionChange?: (hasSelected: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function AllWishlist({
  onSelectionChange,
  isOpen,
  onClose,
  onOpen,
}: AllWishlistProps) {
  // Selection keyed by actual product id
  const [selectedItems, setSelectedItems] = useState<{
    [productId: string]: boolean;
  }>({});
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    const hasAnySelected = Object.values(selectedItems).some(
      (isSelected) => isSelected
    );
    onSelectionChange?.(hasAnySelected);
  }, [selectedItems, onSelectionChange]);

  const [openAddToCart, setOpenAddToCart] = useState(false);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const labels = useSelector((state: RootState) => state.wishlistLabel.labels);
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.token);
  const { loading, sendHttpRequest } = useHttp();
  const { loading: addingItem, sendHttpRequest: addToListReq } = useHttp();
  const { loading: rmoving, sendHttpRequest: removeReq } = useHttp();
  const [CreateModal, setCreateModal] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [loadingRem, setLoadRem] = useState<Record<string, boolean>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  // allSelected now based on product ids
  const allSelected =
    wishlistItems.length > 0 &&
    wishlistItems.every((item) => {
      const productId = String(item.product?.id ?? item.id);
      return selectedItems[productId];
    });

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelections: { [key: string]: boolean } = {};
      wishlistItems.forEach((item) => {
        const productId = String(item.product?.id ?? item.id);
        newSelections[productId] = true;
      });
      setSelectedItems(newSelections);
    }
  };

  const handleAddToCart =
    (productSlug: string) => async (e: React.MouseEvent) => {
      e.stopPropagation();

      setSelectedSlug(productSlug);
      setTimeout(() => {
        setOpenAddToCart(true);
      }, 0);
    };
  const handleCreateFirstList = () => {
    setCreateModal(true);
    if (CreateModal) {
      onClose();
    }
  };

  const handleAddItemToLIst = (labelId: string | null) => {
    if (!token) return;
    if (!labelId) {
      toast.error("Please select a label first");
      return;
    }
    const selectedProductIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    if (selectedProductIds.length === 0) {
      toast.error("Please select at least one item to add");
      return;
    }
    const selectedLabelObj = labels.find((label: any) => label.id === labelId);
    const labelName = selectedLabelObj ? selectedLabelObj.name : selectedLabel;

    addToListReq({
      requestConfig: {
        url: "/wishlist/items/move-items-to-label/",
        method: "PATCH",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          item_ids: selectedProductIds,
          label_id: labelId,
        },
        successMessage: `Item added to ${labelName} successfully`,
      },
      successRes: (res) => {
        console.log("item added  success:", res.data);
        res.data.items.forEach((item: WishlistItem) => {
          dispatch(
            addItemToWishlistLabel({
              labelId: labelId,
              item,
            })
          );
        });

        onClose();
      },
    }).catch((err) => {
      console.error("Cart API failed:", err);
      toast.error("Network error — added to local cart");
    });
  };
  const handleRemoveItem = (itemId: string | number) => {
    setLoadRem((s) => ({ ...s, [itemId]: true }));

    if (!token) {
      setLoadRem((s) => ({ ...s, [itemId]: false }));
      return;
    }

    removeReq({
      requestConfig: {
        url: `wishlist/items/remove/${itemId}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: `Item removed successfully`,
      },
      successRes: (res) => {
        setLoadRem((s) => ({ ...s, [itemId]: false }));
        console.log("Cart API success:", res.data);

        dispatch(removeFromWishlist(itemId));
        onClose();
      },
    }).catch((err) => {
      console.error("Cart API failed:", err);
      setLoadRem((s) => ({ ...s, [itemId]: false }));
      toast.error("Network error — added to local cart");
    });
  };

  console.log("new labelssss", labels);

  return (
    <div>
      {wishlistItems.length === 0 ? (
        <div className="w-full flex justify-center h-75.5 items-center">
          <div>
            <p className="text-c18 font-MontserratMedium text-000000/32 mb-8">
              No items added to wishlist
            </p>
            <Button variant="primary">Start shopping</Button>
          </div>
        </div>
      ) : (
        <div className="w-full px-6 md:px-0">
          <div className="w-full h-c56 mb-4 md:mb-c32 flex justify-between items-center md:hidden">
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleSelectAll}
                className={`w-5 h-5 rounded-c4 border-1 border-000000/32 flex items-center justify-center transition-colors ${
                  allSelected ? "bg-ff715b" : "border-000000/5 bg-transparent"
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
                Select all
              </span>
            </div>
            <Image src={Filter} alt="filter" width={24} height={24} />
          </div>

          <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-200 w-full justify-between">
            {["left", "right"].map((col, idx) => (
              <div
                key={col}
                className={`w-full md:w-1/2 ${
                  col === "left" ? "md:pr-4" : "md:pl-4"
                }`}
              >
                {wishlistItems
                  .slice(
                    col === "left" ? 0 : Math.ceil(wishlistItems.length / 2),
                    col === "left"
                      ? Math.ceil(wishlistItems.length / 2)
                      : wishlistItems.length
                  )
                  .map((item: WishlistItem) => {
                    const product: Product = item.product ?? (item as any);
                    const productId = String(product.id);
                    const whishlistItemSelected = item.id;
                    return (
                      <div
                        key={whishlistItemSelected}
                        className="w-full justify-between items-end pb-8 flex"
                      >
                        <div className="flex gap-4 w-full items-center md:items-start">
                          <div className="flex gap-3 items-center w-full max-w-fit">
                            <button
                              onClick={() =>
                                setSelectedItems((prev) => ({
                                  ...prev,
                                  [whishlistItemSelected]:
                                    !prev[whishlistItemSelected],
                                }))
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedItems[whishlistItemSelected]
                                  ? "bg-ff715b border-ff715b"
                                  : "border-ff715b bg-transparent"
                              }`}
                            >
                              {selectedItems[whishlistItemSelected] && (
                                <Image
                                  src={GoodMark}
                                  alt="checked"
                                  width={9.75}
                                  height={7.13}
                                />
                              )}
                            </button>
                            <Image
                              src={
                                product.main_image.medium || "/placeholder.png"
                              }
                              alt={product.name || "Wishlist item image"}
                              width={100}
                              height={100}
                              className="w-16 h-16 md:w-25 md:h-25"
                            />
                          </div>
                          <div className="w-full md:max-w-143.75">
                            <p className="font-MontserratSemiBold text-c12 md:text-sm pb-1 text-000000">
                              {product.name}
                            </p>
                            <p className="font-MontserratSemiBold  text-base md:text-c18 pt-3 leading-6.5">
                              ₦{product.base_price}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleAddToCart(product.slug)}
                          className={`w-10 h-10 flex justify-center md:hidden items-center rounded-full border flex-shrink-0 border-ff715b $}`}
                        >
                          {loadingIds[productId] ? (
                            <LoadingSpinner color="border-ff715b" />
                          ) : (
                            <Image
                              src={CartButton}
                              alt="Add to cart"
                              width={16}
                              height={16}
                            />
                          )}
                        </button>

                        <div className="hidden md:flex flex-col w-full max-w-52.5 space-y-4">
                          <Button onClick={handleAddToCart(product.slug)}>
                            {loadingIds[productId] ? (
                              <LoadingSpinner />
                            ) : (
                              "Add to cart"
                            )}
                          </Button>
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            variant="secondary"
                          >
                            {loadingRem[item.id] ? (
                              <LoadingSpinner color="border-ff715b" />
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {Object.values(selectedItems).some(Boolean) && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full md:hidden fixed left-0 bottom-0 py-4 px-6 bg-white shadow-custom z-[60]"
              >
                <Button onClick={onOpen} variant="secondary" className="w-full">
                  Add to list
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
            <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className=" bg-white shadow-xl flex flex-col items-center gap-8 w-full max-w-101.5 rounded-t-2xl md:rounded-xl p-6 md:p-8 max-h-120 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between w-full ">
                  <h2 className="text-base font-MontserratSemiBold text-gray-800">
                    Select list
                  </h2>
                  <button onClick={onClose}>
                    <Image src={close} alt="close" width={15} height={15} />
                  </button>
                </div>

                <div className="flex flex-col gap-6 w-full  max-h-70 custom-scrollrailes">
                  {labels.length === 0 && (
                    <div className="w-full flex flex-col justify-center items-center gap-6">
                      <p className="w-full max-w-34.75 text-center text-sm font-MontserratNormal text-000000/50 leading-c20">
                        You haven’t created any lists yet
                      </p>
                      <Button onClick={handleCreateFirstList}>
                        Create your first list
                      </Button>
                    </div>
                  )}

                  {labels.map((item: any) => (
                    <div key={item.id} className="gap-6 w-full">
                      <button
                        onClick={() => setSelectedLabel(item.id)}
                        className={`w-full flex justify-between items-center ${
                          selectedLabel === item.id
                            ? "text-primary font-semibold"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col ">
                          <span className="font-MontserratSemiBold text-c12">
                            {item.name}
                          </span>
                          <span className="font-MontserratNormal text-c12 text-left">
                            {item.items.length} items
                          </span>
                        </div>
                        {selectedLabel === item.id && (
                          <Image
                            src={GoodCheckOrange}
                            alt="checked"
                            width={18.75}
                            height={13.5}
                          />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-2 justify-center w-full">
                  {labels.length > 0 && (
                    <Button
                      disabled={addingItem || !selectedLabel}
                      onClick={() => handleAddItemToLIst(selectedLabel)}
                    >
                      {addingItem ? <LoadingSpinner /> : "Add to selected list"}
                    </Button>
                  )}
                  {labels.length === 0 && (
                    <Button
                      variant="secondary"
                      onClick={handleCreateFirstList}
                      className="w-full "
                    >
                      Create List
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <CreateListModal
        isOpen={CreateModal}
        onClose={() => setCreateModal(false)}
      />
      <AddCartModal
        isOpen={openAddToCart}
        onClose={() => setOpenAddToCart(false)}
        productSlug={selectedSlug}
      />
    </div>
  );
}
