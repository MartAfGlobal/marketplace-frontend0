"use client";

import Image from "next/image";

import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Filter from "@/assets/icons/filter.png";
import { addToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { Product, Variations } from "@/types/global";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/Button/Button";
import close from "@/assets/Icons2/cancel.svg";
import Adding from "@/assets/Icons2/PlusWhite.svg";
import Add from "@/assets/icons/plusOrange.svg";

import GoodMark from "@/assets/mobile/good.png";

import CreateListModal from "@/components/ui/Modals/create-wishlist-list-modal";
import NextBtn from "@/assets/icons/pointerfront.svg";
import { useRouter } from "next/navigation";

interface MylistProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  labels: any[]
}
export default function Mylist({
  isOpen,
  onClose,
  onOpen,
  onSelectionChange,
  labels
}: MylistProps) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const [CreateModal, setCreateModal] = useState(false);
  
  const { loading, sendHttpRequest: handleDeleteReq } = useHttp()
  useEffect(() => {
    
    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    // Pass the array to parent
    onSelectionChange?.(selectedIds);
  }, [selectedItems, onSelectionChange]);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  // const token = useSelector((state: RootState) => state.token?.token);
 

   const [localLabelItems, setLocalLabelItems] = useState(labels);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
   useEffect(() => {
  setLocalLabelItems(labels);
}, [labels]);
  

  const { loading: removeLoading, sendHttpRequest: removReg } = useHttp();

  const allSelected =
    labels.length > 0 && labels.every((item) => selectedItems[item.id]);

  const handleDeleteLabel = () => {
    if (!token) {
      return;
    }
     const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    handleDeleteReq({
      requestConfig: {
        url: "/wishlist/labels/delete/",
        method: "DELETE",
        token,
        body: {
          label_ids: selectedIds,
        },
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        toast.success("List deleted successful");

        setLocalLabelItems((prev) =>
          prev.filter((item) => !selectedIds.includes(String(item.id)))
        );
        setSelectedIds([]);
        console.log("Wishlist labels stored in Redux:", labels);
      },
    });
  };

  // const handleAddToCart = (item: Product) => (e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   const variation =
  //     selectedVariations[item.id] || item.variations?.[0] || null;

  //   if (item.variations?.length && !variation) {
  //     toast.error("Please select a variation for this product");
  //     return;
  //   }

  //   // Dispatch local Redux state
  //   dispatch(
  //     addToCart({
  //       ...item,
  //       product_id: item.id,
  //       quantity: 1,
  //       variation_display: variation
  //         ? `${variation.size} / ${variation.color}`
  //         : undefined,
  //       price_at_purchase: item.price,
  //       selectedVariation: variation || undefined,
  //     })
  //   );

  //   // If logged in, send request to backend
  //   if (token) {
  //     sendHttpRequest({
  //       requestConfig: {
  //         url: "/cart/add",
  //         method: "POST",
  //         token,
  //         isAuth: true,
  //         userType: "buyer",
  //         body: {
  //           product_id: item.id,
  //           variation_id: variation?.id,
  //           quantity: 1,
  //           check: true,
  //         },
  //         successMessage: "Item added to cart successfully",
  //       },
  //       successRes: (res) => console.log("Cart API success:", res.data),
  //     }).catch((err) => {
  //       console.error("Cart API failed:", err);
  //       toast.error("Network error — added to local cart");
  //     });
  //   } else {
  //     toast.success("Item added to cart (offline mode)");
  //   }
  // };

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelections: { [key: string]: boolean } = {};
      labels.forEach((item) => {
        const productId = String(item.id);
        newSelections[productId] = true;
      });
      setSelectedItems(newSelections);
    }
  };
  return (
    <div className="px-6 md:px-0">
      <div className="w-full h-c56 mb-4 md:mb-c32 flex justify-between items-center md:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSelectAll}
            className={`w-5 h-5 rounded-c4 border-1 border-000000/32 flex items-center justify-center transition-colors ${
              allSelected ? "bg-ff715b" : "border-000000/5 bg-transparent"
            }`}
          >
            {allSelected && (
              <Image src={GoodMark} alt="checked" width={9.75} height={7.13} />
            )}
          </button>
          <span className="text-c12 font-MontserratSemiBold">Select all</span>
        </div>
        <Image src={Filter} alt="filter" width={24} height={24} />
      </div>
      {localLabelItems.length === 0 && (
        <div className="w-full px-6 flex flex-col justify-center items-center gap-8 md:px-0">
          <p className="text-center font-MontserratSemiBold text-sm text-000000/50">
            No List
          </p>
          <Button onClick={onOpen} className="w-full max-w-[175.15px]">
            Create List
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-8 ">
        {localLabelItems.map((label) => {
          return (
            <div
              key={label.id}
              className="pb-8 border-b flex md:flex-col gap-4  border-b-000000/10"
            >
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-base font-MontserratSemiBold text-nowrap">
                    {label.name}
                  </h1>
                  <p className="text-c12 font-MontserratNormal text-nowrap">
                    {label.items.length} items
                  </p>
                </div>
                {label.items.length === 0? (
                  <div>
                    <p className="font-MontserratNormal text-sm">Empty List</p>
                  </div>
                ): (<div className="flex gap-3 md:hidden items-center w-full max-w-fit">
                  <button
                    onClick={() =>
                      setSelectedItems((prev) => ({
                        ...prev,
                        [label.id]: !prev[label.id],
                      }))
                    }
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedItems[label.id]
                        ? "bg-ff715b border-ff715b"
                        : "border-ff715b bg-transparent"
                    }`}
                  >
                    {selectedItems[label.id] && (
                      <Image
                        src={GoodMark}
                        alt="checked"
                        width={9.75}
                        height={7.13}
                      />
                    )}
                  </button>
                </div>)}
              </div>

              {label.items.length > 0 && <div className="flex gap-8 items-center mt-6  w-full  overflow-x-auto">
                <div className="md:flex gap-3 hidden items-center w-full max-w-fit">
                  <button
                    onClick={() =>
                      setSelectedItems((prev) => ({
                        ...prev,
                        [label.id]: !prev[label.id],
                      }))
                    }
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedItems[label.id]
                        ? "bg-ff715b border-ff715b"
                        : "border-ff715b bg-transparent"
                    }`}
                  >
                    {selectedItems[label.id] && (
                      <Image
                        src={GoodMark}
                        alt="checked"
                        width={9.75}
                        height={7.13}
                      />
                    )}
                  </button>
                </div>
                {label.items.slice(0, 7).map((item: any) => (
                  <div
                    key={item.id}
                    className="w-35.75 flex-shrink-0   space-y-2"
                  >
                    <div className="w-full h-35.75 flex-shrink-0 ">
                      <Image
                        src={item.product.image}
                        alt={item.product.product_name}
                        width={100}
                        height={100}
                        className="w-full h-full hidden md:flex"
                      />
                      <Image
                        src={item.product.image}
                        alt={item.product.product_name}
                        width={96}
                        height={96}
                        className="w-full h-full md:hidden"
                      />
                    </div>
                    <p className="text-base hidden md:flex font-MontserratSemiBold text-000000/60">
                      {item.product.product_name}
                    </p>
                    <p className="text-c18 mt-2.5  md:mt-0 font-MontserratSemiBold flex-shrink-0">
                      ₦{item.product.price}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() =>
                    router.push(`/dashboard/buyer/wishlist/${label.id}`)
                  }
                  className="text-ff715b font-MontserratSemiBold flex items-center gap-3 text-nowrap"
                >
                  view all
                  <Image src={NextBtn} alt="next" width={24} height={24} />
                </button>
              </div>}
            </div>
          );
        })}
      </div>

      <div>
        <CreateListModal isOpen={isOpen} onClose={onClose} />
      </div>

      <AnimatePresence>
        <div className="mt-20">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4"
          >
            <div className="w-full flex gap-2 text-c12 font-MontserratSemiBold">
              {Object.keys(selectedItems).some((key) => selectedItems[key]) ? (
                <Button
                  onClick={handleDeleteLabel}
                  className="  flex justify-center gap-3 items-center"
                >
                  {loading?<LoadingSpinner/>: "Delete selected lists"}
                </Button>
              ) : (
                <Button
                  onClick={onOpen}
                  className="  flex justify-center gap-3 items-center"
                >
                  <Image src={Adding} alt="Add" width={12} height={12} />
                  Create new list
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
}
