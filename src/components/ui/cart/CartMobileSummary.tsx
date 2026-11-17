"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import GoodMark from "@/assets/mobile/good.png";
import CaretDwn from "@/assets/mobile/carent-down.png";
import CloseX from "@/assets/mobile/closeX.png";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CartItem } from "@/store/cart/cartSlice";

interface CartMobileSummaryProps {
  cartItems: CartItem[];
  selectedItems: Record<string, boolean>;
  totalPrice: number;
  selectedCount: number;
  allSelected: boolean;
  checkoutGuarding: boolean;
  open: boolean;
  onSelectAll: () => void;
  onToggleDetails: () => void;
  onCheckout: () => void;
}

export default function CartMobileSummary({
  cartItems,
  selectedItems,
  totalPrice,
  selectedCount,
  allSelected,
  checkoutGuarding,
  open,
  onSelectAll,
  onToggleDetails,
  onCheckout,
}: CartMobileSummaryProps) {
  return (
    <>
      <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed bottom-0 md:hidden z-30 flex items-center gap-4 ">
        <div className="flex items-center gap-2 w-11">
          <button
            onClick={onSelectAll}
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
            <p className="font-MontserratSemiBold text-c20">₦{totalPrice}</p>
            <p className="text-c12 font-MontserratNormal text-ca0202 line-through">
              ₦1250.00
            </p>
          </div>
          <button
            className="w-full transition-transform"
            onClick={onToggleDetails}
          >
            <motion.div animate={{ rotate: open ? 180 : 0 }}>
              <Image src={CaretDwn} alt="view" width={16} height={16} />
            </motion.div>
          </button>
        </div>

        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0 || checkoutGuarding}
          className="border-0 bg-black hover:bg-black/90 text-white rounded-xl"
        >
          {checkoutGuarding ? (
            <LoadingSpinner />
          ) : (
            <>Proceed ({selectedCount})</>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
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
              <button onClick={onToggleDetails}>
                <Image src={CloseX} alt="close" width={15} height={15} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-scroll py-4">
              {cartItems
                .filter((item) => selectedItems[item.variation_id || item.id])
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
    </>
  );
}
