"use client";

import { useState, useEffect } from "react";
import Header from "@/components/martaf/Header";
import HeroSection from "@/components/martaf/HeroSection";
import Categories from "@/components/martaf/Categories";
import TrendingProducts from "@/components/martaf/TrendingProducts";
import PopularSearches from "@/components/martaf/PopularSearches";
import DiscountItems from "@/components/martaf/DiscountItems";
import WhyChooseMartaf from "@/components/martaf/WhyChooseMartaf";
import ImpactNumbers from "@/components/martaf/ImpactNumbers";
import JoinMartaf from "@/components/martaf/JoinMartaf";
import Footer from "@/components/martaf/Footer";

export default function Landing() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      // Simulate API call for landing page data
      await new Promise(resolve => setTimeout(resolve, 1400));
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex flex-col min-h-screen">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-[#6B46C1] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded"></div>
              <div className="w-16 h-4 bg-white/20 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="w-6 h-6 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col gap-8 p-4">
          {/* Hero Section Skeleton */}
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Categories Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Sections Skeleton */}
          {[...Array(3)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Why Choose Section Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Numbers Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Section Skeleton */}
          <div className="space-y-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </main>

        {/* Footer Skeleton */}
        <div className="bg-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
        </div>
      </div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col gap-8">
        <HeroSection />
        <Categories />
        <TrendingProducts />
        <PopularSearches />
        <DiscountItems />
        <WhyChooseMartaf />
        <ImpactNumbers />
        <JoinMartaf />
      </main>
      <Footer />
    </div>
  );
}
