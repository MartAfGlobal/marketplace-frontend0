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
import{ ProductPageProps} from "@/types/global"
import ProductCard from "@/components/ui/cards/ProductCard";




export default function ProductPage({ params }: ProductPageProps) {
  // ✅ Unwrap params Promise (Next.js 15+)
  const { slug } = React.use(params);

  const product = dummyProducts.find((p) => p.slug === slug);
  const relatedProducts = product
    ? dummyProducts.filter(
        (p) => p.category === product.category && p.slug !== slug
      )
    : [];


   const images = Array.isArray(product?.image)
    ? product.image
    : product?.image
    ? [product.image]
    : [];


  // Ensure we have an array of images
  

  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [activeSlide, setActiveSlide] = useState(0);

   if (!product) {
    return notFound();
  }

  return (
    <main className="px-c60 pb-c32">
      <div>
        <DetailPageNavbar />
      </div>

      <div className="flex  gap-c67">
        <div className="flex flex-col gap-c32">
          <div className="flex items-start gap-12 mt-6 border-b border-gray-200 h-fit pb-1.5 ">
           
            <div>
           
              <div className="w-full md:min-w-c397  h-c386-58 mb-4 flex-shrink-0">
                <Image
                  src={selectedImage}
                  alt={product.category}
                  width={397}
                  height={387}
                  className="object-cover w-full max-w-c397 h-c386-58 rounded-lg border"
                />
              </div>
              <div className="flex gap-2 mt-c24 mb-c32">
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

            <div className="w-full max-w-c376">
              <h1 className="text-161616 font-MontserratMedium text-c18  mb-3">
                {product.category}
              </h1>
              <p className="text-c32 font-MontserratSemiBold mb-2">
                N{product.price}
              </p>

              <div className="text-c12 font-MontserratMedium text-gray-500">
                <p> {">"}20 pieces : N2000 per piece</p>
                <p>{">"}50 pieces: 1500 per piece</p>
              </div>

              {product.onSale && (
                <span className="text-base font-MontserratSemiBold mt-2  text-2d7565 ">
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

              <div className="flex gap-c19 mt-c24 items-center">
                <Image src={Heart} alt="Like" height={22.93} width={28} />
                <Image src={Share} alt="Like" height={24} width={28.01} />
              </div>

              <h1 className="font-MontserratSemiBold text-base mt-c24 text-161616">
                Variations available
              </h1>

              <SizeColorSelector />
            </div>
          </div>
          <div className="relative">
            
            <div className="sticky top-0 z-10 bg-white shadow pointer-events-auto">
              <ProductNav />
            </div>

            {/* Scrollable content inside this section */}
            <div className="relative z-0">
              <MoreDetailedPage />
            </div>
          </div>
        </div>
        <div>
          <ItemAddToCart />
        </div>
      </div>
         <section
        id="similar"
        className="h-fit p-6 mt-12 rounded-lg"
      >
        <h2 className="font-MontserratSemiBold text-base text-[#1a1a1a] mb-6">
          Similar Items
        </h2>
        {relatedProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">No similar items found.</p>
      ) :(<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
         {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      )}
      </section>
    </main>
  );
}
