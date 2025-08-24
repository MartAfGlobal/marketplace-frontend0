import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/global";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";
import { addToWishlist } from "@/store/cart/wishlist-slice";
import { setSelectedProduct } from "@/store/user-data/products/selectedProduct-slice";
import { useRouter } from "next/navigation";
import LoveIcon from "@/assets/images/loveIcone.svg";
import Cart from "@/assets/headerIcon/cart.svg";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(setSelectedProduct(product));
    router.push(`/product/${product.slug}`);
  };

  const productImage = Array.isArray(product.image) ? product.image[0] : product.image;

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
          <Image src={productImage} alt={product.category || "Product"} fill className="object-cover" />

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
            }}
            className="absolute top-4 right-4 w-[32px] h-[32px] bg-white rounded-full shadow flex items-center justify-center"
          >
            <Image src={LoveIcon} alt="LoveIcon" width={19} height={16} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex justify-between p-4 items-end">
          <div className="text-sm">
            <p className="font-MontserratMedium text-[12px] text-[#161616]">Free shipping</p>
            <p className="text-yellow-500 text-base">★★★★★</p>
            <p className="font-MontserratSemiBold text-base">N{product.price}</p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(product));
            }}
            className="w-c44 hidden md:flex h-[41.97px] items-center justify-center gap-2 py-1 bg-[#FF715B] rounded-[8px]"
          >
            <Image src={Cart} alt="cart" width={20} height={17.6} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
