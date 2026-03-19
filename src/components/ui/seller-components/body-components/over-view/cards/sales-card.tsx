"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import UsableCard from "./cardUse";
import RedPointerIcon from "@/assets/Seller/redPointer.svg";
import WhitePointerIcon from "@/assets/Seller/WhitePointer.svg?component";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SalesCard() {
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
    const product = useSelector((state: RootState) =>state.sellerProduct.product);

  const targets = [75, 15];
  const [progresses, setProgresses] = useState<number[]>(targets.map(() => 0));

  useEffect(() => {
    let start = [...progresses];

    const interval = setInterval(() => {
      let done = true;

      start = start.map((value, index) => {
        if (value < targets[index]) {
          done = false;
          return value + 1;
        }
        return value;
      });

      setProgresses([...start]);

      if (done) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isIncomplete ? (
        <UsableCard title="Sales">
          <div className="mt-4">
            <div className="flex gap-2.75 text-000000/10 mb-9">
              <p className="flex gap-2.5 items-center">
                <span className="text-c18 font-MontserratMedium">$</span>
                <span className="text-5xl font-MontserratSemiBold">0</span>
              </p>
              <div className=" h-fit mt-3">
                <WhitePointerIcon className="w-4 h-2.25  " />
              </div>
            </div>

         
            {["Anker shoes", "Ankara dress"].map((label, index) => (
              <div
                key={label}
                className={`mt-${index === 0 ? 1 : 1} w-full`}
              >
                <div className="flex justify-between w-full max-w-66 text-000000/10">
                  <span className="text-c10 font-MontserratMedium">
                    No data
                  </span>
                  <span className="text-c10 font-MontserratMedium">0%</span>
                </div>
                <div className="relative w-full h-2 rounded-c4 bg-black/5 overflow-hidden">
                  <div
                    className="h-2 rounded-c4 transition-all duration-100 ease-out"
                    style={{
                      width: `0%`,
                      background:
                        progresses[index] < 50
                          ? `linear-gradient(0deg, #947FFF, #947FFF), linear-gradient(0deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.32))`
                          : `linear-gradient(0deg, #6A0DAD, #6A0DAD), linear-gradient(0deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.32))`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </UsableCard>
      ) : (
        <UsableCard title="Sales">
          <div className="flex gap-2.75">
            <p className="flex gap-2.5 items-center">
              <span className="text-c18 font-MontserratMedium">$</span>
              <span className="text-5xl font-MontserratSemiBold">350,000</span>
            </p>
            <div className="flex flex-col">
              <Image
                src={RedPointerIcon}
                alt="error pointer"
                width={16.5}
                height={9}
                className="mt-4"
              />
            </div>
          </div>

          {/* Render progress bars dynamically */}
          {["Anker shoes", "Ankara dress"].map((label, index) => (
            <div key={label} className={`mt-${index === 0 ? 9 : 4} w-full`}>
              <div className="flex justify-between w-full max-w-66">
                <span className="text-base font-MontserratMedium">{label}</span>
                <span className="text-c10 font-MontserratMedium">
                  {progresses[index]}%
                </span>
              </div>

              <div className="relative w-full h-2 rounded-c4 bg-black/5 overflow-hidden">
                <div
                  className="h-2 rounded-c4 transition-all duration-100 ease-out"
                  style={{
                    width: `${progresses[index]}%`,
                    background:
                      progresses[index] < 50
                        ? `linear-gradient(0deg, #947FFF, #947FFF), linear-gradient(0deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.32))`
                        : `linear-gradient(0deg, #6A0DAD, #6A0DAD), linear-gradient(0deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.32))`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </UsableCard>
      )}
    </>
  );
}
