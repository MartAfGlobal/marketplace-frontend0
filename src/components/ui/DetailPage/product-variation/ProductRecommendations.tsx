"use client";

import AdSlider from "@/components/Ads";
import ProductSection from "@/components/ui/landindPage/ShoppingItems/shoppingItemComponent/ProductSection";
import ProductDetailCategory from "@/components/ui/mobile/product-detail.categories";
import { Product, ProductDetail } from "@/types/global";

interface ProductRecommendationsProps {
  productDetails: ProductDetail | null;
  isLoading: boolean;
  similarProducts: Product[];
}

export default function ProductRecommendations({
  productDetails,
  isLoading,
  similarProducts,
}: ProductRecommendationsProps) {
  return (
    <>
      {/* Related category content is mobile-only; the ad slider is shared. */}
      <div className="">
        <AdSlider />
      </div>

      <div className=" mt-c32 md:hidden ">
        <div className="md:hidden">
          <ProductDetailCategory
            slug={productDetails?.slug || "new"}
            ProductDetail={productDetails}
          />
        </div>
        {isLoading ? (
          <div>
            <h1 className="mb-12">Searching for similier products...</h1>
          </div>
        ) : (
          <div>
            {similarProducts.length > 0 && (
              <ProductSection
                title={"Similar products"}
                products={similarProducts}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
