import ProductCard from "@/components/ui/cards/ProductCard";
import { RootState } from "@/store";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Wishlist() {
  const [visible, setVisible] = useState(10); // Show 6 items by default
  const router = useRouter();

  const showMore = () => router.push("/dashboard/buyer/wishlist");

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistProducts = wishlistItems
    .map((item) => item.product) // extract only the product object
    .filter(Boolean); // remove null/undefined products

  console.log("lets check wishlist:", wishlistProducts);

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-lg font-MontserratMedium text-[#161616]">
          <p>Wishlist</p>
        </h2>
        
        {wishlistProducts.length > 10 && (
          <button
            onClick={showMore}
            className="font-MontserratSemiBold text-[#FF715B] hover:underline text-sm"
          >
            View All
          </button>
        )}
      </div>
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 ">
          {wishlistProducts.slice(0, visible).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <div className="w-full h-40 flex justify-center flex-col gap-4 items-center">
          <h1 className="text-sm font-MontserratSemiBold leading-6.5 text-000000 opacity-32">
            Your wishlist is empty
          </h1>
          <p className="text-sm font-MontserratNormal text-000000 opacity-20">
            Discover products and add them with one tap.
          </p>
        </div>
      )}
    </div>
  );
}
