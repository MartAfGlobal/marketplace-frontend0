"use client";

import Footer from "@/components/martaf/Footer";
import { ProductCard } from "@/components/martaf/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, Product } from "@/lib/api";
import { toast } from "sonner";

// Reusable category circle component
const CategoryCircle = ({ name, icon, href }: { name: string; icon: string; href: string }) => (
  <Link href={href} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
      <Image src={icon} alt={name} fill className="object-cover" />
    </div>
    <span className="text-xs font-medium text-gray-700">{name}</span>
  </Link>
);

const categories = [
  { name: "Fashion", icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", slug: "fashion" },
  { name: "Electronics", icon: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", slug: "electronics" },
  { name: "Home & living", icon: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", slug: "home-living" },
  { name: "Beauty", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", slug: "beauty" },
];

// Fallback products for when API is not available
const fallbackProducts = [
  { id: "1", name: "Diamond Earrings", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
  { id: "2", name: "Yellow Heels", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
  { id: "3", name: "Diamond Earrings", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
  { id: "4", name: "Trendy Caps", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 3 },
  { id: "5", name: "Leather Wallet", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
  { id: "6", name: "Trendy Caps", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 3 },
  { id: "7", name: "Leather Wallet", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
  { id: "8", name: "Yellow Heels", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", price: 40.00, rating: 4 },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFavorite = (productId: string | number) => {
    console.log(`Added product ${productId} to favorites`);
  };

  // Load more products
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    await fetchProducts(searchQuery, currentPage + 1);
    setIsLoading(false);
  };

  // Fetch products from API
  const fetchProducts = async (search?: string, page: number = 1) => {
    try {
      const response = await apiService.getProducts({
        search,
        is_active: true,
        page
      });
      
      if (page === 1) {
        setProducts(response.results);
        setDisplayedProducts(response.results.map(p => ({
          id: p.id.toString(),
          name: p.name,
          image: p.images?.[0]?.image || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
          price: Number(p.discount_price || p.price),
          rating: 4 // Default rating since API doesn't provide this
        })));
      } else {
        const newProducts = response.results.map(p => ({
          id: p.id.toString(),
          name: p.name,
          image: p.images?.[0]?.image || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
          price: Number(p.discount_price || p.price),
          rating: 4
        }));
        setDisplayedProducts((prev: any[]) => [...prev, ...newProducts]);
      }
      
      setHasMore(!!response.next);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Use fallback products if API fails
      if (page === 1) {
        setDisplayedProducts(fallbackProducts);
      }
      toast.error("Failed to load products. Showing sample products.");
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setCurrentPage(1);
    await fetchProducts(query, 1);
    setIsLoading(false);
  };

  // Initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);
      await fetchProducts();
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-[#faf9fb] min-h-screen flex flex-col">
      <div className="animate-pulse">

        {/* Search Bar Skeleton */}
        <div className="px-4 py-3">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Banner Skeleton */}
        <div className="px-4 mb-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="px-4 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Sections Skeleton */}
        {[...Array(2)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="px-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
    <div className="bg-[#faf9fb] min-h-screen flex flex-col">
      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center w-full rounded-lg px-4 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6C1EB1] shadow-md bg-white border-0">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            className="ml-2 w-full outline-none border-0 bg-transparent"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
          />
        </div>
      </div>
      {/* Banner */}
      <div className="px-4 mb-4">
        <div className="rounded-xl overflow-hidden w-full h-32 relative flex items-center justify-between bg-gradient-to-r from-[#ff715b] to-[#ffb347]">
          <div className="flex-1 p-4">
            <div className="text-xs font-semibold text-white mb-1">EXCLUSIVE WEARS</div>
            <div className="text-2xl font-bold text-white mb-1">HOT DEALS</div>
            <div className="text-xs text-white mb-2">UPTO <span className="bg-yellow-300 text-black px-1 rounded">20%</span> DISCOUNT</div>
            <button className="bg-white text-[#ff715b] rounded px-4 py-1 text-sm font-semibold">Shop now</button>
          </div>
          <div className="h-full w-24 relative hidden sm:block">
            <Image src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Banner suit" fill className="object-cover" />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="text-lg font-semibold mb-3">Explore popular categories</div>
        <div className="flex gap-4 overflow-x-auto pb-2 rounded">
          {categories.map((cat) => (
            <div key={cat.name}>
              <CategoryCircle 
                name={cat.name} 
                icon={cat.icon} 
                href={`/categories/${cat.slug}`}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Product recommendations */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">We think you'd love this</div>
          <a href="#" className="text-[#7C2AE8] text-xs font-medium">View more</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {displayedProducts.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onFavorite={() => handleFavorite(product.id)}
            />
          ))}
        </div>
      </div>
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">More to love</div>
          <a href="#" className="text-[#7C2AE8] text-xs font-medium">View more</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {displayedProducts.slice(4, 8).map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onFavorite={() => handleFavorite(product.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Additional Products Section */}
      {displayedProducts.length > 8 && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-semibold">More products</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {displayedProducts.slice(8).map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onFavorite={() => handleFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      )}

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
      <Footer />
    </div>
  );
}
