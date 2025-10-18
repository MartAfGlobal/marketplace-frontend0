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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, sendHttpRequest } = useHttp();
  const token = useSelector((state: RootState) => state.token?.token);

  const [selectedVariation, setSelectedVariation] = useState<Variations | null>(
    product.variations?.[0] || null
  );

  // ✅ Add to cart handler
  // ✅ Add to Cart Handler
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
  
    if (!token) {
      dispatch(addToCart(product));
      toast.success("Item added to cart (offline mode)");
      return;
    }

    // --- Logged in → send to backend
    sendHttpRequest({
      requestConfig: {
        url: "/cart/add", // 👈 your backend endpoint
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          product_id: product.id,
          variation_id: selectedVariation?.id,
          quantity: 1,
          check: true
        },
        successMessage: "Item added to cart successfully",
      },

      // ✅ Called when backend responds successfully
      successRes: (res: any) => {
        dispatch(addToCart(product));
        console.log("Cart API success:", res.data);
      },
    }).catch((err: any) => {
      // ✅ Called only if the hook itself throws (rare)
      console.error("Cart API failed:", err);
      dispatch(addToCart(product));
      toast.error("Network error — added to local cart");
    });
  };

  const handleClick = () => {
    dispatch(setSelectedProduct(product));
    router.push(`/product/${product.slug}`);
  };

  const productImage = product.image?.[0] || "/placeholder.png";

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

          {product.onSale && (
            <span className="absolute top-4 left-4 font-MontserratSemiBold bg-[#FFAC06] text-[12px] text-white w-[71px] h-[32px] flex items-center justify-center rounded-[8px]">
              On sale
            </span>
          )}

          {/* Love Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToWishlist(product));
              toast.success("Added to wishlist");
            }}
            className="absolute top-4 right-4 w-[32px] h-[32px] bg-white rounded-full shadow flex items-center justify-center"
          >
            <Image src={LoveIcon} alt="LoveIcon" width={19} height={16} />
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
              {product.discount_price &&
              product.discount_price < product.price ? (
                <>
                  <span className=" text-gray-400 mr-2 ">₦{product.price}</span>
                </>
              ) : (
                <span>₦{product.price}</span>
              )}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-c44 hidden flex-shrink-0 md:flex h-[41.97px] items-center justify-center gap-2 py-1 bg-[#FF715B] rounded-[8px]"
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
