"use client"
import React from 'react'
import { Card } from '../ui/card';
import Image from 'next/image';
import { Heart } from 'lucide-react';
// Mock product recommendations
const recommendations = [
  {
    id: 1,
    title: "Handmade Ceramic Coffee Mug Set",
    price: "₦8,500",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80",
    onSale: true,
    freeShipping: true,
    rating: 4,
  },
  {
    id: 2,
    title: "Waterproof Hiking Backpack",
    price: "₦22,000",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    onSale: true,
    freeShipping: true,
    rating: 4,
  },
  {
    id: 3,
    title: "Portable Bluetooth Speaker",
    price: "₦15,000",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",
    onSale: true,
    freeShipping: true,
    rating: 3,
  },
  {
    id: 4,
    title: "Bamboo Cutting Board Set",
    price: "₦6,500",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
    onSale: true,
    freeShipping: true,
    rating: 5,
  },
  {
    id: 5,
    title: "Wireless Phone Charger Pad",
    price: "₦12,500",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80",
    onSale: false,
    freeShipping: true,
    rating: 4,
  },
  {
    id: 6,
    title: "Indoor Plant Care Kit",
    price: "₦9,800",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80",
    onSale: false,
    freeShipping: true,
    rating: 3,
  },
];

const MoreToLove = () => {
  return (
    <div>
      {/* More to love section */}
      <div className="px-4 md:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {recommendations.map((product, index) => (
            <Card
              key={product.id}
              className="relative bg-white overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-0"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.5s ease-out forwards",
              }}
            >
              {/* Product Image */}
              <div className="relative w-full h-40 rounded-t-md overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Sale Badge */}
                {product.onSale && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    On sale
                  </div>
                )}

                {/* Wishlist Heart */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md">
                  <Heart className="w-4 h-4 text-gray-400 transition-colors duration-200 hover:text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="px-2">
                {/* Star Rating */}
                <p className="text-xs text-gray-500 mb-1">Free shipping</p>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.1 3.386a1 1 0 00.95.69h3.57c.969 0 1.371 1.24.588 1.81l-2.89 2.1a1 1 0 00-.364 1.118l1.1 3.386c.3.921-.755 1.688-1.54 1.118l-2.89-2.1a1 1 0 00-1.176 0l-2.89 2.1c-.784.57-1.838-.197-1.539-1.118l1.1-3.386a1 1 0 00-.364-1.118L2.34 8.813c-.783-.57-.38-1.81.588-1.81h3.57a1 1 0 00.95-.69l1.1-3.386z" />
                    </svg>
                  ))}
                </div>

                {/* Shipping */}

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between pb-4">
                  <p className="text-lg font-bold text-black">
                    {product.price}
                  </p>
                  <button className="bg-[#FF715B] text-white w-9 h-9 rounded flex items-center justify-center transition-colors hover:bg-[#ff4d2d]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h2l.4 2M7 13h14l-1.5 8H6L3 6h18" />
                    </svg>
                  </button>
                </div>
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
  )
}

export default MoreToLove