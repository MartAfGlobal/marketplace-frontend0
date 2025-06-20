"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock order data
const orders = [
  {
    id: 1,
    status: 'on_way',
    title: 'Wireless Bluetooth Headphones with Noise Cancellation',
    description: 'Premium audio headphones',
    specifications: 'Black, Over-ear',
    price: '₦25,000',
    delivery: 'May 15, 2025',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    status: 'dispute',
    title: 'Vintage Leather Handbag for Women',
    description: 'Genuine leather shoulder bag',
    specifications: 'Brown, Medium size',
    price: '₦18,500',
    delivery: 'May 15, 2025',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    status: 'completed',
    title: 'Organic Cotton T-Shirt Pack (3-piece)',
    description: 'Comfortable casual wear',
    specifications: '3PC, Assorted colors',
    price: '₦12,000',
    delivery: 'Delivered',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    status: 'dispute',
    title: 'Smart Fitness Watch with Heart Rate Monitor',
    description: 'Health tracking smartwatch',
    specifications: 'Black, Silicone strap',
    price: '₦45,000',
    delivery: 'May 15, 2025',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    status: 'awaiting_payment',
    title: 'Professional Kitchen Knife Set',
    description: 'Stainless steel knives',
    specifications: '5PC, German steel',
    price: '₦35,000',
    delivery: 'Pending payment',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    status: 'to_ship',
    title: 'Luxury Scented Candle Collection',
    description: 'Aromatherapy candles',
    specifications: '4PC, Mixed scents',
    price: '₦15,500',
    delivery: 'Ready to ship',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    status: 'shipped',
    title: 'Gaming Mechanical Keyboard with RGB Lighting',
    description: 'Backlit gaming keyboard',
    specifications: 'RGB, Cherry MX switches',
    price: '₦28,000',
    delivery: 'May 20, 2025',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=400&q=80'
  }
];

