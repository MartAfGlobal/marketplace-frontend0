"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/global";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
} from "@/store/cart/wishlist-slice";
import { setSelectedProduct } from "@/store/user-data/products/selectedProduct-slice";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import LoveIcon from "@/assets/images/loveIcone.svg";
import loveIcon2 from "@/assets/images/wishlist.svg";
import Cart from "@/assets/headerIcon/cart.svg";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "../loading-spinner";
import { useState } from "react";
import { toast } from "sonner";

import AddCartModal from "../Modals/addToCart/addTocart-modal";
import { setSelectedVariation } from "@/store/slices/variationSelectorSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, sendHttpRequest } = useHttp();
  const { loading: loadingWishlist, sendHttpRequest: addWishlistReq } =
    useHttp();
  const { sendHttpRequest: wishlistReq } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const [openAddToCart, setOpenAddToCart] = useState(false);
  const selectedVariation = useSelector(
    (state: RootState) => state.selectedVariation
  );

  const fetchWishlist = () => {
    if (!token) {
      return;
    }
    wishlistReq({
      requestConfig: {
        url: "/wishlist/all",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const wishlistItems = res.data.results;

        console.log("Wishlist items fetched:", res);
        dispatch(setWishlist(wishlistItems));
      },
    });
  };

  // const [selectedVariation, setSelectedVariation] = useState<Variations | null>(
  //   product.grouped_variations?.[0] || null
  // );
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  // const handleAddToCart = async (e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   if (!token) {
  //     dispatch(
  //       addToCart({
  //         ...product,
  //         product_id: product.id, // ✅ Fix here
  //         quantity: 1,
  //         variation_display: selectedVariation
  //           ? `${selectedVariation.sizes} / ${selectedVariation.color}`
  //           : undefined,
  //         price_at_purchase: product.price,
  //       })
  //     );
  //     toast.success("Item added to cart (offline mode)");
  //     return;
  //   }

  //   sendHttpRequest({
  //     requestConfig: {
  //       url: "/cart/add",
  //       method: "POST",
  //       token,
  //       isAuth: true,
  //       userType: "buyer",
  //       body: {
  //         product_id: product.id,
  //         variation_id: selectedVariation?.id,
  //         quantity: 1,
  //         check: true,
  //       },
  //       successMessage: "Item added to cart successfully",
  //     },

  //     successRes: (res: any) => {
  //       dispatch(
  //         addToCart({
  //           ...product,
  //           product_id: product.id,
  //           quantity: 1,
  //           variation_display: selectedVariation
  //             ? `${selectedVariation.size} / ${selectedVariation.color}`
  //             : undefined,
  //           price_at_purchase: product.price,
  //         })
  //       );

  //       console.log("Cart API success:", res.data);
  //     },
  //   }).catch((err: any) => {
  //     console.error("Cart API failed:", err);
  //     dispatch(
  //       addToCart({
  //         ...product,
  //         product_id: product.id,
  //         quantity: 1,
  //         variation_display: selectedVariation
  //           ? `${selectedVariation.size} / ${selectedVariation.color}`
  //           : undefined,
  //         price_at_purchase: product.price,
  //       })
  //     );

  //     toast.error("Network error — added to local cart");
  //   });
  // };

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const wishlistItem = wishlistItems.find(
    (item: any) => item.product.id === product.id
  );

  const isInWishlist = Boolean(wishlistItem);
  const wishlistId = wishlistItem?.id;

  const handleToggleWishlist = (id: string) => {
  

    console.log("checking id", id);
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      toast.info("Please log in to manage your wishlist");
      if (isMobile) {
        router.replace("/?showLogin=true");
      } else {
        router.replace("/auth/login");
      }
      return;
    }

    // ------------------------------------
    // REMOVE FROM WISHLIST
    // ------------------------------------
    if (isInWishlist) {
      addWishlistReq({
        requestConfig: {
          url: `/wishlist/items/remove/${wishlistId}/`,
          method: "DELETE",
          token,
          isAuth: true,
          userType: "buyer",
          successMessage: "Removed from wishlist",
        },
        successRes: () => {
          fetchWishlist();
        },
      });

      return;
    }

    // ------------------------------------
    // ADD TO WISHLIST
    // ------------------------------------
    addWishlistReq({
      requestConfig: {
        url: `/wishlist/add/${id}/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Added to wishlist",
      },
      successRes: () => {
        // dispatch(
        //   addToWishlist({

        //   })
        // );
        fetchWishlist();
      },
    });
  };

  const handleClick = () => {
    // // 1️⃣ Get default variation → grouped_variations[0]
    // const defaultVariation = product.grouped_variations?.[0];

    // // 2️⃣ Get default size id inside that variation (optional)
    // const defaultSizeId = defaultVariation.sizes[0];

    // // 3️⃣ Dispatch into redux
    // if (defaultVariation) {
    //   dispatch(
    //     setSelectedVariation({
    //       slug: product.slug ?? "",
    //       variation_id: defaultSizeId.variation_id,
    //       variationData: defaultVariation,
    //     })
    //   );
    // }

    // 4️⃣ Navigate to product page
    router.push(`/product/${product.slug}`);
  };

  const handleAddToCart = (productSlug: string) => {
    setSelectedSlug(productSlug);
    setTimeout(() => {
      setOpenAddToCart(true);
    }, 0);
  };
  const productImage = product.main_image.thumbnail || "/placeholder.png";

  return (
    <div className="cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        // ⭐ Add animation on hover
        whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg shadow-custom w-full h-[264.69px] pb-4 flex-shrink-0  bg-white overflow-hidden cursor-pointer"
      >
        {/* Product Image */}
        <div onClick={handleClick} className="relative h-40 w-full">
          <Image
            src={productImage}
            alt={product.name || "Product name"}
            fill
            className="object-cover"
          />

          {product.inventory && product.inventory > 0 && (
            <span className="absolute top-4 left-4 font-MontserratSemiBold bg-[#FFAC06] text-[12px] text-white w-[71px] h-[32px] flex items-center justify-center rounded-[8px]">
              On sale
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist(product.id);
            }}
            disabled={loadingWishlist}
            className="absolute top-4 right-4 w-[32px] h-[32px] bg-white rounded-full shadow flex items-center justify-center"
          >
            {loadingWishlist ? (
              <LoadingSpinner color="ff715b" />
            ) : (
              <>
                {isInWishlist ? (
                  <Image
                    src={loveIcon2}
                    alt="LoveIcon"
                    width={19}
                    height={16}
                  />
                ) : (
                  <Image src={LoveIcon} alt="LoveIcon" width={19} height={16} />
                )}
              </>
            )}
          </button>
        </div>

        <div className="flex items-end justify-between p-4 h-[104px]">
          <div className="text-sm">
            <p className="font-MontserratMedium text-[12px] text-[#161616]">
              Free shipping
            </p>

            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-base ${
                    i < Math.round(product.rating_average || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Price */}
            <p className="font-MontserratSemiBold text-base">
              {product.price_range.currency}
              {product.base_price}
            </p>
          </div>

          <button
            onClick={() => handleAddToCart(product.slug)}
            disabled={loading || product.inventory === 0}
            className={`w-c44 hidden flex-shrink-0 md:flex h-[41.97px] items-center justify-center gap-2 py-1 rounded-[8px] transition
             ${
               loading || product.inventory === 0
                 ? "bg-gray-400 cursor-not-allowed"
                 : "bg-[#FF715B] hover:bg-[#e6604a]"
             }`}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Image src={Cart} alt="cart" width={20} height={17.6} />
            )}
          </button>
        </div>
      </motion.div>
      <AddCartModal
        isOpen={openAddToCart}
        onClose={() => setOpenAddToCart(false)}
        productSlug={selectedSlug}
      />
    </div>
  );
}
