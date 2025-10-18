"use client";

import { useState, useEffect } from "react";
import { Button } from "../Button/Button";
import Image from "next/image";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";

import Location from "@/assets/mobile/MapPinArea.png";
import phone from "@/assets/mobile/Phone.png";
import { Product, Variations } from "@/types/global";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";

import QuantitySelector from "../cart/quantityControl";
import { addToCart } from "@/store/cart/cartSlice";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../loading-spinner";

type ItemAddToCartProps = {
  product: Product;
  quantity: number;
  selectedVariation: Variations | null;
  setSelectedQty: (qty: number) => void;
  setSelectedVariation: (variation: Variations) => void;
};

export default function ItemAddToCart({
  product,
  quantity,
  selectedVariation,
  setSelectedQty,
  setSelectedVariation,
}: ItemAddToCartProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {loading, sendHttpRequest } = useHttp();
  const token = useSelector((state: RootState) => state.token?.token);

  const [localQty, setLocalQty] = useState<number>(quantity);

  useEffect(() => {
    setLocalQty(quantity);

    if (!selectedVariation && product?.variations?.length) {
      setSelectedVariation(product.variations?.[0]);
    }

  }, [quantity, product?.variations, selectedVariation, setSelectedVariation]);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
    setSelectedQty(newQty); // update parent
  };

  const handleAddToCart = async () => {
 

    console.log("Adding to cart:", {
      productId: product.id,
      variationId: selectedVariation?.id,
      quantity: localQty,
    });

     if (!token) {
        dispatch(
          addToCart({
            ...product,
            quantity: localQty,
            variation_display: selectedVariation
              ? `${selectedVariation.size} / ${selectedVariation.color}`
              : undefined,
            price_at_purchase: product.price,
          })
        );
      toast.success("Item added to cart (offline mode)");
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/cart/add",
        method: "POST",
        token,
        isAuth: true,
        userType: "buyer",
        body: {
          product_id: product.id,
          variation_id: selectedVariation?.id,
          quantity: localQty,
        },
        successMessage: "Item added to cart successfully",
      },
      successRes: (res: any) => {
        dispatch(
          addToCart({
            ...product,
            quantity: localQty,
            variation_display: selectedVariation
              ? `${selectedVariation.size} / ${selectedVariation.color}`
              : undefined,
            price_at_purchase: product.price,
          })
        );
        toast.success("Item added to cart successfully");
      },
    }).catch((err: any) => {
      console.error("Cart API failed:", err);
      dispatch(
        addToCart({
          ...product,
          quantity: localQty,
          variation_display: selectedVariation
            ? `${selectedVariation.size} / ${selectedVariation.color}`
            : undefined,
          price_at_purchase: product.price,
        })
      );

      toast.error("Network error — added to local cart");
    });
  };

  const handleClick = () => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="w-full md:min-w-c386-58 md:shadow  md:p-6 flex flex-col gap-6">
      {/* Seller Info */}
      <div className="md:flex flex-col-reverse hidden md:flex-col gap-c24 md:pb-c32 md:border-b md:border-gray-100">
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
                  <Image src={Location} alt="location" width={20} height={20} />
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
          <button className="font-MontserratSemiBold text-c12 text-ff715b md:hidden">
            Follow
          </button>
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

      {/* Quantity Selector */}
      <div className="hidden md:flex mt-3">
        <QuantitySelector quantity={localQty} onChange={handleQtyChange} />
      </div>

      {/* Add to Cart & Buy Now */}
      <div className="md:space-y-c32 flex w-full gap-2  md:gap-0  md:flex-col">
        <Button
          onClick={handleAddToCart}
          disabled= {loading}
          className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50"
        >
         {loading? <LoadingSpinner color="border-ff715b"/>: " Add to cart"}
        </Button>
        <Button>Buy now</Button>
      </div>

      {/* Mobile Buttons */}
      {/* <div className="flex gap-2 md:hidden">
        <Button className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50">
          View profile
        </Button>
        <Button>Send message</Button>
      </div> */}
    </div>
  );
}
