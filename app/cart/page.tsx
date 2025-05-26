"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArrowLeft, ChevronUp, Minus, Plus, Filter, Check, X, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Sample cart data
const cartItems = [
  {
    id: 1,
    name: "Nike shoes with white an.",
    description: "Two piece shop",
    size: "2PC, Black",
    price: 14000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 2,
    name: "Nike shoes with white an.",
    description: "Two piece shop",
    size: "2PC, Black",
    price: 14000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    selected: true
  },
  {
    id: 3,
    name: "Nike shoes with white an.",
    description: "Two piece shop",
    size: "2PC, Black",
    price: 14000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 4,
    name: "Adidas running shoes",
    description: "Sports collection",
    size: "Size 42, White",
    price: 18500,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 5,
    name: "Casual sneakers",
    description: "Everyday wear",
    size: "Size 40, Blue",
    price: 12000,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=400&q=80",
    selected: true
  },
  {
    id: 6,
    name: "Basketball shoes",
    description: "High performance",
    size: "Size 44, Red",
    price: 22000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 7,
    name: "Leather boots",
    description: "Premium quality",
    size: "Size 41, Brown",
    price: 35000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 8,
    name: "Canvas shoes",
    description: "Casual style",
    size: "Size 39, Pink",
    price: 8500,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80",
    selected: true
  },
  {
    id: 9,
    name: "Running trainers",
    description: "Athletic wear",
    size: "Size 43, Gray",
    price: 16000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 10,
    name: "Formal shoes",
    description: "Business attire",
    size: "Size 42, Black",
    price: 28000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 11,
    name: "Hiking boots",
    description: "Outdoor gear",
    size: "Size 45, Green",
    price: 32000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    selected: true
  },
  {
    id: 12,
    name: "Slip-on shoes",
    description: "Comfort wear",
    size: "Size 40, Navy",
    price: 11000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 13,
    name: "High-top sneakers",
    description: "Street style",
    size: "Size 41, White",
    price: 19500,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80",
    selected: false
  },
  {
    id: 14,
    name: "Sandals",
    description: "Summer collection",
    size: "Size 38, Tan",
    price: 7500,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=400&q=80",
    selected: true
  },
  {
    id: 15,
    name: "Work boots",
    description: "Safety footwear",
    size: "Size 44, Steel",
    price: 25000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80",
    selected: false
  }
];

const checkoutImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=100&q=80"
];

// Custom circular checkbox component
const CircularCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
      checked 
        ? 'bg-[#FF715B] border-[#FF715B] text-white' 
        : 'border-gray-300 bg-white'
    }`}
  >
    {checked && <Check className="w-3 h-3" />}
  </button>
);

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [selectAll, setSelectAll] = useState(false);

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const toggleItemSelection = (id: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, selected: !item.selected }
        : item
    ));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems(items.map(item => ({ ...item, selected: newSelectAll })));
  };

  const selectedItems = items.filter(item => item.selected);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 5500;
  const estimatedTotal = subtotal - discount;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Cart Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">My Cart ({items.length})</h1>
      </div>

      {/* Select All */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <CircularCheckbox
            checked={selectAll}
            onChange={toggleSelectAll}
          />
          <span className="text-sm font-medium">Select all</span>
        </div>
        <Settings className="w-5 h-5 text-gray-400" />
      </div>

      {/* Cart Items - Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {items.map((item) => (
          <div key={item.id} className="p-4 border-b">
            <div className="flex gap-3">
              <div className="mt-1">
                <CircularCheckbox
                  checked={item.selected}
                  onChange={() => toggleItemSelection(item.id)}
                />
              </div>
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{item.description}</p>
                <p className="text-xs text-gray-600 mb-2 bg-gray-100 w-fit p-1.5 rounded-lg">{item.size}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">₦{item.price.toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-neutral-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Checkout Section */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <Drawer>
          {/* Checkout details header */}
          <div className="mb-3">
            <span className="text-sm font-bold">Checkout details</span>
          </div>
          
          {/* Main checkout line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CircularCheckbox
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <span className="text-sm">All</span>
              <div className="flex flex-col">
                <div className="text-lg font-bold">₦{estimatedTotal.toLocaleString()}</div>
                <div className="text-xs text-[#FF715B] line-through">₦{subtotal.toLocaleString()}</div>
              </div>
              <DrawerTrigger asChild>
                <button className="p-1 ml-2">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </DrawerTrigger>
            </div>
            <Link href="/checkout">
              <Button 
                className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-medium h-12"
                disabled={selectedItems.length === 0}
              >
                Checkout ({selectedItems.length})
              </Button>
            </Link>
          </div>

          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader className="hidden">
              <DrawerTitle>Checkout details</DrawerTitle>
            </DrawerHeader>
            {/* Custom Header with X button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Checkout details</h2>
              <DrawerTrigger asChild>
                <button className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </DrawerTrigger>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Product Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {checkoutImages.map((image, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total items</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discounts</span>
                  <span className="text-[#FF715B]">-₦{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Subtotal</span>
                  <span>₦{estimatedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping fee</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Estimated total</span>
                  <span>₦{estimatedTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Bottom Checkout Section - Same as main */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <CircularCheckbox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-sm">All</span>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold">₦{estimatedTotal.toLocaleString()}</div>
                    <div className="text-xs text-[#FF715B] line-through">₦{subtotal.toLocaleString()}</div>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button 
                    className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-medium h-12"
                    disabled={selectedItems.length === 0}
                  >
                    Checkout ({selectedItems.length})
                  </Button>
                </Link>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
} 