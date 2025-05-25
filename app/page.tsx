"use client";

import Header from "@/components/martaf/Header";
import Footer from "@/components/martaf/Footer";
import { ProductCard } from "@/components/martaf/ProductCard";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Reusable category circle component
const CategoryCircle = ({ name, icon, onClick }: { name: string; icon: string; onClick: () => void }) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onClick}>
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
      <Image src={icon} alt={name} fill className="object-cover" />
    </div>
    <span className="text-xs font-medium text-gray-700">{name}</span>
  </div>
);

const categories = [
  { name: "Fashion", icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", slug: "fashion" },
  { name: "Electronics", icon: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", slug: "electronics" },
  { name: "Home & living", icon: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", slug: "home-living" },
  { name: "Beauty", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", slug: "beauty" },
];

const products = [
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
  const router = useRouter();
  const [displayedProducts, setDisplayedProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFavorite = (productId: string) => {
    console.log(`Added product ${productId} to favorites`);
  };

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
      if (displayedProducts.length > 24) {
        setHasMore(false);
      }
    }, 1500);
  };

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

  return (
    <div className="bg-[#faf9fb] min-h-screen flex flex-col">
      <Header />
      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center w-full rounded-lg px-4 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6C1EB1] shadow-md bg-white border-0">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            className="ml-2 w-full outline-none border-0 bg-transparent"
            placeholder="Search for products"
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
                onClick={() => handleCategoryClick(cat.slug)}
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
              onClick={() => handleProductClick(product.id)}
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
              onClick={() => handleProductClick(product.id)}
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
                onClick={() => handleProductClick(product.id)}
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
