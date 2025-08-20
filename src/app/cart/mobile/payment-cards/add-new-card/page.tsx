"use client";

import { useState } from "react";
import Image from "next/image";
import NavBack from "@/assets/icons/navBacksmall.png";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import SaveCard from "@/assets/mobile/cards/saveCard.png";

export default function CardForm() {
  const [isDefault, setIsDefault] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setIsDefault((prev) => !prev);
  };

  return (
    <div className="w-full bg-white  px-6">
      <div className="pb-7 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Payment methods
          </p>
        </button>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-c12 font-MontserratSemiBold mb-2">
            Card number
          </label>
          <input
            type="number"
            name="name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-ff715b outline-none"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-c12 font-MontserratSemiBold mb-2">
            Name on card
          </label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ff715b outline-none"
            required
          />
        </div>

        {/* Expiry & CVV in Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-c12 font-MontserratSemiBold mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ff715b outline-none"
              required
            />
          </div>

          <div>
            <label className="bloc ktext-c12 font-MontserratSemiBold mb-2">
              CVV
            </label>
            <input
              type="password"
              name="cvv"
              placeholder="123"
              maxLength={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ff715b outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-c12 font-MontserratSemiBold">
            Save card details
          </span>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative w-11.5 h-6 flex items-center rounded-full transition-colors duration-300 ${
              isDefault ? "bg-ff715b" : "bg-gray-300"
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-md"
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                x: isDefault ? "24px" : "0px",
              }}
            />
          </button>
        </div>
      </form>
      <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <Button type="button" className="border-0 h-12 flex items-center gap-3">
          <Image src={SaveCard} alt="save card" width={21.14} height={15.1} />
          <span className="text-c12 font-MontserratSemiBold"> Save card</span>
        </Button>
      </div>
    </div>
  );
}
