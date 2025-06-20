"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data
const shippingAddresses = [
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
    name: "John Doe",
    phone: "+234801234567",
    address: "Plot 123, Gwarinpa Estate, Abuja, FCT, Nigeria, 900108",
    isDefault: false
  }
];

const paymentMethods = [
  {
    id: 1,
    type: "card",
    last4: "7167",
    provider: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
  },
  {
    id: 2,
    type: "card",
    last4: "7167",
    provider: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
  },
  {
    id: 3,
    type: "card",
    last4: "7167",
    provider: "American Express",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
  },
  {
    id: 4,
    type: "wallet",
    name: "Pay with Flutterwave",
    logo: "https://flutterwave.com/images/logo/full.svg"
  },
  {
    id: 5,
    type: "wallet",
    name: "Pay with Paystack",
    logo: "https://paystack.com/assets/img/logo/paystack-logo-blue.svg"
  }
];

const orderItems = [
  {
    id: 1,
    name: "Nike shoes with white an.",
    description: "Two piece shop",
    size: "2PC, Black",
    price: 14000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    shipping: "Free shipping",
    deliveryEstimate: "May 26 - Jun 05"
  },
  {
    id: 2,
    name: "Nike shoes with white an.",
    description: "Two piece shop",
    size: "2PC, Black",
    price: 14000,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    shipping: "Free shipping",
    deliveryEstimate: "May 26 - Jun 05"
  }
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [showMoreAddresses, setShowMoreAddresses] = useState(false);
  const [showMorePayments, setShowMorePayments] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(false);
  const [errors, setErrors] = useState<{address?: string; payment?: string}>({});
  const [items, setItems] = useState(orderItems);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Update quantity function
  const updateQuantity = (id: number, change: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + change);
    
    // Don't update if trying to go below 1
    if (item.quantity === 1 && change < 0) {
      toast.warning("Minimum quantity is 1", {
        duration: 2000,
      });
      return;
    }
    
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity }
        : item
    ));
    
    // Show success toast for quantity updates
    if (change > 0) {
      toast.success(`Increased quantity to ${newQuantity}`, {
        duration: 1500,
      });
    } else {
      toast.success(`Decreased quantity to ${newQuantity}`, {
        duration: 1500,
      });
    }
  };

  // Calculate totals based on current items state
  const totalItems = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 5500;
  const subtotal = totalItems - discount;

  const validateForm = () => {
    const newErrors: {address?: string; payment?: string} = {};
    
    if (!selectedAddress) {
      newErrors.address = "Please select a shipping address";
    }
    
    if (!selectedPayment) {
      newErrors.payment = "Please select a payment method";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      setIsPlacingOrder(true);
      
      // Simulate order processing
      setTimeout(() => {
        // Handle order placement
        toast.success("Order placed successfully! 🎉", {
          description: "Redirecting to order confirmation...",
          duration: 2000,
        });
        console.log("Order placed successfully!");
        
        // Redirect to order success page after a short delay
        setTimeout(() => {
          window.location.href = '/order-success';
        }, 2000);
      }, 1500);
    } else {
      toast.error("Please complete all required fields", {
        description: "Make sure you've selected a shipping address and payment method.",
        duration: 3000,
      });
    }
  };

  const visibleAddresses = showMoreAddresses ? shippingAddresses : shippingAddresses.slice(0, 2);
  const visiblePayments = showMorePayments ? paymentMethods : paymentMethods.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/cart">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Checkout</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Shipping Address Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <Link href="/account/shipping-addresses">
              <button className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {visibleAddresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAddress === address.id
                    ? 'bg-[#7C2AE8] border-[#7C2AE8] text-white'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedAddress === address.id
                      ? 'bg-white border-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAddress === address.id && (
                      <div className="w-3 h-3 bg-[#7C2AE8] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{address.name}</div>
                    <div className="text-sm mb-1">{address.phone}</div>
                    <div className="text-sm">{address.address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shippingAddresses.length > 2 && (
            <button
              className="text-[#FF715B] text-sm font-medium mt-3"
              onClick={() => setShowMoreAddresses(!showMoreAddresses)}
            >
              {showMoreAddresses ? 'See less' : 'See more'}
            </button>
          )}

          {errors.address && (
            <p className="text-red-500 text-sm mt-2">{errors.address}</p>
          )}
        </div>

        {/* Payment Method Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Payment method</h2>
            <Link href="/account/payment-methods/add">
              <button className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center hover:bg-[#ff4d2d] transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {visiblePayments.map((payment) => (
              <div
                key={payment.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPayment === payment.id
                    ? 'border-[#FF715B] bg-[#FF715B]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPayment(payment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === payment.id
                        ? 'border-[#FF715B]'
                        : 'border-gray-300'
                    }`}>
                      {selectedPayment === payment.id && (
                        <div className="w-3 h-3 bg-[#FF715B] rounded-full"></div>
                      )}
                    </div>
                                         <div>
                       {payment.type === 'card' ? (
                         <span className="font-medium">
                           272080••••••{payment.last4}
                         </span>
                       ) : (
                         <span className="font-medium">{payment.name}</span>
                       )}
                     </div>
                  </div>
                  <div className="h-6 w-12 relative">
                    <Image
                      src={payment.logo}
                      alt={payment.provider || payment.name || ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {paymentMethods.length > 3 && (
            <Link href="/account/payment-methods">
              <button className="text-[#FF715B] text-sm font-medium mt-3">
                See more
              </button>
            </Link>
          )}

          {errors.payment && (
            <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
          )}
        </div>

        {/* Orders List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Orders list ({items.length})</h2>
            <button
              className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center"
              onClick={() => setExpandedOrders(!expandedOrders)}
            >
              {expandedOrders ? (
                <Minus className="w-5 h-5 text-white" />
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedOrders ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
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
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-green-600">{item.shipping}</div>
                        <div className="text-xs text-gray-500">Delivery estimate: {item.deliveryEstimate}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total items</span>
              <span>₦{totalItems.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discounts</span>
              <span className="text-[#FF715B]">-₦{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Total and Place Order Section */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">Total</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₦{subtotal.toLocaleString()}</span>
                <span className="text-sm text-gray-500 line-through">₦{totalItems.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white px-8 py-4 text-lg font-semibold rounded-lg h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? "Processing..." : "Place order"}
          </Button>
        </div>
      </div>
    </div>
  );
} 