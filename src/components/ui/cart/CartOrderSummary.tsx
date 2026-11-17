"use client";

import Image from "next/image";

import padlock from "@/assets/icons/padlock.png";
import ShildCheck from "@/assets/icons/ShieldCheck.png";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CartOrderSummaryProps {
  totalPrice: number;
  selectedCount: number;
  checkoutGuarding: boolean;
  loading: boolean;
  onCheckout: () => void;
}

export default function CartOrderSummary({
  totalPrice,
  selectedCount,
  checkoutGuarding,
  loading,
  onCheckout,
}: CartOrderSummaryProps) {
  return (
    <div className="hidden md:flex w-full max-w-105">
      <div className="w-full">
        <h1 className="text-sm font-MontserratSemiBold mb-3">Order Summary</h1>
        <div className="space-y-2 text-sm font-MontserratNormal h-23 border-b border-b-000000/10">
          <div className="flex justify-between">
            <p>Total items:</p>
            <p>₦{totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount:</p>
            <p className="text-ca0202">0</p>
          </div>
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>₦{totalPrice}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-c32 border-b border-b-000000/10 pt-4">
          <div className="w-full max-w-60">
            <p>Total:</p>
            <p className="text-c10 font-MontserratNormal leading-4">
              Please refer to your final actual payment amount.
            </p>
          </div>
          <p className="text-c32 font-MontserratSemiBold">₦{totalPrice}</p>
        </div>
        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0 || checkoutGuarding}
          className="border-0"
        >
          {checkoutGuarding || loading ? (
            <LoadingSpinner />
          ) : (
            <>Proceed ({selectedCount})</>
          )}
        </Button>
        <div className="space-y-2.5 mt-c32">
          <div className="flex items-center gap-2">
            <Image src={ShildCheck} alt="shild check" width={20} height={20} />
            <p className="text-c12 font-MontserratSemiBold">Secure payments</p>
          </div>
          <p className="text-c12 font-MontserratNormal leading-4">
            Every payment you make on MartAf is secured with strict SSL
            encryption and PCI DSS data protection protocols
          </p>
        </div>
        <div className="space-y-2.5 mt-4">
          <div className="flex items-center gap-2">
            <Image src={padlock} alt="shild check" width={20} height={20} />
            <p className="text-c12 font-MontserratSemiBold">Secure privacy</p>
          </div>
          <p className="text-c12 font-MontserratNormal leading-4">
            Protecting your privacy is important to us! We will only use your
            information in accordance with our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
