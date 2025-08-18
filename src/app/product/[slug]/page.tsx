"use client";

import { notFound } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { dummyProducts } from "@/store/data/products";
import Image from "next/image";
import DetailPageNavbar from "@/components/ui/navigation/detail-page-nav";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
import Heart from "@/assets/icons/heart.svg";
import Share from "@/assets/icons/share.svg";
import SizeColorSelector from "@/components/ui/Button/SizeColorSelector";
import ItemAddToCart from "@/components/ui/DetailPage/ItemAddToCart";
import ProductNav from "@/components/ui/navigation/ProductNavView";
import MoreDetailedPage from "@/components/ui/DetailPage/MoreDetailedPage";
import { ProductPageProps } from "@/types/global";
import ProductCard from "@/components/ui/cards/ProductCard";
import QuantitySelector from "@/components/ui/cart/quantityControl";
import ProductDetailCategory from "@/components/ui/mobile/product-detail.categories";
import CartButton from "@/components/ui/cart/cartButton";
import { Button } from "@/components/ui/Button/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cart/cartSlice";

import CartBtn from "@/assets/mobile/cart.png"

export default function ProductPage({ params }: ProductPageProps) {
  const dispatch = useDispatch();
  // ✅ Unwrap params Promise (Next.js 15+)
  const { slug } = React.use(params);

  const product = dummyProducts.find((p) => p.slug === slug);
  const relatedProducts = product
    ? dummyProducts.filter(
        (p) => p.category === product.category && p.slug !== slug
      )
    : [];

    const productId = product?.id
  const images = Array.isArray(product?.image)
    ? product.image
    : product?.image
    ? [product.image]
    : [];

  

  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [activeSlide, setActiveSlide] = useState(0);

  if (!product) {
    return notFound();
  }

  return (
    <main className="md:px-c60 pb-c32">
      <div className="hidden md:flex">
        <DetailPageNavbar />
      </div>

      <div className="flex flex-col md:flex-row  md:gap-c67">
        <div className="flex flex-col gap-c32">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12 px-5.5 md:px-0 mt-6 md:border-b   md:border-gray-200 h-fit pb-1.5 ">
            <div>
              <div className="w-full md:min-w-c397 h-fit  md:h-c386-58 mb-1 md:mb-4 flex-shrink-0">
                <Image
                  src={selectedImage}
                  alt={product.category}
                  width={397}
                  height={387}
                  className="object-cover w-full md:max-w-c397 md:h-c386-58 h-85 rounded-lg  border "
                />
              </div>
              <div className="flex gap-2  md:mt-c24 mb-4 md:mb-c32">
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
                        : "bg-gray-300  w-c40"
                    }`}
                  />
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <div className="flex gap-3 mb-4 h-c66-81">
                    {images.map((thumb, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(thumb);
                          setActiveSlide(index);
                        }}
                        className={`w-c66-81 h-c66-81 overflow-hidden border-2 ${
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
                </>
              )}
            </div>

            <div className="w-full md:max-w-c376">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-161616 font-MontserratMedium text-base md:text-c18  mb-3">
                    {product.category}
                  </h1>
                  <p className="md:text-c32 text-c20 font-MontserratSemiBold md:mb-2">
                    N{product.price}
                  </p>

                  <div className="text-c12 font-MontserratMedium hidden md:flex flex-col text-gray-500">
                    <p> {">"}20 pieces : N2000 per piece</p>
                    <p>{">"}50 pieces: 1500 per piece</p>
                  </div>

                  {product.onSale && (
                    <span className="md:text-base text-sm font-MontserratSemiBold mt-1 md:mt-2  text-2d7565 ">
                      In stock
                    </span>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex gap-0.5 items-center">
                      <Image
                        src={YellowStar}
                        alt="yellow star"
                        height={22.74}
                        width={24}
                      />
                      <Image
                        src={YellowStar}
                        alt="yellow star"
                        height={22.74}
                        width={24}
                      />
                      <Image
                        src={YellowStar}
                        alt="yellow star"
                        height={22.74}
                        width={24}
                      />
                      <Image
                        src={YellowStar}
                        alt="yellow star"
                        height={22.74}
                        width={24}
                      />
                      <Image
                        src={Star}
                        alt="yellow star"
                        height={22.74}
                        width={24}
                      />
                    </div>
                    <p className="font-MontserratMedium text-sm text-161616">
                      4.5/5
                    </p>
                  </div>
                  <div className="md:hidden mt-3">
                  <QuantitySelector productId={product.id}/>
                </div>
                </div>
                

                <div className="flex gap-c19 md:mt-c24 items-center">
                  <Image src={Heart} alt="Like" height={22.93} width={28} className="w-5.25 h-4.5" />
                  <Image src={Share} alt="Like" height={24} width={28.01} className="h-5.25 w-4.5" />
                </div>
              </div>

              <h1 className="font-MontserratSemiBold text-base mt-c32 md:mt-c24 text-161616">
                Variations available
              </h1>

              <SizeColorSelector />
            </div>
          </div>

          
          <div className="relative hidden md:flex flex-col">
            <div className="sticky top-0 z-10 bg-white shadow pointer-events-auto">
              <ProductNav />
            </div>

            {/* Scrollable content inside this section */}
            <div className="relative z-0">
              <MoreDetailedPage product={product} />
            </div>
          </div>
        </div>

        <div>
          <ItemAddToCart />
        </div>
      </div>
      <ProductDetailCategory  slug={slug}/>
      <section id="similar" className="h-fit p-6 md:mt-12 rounded-lg pb-20">
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
      </section>
       <div className="flex gap-9.75 items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
        <CartButton image={CartBtn} size={32}/>
        <div className="flex gap-2 w-full text-c12">
          <Button className="bg-transparent border border-ff715b hover:border-0 text-ff715b focus:ring-0"    onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              dispatch(addToCart(product));
            }}>Add to cart</Button>
          <Button>Buy now</Button>
        </div>
      </div>
    </main>
  );
}
