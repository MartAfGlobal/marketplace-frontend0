"use client";
import { RootState } from "@/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import Link from "next/link";
import NavBack from "@/assets/icons/navBacksmall.png";
import { useHttp } from "@/hooks/use-http";
import { useEffect, useState } from "react";
import { Product} from "@/types/global";
import { removeFromWishlist, WishlistItem } from "@/store/cart/wishlist-slice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import GoodMark from "@/assets/mobile/good.png";
import CartButton from "@/assets/mobile/coloureCart.png";
import Filter from "@/assets/icons/filter.png";
import { addToCart } from "@/store/cart/cartSlice";
import Trash from "@/assets/icons/trash.svg";
import AddItemtoLabelModal from "@/components/ui/Modals/addItemToLabelModal";
import Adding from "@/assets/Icons2/PlusWhite.svg";
import Add from "@/assets/icons/plusorange.png";

import { Button } from "@/components/ui/Button/Button";
import GoodCheckOrange from "@/assets/Icons2/GoodCheckOrange.svg";
import {
  removeItemFromWishlistLabel,
  removeItemsFromWishlistLabel,
} from "@/store/wishlistLabel/wishlistLabelSlice";
import EmptyCartIcon from "@/components/ui/cart/EmptyCartIcon";
import AddCartModal from "@/components/ui/Modals/addToCart/addTocart-modal";

export default function CategoryPage() {
  const { id } = useParams();

  const labels = useSelector((state: RootState) => state.wishlistLabel.labels);
  const labelSelected = labels.find((cat: any) => cat.id === id);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const router = useRouter();

  const labelItems = labelSelected?.items;

  const [localLabelItems, setLocalLabelItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setLocalLabelItems(labelSelected?.items ?? []);
  }, [labelSelected]);

  if (!labelSelected) {
    return <p className="text-center mt-20 text-lg">Category not found</p>;
  }
  const labelId = Array.isArray(id) ? id[0] : id;
  const [selectedItems, setSelectedItems] = useState<{
    [productId: string]: boolean;
  }>({});
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.token);
  const { sendHttpRequest } = useHttp();


  const [CreateModal, setCreateModal] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const { loading: rmoving, sendHttpRequest: removeReq } = useHttp();
  const { loading: itemRemove, sendHttpRequest: itemRemoveReq } = useHttp();
  const [loadingRem, setLoadRem] = useState<Record<string, boolean>>({});
  const allSelected =
    wishlistItems.length > 0 &&
    wishlistItems.every((item) => {
      const productId = String(item.product?.id ?? item.id);
      return selectedItems[productId];
    });
