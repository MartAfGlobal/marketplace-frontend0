"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import GoodMark from "@/assets/mobile/good.png";
import Trash from "@/assets/icons/trash.png";
import QuantitySelector from "@/components/ui/cart/quantityControl";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CartItem } from "@/store/cart/cartSlice";

interface CartItemsSectionProps {
  cartItems: CartItem[];
  selectedItems: Record<string, boolean>;
  allSelected: boolean;
  token?: string | null;
  deleting: string;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onToggleItem: (item: CartItem) => void;
  onItemClick: (item: CartItem) => void;
  onDeleteItem: (item: CartItem) => void;
  onQtyChange: (quantity: number) => void;
}

export default function CartItemsSection({
  cartItems,
  selectedItems,
  allSelected,
  token,
  deleting,
  onSelectAll,
  onDeleteSelected,
  onToggleItem,
  onItemClick,
  onDeleteItem,
  onQtyChange,
}: CartItemsSectionProps) {
  return (
    <div className="w-full px-0 ">
      <div className="w-full h-c56 mb-4 md:mb-c32 flex px-6 justify-between items-center bg-947fff/10">
        <div className="flex items-center gap-4">
          {/* <input
            type="checkbox"
            className="h-5 w-5 border border-black rounded  accent-black checked:bg-black checked:text-white"
            checked={allSelected}
            onChange={onSelectAll}
          /> */}

          <button
            onClick={onSelectAll}
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
          <span className="text-c12 font-MontserratSemiBold">Select All</span>
        </div>
        {Object.values(selectedItems).some((isSelected) => isSelected) && (
          <button onClick={onDeleteSelected}>
            <Image src={Trash} alt="delete" width={15} height={16.25} />
          </button>
        )}
      </div>

      <div className="flex px-6  w-full justify-between mb-15 md:mb-0">
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
                  checked={!!selectedItems[item.variation_id || item.id]}
                  onChange={() => onToggleItem(item)}
                  className="custom-checkbox flex-shrink-0"
                />
                <button
                  onClick={() => onItemClick(item)}
                  className="flex gap-4 items-center"
                >
                  {item.product_image && (
                    <Image
                      src={item.product_image || "/placeholder.png"}
                      alt={item.product_name || "Product image"}
                      width={96}
                      height={96}
                      className=" md:h-24 md:w-24 w-c56 h-c56"
                    />
                  )}

                  <div>
                    <p className="font-MontserratSemiBold  text-left  text-c12 md:text-base mb-1">
                      {item.product_name}
                    </p>
                    {!token ? (
                      <p className="bg-000000/5 px-3 py-1 md:px-4 md:py-2 w-fit rounded-c12 text-000000/36 mb-3 text-c12 font-MontserratSemiBold">
                        {item.quantity}pc, {item.variation_display || "black"}
                      </p>
                    ) : (
                      <p className="bg-000000/5 px-3 py-1 md:px-4 md:py-2 w-fit rounded-c12 text-000000/36 mb-3 text-c12 font-MontserratSemiBold">
                        {item.quantity}pc, {item.variation_display || "black"}
                      </p>
                    )}

                    <p className="font-MontserratSemiBold text-base  md:text-c18 text-161616 text-left">
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
                  onClick={() => onDeleteItem(item)}
                  className="ml-2 transition-opacity hover:opacity-70 z-10"
                >
                  {deleting !== "" && deleting === item.variation_id ? (
                    <LoadingSpinner color="border-ff715b" />
                  ) : (
                    <Image src={Trash} alt="delete" width={15} height={16} />
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
                    quantity={item.quantity}
                    onChange={onQtyChange}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
