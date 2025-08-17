"use client";
import { Button } from "../Button/Button";
import Image from "next/image";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";
import Counter from "../Button/Counter";

export default function ItemAddToCart() {
  const empty = "";

  return (
    <div className="w-full min-w-c386-58  shadow p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-c24 pb-c32 border-b border-gray-100">
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
            <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
               Sellern Location
            </p>
            <div className="flex gap-c24 font-MontserratSemiBold text-c12 text-ff715b">
              <button>Follow</button>
              <button>Send Message</button>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-start mt-">
          <div>
            <Image
              className="mt-1"
              src={truck}
              alt="truck"
              width={22.5}
              height={15.76}
            />
          </div>
          <div className=" flex flex-col gap-2">
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
              Claim a refund if your order doesn&apos;t ship, is missing, or arrives
              with product issues
            </p>
          </div>
        </div>
      </div>
      <Counter />
      <div className="space-y-c32">
        <Button className="bg-transparent border text-ff715b border-ff715b hover:bg-gray-50">
          Add to cart
        </Button>
        <Button>Buy now</Button>
      </div>
    </div>
  );
}
