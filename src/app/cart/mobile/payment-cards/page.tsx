"use client";

import { useState } from "react";
import Image from "next/image";

import NavBack from "@/assets/icons/navBacksmall.png";
import GoodMark from "@/assets/mobile/good.png";
import VisaLogo from "@/assets/mobile/cards/visa.png";
import Master from "@/assets/mobile/cards/master.png";
import flutterwave from "@/assets/mobile/cards/flutterwave_logo.png";
import American from "@/assets/mobile/cards/american-express.png";
import Paystack from "@/assets/mobile/cards/paystack.png";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";

type AtmCardProps = {
  id: number;
  accountNumber: string;
  logo: any; // You can type as StaticImageData if using Next images
};

const initialCards: AtmCardProps[] = [
  { id: 1, accountNumber: "272080******7167", logo: Master },
  { id: 2, accountNumber: "509876******4412", logo: VisaLogo },
  { id: 3, accountNumber: "377982******3321", logo: flutterwave },
  { id: 4, accountNumber: "456098******1189", logo: American },
  { id: 5, accountNumber: "876543******1200", logo: Paystack },
];

export default function MobileCards() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="px-6">
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
      <div className="space-y-4 pb-40">
        {initialCards.slice(0, 5).map((card) => (
          <div
            key={card.id}
            className="flex items-center h-13 justify-between p-3 rounded-xl border border-gray-200 bg-white circle-shadow shadow-sm"
          >
            {/* Check button */}
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
            <span className="text-c12 font-MontserratSemiBold text-000000 flex-1 ml-3">
              {card.accountNumber}
            </span>

            {/* Card Logo */}
            <Image
              src={card.logo}
              alt="card logo"
              width={40}
              height={24}
              className="object-contain"
            />
          </div>
        ))}

        <button
          onClick={() => router.push("/cart/mobile/payment-cards/add-new-card")}
          className="w-full mt-6  flex flex-col items-start py-3 px-6 gap-2 rounded-c8 text-ff715b border border-ff715b"
        >
          <span className="text-c12 font-MontserratSemiBold text-left">
            Add a new card
          </span>
          <span className="flex items-center gap-2.5">
            <Image src={Master} alt="visa" width={24} height={14.8} />
            <Image src={VisaLogo} alt="visa" width={32} height={18.35} />
            <Image src={American} alt="visa" width={85.5} height={5.41} />
          </span>
        </button>
      </div>

      <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <Button type="button" className="border-0">
          Use selected card
        </Button>
      </div>
    </div>
  );
}
