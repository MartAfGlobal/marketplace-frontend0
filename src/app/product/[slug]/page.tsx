"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useParams } from "next/navigation";

import DetailPageNavbar from "@/components/ui/navigation/detail-page-nav";


import { useHttp } from "@/hooks/use-http";
import { setProduct } from "@/store/productDetails/productDetailsSlice";
import ProductVariation from "@/components/ui/DetailPage/productVariation";
import { useSearchParams } from "next/navigation";

export default function ProductPage() {
  const dispatch = useDispatch();
  const params = useParams(); // ✅ get slug from URL
  const slug = params?.slug as string;
 const searchParams = useSearchParams();
const variationId = searchParams.get("variationId") || undefined;
 
  const { loading: loadingDetails, sendHttpRequest: fetchDetailsReq } =
    useHttp();

  useEffect(() => {
    if (!slug) return;
    console.log("product details   emty:");

    // dispatch(clearSelectedVariation());

    fetchDetailsReq({
      requestConfig: {
        url: `/products/public/products/${slug}/`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res) => {
       

        // Store in Redux
        dispatch(setProduct(res.data));
      },
    });
  }, [slug, dispatch, fetchDetailsReq]);

  const [selectedQty, setSelectedQty] = useState(1);

  // ✅ Try to find product by slug
  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => p.slug === slug)
  );


  const productDetails = useSelector(
    (state: RootState) => state.productDetails.product
  );

  console.log("redux product details", productDetails);


  return (
    <main className="md:px-c60 pb-c32 ">
      <div className="hidden md:flex">
        <DetailPageNavbar productName={productDetails?.name || ""} categoryName={productDetails?.category?.name || ""} subCategoryName={productDetails?.category?.subcategory?.name || ""} categorySlug={productDetails?.category?.slug || ""} subCategorySlug={productDetails?.category?.subcategory?.slug || ""} />
      </div>

      {/* Product main section */}
      <div className="flex flex-col md:flex-row md:gap-c67 justify-center">
        <div className="flex flex-col gap-c32 w-full ">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12 px-5.5 md:px-0  md:border-b md:border-gray-200 h-fit pb-1.5 ">
            {/* <div className="w-full  md:max-w-99.5 overflow-hidden">
              <div className="w-full md:min-w-c397 h-fit md:h-c386-58 mb-1 md:mb-4 flex-shrink-0">
                <Image
                  src={selectedImage}
                  alt={product.name || "Product"}
                  width={397}
                  height={387}
                  className="object-cover w-full md:max-w-c397 md:h-c386-58 h-85 rounded-lg border"
                />
              </div>

              <div className="flex gap-2 md:mt-c24 mb-4 md:mb-c32">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(images[index]);
                      setActiveSlide(index);
                    }}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      activeSlide === index
                        ? " w-c117 h-1 bg-gray-700"
                        : "bg-gray-300 w-c40"
                    }`}
                  />
                ))}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 mb-4 h-c66-81 w-full flex-shrink-0 overflow-x-auto overflow-y-hidden hcustom-scroll">
                  {images.map((thumb, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(thumb);
                        setActiveSlide(index);
                      }}
                      className={`w-c66-81 h-c66-81 flex-shrink-0  border-2 ${
                        activeSlide === index
                          ? "my-gradient-border"
                          : "border-transparent"
                      } transition-all duration-200`}
                    >
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-c66-81 h-c66-81"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Product details */}
            {/* <div className="w-full md:max-w-c376">
              <div className="">
                <div>
                  <h1 className="text-161616 font-MontserratMedium text-base md:text-c18 mb-3">
                    {product.name || "Category Name"}
                  </h1>
                  <p className="md:text-c32 text-c20 font-MontserratSemiBold md:mb-2">
                    N{product.price}
                  </p>
                  {product.inventory !== undefined && product.inventory > 0 && (
                    <span className="md:text-base text-sm font-MontserratSemiBold mt-1 md:mt-2 text-2d7565">
                      In stock
                    </span>
                  )}

                  <div className="mt-3 flex items-center gap-3">
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

                    <p className="font-MontserratMedium text-sm text-161616">
                      4.5/5
                    </p>
                  </div>
                </div>

                <div className="flex gap-c19 md:mt-c24 items-center">
                  <Image
                    src={Heart}
                    alt="Like"
                    height={22.93}
                    width={28}
                    className="w-5.25 h-4.5"
                  />
                  <Image
                    src={Share}
                    alt="Share"
                    height={24}
                    width={28.01}
                    className="h-5.25 w-4.5"
                  />
                </div>
              </div>

              <h1 className="font-MontserratSemiBold text-base mt-c32 md:mt-c24 text-161616">
                Variations available
              </h1>
              <SizeColorSelector
                product={product}
                setSelectedVariation={(v) => {
                  if (v) {
                    setSelectedVariation(v);
                    dispatch(
                      updateSelectedVariation({
                        variation_id: v.variation_id,
                        variationData: v,
                        slug: product.slug ?? "",
                      })
                    );
                  }
                }}
              />
            </div> */}

            <ProductVariation isModal={false} selectedVariaton={variationId}/>
          </div>

          {/* More details section */}
          {/* <div className="relative hidden md:flex flex-col ">
            <div className="sticky top-0 z-10 bg-white shadow pointer-events-auto">
              <ProductNav />
            </div>
            <div className="relative z-0">
              <MoreDetailedPage product={product} />
            </div>
          </div> */}
        </div>

      

        

        {/* <div className=" w-full md:flex hidden max-w-105.5 ">
          <ItemAddToCart
            product={product}
            quantity={selectedQty}
            setSelectedQty={setSelectedQty}
            selectedVariation={selectedVariation}
            setSelectedVariation={setSelectedVariation}
          />
        </div> */}
      </div>

      {/* <div className="md:hidden">
        <ProductDetailCategory slug={product.category_name || "new"} />
      </div> */}

      {/* Similar products */}
      {/* <section
        id="similar"
        className="h-fit p-6 md:pt-12 md:px-0 rounded-lg md:pb-20"
      >
        <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-6">
          Similar Items
        </h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No similar items found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section> */}

      {/* Mobile Cart Button */}
      {/* <div className="flex gap-9.75 items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
        <CartButton image={CartBtn} size={32} />
        <div className="w-full">
          <ItemAddToCart
            product={product}
            quantity={selectedQty}
            setSelectedQty={setSelectedQty}
            selectedVariation={selectedVariation}
            setSelectedVariation={setSelectedVariation}
          />
        </div>
      </div> */}
    </main>
  );
}
