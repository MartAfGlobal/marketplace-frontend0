"use client"

import React from 'react';
import { ArrowLeft, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/account">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Sellers</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No sellers followed</h2>
          <p className="text-gray-500 mb-6">Follow your favorite sellers to stay updated on their latest products</p>
          <Button 
            className="bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={() => window.location.href = '/'}
          >
            Discover Sellers
          </Button>
        </div>
      </div>
    </div>
  );
} 