const [selectedSlug, setSelectedSlug] = useState<string>("");
  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelections: { [key: string]: boolean } = {};
      wishlistItems.forEach((item) => {
        const productId = String(item.product?.id ?? item.id);
        newSelections[productId] = true;
      });
      setSelectedItems(newSelections);
    }
  };
    const [openAddToCart, setOpenAddToCart] = useState(false);
  const handleWishListRemoveItem = (itemId: string | number) => {
    setLoadRem((s) => ({ ...s, [itemId]: true }));

    if (!token) {
      setLoadRem((s) => ({ ...s, [itemId]: false }));
      return;
    }

    removeReq({
      requestConfig: {
        url: `wishlist/items/remove/${itemId}/`,
        method: "DELETE",
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: `Item removed successfully`,
      },
      successRes: (res) => {
        setLoadRem((s) => ({ ...s, [itemId]: false }));
        console.log("Cart API success:", res.data);

        dispatch(removeFromWishlist(itemId));
      },
    }).catch((err) => {
      console.error("Cart API failed:", err);
      setLoadRem((s) => ({ ...s, [itemId]: false }));
      toast.error("Network error — added to local cart");
    });
  };
  const handleLabelRemoveItem = () => {
    const selectedIds = Object.keys(selectedItems).filter(
      (key) => selectedItems[key]
    );

    if (selectedIds.length === 0) {
      toast.error("Please select at least one item to remove");
      return;
    }
    if (!token) {
      return;
    }
    const labelId = Array.isArray(id) ? id[0] : id;

    if (!labelId) {
      toast.error("Invalid label ID");
      return;
    }

    itemRemoveReq({
      requestConfig: {
        url: "wishlist/labels/remove-items/",
        method: "DELETE",
        token,
        isAuth: true,
        body: {
          label_id: labelId,
          item_ids: selectedIds,
        },
        userType: "buyer",
        successMessage: `Item removed successfully`,
      },
      successRes: (res) => {
        console.log("item remv success:", res.data);
        dispatch(
          removeItemsFromWishlistLabel({ labelId, itemIds: selectedIds })
        );
        setLocalLabelItems((prev) =>
          prev.filter((item) => !selectedIds.includes(String(item.id)))
        );
        setSelectedItems({});
      },
    }).catch((err) => {
      console.error("Cart API failed:", err);

      toast.error("Network error — added to local cart");
    });
  };

  const handleAddToCart =
    (productSlug: string) => async (e: React.MouseEvent) => {
      e.stopPropagation();

      setSelectedSlug(productSlug);
      setTimeout(() => {
        setOpenAddToCart(true);
      }, 0);
    };


  

  return (
    <div className="md:px-15 px-6">
      <div className="w-full">
        <div className="w-full pb-7     h-fit md:px-0 flex justify-between items-center ">
          <div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className=" hidden z-40 md:flex items-center md w-full mt-8"
                style={{ top: "0rem" }}
              >
                <nav
                  aria-label="breadcrumb"
                  className="flex h-c32 w-full items-center gap-2"
                >
                  <Link
                    href="/"
                    className="opacity-30 font-MontserratMedium text-c12"
                  >
                    Home
                  </Link>
                  <Image src={WnavRight} alt=">" width={16} height={16} />
                  <Link
                    href="/dashboard/buyer"
                    className="opacity-30 font-MontserratMedium text-c12"
                  >
                    Account
                  </Link>
                  <Image src={WnavRight} alt=">" width={16} height={16} />
                  <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
                    Wishlist
                  </span>
                </nav>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className=" h-fit ">
        <div className="  z-20 bg-white flex flex-col gap-8 mb-8 ">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-4  "
          >
            <Image
              src={NavBack}
              alt="<"
              width={9}
              height={16.5}
              className="brightness-20 w-2.25 h-[16.5px]"
            />
            <p className="font-MontserratSemiBold text-c16 text-161616">
              {labelSelected.name}
            </p>
          </button>
          <div className="hidden md:flex">
            {Object.keys(selectedItems).some((key) => selectedItems[key]) ? (
              <Button
                onClick={handleLabelRemoveItem}
                variant="secondary"
                className="w-full max-w-[190.15px] flex gap-3"
              >
                <Image src={Trash} alt="Delete" width={18.12} height={19.63} />{" "}
                {itemRemove ? (
                  <LoadingSpinner color=" border-ff715b" />
                ) : (
                  "Remove from list"
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setAddItemOpen(true)}
                variant="secondary"
                className="w-full max-w-[190.15px] flex gap-3"
              >
                <Image src={Add} alt="Delete" width={18.12} height={19.63} />{" "}
                Add items
              </Button>
            )}
          </div>
        </div>
        {wishlistItems.length === 0 ? (
          // <div className="w-full flex justify-center h-75.5 items-center">
          //   <div className="flex flex-col items-center justify-center py-20 text-center">
          //     {/* Animated Cart SVG */}
          //     <motion.svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       fill="none"
          //       viewBox="0 0 64 64"
          //       stroke="currentColor"
          //       strokeWidth="2"
          //       className="w-24 h-24 text-ff715b"
          //       animate={{
          //         rotate: [0, -5, 5, -5, 5, 0],
          //       }}
          //       transition={{
          //         duration: 2,
          //         repeat: Infinity,
          //         repeatDelay: 2,
          //         ease: "easeInOut",
          //       }}
          //     >
          //       <motion.g
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         initial={{ y: 0 }}
          //         animate={{ y: [0, -2, 0] }}
          //         transition={{
          //           duration: 1.5,
          //           repeat: Infinity,
          //           ease: "easeInOut",
          //         }}
          //       >
          //         <path d="M8 8h6l6 36h28l6-24H20" />
          //         <path d="M26 28h18" />
          //         <path d="M24 20h22" />
          //       </motion.g>

          //       {/* Spinning wheels */}
          //       <motion.circle
          //         cx="26"
          //         cy="52"
          //         r="3"
          //         animate={{ rotate: 360 }}
          //         transition={{
          //           duration: 2,
          //           repeat: Infinity,
          //           ease: "linear",
          //         }}
          //       />
          //       <motion.circle
          //         cx="46"
          //         cy="52"
          //         r="3"
          //         animate={{ rotate: -360 }}
          //         transition={{
          //           duration: 2,
          //           repeat: Infinity,
          //           ease: "linear",
          //         }}
          //       />
          //     </motion.svg>

          //     <p className="text-c18 font-MontserratMedium text-000000/32 mb-8">
          //       No items added to Whislist
          //     </p>
          //     <Button  onClick={() => router.push("/#production-section")}variant="primary">Visit our Store</Button>
          //   </div>
          // </div>
          <EmptyCartIcon title = "No items added to Whislist" description=" Looks like you haven’t added any items yet. Start exploring our productsto fill your Wishlist"/>
        ) : labelItems?.length === 0 ? (
          // <div className="w-full flex justify-center h-75.5 items-center">
          //   <div>
          //     <p className="text-c18 font-MontserratMedium text-000000/32 mb-8">
          //       No items added to <br /> <span>{labelSelected.name}</span>
          //     </p>
          //     <Button variant="primary">Start shopping</Button>
          //   </div>
          // </div>
           <EmptyCartIcon title="No items added to " description={labelSelected.name} ButtonText="Add items" onClick={() => setAddItemOpen(true)}/>
        ) : (
          <div className="w-full  ">
            <div className="w-full h-c56 mb-4 md:mb-c32 flex justify-between items-center md:hidden">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleSelectAll}
                  className={`w-5 h-5 rounded-c4 border-1 border-000000/32 flex items-center justify-center transition-colors ${
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
                <span className="text-c12 font-MontserratSemiBold">
                  Select all
                </span>
              </div>
              <Image src={Filter} alt="filter" width={24} height={24} />
            </div>

            <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-200 w-full justify-between">
              {["left", "right"].map((col, idx) => (
                <div
                  key={col}
                  className={`w-full md:w-1/2 ${
                    col === "left" ? "md:pr-4" : "md:pl-4"
                  }`}
                >
                  {(localLabelItems ?? [])
                    .slice(
                      col === "left"
                        ? 0
                        : Math.ceil((localLabelItems?.length || 0) / 2),
                      col === "left"
                        ? Math.ceil((localLabelItems?.length || 0) / 2)
                        : localLabelItems?.length
                    )
                    .map((item: WishlistItem) => {
                      const product: Product = item.product ?? (item as any);
                      const productId = String(product.id);
                      const whishlistItemSelected = item.id;
                      console.log("wishlistId");
                      return (
                        <div
                          key={whishlistItemSelected}
                          className="w-full justify-between items-end pb-8 flex"
                        >
                          <div className="flex gap-4 w-full items-center md:items-start">
                            <div className="flex gap-3 items-center w-full max-w-fit">
                              <button
                                onClick={() =>
                                  setSelectedItems((prev) => ({
                                    ...prev,
                                    [whishlistItemSelected]:
                                      !prev[whishlistItemSelected],
                                  }))
                                }
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  selectedItems[whishlistItemSelected]
                                    ? "bg-ff715b border-ff715b"
                                    : "border-ff715b bg-transparent"
                                }`}
                              >
                                {selectedItems[whishlistItemSelected] && (
                                  <Image
                                    src={GoodMark}
                                    alt="checked"
                                    width={9.75}
                                    height={7.13}
                                  />
                                )}
                              </button>
                              <Image
                                src={product.main_image.medium || "/placeholder.png"}
                                alt={
                                  product.name || "Wishlist item image"
                                }
                                width={100}
                                height={100}
                                unoptimized
                                className="w-16 h-16 md:w-25 md:h-25"
                              />
                            </div>
                            <div className="w-full md:max-w-143.75">
                              <p className="font-MontserratSemiBold text-c12 md:text-sm pb-1 text-000000">
                                {product.name}
                              </p>
                              <p className="font-MontserratSemiBold  text-base md:text-c18 pt-3 leading-6.5">
                                ₦{product.base_price}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={handleAddToCart(product.slug)}
                            className={`w-10 h-10 flex justify-center md:hidden items-center rounded-full border flex-shrink-0 border-ff715b $}`}
                          >
                            {loadingIds[productId] ? (
                              <LoadingSpinner color="border-ff715b" />
                            ) : (
                              <Image
                                src={CartButton}
                                alt="Add to cart"
                                width={16}
                                height={16}
                              />
                            )}
                          </button>

                          <div className="hidden md:flex flex-col w-full max-w-52.5 space-y-4">
                            <Button onClick={handleAddToCart(product.slug)}>
                              {loadingIds[productId] ? (
                                <LoadingSpinner />
                              ) : (
                                "Add to cart"
                              )}
                            </Button>
                            <Button
                              onClick={() => handleWishListRemoveItem(item.id)}
                              variant="secondary"
                            >
                              {loadingRem[item.id] ? (
                                <LoadingSpinner color="border-ff715b" />
                              ) : (
                                "Remove"
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AddItemtoLabelModal
        isOpen={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        labelId={labelSelected.id}
      />

      <AnimatePresence>
        <div className="mt-20">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4"
          >
            <div className="w-full flex gap-2 text-c12 justify-center items-center font-MontserratSemiBold">
              {Object.keys(selectedItems).some((key) => selectedItems[key]) ? (
                <Button
                  onClick={handleLabelRemoveItem}
                  variant="secondary"
                  className="w-full max-w-[190.15px] flex gap-3"
                >
                  <Image
                    src={Trash}
                    alt="Delete"
                    width={18.12}
                    height={19.63}
                  />{" "}
                  {itemRemove ? (
                    <LoadingSpinner color=" border-ff715b" />
                  ) : (
                    "Remove from list"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setAddItemOpen(true)}
                  variant="secondary"
                  className="w-full max-w-[190.15px] flex gap-3 border-0"
                >
                  <Image src={Add} alt="Add" width={12} height={12} /> Add items
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
        <AddCartModal
              isOpen={openAddToCart}
              onClose={() => setOpenAddToCart(false)}
              productSlug={selectedSlug}
            />
    </div>
  );
}
