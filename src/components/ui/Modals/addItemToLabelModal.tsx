"use client";

import { AnimatePresence, motion, number } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../Button/Button";

import { LoadingSpinner } from "../loading-spinner";
import close from "@/assets/Icons2/cancel.svg";
import Add from "@/assets/icons/plusOrange.svg";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import {
  addItemToWishlistLabel,
  addWishlistLabel,
} from "@/store/wishlistLabel/wishlistLabelSlice";
import Selector from "@/assets/icons/dropDown.svg";

import GoodMark from "@/assets/mobile/good.png";
import Plus from "@/assets/icons/plus.svg";
import { setWishlist, WishlistItem } from "@/store/cart/wishlist-slice";
interface AddToLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelId: string;
}

export default function AddItemtoLabelModal({
  isOpen,
  onClose,
  labelId,
}: AddToLabelModalProps) {
  const { loading: creating, sendHttpRequest: createLabelReq } = useHttp();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  const labels = useSelector((state: RootState) => state.wishlistLabel.labels);

  const [itemsOpen, setItemsOpen] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const { loading: addingItem, sendHttpRequest: addToListReq } = useHttp();

  const selectedLabel = labels.find((labelName) => labelName.id === labelId);

  const labelName = selectedLabel?.name;

  const [name, setName] = useState("");
  console.log("lsbbddddjdjdjdjdjdjd,", labelId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  const handleCreateLabel = async (e: React.MouseEvent) => {
    const selectedItemIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    if (!token) {
      toast.error("You need to be logged in to create a list");
      return;
    }

    createLabelReq({
      requestConfig: {
        url: "/wishlist/items/move-items-to-label/",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: { selectedItemIds },
        successMessage: "List created successfully",
      },
      successRes: (res) => {
        console.log("List created:", res.data);
        dispatch(addWishlistLabel(res.data));

        setName("");
        onClose();
      },
    });
  };

  const handleAddItemToLIst = (): void => {
    if (!token) return;

    const selectedProductIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    if (selectedProductIds.length === 0) {
      toast.error("Please select at least one item to add");
      return;
    }

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
        console.log("Cart API success:", res.data.items);
        if (Array.isArray(res.data.items)) {
         

          res.data.items.forEach((item: WishlistItem) => {
            dispatch(
              addItemToWishlistLabel({
                labelId: labelId,
                item,
              })
            );
          });
        }

        onClose();
      },
    }).catch((err) => {
      console.error("Cart API failed:", err);
      toast.error("Network error — Try again later");
    });
  };
  const itemsNotInLabel = wishlistItems.filter(
    (item) =>
      !selectedLabel?.items?.some((labelItem) => labelItem.id === item.id)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9998] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed z-[9999] bg-white shadow-xl flex flex-col items-center gap-8 
             w-[calc(100%-30px)] max-md:bottom-0 max-md:left-[15px] max-md:right-[15px]
             max-md:rounded-t-2xl max-md:p-6 max-md:max-h-[90vh] max-md:overflow-y-auto 
             md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
             md:rounded-xl md:p-8 md:max-w-102.25"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key="wishlist-items"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden w-full"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <h2 className="text-base font-MontserratSemiBold text-gray-800">
                  Add new Item to {labelName}
                </h2>
                <button onClick={onClose}>
                  <Image src={close} alt="close" width={15} height={15} />
                </button>
              </div>
              <div className="flex w-full flex-col gap-6 h-80 overflow-y-auto custom-scrollrailes">
                {itemsNotInLabel.length > 0 ? (
                  itemsNotInLabel.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setSelectedItems((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                          selectedItems[item.id]
                            ? "bg-ff715b border-ff715b"
                            : "border-ff715b bg-transparent"
                        }`}
                      >
                        {selectedItems[item.id] && (
                          <Image
                            src={GoodMark}
                            alt="checked"
                            width={9.75}
                            height={7.13}
                          />
                        )}
                      </button>
                      <div className="flex gap-3 items-center">
                        <Image
                          src={item.product.image || "/placeholder.png"}
                          alt={item.product.name || "Wishlist item image"}
                          width={64}
                          height={64}
                          className="w-16 h-16 md:w-25 md:h-25"
                        />

                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="text-c12 font-MontserratSemiBold mb-1">
                              {item.product.product_name}
                            </p>
                          </div>
                          <span className="text-base font-MontserratSemiBold">
                            ₦{item.product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 gap-2">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 64 64"
                      stroke="currentColor"
                      strokeWidth="2"
                     className="w-16 h-16 text-ff715b"
                      animate={{
                        rotate: [0, -5, 5, -5, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.g
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -2, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {/* Cart body */}
                        <path d="M8 8h6l6 36h28l6-24H20" />
                        <path d="M26 28h18" />
                        <path d="M24 20h22" />

                        {/* Boxes inside cart */}
                        <rect
                          x="28"
                          y="12"
                          width="6"
                          height="6"
                          fill="currentColor"
                        />
                        <rect
                          x="36"
                          y="10"
                          width="6"
                          height="6"
                          fill="currentColor"
                        />
                        <rect
                          x="32"
                          y="18"
                          width="6"
                          height="6"
                          fill="currentColor"
                        />
                      </motion.g>

                      {/* Spinning wheels */}
                      <motion.circle
                        cx="26"
                        cy="52"
                        r="3"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.circle
                        cx="46"
                        cy="52"
                        r="3"
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.svg>

                    <p className="text-sm font-MontserratRegular text-center">
                      All items are already added to{" "} <br />
                      <span className="font-MontserratSemiBold text-ff715b">
                        {labelName}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex gap-2 justify-center w-full">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              {itemsNotInLabel.length > 0 && <Button
                className="flex  gap-2"
                onClick={handleAddItemToLIst}
                disabled={creating}
              >
                <Image src={Plus} alt="add" width={13} height={13} />
                {addingItem ? <LoadingSpinner /> : "Add Item"}
              </Button>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
