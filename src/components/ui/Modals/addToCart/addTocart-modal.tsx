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
import { Variations } from "@/types/global";
import AddSelectedItemToCart from "./addItemSelectedToCart";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export default function AddCartModal({
  isOpen,
  onClose,
  productId,
}: AddToCartModalProps) {
  const { loading: creating, sendHttpRequest: createLabelReq } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const products = useSelector((state: RootState) => state.products.items);
   const [selectedId, setSelectedId] = useState<string>("");
     const [openAddToCart, setOpenAddToCart] = useState(false);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const product = products.find((p) => p.id === productId);

    const handleAddToCart = (mainvalue: string) => {
    setSelectedId(mainvalue);
    setTimeout(() => {
      setOpenAddToCart(true);
    }, 100);
    onClose();
  };

  return (
    <>
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
                  Select color {product?.name || "Product"}
                </h2>
                <button onClick={onClose}>
                  <Image src={close} alt="close" width={15} height={15} />
                </button>
              </div>

              <div className="flex w-full flex-col md:flex-row gap-6 h-fit overflow-y-auto  md:overflow-x-auto md:overflow-y-hidden p-4 custom-scrollrailes">
                {product?.grouped_variations?.map((item: Variations) => (
                  <div key={item.main_value} className="flex items-center gap-3">
                   

                    <button onClick={()=>handleAddToCart(item.main_value || "")}  className="flex flex-col gap-3 items-center  hover:border-2 p-2 rounded-c8 hover:border-ff715b">
                      <Image
                        src={item.main_image || "/placeholder.png"}
                        alt={item.main_value || "Wishlist item image"}
                        width={64}
                        height={64}
                        className="w-16 h-16 md:w-25 md:h-25"
                      />

                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-c12 font-MontserratSemiBold mb-1">
                            {item.main_value || "Color"}
                          </p>
                        </div>
                       
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
        </>
        
      )}
      
    </AnimatePresence>
    <AddSelectedItemToCart isOpen={openAddToCart} onClose={() => setOpenAddToCart(false)} productId={productId} color={selectedId} />
    </>
  );
}
