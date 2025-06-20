"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ChevronUp, Minus, Plus, Check, X, Settings, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/api';

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

// Loading component for cart items
const CartItemSkeleton = () => (
  <div className="p-4 border-b animate-pulse">
    <div className="flex gap-3">
      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CartPage() {
  const { cart, isLoading, error, updateQuantity, removeItem, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Handle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    
    // Update select all state
    if (cart?.items) {
      setSelectAll(newSelected.size === cart.items.length);
    }
  };

  const toggleSelectAll = () => {
    if (!cart?.items) return;
    
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const updateItemQuantity = async (itemId: string, change: number) => {
    const item = cart?.items.find(item => item.id === itemId);
    if (!item) return;
    
    const newQuantity = Math.max(0, item.quantity + change);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const getItemPrice = (item: CartItem) => {
    const price = item.product.discount_price || item.product.price;
    return parseFloat(price);
  };

  const getItemImage = (item: CartItem) => {
    // Use actual product image if available
    if (item.product.images_data && item.product.images_data.length > 0) {
      return item.product.images_data[0].image_urls.medium || item.product.images_data[0].image_urls.original;
    }
    
    // Fallback to product-specific placeholder image based on product name/category
    const productName = item.product_name.toLowerCase();
    
    if (productName.includes('chair') || productName.includes('furniture')) {
      return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80";
    }
    if (productName.includes('shoe') || productName.includes('footwear')) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
    }
    if (productName.includes('gown') || productName.includes('dress') || productName.includes('apparel')) {
      return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80";
    }
    if (productName.includes('phone') || productName.includes('electronic')) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80";
    }
    if (productName.includes('bag') || productName.includes('leather')) {
      return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80";
    }
    
    // Default product placeholder
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
  };

  const getVariationText = (item: CartItem) => {
    if (!item.variation) return 'Standard';
    
    const parts = [];
    if (item.variation.size) parts.push(item.variation.size);
    if (item.variation.color) parts.push(item.variation.color);
    return parts.length > 0 ? parts.join(', ') : 'Standard';
  };

  // Calculate totals for selected items
  const selectedCartItems = cart?.items.filter(item => selectedItems.has(item.id)) || [];
  const selectedTotalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedSubtotal = selectedCartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = 0; // You can implement discount logic here
  const estimatedTotal = selectedSubtotal - discount;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">My Cart</h1>
        </div>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Select all</span>
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          {[...Array(5)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">My Cart</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">My Cart (0)</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6 0L19 8" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link href="/">
              <Button className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Cart Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">My Cart ({cart.items.length})</h1>
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
        <div className="flex items-center gap-2">
          <button 
            onClick={clearCart}
            className="text-red-600 text-sm"
          >
            Clear Cart
          </button>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Cart Items - Scrollable area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {cart.items.map((item) => (
          <div key={item.id} className="p-4 border-b">
            <div className="flex gap-3">
              <div className="mt-1">
                <CircularCheckbox
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                />
              </div>
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getItemImage(item)}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{item.product_name}</h3>
                <p className="text-xs text-gray-500 mb-1">Product ID: {item.product.id}</p>
                <p className="text-xs text-gray-600 mb-2 bg-gray-100 w-fit p-1.5 rounded-lg">
                  {getVariationText(item)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.formatted_subtotal}</span>
                    {item.product.discount_price && item.product.discount_price !== item.product.price && (
                      <span className="text-xs text-gray-400 line-through">₦{parseFloat(item.product.price).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-neutral-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 text-xs mt-2 hover:underline"
                >
                  Remove
                </button>
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
                {discount > 0 && (
                  <div className="text-xs text-[#FF715B] line-through">₦{selectedSubtotal.toLocaleString()}</div>
                )}
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
                disabled={selectedItems.size === 0}
              >
                Checkout ({selectedItems.size})
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
              {/* Selected Product Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedCartItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getItemImage(item)}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {selectedCartItems.length > 6 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-medium">+{selectedCartItems.length - 6}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total items ({selectedTotalItems})</span>
                  <span>₦{selectedSubtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discounts</span>
                    <span className="text-[#FF715B]">-₦{discount.toLocaleString()}</span>
                  </div>
                )}
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

              {/* Bottom Checkout Section */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <CircularCheckbox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  <span className="text-sm">All</span>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold">₦{estimatedTotal.toLocaleString()}</div>
                    {discount > 0 && (
                      <div className="text-xs text-[#FF715B] line-through">₦{selectedSubtotal.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <Link href="/checkout">
                  <Button 
                    className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-medium h-12"
                    disabled={selectedItems.size === 0}
                  >
                    Checkout ({selectedItems.size})
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