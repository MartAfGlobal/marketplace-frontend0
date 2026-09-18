"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { Category, subcategory } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SubcategoryModalProps {
  selectedCategory: Category | null;
  onClose: () => void;
  subcategories: subcategory[];
  subLoading: boolean;
}

export default function SubcategoryModal({
  selectedCategory,
  onClose,
  subcategories,
  subLoading,
}: SubcategoryModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {selectedCategory && (
        <motion.div
          className="absolute inset-0 z-50 flex  overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Dim the carousel area */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel slides down over the carousel */}
          <motion.div
            className="absolute top-0 left-0 h-full z-10"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-8 shadow-customW h-fit max-h-[520px] overflow-y-auto w-full min-w-[420px] max-w-[727px] relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-000000/68 hover:text-000000 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <h2 className="font-MontserratSemiBold text-base mb-6 text-000000">
                {selectedCategory.name.replace("Products", "").trim()}
              </h2>

              {subLoading ? (
                <div className="flex items-center justify-center h-full w-full py-10">
                  <LoadingSpinner color="border-ff715b" size={40} />
                </div>
              ) : subcategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-000000/68">
                  <p className="font-MontserratMedium text-sm">
                    No subcategories available
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-[27px] gap-y-[24px]">
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id || sub.slug || sub.name}
                      onClick={() => {
                        onClose();
                        router.push(
                          `/categories/${encodeURIComponent(
                            selectedCategory.slug || selectedCategory.id
                          )}/${encodeURIComponent(sub.slug || sub.id)}`
                        );
                      }}
                      className="flex flex-col w-22 items-center cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <span className="w-22 h-22 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {sub.image ? (
                          <Image
                            src={sub.image}
                            height={88}
                            width={88}
                            alt={sub.name}
                            className="object-cover h-22 w-22"
                          />
                        ) : (
                          <div className="text-gray-300 text-[10px] text-center px-1">
                            No Image
                          </div>
                        )}
                      </span>
                      <p className="mt-4 text-sm text-center text-c12 font-MontserratNormal leading-4">
                        {sub.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
