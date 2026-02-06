"use client";

import { X, ChevronDown } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import productIcon from "@/assets/icons/productBox.svg";
import plusIcon from "@/assets/icons/orangePlus.svg";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";

interface CancelOrderModalProps {
  isOpen: boolean;

  onClose: () => void;
}

export default function AddProductMethodModal({
  isOpen,

  onClose,
}: CancelOrderModalProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
              <motion.div
                className={`relative bg-white shadow-xl w-full max-w-140 h-96.25 rounded-t-2xl md:rounded-xl pt-c64 pb-c56 px-8 `}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-gray-100 absolute right-6 top-3.5"
                >
                  <X size={24} className="text-black" />
                </button>

                <div className=" flex justify-center items-center gap-c32">
                  <div className="bg-ffffff w-58 h-66.25 flex flex-col items-center justify-between rounded-c16 shadow-customW  py-c32 px-6">
                    <div className="w-full max-w-33.75 h-23 flex flex-col  items-center justify-between">
                      <Image
                        src={productIcon}
                        alt="product"
                        width={39}
                        height={41.99}
                      />
                      <p className="text-sm font-MontserratNormal">
                        Add a new product
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      className="flex items-center justify-baseline p-4  gap-2"
                    >
                      <Image src={plusIcon} alt="add" width={12} height={12} />
                      <span>add products</span>
                    </Button>
                  </div>
                  <div className="bg-ffffff w-58 h-66.25 rounded-c16 shadow-customW  py-c32 px-6 flex flex-col items-center justify-between">
                    <div className="relative  flex flex-col h-23.25 w-39.75 justify-end items-center">
                      {/* Top image */}
                      <Image
                        src={productIcon}
                        alt="product"
                        width={39}
                        height={41.99}
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                      />

                      {/* Bottom left */}
                      <Image
                        src={productIcon}
                        alt="product"
                        width={39}
                        height={41.99}
                        className="absolute top-5 left-[25px]"
                      />

                      {/* Bottom right */}
                      <Image
                        src={productIcon}
                        alt="product"
                        width={39}
                        height={41.99}
                        className="absolute top-5 right-[25px]"
                      />

                      <p className="text-sm font-MontserratNormal ">
                        Add multiple products
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      className="flex items-center justify-baseline p-4  gap-2"
                    >
                      <Image src={plusIcon} alt="add" width={12} height={12} />
                      <span>add products</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
