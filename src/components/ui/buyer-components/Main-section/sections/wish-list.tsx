import ProductCard from "@/components/ui/cards/ProductCard";
import { RootState } from "@/store";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";



export default function Wishlist() {
  const [visible, setVisible] = useState(10); // Show 6 items by default
  const router = useRouter()

const showMore = ()=> router.push("/dashboard/buyer/wishlist")

    const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
   const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistProducts = wishlistItems
  .map(item => item.product)   // extract only the product object
  .filter(Boolean);            // remove null/undefined products

   console.log("lets check wishlist:", wishlistProducts)
  

  const fashionProducts = cartItems.filter(
    (product) => product.category === "Fashion and Apparel"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-lg font-MontserratMedium text-[#161616]">
          <p>Wishlist</p>
        </h2>
        {/* {visible < fashionProducts.length && ( */}
          <button
            onClick={showMore}
            className="font-MontserratSemiBold text-[#FF715B] hover:underline text-sm"
          >
            View All
          </button>
       
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 ">
        {wishlistProducts.slice(0, visible).map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
