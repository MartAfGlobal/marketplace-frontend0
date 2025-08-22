"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GoodMark from "@/assets/mobile/good.png";
import VisaLogo from "@/assets/mobile/cards/visa.png";
import Master from "@/assets/mobile/cards/master.png";
import flutterwave from "@/assets/mobile/cards/flutterwave_logo.png";
import American from "@/assets/mobile/cards/american-express.png";
import Paystack from "@/assets/mobile/cards/paystack.png";
import {useRouter} from "next/navigation";

type AtmCardProps = {
  id: number;
  accountNumber: string;
  logo: any; // Next.js image type
};

const initialCards: AtmCardProps[] = [
  { id: 1, accountNumber: "272080******7167", logo: Master },
  { id: 2, accountNumber: "509876******4412", logo: VisaLogo },
  { id: 3, accountNumber: "377982******3321", logo: flutterwave },
  { id: 4, accountNumber: "456098******1189", logo: American },
  { id: 5, accountNumber: "876543******1200", logo: Paystack },
];

// Different entry directions
const directions = [
  { x: -50, y: 0 }, // left
  { x: 50, y: 0 }, // right
  { x: 0, y: -50 }, // top
  { x: 0, y: 50 }, // bottom
];

export default function MobileCards() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-6 pt-3">
      <div className="flex justify-between mt-7 md:hidden">
        <p className="text-c12 font-MontserratSemiBold ">Payment method</p>
        <button onClick={() => router.push("/dashboard/buyer/mobile/payment-cards/add-address")} className="rounded-full bg-ff715b text-ffffff w-c32 h-c32">
          +
        </button>
      </div>

      {initialCards.slice(0, 5).map((card, index) => {
        const dir = directions[index % directions.length];

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, ...dir }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setSelectedCardId(card.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedCardId === card.id
                    ? "bg-ff715b border-ff715b"
                    : "border-black/20 bg-transparent"
                }`}
              >
                {selectedCardId === card.id && (
                  <Image src={GoodMark} alt="checked" width={10} height={8} />
                )}
              </button>

              {/* Account Number */}
              <span className="text-c12 font-MontserratSemiBold ">
                {card.accountNumber}
              </span>
            </div>

            {/* Card Logo */}
            <Image
              src={card.logo}
              alt="card logo"
              width={40}
              height={24}
              className="object-contain"
            />
          </motion.div>
        );
      })}

      {/* See more button */}
      <div className="w-full flex justify-end pb-4">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-c12 font-MontserratSemiBold text-ff715b"
          onClick={() => router.push("/dashboard/buyer/mobile/payment-cards")}
        >
          See More
        </motion.button>
      </div>
    </div>
  );
}
