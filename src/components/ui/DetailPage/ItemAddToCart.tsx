"use client";
import { useState } from "react";
import { Button } from "../Button/Button";
import Image from "next/image";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";

import Location from "@/assets/mobile/MapPinArea.png";
import phone from "@/assets/mobile/Phone.png";
import { Product } from "@/types/global";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";

import QuantitySelector from "../cart/quantityControl";
import { updateQuantity, addToCart } from "@/store/cart/cartSlice";

export default function ItemAddToCart({
  product,
 
}: {
  product: Product;
  selectedQty: number;
  setSelectedQty: React.Dispatch<React.SetStateAction<number>>;
}) {
  const dispatch = useDispatch();

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === product.id)
  );

  const quantity = cartItem?.quantity ?? 1;
  const empty = "";
  return (
    <div className="w-full md:min-w-c386-58  md:shadow p-6 flex flex-col gap-6 ">
      <div className="flex flex-col-reverse md:flex-col gap-c24 md:pb-c32 md:border-b md:border-gray-100">
        <div className="w-full flex justify-between items-start">
          <div className="flex gap-4  ">
            {empty === "" && (
              <div className="h-c88 w-c88 rounded-c12 bg-f89f1c flex items-center justify-center text-center">
                <p className="font-MontserratBold text-c12 text-000000">
                  COMPANY LOGO
                </p>
              </div>
            )}
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
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                  Suppliers Location
                </p>
              </div>
              <div className=" md:hidden flex gap-2 items-center">
                <div className="w-5 h-5">
                  <Image
                    src={phone}
                    alt="location"
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                  +234 80312345678
                </p>
              </div>

              <div className="hidden md:flex gap-c24 font-MontserratSemiBold text-c12 text-ff715b">
                <button>Follow</button>
                <button>Send Message</button>
              </div>
            </div>
          </div>
          <button className="font-MontserratSemiBold text-c12 text-ff715b">
            Follow
          </button>
        </div>

        <div className="md:flex gap-4 items-start hidden mt-">
          <div>
            <Image
              className="mt-1"
              src={truck}
              alt="truck"
              width={22.5}
              height={15.76}
            />
          </div>
          <div className=" md:flex flex-col gap-2 ">
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
        <div className="space-y-6">
          <div className="flex gap-4 items-start mt-">
            <div>
              <Image
                className="mt-1 flex-shrink-0"
                src={Security}
                alt="security check"
                width={22.5}
                height={15.76}
              />
            </div>
            <div className=" flex flex-col gap-2">
              <p className="font-MontserratSemiBold text-sm text-161616">
                Secure payments{" "}
              </p>
              <p className="text-sm font-MontserratNormal text-gray-500">
                Every payment you make on MartAf is secured with strict SSL
                encryption and PCI DSS data protection protocols
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start mt-">
            <div>
              <Image
                className="mt-1"
                src={refund}
                alt="refund"
                width={26}
                height={24.76}
              />
            </div>
            <div className=" flex flex-col gap-2">
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
      <div className="hidden md:flex mt-3">
        <QuantitySelector
          productId={product.id}
          initialQty={quantity}
          onChange={(newQty, id) => {
            dispatch(updateQuantity({ id, quantity: newQty }));
          }}
        />
      </div>
      <div className="space-y-c32 hidden md:flex flex-col">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(addToCart(product)); // will either create or increment
          }}
          className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50"
        >
          Add to cart
        </Button>
        <Button>Buy now</Button>
      </div>
      <div className="flex gap-2 md:hidden">
        <Button className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50">
          View profile
        </Button>
        <Button>Send message</Button>
      </div>
    </div>
  );
}
