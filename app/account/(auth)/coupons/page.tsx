"use client"

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';    

export default function CouponsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/account">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Coupons</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No coupons available</h2>
          <p className="text-gray-500 mb-6">Check back later for exclusive deals and discounts</p>
          <Button 
            className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={() => window.location.href = '/'}
          >
            Browse Products
          </Button>
        </div>
      </div>
    </div>
  );
} 