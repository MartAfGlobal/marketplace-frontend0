"use client";
import React from "react";
import Image from "next/image";
import YellowStar from "@/assets/icons/Star1.svg";
import Star from "@/assets/icons/Star2.svg";
export default function Overview() {
  return (
    <div className="pt-c56">
      <div className="flex flex-col gap-c56">
        <div className="flex gap-3 flex-col">
          <div className="flex justify-between">
            <p className="font-MontserratSemiBold text-sm text-161616">
              Customer Name
            </p>
            <p className="font-MontserratNormal text-c12 text-646464">
              Jan 02, 2024
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-c2">
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image src={Star} alt="yellow star" width={16} height={15.16} />
            </div>
            <p className="font-MontserratSemiBold text-c12 text-128807">
              Verified Purchase
            </p>
          </div>
          <div>
            <p className="font-MontserratNormal text-sm text-000000">
              there should probably something nice this guy will write that will
              sound sweet in the ear for people to buy the product.
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-col">
          <div className="flex justify-between">
            <p className="font-MontserratSemiBold text-sm text-161616">
              Customer Name
            </p>
            <p className="font-MontserratNormal text-c12 text-646464">
              Jan 02, 2024
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-c2">
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image src={Star} alt="yellow star" width={16} height={15.16} />
            </div>
            <p className="font-MontserratSemiBold text-c12 text-128807">
              Verified Purchase
            </p>
          </div>
          <div>
            <p className="font-MontserratNormal text-sm text-000000">
              there should probably something nice this guy will write that will
              sound sweet in the ear for people to buy the product.
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-col">
          <div className="flex justify-between">
            <p className="font-MontserratSemiBold text-sm text-161616">
              Customer Name
            </p>
            <p className="font-MontserratNormal text-c12 text-646464">
              Jan 02, 2024
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-c2">
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image
                src={YellowStar}
                alt="yellow star"
                width={16}
                height={15.16}
              />
              <Image src={Star} alt="yellow star" width={16} height={15.16} />
            </div>
            <p className="font-MontserratSemiBold text-c12 text-128807">
              Verified Purchase
            </p>
          </div>
          <div>
            <p className="font-MontserratNormal text-sm text-000000">
              there should probably something nice this guy will write that will
              sound sweet in the ear for people to buy the product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
