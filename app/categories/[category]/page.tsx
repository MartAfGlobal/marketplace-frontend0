"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/martaf/ProductCard";
import { SearchIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/martaf/Header";
import Image from "next/image";

// Mock products data
const products = [
  { 
    id: "1", 
    name: "Diamond Earrings", 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "2", 
    name: "Yellow Heels", 
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "3", 
    name: "Diamond Earrings", 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "4", 
    name: "Trendy Caps", 
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 3,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "5", 
    name: "Leather Wallet", 
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "6", 
    name: "Trendy Caps", 
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 3,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "7", 
    name: "Leather Wallet", 
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
  { 
    id: "8", 
    name: "Yellow Heels", 
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", 
    price: 40.00, 
    rating: 4,
    badge: "On sale",
    freeShipping: true
  },
];

// Category name mapping
const categoryNames: { [key: string]: string } = {
  fashion: "Fashion & Apparel",
  electronics: "Electronics",
  "home-living": "Home & Living",
  beauty: "Beauty",
};

// Category background images
const categoryImages: { [key: string]: string } = {
  fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  "home-living": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const [displayedProducts, setDisplayedProducts] = useState(products.slice(0, 6));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Unwrap the params Promise
  const resolvedParams = use(params);
  const categoryName = categoryNames[resolvedParams.category] || "Category";
  const categoryImage = categoryImages[resolvedParams.category] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";

  // Simulate loading more products
  const loadMoreProducts = () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      
      // Create more products by duplicating with unique IDs
      const additionalProducts: typeof products = [];
      for (let i = 0; i < 4; i++) {
        const baseProduct = products[i % products.length];
        // Use timestamp and index to ensure unique keys
        const uniqueId = `${baseProduct.id}-${Date.now()}-${currentLength + i}`;
        additionalProducts.push({
          ...baseProduct,
          id: uniqueId,
        });
      }
      
      setDisplayedProducts(prev => [...prev, ...additionalProducts]);
      setIsLoading(false);
      
      // Stop loading after showing many products
      if (displayedProducts.length > 20) {
        setHasMore(false);
      }
    }, 1500);
  };

  // Simulate initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      // Simulate API call for category data
      await new Promise(resolve => setTimeout(resolve, 1100));
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Load more products when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedProducts.length, isLoading, hasMore]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFavorite = (productId: string) => {
    console.log(`Added product ${productId} to favorites`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="animate-pulse">

        {/* Search Bar Skeleton */}
        <div className="px-4 py-3 bg-white">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <span>›</span>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <span>›</span>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Hot Deals Banner Skeleton */}
        <div className="px-4 py-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Category Header Skeleton */}
        <div className="px-4 py-2">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Products Section Skeleton */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Search bar */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center w-full rounded-lg px-4 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6C1EB1] shadow-md border">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            className="ml-2 w-full outline-none"
            placeholder="Search for products"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-gray-800"
          >
            Home
          </button>
          <span>›</span>
          <button 
            onClick={() => router.push('/categories')}
            className="hover:text-gray-800"
          >
            All Categories
          </button>
          <span>›</span>
          <span className="text-gray-800 font-medium">{categoryName}</span>
        </div>
      </div>

      {/* Hot Deals Banner */}
      <div className="px-4 py-4">
        <div className="rounded-xl overflow-hidden w-full h-32 relative flex items-center justify-between bg-gradient-to-r from-[#ff715b] to-[#ffb347]">
          <div className="flex-1 p-4 z-10 relative">
            <div className="text-xs font-semibold text-white mb-1">EXCLUSIVE WEARS</div>
            <div className="text-2xl font-bold text-white mb-1">HOT DEALS</div>
            <div className="text-xs text-white mb-2">UPTO <span className="bg-yellow-300 text-black px-1 rounded">20%</span> DISCOUNT</div>
            <button className="bg-white text-[#ff715b] rounded px-4 py-1 text-sm font-semibold">Shop now</button>
          </div>
          <div className="h-full w-24 relative">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
              alt="Hot deals fashion"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#ff715b]/20"></div>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="px-4 py-2">
        <div className="w-full h-24 rounded-lg flex items-center justify-center relative overflow-hidden">
          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
          <h1 className="text-white text-xl font-bold z-10 relative">{categoryName}</h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Trending in {categoryName}</div>
          <button className="text-[#7C2AE8] text-sm font-medium">View more</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={product.badge}
              freeShipping={product.freeShipping}
              onFavorite={() => handleFavorite(product.id)}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>

        {/* Loading Spinner */}
        {(isLoading || hasMore) && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2AE8]"></div>
          </div>
        )}

        {/* End of products message */}
        {!hasMore && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end of the products</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
} 