"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { Input } from "../forms/Input";
import { Label } from "../forms/Label";
import { LoadingSpinner } from "../loading-spinner";
import close from "@/assets/Icons2/cancel.svg";
import Add from "@/assets/icons/plusorange.png";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { addWishlistLabel } from "@/store/wishlistLabel/wishlistLabelSlice";
import Selector from "@/assets/icons/dropDown.svg";
import GoodMark from "@/assets/mobile/good.png";
interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateListModal({
  isOpen,
  onClose,
}: CreateListModalProps) {
  const { loading: creating, sendHttpRequest: createLabelReq } = useHttp();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);

  const [name, setName] = useState("");

  const [itemsOpen, setItemsOpen] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});



  useEffect(() => {
    if (typeof window !=="undefined") {
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
        url: "/wishlist/labels/",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: { name, items: selectedItemIds },
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
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
            <div className="flex items-center justify-between w-full">
              <h2 className="text-base font-MontserratSemiBold text-gray-800">
                Create a new list
              </h2>
              <button onClick={onClose}>
                <Image src={close} alt="close" width={15} height={15} />
              </button>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label className="text-000000/50 text-c12 font-MontserratNormal">
                Enter your list name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Summer Collection"
              />
            </div>

            <button
              onClick={() => setItemsOpen((prev) => !prev)}
              className="w-full flex items-center gap-3"
            >
              <span className="flex gap-3 text-nowrap pr-3 font-MontserratSemiBold text-sm text-ff715b">
                <Image src={Add} alt="Add" height={12} width={12} />
                Add to list
              </span>
              <p className="h-0.5 w-full bg-000000/50"></p>

              <motion.div
                animate={{ rotate: itemsOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={Selector}
                  alt="select item"
                  height={20}
                  width={20}
                />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {itemsOpen && (
                <motion.div
                  key="wishlist-items"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden w-full"
                >
                  <div className="flex w-full flex-col gap-6 h-66 overflow-y-auto custom-scrollrailes">
                    {wishlistItems.map((item) => (
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
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 justify-center w-full">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateLabel} disabled={creating}>
                {creating ? <LoadingSpinner /> : "Create list"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
