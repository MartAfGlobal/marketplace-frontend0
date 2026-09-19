"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../Button/Button";

import close from "@/assets/Icons2/cancel.svg";
import GoodMark from "@/assets/mobile/good.png";
import Plus from "@/assets/icons/plus.svg";

import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import { setProduct } from "@/store/productDetails/productDetailsSlice";
import { LoadingSpinner } from "../../loading-spinner";
import ProductVariation from "../../DetailPage/productVariation";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
  selectedVariationId?: string;
}

export default function AddCartModal({
  isOpen,
  onClose,
  productSlug,
  selectedVariationId,
}: AddToCartModalProps) {
  const { loading: creating, sendHttpRequest: createLabelReq } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const products = useSelector((state: RootState) => state.products.items);
  const [selectedId, setSelectedId] = useState<string>("");
  const [openAddToCart, setOpenAddToCart] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const dispatch = useDispatch();

  const { loading: loadingDetails, sendHttpRequest: fetchDetailsReq } =
    useHttp();

  useEffect(() => {
    if (!productSlug || !isOpen) return; // Only fetch when modal is open

    console.log("Fetching product details for modal...");

    fetchDetailsReq({
      requestConfig: {
        url: `/products/public/products/${productSlug}/`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res) => {
        console.log("Product details fetched for modal:", res.data);
        // Store in Redux
        dispatch(setProduct(res.data));
      },
    });
  }, [isOpen, productSlug, dispatch, fetchDetailsReq]);
  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );

  const product = products.find((p) => p.id === productSlug);

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
                className="relative bg-white shadow-xl flex flex-col w-full max-w-md md:max-w-4xl rounded-t-2xl md:rounded-xl overflow-hidden h-fit max-h-[90vh]"
              >
                {/* Fixed header */}
                <div className="flex items-center justify-between w-full px-6 md:px-8 pt-6 md:pt-8 pb-4 flex-shrink-0">
                  <h2 className="text-base md:text-lg font-MontserratSemiBold text-gray-800 line-clamp-1 pr-8">
                    Select variation for {productDetails?.name || "Product"}
                  </h2>
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-30"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>

                {loadingDetails ? (
                  <div className="py-20 w-full flex justify-center items-center flex-1">
                    <LoadingSpinner size={50} color="border-[#ff715b]" />
                  </div>
                ) : (
                  <motion.div
                    key="modal-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col flex-1 min-h-0 w-full"
                  >
                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-4 custom-scrollrailes">
                      <div className="flex w-full flex-col md:flex-row gap-6">
                        <div className="w-full">
                          <ProductVariation
                            isModal={true}
                            selectedVariaton={selectedVariationId}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
