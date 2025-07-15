'use client';

import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CardFormData) => void;
}

export interface CardFormData {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvv: string;
}

export function AddCardModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = React.useState<CardFormData>({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (field: keyof CardFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-sm p-6 sm:p-8">
        <div className="relative">
          <h2 className="text-lg font-semibold mb-4">Add a new card</h2>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Card number</label>
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="•••• •••• •••• ••••"
              />
            </div>

            {/* Name on Card */}
            <div>
              <label className="block text-sm font-medium mb-1">Name on card</label>
              <input
                type="text"
                value={form.nameOnCard}
                onChange={(e) => handleChange('nameOnCard', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">MM/YY</label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="password"
                  value={form.cvv}
                  onChange={(e) => handleChange('cvv', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={handleSubmit}
          >
            Save card
          </Button>

         
        </div>
      </DialogContent>
    </Dialog>
  );
}
