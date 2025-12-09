"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../../Button/Button";

import close from "@/assets/Icons2/cancel.svg";
import GoodMark from "@/assets/mobile/good.png";
import Plus from "@/assets/icons/plus.svg";

import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { Sizes, Variations } from "@/types/global";
import QuantitySelector from "../../cart/quantityControl";
import { useRouter } from "next/navigation";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  color: string;
}

type ItemAddToCartProps = {
  quantity: number;
};

export default function AddSelectedItemToCart({
  isOpen,
  onClose,
  productId,
  color,
}: AddToCartModalProps) {
  const { loading: creating, sendHttpRequest: createLabelReq } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const products = useSelector((state: RootState) => state.products.items);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const router = useRouter();

  const handleQtyChange = (variationId: string, newQty: number) => {
    if (newQty < 1) return;

    setQuantities((prev) => ({
      ...prev,
      [variationId]: newQty,
    }));
  };

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const product = products.find((p) => p.id === productId);
  const coloredItem = product?.grouped_variations?.find(
    (item: Variations) => item.main_value === color
  );
  console.log("Selected color item:", coloredItem);

  return (
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
              onClick={(e) => e.stopPropagation()}
              className="
            bg-white shadow-xl flex flex-col items-center gap-8
            w-full max-w-md md:max-w-[600px] rounded-t-2xl md:rounded-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto
          "
            >
              <motion.div
                key="modal-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden w-full"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <h2 className="text-base font-MontserratSemiBold text-gray-800">
                    Select size for {color} of {product?.name || "Product"}
                  </h2>
                  <button onClick={onClose}>
                    <Image src={close} alt="close" width={15} height={15} />
                  </button>
                </div>

                <div className="flex w-full flex-col  gap-6 h  custom-scrollrailes">
                  {coloredItem?.sizes.map((item: Sizes) => (
                    <div
                      key={item.variation_id}
                      className="flex justify-between items-center border-b pb-4"
                    >
                      <div className="">
                        <span className="font-semibold text-c18">
                          {item.size || "Size"}
                        </span>

                        <div className="flex flex-col">
                          <p>price: ${item.price || "0.00"}</p>
                          <p className="text-c12 font-MontserratSemiBold mb-1">
                            {item.stock || "stock"} available
                          </p>
                        </div>
                      </div>
                      <div>
                        <QuantitySelector
                          productId={productId}
                          variation_id={item.variation_id}
                          quantity={quantities[item.variation_id] || 0}
                          onChange={(newQty) =>
                            handleQtyChange(item.variation_id, newQty)
                          }
                          group_variation={coloredItem}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Footer Buttons */}
              <div className="flex gap-2 justify-center w-full">
                <Button onClick={onClose} variant="secondary">
                  Continue Shopping
                </Button>

                <Button
                  onClick={() => router.push("/cart")}
                  className="flex gap-2"
                  disabled={creating}
                >
                  Go to Cart
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
