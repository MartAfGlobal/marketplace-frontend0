"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const orderNumber = "MTF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = "May 26 - Jun 05, 2024";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b">
        <h1 className="text-lg font-semibold">Order Confirmation</h1>
      </div>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Order Number</span>
            <span className="font-semibold text-gray-900">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Delivery</span>
            <span className="font-semibold text-gray-900 text-sm">{estimatedDelivery}</span>
          </div>
        </div>

        {/* Status Steps */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600">Order Placed</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-600">Processing</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-600">Shipped</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Button className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-3 text-lg font-semibold rounded-lg">
            Track Your Order
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full py-3 text-lg font-semibold rounded-lg border-gray-300">
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            A confirmation email has been sent to your email address.
          </p>
          <p className="text-sm text-gray-500">
            Need help? <Link href="/support" className="text-[#FF715B] font-medium">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 