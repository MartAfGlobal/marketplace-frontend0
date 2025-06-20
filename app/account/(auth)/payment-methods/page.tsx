"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, User, Menu, Check, Plus, CreditCard, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

const paymentCards = [
  {
    id: 1,
    number: "272080******7167",
    provider: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
  },
  {
    id: 2,
    number: "534780******7167",
    provider: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
  },
  {
    id: 3,
    number: "272080******7167",
    provider: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
  },
  {
    id: 4,
    number: "272080******7167",
    provider: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
  },
  {
    id: 5,
    number: "534780******7167",
    provider: "American Express",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
  }
];

export default function PaymentMethodsPage() {
  const [selectedCard, setSelectedCard] = useState(1);

  const handleSelectCard = (id: number) => {
    setSelectedCard(id);
    const selected = paymentCards.find(method => method.id === id);
    if (selected) {
      toast.success(`Selected ${selected.provider} card ending in ${selected.number.slice(-4)}`);
      // Navigation will be handled by parent component or redirect
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Link href="/account">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Payment methods</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Payment Cards List */}
      <div className="px-4 py-6 space-y-4">
        {paymentCards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between py-4 px-4 cursor-pointer bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => handleSelectCard(card.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedCard === card.id
                  ? 'bg-[#FF715B] border-[#FF715B]'
                  : 'border-gray-300'
              }`}>
                {selectedCard === card.id && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-lg font-medium text-black">{card.number}</span>
            </div>
            <div className="h-8 w-16 relative">
              <Image
                src={card.logo}
                alt={card.provider}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Card Section */}
      <div className="px-4 py-6 pb-24">
        <Link href="/account/payment-methods/add">
          <div className="border-2 border-[#FF715B] rounded-xl p-6 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-black">Add a new card</span>
              <div className="flex items-center gap-3">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  width={32}
                  height={32}
                  className="h-6 w-10 object-contain"
                />
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width={32}
                  height={32}
                  className="h-6 w-10 object-contain"
                />
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                  alt="American Express"
                  width={32}
                  height={32}
                  className="h-6 w-16 object-contain"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <Button
          className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-6 text-lg font-semibold rounded-xl h-14"
        >
          Use selected card
        </Button>
      </div>
    </div>
  );
} 