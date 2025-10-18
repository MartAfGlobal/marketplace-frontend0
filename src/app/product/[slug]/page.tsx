"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useParams } from "next/navigation";

import Image from "next/image";
import DetailPageNavbar from "@/components/ui/navigation/detail-page-nav";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";

import Location from "@/assets/mobile/MapPinArea.png";
import phone from "@/assets/mobile/Phone.png";
import Heart from "@/assets/icons/heart.svg";
import Share from "@/assets/icons/share.svg";
import SizeColorSelector from "@/components/ui/Button/SizeColorSelector";
import ItemAddToCart from "@/components/ui/DetailPage/ItemAddToCart";
import ProductNav from "@/components/ui/navigation/ProductNavView";
import MoreDetailedPage from "@/components/ui/DetailPage/MoreDetailedPage";
import ProductCard from "@/components/ui/cards/ProductCard";
import QuantitySelector from "@/components/ui/cart/quantityControl";
import ProductDetailCategory from "@/components/ui/mobile/product-detail.categories";
import CartButton from "@/components/ui/cart/cartButton";
import { Button } from "@/components/ui/Button/Button";
import { addToCart, updateQuantity } from "@/store/cart/cartSlice";
import CartBtn from "@/assets/mobile/cart.png";
import { Variations } from "@/types/global";

export default function ProductPage() {
  const dispatch = useDispatch();
  const params = useParams(); // ✅ get slug from URL
  const slug = params?.slug as string;

  const [selectedQty, setSelectedQty] = useState(1);

  // ✅ Try to find product by slug
  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => p.slug === slug)
  );

  const [selectedVariation, setSelectedVariation] = useState<Variations | null>(
    product?.variations?.[0] || null
  );
  // if product not found, return fallback
  if (!product) {
    return (
      <main className="p-6">
        <p className="text-gray-600 text-center">Product not found.</p>
      </main>
    );
  }

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const quantity = cartItem?.quantity ?? 1;

  const relatedProducts = useSelector((state: RootState) =>
    state.products.items.filter(
      (p) => p.category === product.category && p.id !== product.id
    )
  );

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <main className="md:px-c60 pb-c32 ">
      <div className="hidden md:flex">
        <DetailPageNavbar />
      </div>

      {/* Product main section */}
      <div className="flex flex-col md:flex-row md:gap-c67 justify-center">
        <div className="flex flex-col gap-c32 w-full ">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12 px-5.5 md:px-0 mt-6 md:border-b md:border-gray-200 h-fit pb-1.5 ">
            <div className="w-full ">
              <div className="w-full md:min-w-c397 h-fit md:h-c386-58 mb-1 md:mb-4 flex-shrink-0">
                <Image
                  src={selectedImage}
                  alt={product.category || product.name}
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
              )}
            </div>

            {/* Product details */}
            <div className="w-full md:max-w-c376">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-161616 font-MontserratMedium text-base md:text-c18 mb-3">
                    {product.category}
                  </h1>
                  <p className="md:text-c32 text-c20 font-MontserratSemiBold md:mb-2">
                    N{product.price}
                  </p>
                  {product.onSale && (
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

                  <div className="md:hidden mt-3">
                    <QuantitySelector
                      productId={product.id}
                      quantity={quantity}
                      onChange={(newQty, id) => {
                        dispatch(
                          updateQuantity({ id: product.id, quantity: newQty })
                        );
                      }}
                    />
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
                selectedVariation={selectedVariation}
                setSelectedVariation={setSelectedVariation}
              />
            </div>
          </div>

          {/* More details section */}
          <div className="relative hidden md:flex flex-col ">
            <div className="sticky top-0 z-10 bg-white shadow pointer-events-auto">
              <ProductNav />
            </div>
            <div className="relative z-0">
              <MoreDetailedPage product={product} />
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col-reverse mt-c32 m  gap-c24 pb-4 md:border-b md:border-gray-100 px-6">
          <div className="w-full flex justify-between items-start">
            <div className="flex gap-4">
              <div className="h-c88 w-c88 rounded-c12 bg-f89f1c flex items-center justify-center text-center">
                <p className="font-MontserratBold text-c12 text-000000">
                  COMPANY LOGO
                </p>
              </div>
              <div>
                <h1 className="font-MontserratSemiBold text-161616 text-c18">
                  Seller Name
                </h1>
                <div className="flex gap-2 items-center">
                  <div className="w-5 h-5">
                    <Image
                      src={Location}
                      alt="location"
                      width={20}
                      height={20}
                    />
                  </div>
                  <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                    Suppliers Location
                  </p>
                </div>
                <div className="md:hidden flex gap-2 items-center">
                  <div className="w-5 h-5">
                    <Image src={phone} alt="phone" width={20} height={20} />
                  </div>
                  <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                    +234 80312345678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="md:flex gap-4 items-start hidden">
            <div>
              <Image src={truck} alt="truck" width={22.5} height={15.76} />
            </div>
            <div className="md:flex flex-col gap-2">
              <p className="font-MontserratSemiBold text-base text-161616">
                Shipping fee
              </p>
              <p className="text-c12 font-MontserratMedium text-gray-500">
                Delivery:{" "}
                <span className="font-MontserratSemiBold text-c12 text-161616">
                  May 25, 2020
                </span>
              </p>
              <p className="text-c12 font-MontserratMedium text-gray-500">
                Courier company:{" "}
                <span className="font-MontserratSemiBold text-c12 text-161616">
                  SpeedAf
                </span>
              </p>
            </div>
          </div>

          {/* Security & Refund */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <Image
                src={Security}
                alt="security check"
                width={22.5}
                height={15.76}
              />
              <div className="flex flex-col gap-2">
                <p className="font-MontserratSemiBold text-sm text-161616">
                  Secure payments
                </p>
                <p className="text-sm font-MontserratNormal text-gray-500">
                  Every payment you make on MartAf is secured with strict SSL
                  encryption and PCI DSS data protection protocols
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Image src={refund} alt="refund" width={26} height={24.76} />
              <div className="flex flex-col gap-2">
                <p className="font-MontserratSemiBold text-sm text-161616">
                  Standard refund policy
                </p>
                <p className="text-sm font-MontserratNormal text-gray-500">
                  Claim a refund if your order doesn&apos;t ship, is missing, or
                  arrives with product issues
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex w-full px-6 gap-2 mb-c32  md:gap-0  md:flex-col">
          <Button className="" variant="secondary">
            View profile
          </Button>
          <Button variant="primary">Send message</Button>
        </div>

        <div className=" w-full md:flex hidden max-w-105.5">
          <ItemAddToCart
            product={product}
            quantity={selectedQty}
            setSelectedQty={setSelectedQty}
            selectedVariation={selectedVariation}
            setSelectedVariation={setSelectedVariation}
          />
        </div>
      </div>

      <div className="md:hidden">
        <ProductDetailCategory slug={product.slug} />
      </div>

      {/* Similar products */}
      <section
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
      </section>

      {/* Mobile Cart Button */}
      <div className="flex gap-9.75 items-center left-0 px-6 bg-ffffff fixed bottom-0 h-20 w-full md:hidden">
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
      </div>
    </main>
  );
}
