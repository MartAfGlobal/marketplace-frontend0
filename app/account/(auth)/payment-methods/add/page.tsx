"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AddCardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (field: string, value: string) => {
    // Format card number with spaces
    if (field === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) { // Max 16 digits + 3 spaces
        setFormData(prev => ({ ...prev, [field]: formatted }));
      }
      return;
    }
    
    // Format expiry date as MM/YY
    if (field === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        setFormData(prev => ({ ...prev, [field]: formatted }));
      } else {
        setFormData(prev => ({ ...prev, [field]: cleaned }));
      }
      return;
    }
    
    // Limit CVV to 3-4 digits
    if (field === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        setFormData(prev => ({ ...prev, [field]: cleaned }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { cardNumber, nameOnCard, expiryDate, cvv } = formData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!nameOnCard.trim()) {
      toast.error('Please enter the name on card');
      return false;
    }
    
    if (!expiryDate || expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handleSaveCard = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Card added successfully!');
    } catch (error) {
      toast.error('Failed to add card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Link href="/account/payment-methods">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Add payment method</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 space-y-6">
        {/* Card Number */}
        <div className="space-y-3">
          <Label htmlFor="cardNumber" className="text-lg font-medium text-gray-700">
            Card number
          </Label>
          <Input
            id="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="h-14 text-lg border-gray-300 rounded-xl"
            disabled={isLoading}
          />
        </div>

        {/* Name on Card */}
        <div className="space-y-3">
          <Label htmlFor="nameOnCard" className="text-lg font-medium text-gray-700">
            Name on card
          </Label>
          <Input
            id="nameOnCard"
            type="text"
            value={formData.nameOnCard}
            onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
            placeholder="John Doe"
            className="h-14 text-lg border-gray-300 rounded-xl"
            disabled={isLoading}
          />
        </div>

        {/* MM/YY and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="expiryDate" className="text-lg font-medium text-gray-700">
              MM/YY
            </Label>
            <Input
              id="expiryDate"
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="12/25"
              className="h-14 text-lg border-gray-300 rounded-xl"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="cvv" className="text-lg font-medium text-gray-700">
              CVV
            </Label>
            <Input
              id="cvv"
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="123"
              className="h-14 text-lg border-gray-300 rounded-xl"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Save Card Details */}
        <div className="flex items-center justify-between py-4">
          <Label htmlFor="saveCard" className="text-lg font-medium text-gray-700">
            Save card details
          </Label>
          <Switch
            id="saveCard"
            checked={saveCardDetails}
            onCheckedChange={setSaveCardDetails}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <Button
          onClick={handleSaveCard}
          disabled={isLoading}
          className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-6 text-lg font-semibold rounded-xl h-14 disabled:opacity-50"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {isLoading ? 'Saving card...' : 'Save card'}
        </Button>
      </div>
    </div>
  );
} 