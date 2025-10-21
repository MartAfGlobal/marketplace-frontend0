"use client";

import Image from "next/image";
import GoodMark from "@/assets/mobile/good.png";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartButton from "@/assets/mobile/coloureCart.png";
import Filter from "@/assets/icons/filter.png";
import { addToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import {  Product, Variations } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProductCardProps {
  product: Product;
}


export default function AllWishlist() {


  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
 
  

  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: Variations | null }>({});


  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
const dispatch = useDispatch();
const token = useSelector((state: RootState) => state.token?.token);
  const { loading, sendHttpRequest } = useHttp();

  const allSelected =
    wishlistItems.length > 0 &&
    wishlistItems.every((item) => selectedItems[item.id]);

const handleAddToCart = (item: Product) => (e: React.MouseEvent) => {
  e.stopPropagation();

  // Check for variation if product has any
  const variation = selectedVariations[item.id] || item.variations?.[0] || null;

  if (item.variations?.length && !variation) {
    // Product has variations but none selected
    toast.error("Please select a variation for this product");
    return;
  }

  // Dispatch local Redux state
  dispatch(
    addToCart({
      ...item,
      product_id: item.id,
      quantity: 1,
      variation_display: variation ? `${variation.size} / ${variation.color}` : undefined,
      price_at_purchase: item.price,
      selectedVariation: variation || undefined,
    })
  );

  // If logged in, send request to backend
  if (token) {
    sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          product_id: item.id,
          variation_id: variation?.id,
          quantity: 1,
          check: true,
        },
        successMessage: "Item added to cart successfully",
      },
      successRes: (res) => console.log("Cart API success:", res.data),
    }).catch((err) => {
      console.error("Cart API failed:", err);
      toast.error("Network error — added to local cart");
    });
  } else {
    toast.success("Item added to cart (offline mode)");
  }
};


  return (
    <div>
      <div className="w-full max-w-207">
        {/* Header */}
        <div className="w-full h-c56 mb-4 md:mb-c32 flex px-6 justify-between items-center">
          {/* Select All Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (allSelected) {
                  setSelectedItems({});
                } else {
                  const newSelections: { [key: string]: boolean } = {};
                  wishlistItems.forEach((item) => {
                    newSelections[item.id] = true;
                  });
                  setSelectedItems(newSelections);
                }
              }}
              className={`w-5 h-5 rounded-c4 border-1 border-000000/5 flex items-center justify-center transition-colors ${
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
            <span className="text-c12 font-MontserratSemiBold">Select all</span>
          </div>

          <Image src={Filter} alt="filter" width={24} height={24} />
        </div>

        {/* Wishlist Items */}
        <div className="flex px-6 w-full justify-between">
          <motion.div
            key="orders-list"
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
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-full justify-between items-end pb-8 flex">
                  <div className="flex gap-4 w-full items-center md:items-start">
                    {/* Checkbox + Image */}
                    <div className="flex gap-3 items-center w-full max-w-fit">
                      <button
                        onClick={() =>
                          setSelectedItems((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
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

                      <Image
                        src={item.image[0]}
                        alt={item.slug}
                        width={100}
                        height={100}
                        className="w-16 h-16 md:w-25 md:h-25"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="w-full md:max-w-143.75">
                      <p className="font-MontserratSemiBold text-c12 md:text-sm md:leading-c24 pb-1 md:pb-3 text-000000">
                        {item.name}
                      </p>
                      <p className="font-MontserratNormal text-c12 pb-3">
                        Two piece shop
                      </p>
                      <p className="font-MontserratSemiBold text-base md:text-c18 pt-3 leading-6.5">
                        ₦{item.price}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleAddToCart(item)} className="w-10 h-10  flex justify-center items-center rounded-full border flex-shrink-0 border-ff715b">
                  { loading ? <LoadingSpinner color="#ff715b"/>: <Image
                      src={CartButton}
                      alt="Add to cart"
                      width={16}
                      height={16}
                    />}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
      <div className="mt-20">
          {Object.values(selectedItems).some((isSelected) => isSelected) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} // start hidden (below screen)
            animate={{ y: 0, opacity: 1 }} // slide up into view
            exit={{ y: 100, opacity: 0 }} // slide back down when hidden
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4"
          >
            <div className="w-full flex gap-2 text-c12 font-MontserratSemiBold">
              <button className="h-c48 border border-ff715b rounded-lg w-full max-w-28 text-ff715b">
                Add to list
              </button>
              <button className="w-full h-c48 rounded-lg bg-ff715b text-ffffff">
                Remove from list
              </button>
            </div>
          </motion.div>
        )}
      </div>
      </AnimatePresence>
    </div>
  );
}
