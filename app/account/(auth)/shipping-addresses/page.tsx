"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for existing addresses
const existingAddresses = [
  {
    id: 1,
    name: "Chisom Ebube Chris",
    phone: "+234703456234",
    address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    isDefault: true
  },
  {
    id: 2,
    name: "Chisom Ebube Chris",
    phone: "+234703456234",
    address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    isDefault: false
  },
  {
    id: 3,
    name: "Chisom Ebube Chris",
    phone: "+234703456234",
    address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    isDefault: false
  },
  {
    id: 4,
    name: "Chisom Ebube Chris",
    phone: "+234703456234",
    address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
    isDefault: false
  }
];

export default function ShippingAddressesPage() {
  const [addresses, setAddresses] = useState(existingAddresses);
  const [selectedAddress, setSelectedAddress] = useState(1);

  const handleSelectAddress = (id: number) => {
    setSelectedAddress(id);
  };

  const handleEditAddress = (id: number, name: string) => {
    toast.info(`Edit address for ${name}`, {
      description: "This would open the edit address form.",
      duration: 2000,
    });
  };

  const handleDeleteAddress = (id: number, name: string) => {
    if (addresses.length <= 1) {
      toast.error("Cannot delete address", {
        description: "You must have at least one shipping address.",
        duration: 3000,
      });
      return;
    }

    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success(`Address deleted`, {
      description: `Removed ${name}'s address successfully.`,
      duration: 3000,
    });

    // If deleted address was selected, select the first remaining one
    if (selectedAddress === id) {
      const remainingAddresses = addresses.filter(addr => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setSelectedAddress(remainingAddresses[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="p-2 flex-shrink-0"
        >
          <Link href="/account">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Shipping addresses</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Address List */}
      <div className="p-4 space-y-4 pb-24">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`rounded-lg p-4 cursor-pointer transition-all ${
              selectedAddress === address.id
                ? 'bg-[#7C2AE8] text-white'
                : 'bg-white border border-gray-200'
            }`}
            onClick={() => handleSelectAddress(address.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                selectedAddress === address.id
                  ? 'bg-white border-white'
                  : 'border-gray-300'
              }`}>
                {selectedAddress === address.id && (
                  <Check className="w-4 h-4 text-[#7C2AE8]" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">{address.name}</div>
                <div className="text-sm mb-1 opacity-90">{address.phone}</div>
                <div className="text-sm opacity-90">{address.address}</div>
                
                {/* Edit and Delete buttons */}
                <div className="flex gap-4 mt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address.id, address.name);
                    }}
                    className={`text-sm font-medium ${
                      selectedAddress === address.id ? 'text-white' : 'text-orange-500'
                    }`}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id, address.name);
                    }}
                    className="text-sm font-medium text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Add Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Link href="/account/shipping-addresses/add">
          <Button className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-4 text-lg font-semibold rounded-lg h-14">
            + Add new address
          </Button>
        </Link>
      </div>
    </div>
  );
} 