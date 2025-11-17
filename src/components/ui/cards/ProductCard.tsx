"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Product, Variations } from "@/types/global";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";
import { addToWishlist } from "@/store/cart/wishlist-slice";
import { setSelectedProduct } from "@/store/user-data/products/selectedProduct-slice";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import LoveIcon from "@/assets/images/loveIcone.svg";
import Cart from "@/assets/headerIcon/cart.svg";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "../loading-spinner";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, sendHttpRequest } = useHttp();
  const { loading: loadingWishlist, sendHttpRequest: addWishlistReq } =
    useHttp();
  const token = useSelector((state: RootState) => state.token.token);

  const [selectedVariation, setSelectedVariation] = useState<Variations | null>(
    product.variations?.[0] || null
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      dispatch(
        addToCart({
          ...product,
          product_id: product.id, // ✅ Fix here
          quantity: 1,
          variation_display: selectedVariation
            ? `${selectedVariation.size} / ${selectedVariation.color}`
            : undefined,
          price_at_purchase: product.price,
        })
      );
      toast.success("Item added to cart (offline mode)");
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          product_id: product.id,
          variation_id: selectedVariation?.id,
          quantity: 1,
          check: true,
        },
        successMessage: "Item added to cart successfully",
      },

      successRes: (res: any) => {
        dispatch(
          addToCart({
            ...product,
            product_id: product.id,
            quantity: 1,
            variation_display: selectedVariation
              ? `${selectedVariation.size} / ${selectedVariation.color}`
              : undefined,
            price_at_purchase: product.price,
          })
        );

        console.log("Cart API success:", res.data);
      },
    }).catch((err: any) => {
      // ✅ Called only if the hook itself throws (rare)
      console.error("Cart API failed:", err);
      dispatch(
        addToCart({
          ...product,
          product_id: product.id, // ✅ Fix here
          quantity: 1,
          variation_display: selectedVariation
            ? `${selectedVariation.size} / ${selectedVariation.color}`
            : undefined,
          price_at_purchase: product.price,
        })
      );

      toast.error("Network error — added to local cart");
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      toast.info("Please log in to add items to your wishlist");
      if (isMobile) {
        router.replace("/?showLogin=true");
      } else {
        // Desktop → go to dedicated login page
        router.replace("/auth/login");
      }
      return;
    }
    addWishlistReq({
      requestConfig: {
        url: "wishlist/items/",
        method: "POST",
        token,
        body: {
          product_id: product.id,
          variation_id: selectedVariation?.id,
        },
        isAuth: true,
        userType: "buyer",
        successMessage: "Added to wishlist",
      },
      successRes: () => {
        dispatch(
          addToWishlist({
            id: product.id, // wishlist id (can be same as product)
            product: product, // full product
            quantity: 1,
            variation: selectedVariation || null,
            variation_display: selectedVariation
              ? `${selectedVariation.size} / ${selectedVariation.color}`
              : undefined,
            price_at_purchase: product.price,
          })
        );

        toast.success("Added to wishlist");
      },
    });
  };

  const handleClick = () => {
    dispatch(
      addToCart({
        ...product,
        product_id: product.id, // ✅ Fix here
        variation_display: selectedVariation
          ? `${selectedVariation.size} / ${selectedVariation.color}`
          : undefined,
        price_at_purchase: product.price,
      })
    );
    router.push(`/product/${product.slug}`);
  };

  const productImage = product.image || "/placeholder.png";
  console.log("imageeeeeeeeeeeeeeeeeee", productImage);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-lg shadow-custom w-full h-[264.69px] pb-4 flex-shrink-0 md:max-w-49 bg-white shadow overflow-hidden"
      >
        {/* Product Image */}
        <div className="relative h-40 w-full">
          <Image
            src={productImage}
            alt={product.category || "Product"}
            fill
            className="object-cover"
          />

          {product.inventory && product.inventory > 0 && (
            <span className="absolute top-4 left-4 font-MontserratSemiBold bg-[#FFAC06] text-[12px] text-white w-[71px] h-[32px] flex items-center justify-center rounded-[8px]">
              On sale
            </span>
          )}

          {/* Love Button */}
          <button
            onClick={handleAddToWishlist}
            disabled={loadingWishlist}
            className="absolute top-4 right-4 w-[32px] h-[32px]  bg-white rounded-full shadow flex items-center justify-center"
          >
            {loadingWishlist ? (
              <LoadingSpinner color="ff715b" />
            ) : (
              <Image src={LoveIcon} alt="LoveIcon" width={19} height={16} />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-end justify-between p-4 h-[104px]">
          <div className="text-sm">
            <p className="font-MontserratMedium text-[12px] text-[#161616]">
              Free shipping
            </p>

            {/* Rating */}
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
              ₦{product.price}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
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
    </div>
  );
}
