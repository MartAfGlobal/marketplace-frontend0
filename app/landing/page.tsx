"use client";

import { useState, useEffect } from "react";
import { ChevronUp, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/martaf/HeroSection";
import TrendingProducts from "@/components/martaf/TrendingProducts";
import PopularSearches from "@/components/martaf/PopularSearches";
import DiscountItems from "@/components/martaf/DiscountItems";
import WhyChooseMartaf from "@/components/martaf/WhyChooseMartaf";
import ImpactNumbers from "@/components/martaf/ImpactNumbers";
import JoinMartaf from "@/components/martaf/JoinMartaf";
import Footer from "@/components/martaf/Footer";
import { apiService, Category } from "@/lib/api";

// Category icon mapping function
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('electronic') || name.includes('phone') || name.includes('mobile') || name.includes('bluetooth')) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('textile') || name.includes('apparel') || name.includes('wear') || name.includes('fashion') || name.includes('clothing')) {
    return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('footwear') || name.includes('shoes') || name.includes('leather')) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes('agricultural') || name.includes('farm') || name.includes('crop') || name.includes('seed')) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80";
  }
  
  return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80";
};

export default function Landing() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoriesError(null);
      const apiCategories = await apiService.getCategories();
      const topLevelCategories = apiCategories
        .filter((cat: Category) => !cat.parent_id)
        .slice(0, 12);
      setCategories(topLevelCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategoriesError("Failed to load categories");
      setCategories([]);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    // Handle search functionality
    console.log("Searching for:", query);
  };

  // Simulate initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      await Promise.all([
        fetchCategories(),
        new Promise(resolve => setTimeout(resolve, 1400))
      ]);
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex flex-col min-h-screen">
      <div className="animate-pulse">
        

        <main className="flex-1 flex flex-col gap-8 p-4">
          {/* Desktop Layout Skeleton */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="col-span-9">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          
          {/* Mobile Hero Skeleton */}
          <div className="lg:hidden">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </main>
      </div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col gap-8">
        {/* Desktop Layout - Category Sidebar + Hero Section */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="grid grid-cols-12 gap-6">
              {/* LEFT SIDEBAR - Categories */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg">
                  <div className="p-4 bg-purple-50">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Categories
                    </h2>
                  </div>
                  <div className="py-2 bg-purple-50">
                    {categoriesError ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Failed to load categories
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Loading categories...
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <Image 
                                src={getCategoryIcon(category.name)} 
                                alt={category.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-purple-700 transition-colors">
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Hero Section */}
              <div className="col-span-9">
                <div className="bg-white rounded-2xl overflow-hidden relative min-h-[400px]">
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 to-transparent"></div>
                  <div className="absolute top-10 right-20 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 left-20 w-24 h-24 bg-orange-100/30 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 p-8 lg:p-12 flex items-center min-h-[400px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                      {/* Left - Text Content */}
                      <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                          Discover the
                          <span className="block text-gray-800">best of Africa</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          Explore a world of quality products across Africa at Martaf. From electronics to fashion and home goods, we offer something for everyone.
                        </p>
                        
                        {/* Two Buttons */}
                        <div className="flex gap-4">
                          <button className="border-2 border-orange-500 text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors">
                            Become a seller
                          </button>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                            </svg>
                            Shop now
                          </button>
                        </div>
                      </div>
                      
                      {/* Right - Illustration */}
                      <div className="relative flex justify-center items-center">
                        <div className="relative w-full max-w-sm">
                          {/* Main illustration container */}
                          <div className="relative z-10">
                            <Image
                              src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEyL3M5Ny1tay01MjY2LW1vY2t1cC5qcGc.jpg"
                              alt="African woman with shopping bags in traditional attire"
                              width={600}
                              height={600}
                              className="w-full h-auto object-contain mix-blend-multiply"
                              priority
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Hero Section */}
        <div className="lg:hidden">
          <HeroSection />
        </div>
        
        <TrendingProducts />
        <PopularSearches />
        <DiscountItems />
        <WhyChooseMartaf />
        <ImpactNumbers />
        <JoinMartaf />
      </main>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-50 bg-[#7C2AE8] text-white p-3 rounded-full shadow-lg hover:bg-[#6B46C1] transition-all duration-300 hover:scale-110 
          /* Mobile optimizations */
          w-12 h-12 md:w-auto md:h-auto
          flex items-center justify-center
          active:scale-95 
          touch-manipulation"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
      
      <Footer />
    </div>
  );
}
