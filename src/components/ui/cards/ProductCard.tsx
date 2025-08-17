import Image from "next/image";
import Link from "next/link";
import LoveIcon from "@/assets/images/loveIcone.svg";
import Cart from "@/assets/headerIcon/cart.svg";
import { motion } from "framer-motion";
import { Product } from "@/types/global";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  return (
    <Link href={`/product/${product.slug}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-lg shadow-custom w-full h-[264.69px] pb-4 flex-shrink-0 md:max-w-49 bg-white shadow overflow-hidden cursor-pointer"
      >
        {/* === Product Image with Badges === */}
        <div className="relative h-40 w-full">
          <Image
            src={
              Array.isArray(product.image) ? product.image[0] : product.image
            }
            alt={product.category || "Product image"}
            fill
            className="object-cover"
          />

          {/* On Sale Badge */}
          {product.onSale && (
            <span className="absolute top-4 left-4 font-MontserratSemiBold bg-[#FFAC06] text-[12px] text-white w-[71px] h-[32px] flex items-center justify-center rounded-[8px]">
              On sale
            </span>
          )}

          {/* Love Button */}
          <div>
            <button
              onClick={(e) => e.preventDefault()} // prevent Link navigation when clicked
              className="absolute top-4 right-4 w-[32px] h-[32px] bg-white rounded-full shadow flex items-center justify-center"
            >
              <Image
                src={LoveIcon}
                alt="LoveIcon"
                width={19}
                height={16}
                className="m-auto"
              />
            </button>
          </div>
        </div>

        {/* === Product Info === */}
        <div className="flex justify-between p-4 items-end">
          <div className=" text-sm">
            <p className="font-MontserratMedium text-[12px] text-[#161616]">
              Free shipping
            </p>
            <p className="text-yellow-500 text-base">★★★★★</p>
            <p className="font-MontserratSemiBold text-base">
              N{product.price}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              dispatch(addToCart(product));
            }}
            className="w-c44 hidden md:flex h-[41.97px] items-center justify-center gap-2 py-1 bg-[#FF715B] rounded-[8px]"
          >
            <Image src={Cart} alt="cart" width={20} height={17.6} />
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