// Mock product recommendations
const recommendations = [
  {
    id: 1,
    title: 'Handmade Ceramic Coffee Mug Set',
    price: '₦8,500',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  },
  {
    id: 2,
    title: 'Waterproof Hiking Backpack',
    price: '₦22,000',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  },
  {
    id: 3,
    title: 'Portable Bluetooth Speaker',
    price: '₦15,000',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  },
  {
    id: 4,
    title: 'Bamboo Cutting Board Set',
    price: '₦6,500',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  },
  {
    id: 5,
    title: 'Wireless Phone Charger Pad',
    price: '₦12,500',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  },
  {
    id: 6,
    title: 'Indoor Plant Care Kit',
    price: '₦9,800',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
    onSale: true,
    freeShipping: true
  }
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'awaiting_payment', label: 'Awaiting payment' },
  { key: 'to_ship', label: 'To ship(2)' },
  { key: 'shipped', label: 'Shipped(1)' },
  { key: 'processed', label: 'Processed(1)' }
];

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'on_way':
      return { text: 'Order on its way', color: 'text-blue-600' };
    case 'dispute':
      return { text: 'In dispute', color: 'text-red-600' };
    case 'completed':
      return { text: 'Completed', color: 'text-green-600' };
    case 'awaiting_payment':
      return { text: 'Awaiting payment', color: 'text-orange-600' };
    case 'to_ship':
      return { text: 'Ready to ship', color: 'text-purple-600' };
    case 'shipped':
      return { text: 'Shipped', color: 'text-blue-600' };
    default:
      return { text: 'Unknown', color: 'text-gray-600' };
  }
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState<typeof orders>([]);

  // Filter orders based on tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  // Further filter by search query
  const searchFilteredOrders = filteredOrders.filter(order => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      order.title.toLowerCase().includes(query) ||
      order.description.toLowerCase().includes(query) ||
      order.specifications.toLowerCase().includes(query) ||
      order.price.toLowerCase().includes(query)
    );
  });

  // Handle search with animation
  useEffect(() => {
    setIsSearching(true);
    
    const timer = setTimeout(() => {
      setDisplayedOrders(searchFilteredOrders);
      setIsSearching(false);
    }, 300); // Small delay for smooth transition

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Initialize displayed orders
  useEffect(() => {
    setDisplayedOrders(searchFilteredOrders);
  }, []);

  const handleTrackOrder = (orderId: number) => {
    // Navigation handled by Link wrapper
  };

  const handleConfirmDelivery = (orderId: number) => {
    toast.success(`Delivery confirmed for order #${orderId}`);
  };

  const handleSearchToggle = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery(''); // Clear search when closing
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setIsSearching(true);
    
    // Smooth transition for tab change
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-black">Orders</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={handleSearchToggle}
          >
            <Search className="w-6 h-6 text-gray-600" />
          </Button>
        </div>

        {/* Search Input */}
        <div className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${showSearchInput ? 'pt-4 pb-4 max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
              autoFocus={showSearchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Horizontally Scrollable Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide px-4 -mb-px scroll-smooth">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out relative touch-manipulation ${
                  activeTab === tab.key
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-gray-900'
                } ${index > 0 ? 'ml-2' : ''}`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200 ease-in-out"></div>
                )}
              </button>
            ))}
            {/* Add extra padding at the end for better scrolling */}
            <div className="flex-shrink-0 w-4"></div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-6 pb-8 relative min-h-[400px]">
        {/* Loading overlay */}
        {isSearching && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Filtering orders...</span>
            </div>
          </div>
        )}

        {/* Orders with staggered animation */}
        <div className={`space-y-4 transition-all duration-300 ease-in-out ${isSearching ? 'opacity-30 transform scale-[0.98]' : 'opacity-100 transform scale-100'}`}>
          {displayedOrders.map((order, index) => {
            const statusDisplay = getStatusDisplay(order.status);
            return (
              <Card 
                key={order.id} 
                className="p-4 bg-white shadow-sm border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-0.5"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: !isSearching ? 'fadeInUp 0.4s ease-out forwards' : 'none'
                }}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={order.image}
                      alt={order.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    {/* Status and Delivery - Better Alignment */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-sm font-medium ${statusDisplay.color} leading-tight`}>
                        {statusDisplay.text}
                      </span>
                      <span className="text-xs text-gray-500 text-right leading-tight ml-2">
                        Delivery: {order.delivery}
                      </span>
                    </div>

                    {/* Product Info - Improved Spacing */}
                    <div className="space-y-1 mb-4">
                      <h3 className="font-semibold text-black text-sm sm:text-base leading-tight line-clamp-2">
                        {order.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-tight">{order.description}</p>
                      <p className="text-xs text-gray-500 leading-tight">{order.specifications}</p>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold text-black mb-4">{order.price}</p>

                    {/* Action Buttons - Fixed Layout */}
                    <div className="flex gap-2 sm:gap-3">
                      <Link href="/track-order" className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 text-xs sm:text-sm border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium transition-colors duration-200"
                        >
                          Track order
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-xs sm:text-sm bg-[#FF715B] text-white hover:bg-[#ff4d2d] font-medium transition-colors duration-200"
                        onClick={() => handleConfirmDelivery(order.id)}
                      >
                        Confirm delivery
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {!isSearching && displayedOrders.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <p className="text-gray-500">
              {searchQuery ? `No orders found matching "${searchQuery}"` : 'No orders found for this category.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* More to love section */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-bold text-black mb-4">More to love</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {recommendations.map((product, index) => (
            <Card 
              key={product.id} 
              className="relative bg-white overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Sale Badge */}
                {product.onSale && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    On Sale
                  </div>
                )}
                
                {/* Wishlist Heart */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md">
                  <Heart className="w-4 h-4 text-gray-400 transition-colors duration-200 hover:text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-black mb-2 line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-black">{product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 