"use client";

import { useState, useEffect, useMemo } from "react";
import UsableCard from "./cardUse";
import Image from "next/image";
import ProductBox from "@/assets/Seller/productBox.png";
import EmptyProductBox from "@/assets/Seller/Package.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ProductStockCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  const products = useSelector((state: RootState) => state.sellerProduct.product);

  const { totalProducts, stockPercent } = useMemo(() => {
    const totalProducts = products?.length || 0;
    if (totalProducts === 0) return { totalProducts: 0, stockPercent: 0 };
    const fullyStocked = products.filter((p: any) => {
      const qty = p.stock_quantity ?? p.quantity ?? p.stock ?? 0;
      return qty > 10;
    }).length;
    const stockPercent = Math.round((fullyStocked / totalProducts) * 100);
    return { totalProducts, stockPercent };
  }, [products]);

  const target = stockPercent;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      if (start < target) {
        start += 1;
        setProgress(start);
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [target]);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const preload = Math.min(progress + 0.7 * (100 - progress), 90);

  return (
    <>
      {/* Mobile Card */}
      <div className="lg:hidden bg-white rounded-c16 p-4  flex flex-col justify-between h-fit min-h-42 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-000000 text-base font-MontserratNormal mb-4">Products</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-[#161616] text-3xl font-MontserratBold">
              {totalProducts > 0 ? totalProducts.toLocaleString() : "1,000"}
            </h2>
          </div>
        </div>
        <div className="absolute h-26 w-26  -bottom-10 right-0 opacity-[0.08]">
          <Image src={ProductBox} alt="products" width={100} height={100} />
        </div>
      </div>

      {/* Desktop Card */}
      <div className="hidden lg:block">
        {isIncomplete ? (
          <UsableCard title="Products available">
            <div className="flex items-center gap-2.5 text-000000/10">
              <div className="h-fit w-fit flex-shrink-0">
                <Image src={EmptyProductBox} alt="box" width={19.5} height={20.99} />
              </div>
              <p className="text-c32 font-MontserratSemiBold">0</p>
            </div>
            <div className="flex w-full h-fit items-end gap-3.25 mt-c42">
              <div className="w-c61-19 h-c61-19">
                <svg className="w-full h-full" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r={radius} stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                </svg>
              </div>
              <div className=" text-c10 space-y-0.5 font-MontserratMedium text-000000/10">
                <p>Fully stocked</p>
                <p>Average stocked</p>
                <p>Low stock</p>
              </div>
            </div>
          </UsableCard>
        ) : (
          <UsableCard title="Products available">
            <div className="flex items-center gap-2.5">
              <div className="h-fit w-fit flex-shrink-0">
                <Image src={ProductBox} alt="box" width={19.5} height={20.99} />
              </div>
              <p className="text-c32 font-MontserratSemiBold">{totalProducts.toLocaleString()}</p>
            </div>
            <div className="flex w-full h-fit items-end gap-3.25 mt-c42">
              <div className=" w-c61-19 h-c61-19 ">
                <svg className="w-full h-full transform ">
                  <circle cx="30.1" cy="30.1" r={radius} stroke="#947FFF" strokeOpacity="0.40" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="30.1"
                    cy="30.1"
                    r={radius}
                    stroke="#947FFF"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (preload / 100) * circumference}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx="30.1"
                    cy="30.1"
                    r={radius}
                    stroke="#6A0DAD"
                    strokeOpacity="0.30"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progress / 100) * circumference}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
              <div className=" text-c10 space-y-0.5 font-MontserratMedium">
                <p className="text-6a0dad/60">Fully stocked</p>
                <p className="text-947fff">Average stocked</p>
                <p className="text-947fff/40">Low stock</p>
              </div>
            </div>
          </UsableCard>
        )}
      </div>
    </>
  );
}
