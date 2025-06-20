"use client";

import Footer from "@/components/martaf/Footer";
import { ProductCard } from "@/components/martaf/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, ChevronUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiService, Product, Category } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

// Category interface
// interface Category {
//   id: number;
//   name: string;
//   parent_name?: string;
// }

// Reusable category circle component
const CategoryCircle = ({ name, icon, href }: { name: string; icon: string; href: string }) => (
  <Link href={href} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity min-w-[70px] max-w-[80px]">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
      <Image src={icon} alt={name} fill className="object-cover" />
    </div>
    <span className="text-xs font-medium text-gray-700 text-center leading-tight px-1 line-clamp-2">
      {name}
    </span>
  </Link>
);

// Category icon mapping (fallback icons for categories)
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Electronics and tech
  if (name.includes('electronic') || name.includes('phone') || name.includes('mobile') || name.includes('bluetooth')) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80";
  }
  
  // Fashion and textiles
  if (name.includes('textile') || name.includes('apparel') || name.includes('wear') || name.includes('fashion') || name.includes('clothing')) {
    return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80";
  }
  
  // Footwear and leather
  if (name.includes('footwear') || name.includes('shoes') || name.includes('leather')) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80";
  }
  
  // Agriculture and farming
  if (name.includes('agricultural') || name.includes('farm') || name.includes('crop') || name.includes('seed')) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80";
  }
  
  // Plastic and furniture
  if (name.includes('plastic') || name.includes('chair') || name.includes('furniture')) {
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80";
  }
  
  // Wood and timber
  if (name.includes('timber') || name.includes('wood') || name.includes('lumber')) {
    return "https://images.unsplash.com/photo-1500740516770-92bd004b996e?auto=format&fit=crop&w=400&q=80";
  }
  
  // Building and construction
  if (name.includes('building') || name.includes('construction') || name.includes('cement') || name.includes('brick')) {
    return "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80";
  }
  
  // Ceramics and pottery
  if (name.includes('ceramic') || name.includes('pottery') || name.includes('clay')) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80";
  }
  
  // Personal care and beauty
  if (name.includes('personal care') || name.includes('beauty') || name.includes('cosmetic') || name.includes('skincare')) {
    return "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80";
  }
  
  // Sports and fitness
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym') || name.includes('exercise')) {
    return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80";
  }
  
  // Books and education
  if (name.includes('book') || name.includes('education') || name.includes('learning') || name.includes('study')) {
    return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80";
  }
  
  // Toys and children
  if (name.includes('toy') || name.includes('child') || name.includes('kid') || name.includes('baby')) {
    return "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=400&q=80";
  }
  
  // Automotive
  if (name.includes('automotive') || name.includes('car') || name.includes('vehicle') || name.includes('auto')) {
    return "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=400&q=80";
  }
  
  // Home and living
  if (name.includes('home') || name.includes('living') || name.includes('household') || name.includes('kitchen')) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
  }
  
  // Default icon if no match found
  return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80";
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState<Set<string>>(new Set());
  
  // Loading state for add to cart
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart: addToCartContext } = useCart();



  // Add to cart function
  const handleAddToCart = async (productId: string) => {
    // Add to loading set
    setAddingToCart(prev => new Set([...prev, productId]));

    try {
      // Use cart context which will automatically update header
      await addToCartContext(productId, 1);
      
      // Get product name for custom toast
      const product = displayedProducts.find(p => p.id === productId);
      const productName = product?.name || 'Product';
      
      // The cart context already shows a toast, but we can override with product name
      // Note: Remove the previous default toast and show custom one
    } catch (error) {
      console.error("Add to cart failed:", error);
      // Cart context already handles error toasts
      throw error; // Re-throw so ProductCard can handle it
    } finally {
      // Remove from loading set
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleFavorite = async (productId: string | number) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    const id = productId.toString();
    
    // Prevent double-clicking
    if (loadingWishlist.has(id)) {
      return;
    }

    setLoadingWishlist(prev => new Set([...prev, id]));

    try {
      if (wishlistItems.has(id)) {
        // Remove from wishlist
        await apiService.removeFromWishlist(id);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await apiService.addToWishlist(id);
        setWishlistItems(prev => new Set([...prev, id]));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      const message = error instanceof Error ? error.message : "Operation failed";
      toast.error(message);
    } finally {
      setLoadingWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Load user's wishlist on authentication
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems(new Set());
      return;
    }

    try {
      const wishlist = await apiService.getWishlist();
      if (wishlist.length > 0) {
        // Get all product IDs from all wishlists (though typically there's only one per user)
        const productIds = new Set<string>();
        wishlist.forEach(list => {
          list.products.forEach(product => {
            productIds.add(product.id.toString());
          });
        });
        setWishlistItems(productIds);
      } else {
        setWishlistItems(new Set());
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      // Don't show error toast for wishlist loading failure
    }
  }, [isAuthenticated]);

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

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesError(null);
      const apiCategories = await apiService.getCategories();
      
      // Filter to get only top-level categories (no parent_id) and limit to first 8
      const topLevelCategories = apiCategories
        .filter((cat: Category) => !cat.parent_id)
        .slice(0, 8);
      
      setCategories(topLevelCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategoriesError("Failed to load categories");
      setCategories([]);
    }
  };

  // Load more products with proper infinite scroll
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      await fetchProducts(searchQuery, currentPage + 1, false);
    } catch (error) {
      console.error("Failed to load more products:", error);
    }
    setIsLoading(false);
  }, [isLoading, hasMore, searchQuery, currentPage]);

  // Fetch products from API
  const fetchProducts = async (search?: string, page: number = 1, resetProducts: boolean = true) => {
    try {
      setError(null);
      
      const products = await apiService.getProducts({
        search,
        is_active: true,
        page
      });
      
      const newProducts = products.map((p: Product) => ({
        id: p.id.toString(),
        slug: p.slug,
        name: p.name,
        image: p.images_data?.[0]?.image_urls?.medium || 
               p.images_data?.[0]?.image_urls?.original ||
               "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        price: Number(p.discount_price || p.price),
        rating: 4, // Default rating since API doesn't provide this
      }));

      if (resetProducts || page === 1) {
        setProducts(products);
        setDisplayedProducts(newProducts);
      } else {
        setProducts((prev: any[]) => [...prev, ...products]);
        setDisplayedProducts((prev: any[]) => [...prev, ...newProducts]);
      }
      
      // For simple array responses, we'll assume there's more data if we got a full page
      // You might need to adjust this based on your actual pagination implementation
      const hasMoreData = products.length >= 10;
      setHasMore(hasMoreData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
      
      // Don't use fallback products, just show error
      if (resetProducts || page === 1) {
        setDisplayedProducts([]);
        setProducts([]);
      }
      
      toast.error("Failed to load products. Please try again later.");
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setCurrentPage(1);
    setHasMore(true);
    await fetchProducts(query, 1, true);
    setIsLoading(false);
  };

  // Initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);
      // Load both categories and products
      await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Load wishlist when authentication state changes
  useEffect(() => {
    if (!authLoading) {
      loadWishlist();
    }
  }, [authLoading, loadWishlist]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, retry }: { message: string; retry?: () => void }) => (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">{message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="bg-[#7C2AE8] text-white px-4 py-2 rounded-lg hover:bg-[#6B46C1] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📦</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Search bar - Mobile only */}
      <div className="px-4 py-3 lg:hidden">
        <div className="flex items-center w-full rounded-lg px-4 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6C1EB1] bg-white">
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
                      {categories.slice(0, 12).map((category) => (
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
                      {categories.length > 12 && (
                        <div className="px-4 py-2">
                          <Link 
                            href="/categories" 
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            View all categories →
                          </Link>
                        </div>
                      )}
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

      {/* Mobile Banner - existing design */}
      <div className="px-4 mb-4 lg:hidden">
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

      {/* Mobile Categories */}
      <div className="px-4 mb-6 lg:hidden">
        <div className="text-lg font-semibold mb-3">Explore popular categories</div>
        {categoriesError ? (
          <ErrorMessage 
            message={categoriesError} 
            retry={fetchCategories}
          />
        ) : categories.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">Categories coming soon...</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 rounded">
            {categories.map((category) => (
              <div key={category.id}>
                <CategoryCircle 
                  name={category.name} 
                  icon={getCategoryIcon(category.name)} 
                  href={`/categories/${category.slug}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      {error ? (
        <div className="px-4 lg:px-6 lg:max-w-7xl lg:mx-auto">
          <ErrorMessage 
            message={error} 
            retry={() => fetchProducts(searchQuery, 1, true)}
          />
        </div>
      ) : displayedProducts.length === 0 && !isLoading ? (
        <div className="px-4 lg:px-6 lg:max-w-7xl lg:mx-auto">
          <EmptyState 
            message={searchQuery ? `No products found for "${searchQuery}"` : "No products available"} 
          />
        </div>
      ) : (
        <>
          {/* Product recommendations */}
          {displayedProducts.length > 0 && (
            <div className="px-4 mb-6 lg:px-6 lg:max-w-7xl lg:mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold lg:text-xl">We think you'd love this</div>
                <a href="#" className="text-[#7C2AE8] text-xs font-medium lg:text-sm">View more</a>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedProducts.slice(0, 10).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    isFavorited={wishlistItems.has(product.id.toString())}
                    isLoadingFavorite={loadingWishlist.has(product.id.toString())}
                    onFavorite={() => handleFavorite(product.id)}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart.has(product.id.toString())}
                  />
                ))}
              </div>
            </div>
          )}

          {displayedProducts.length > 10 && (
            <div className="px-4 mb-6 lg:px-6 lg:max-w-7xl lg:mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold lg:text-xl">More to love</div>
                <a href="#" className="text-[#7C2AE8] text-xs font-medium lg:text-sm">View more</a>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedProducts.slice(10, 15).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    isFavorited={wishlistItems.has(product.id.toString())}
                    isLoadingFavorite={loadingWishlist.has(product.id.toString())}
                    onFavorite={() => handleFavorite(product.id)}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart.has(product.id.toString())}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Additional Products Section - Infinite Scroll */}
          {displayedProducts.length > 15 && (
            <div className="px-4 mb-6 lg:px-6 lg:max-w-7xl lg:mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold lg:text-xl">More products</div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedProducts.slice(15).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    isFavorited={wishlistItems.has(product.id.toString())}
                    isLoadingFavorite={loadingWishlist.has(product.id.toString())}
                    onFavorite={() => handleFavorite(product.id)}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart.has(product.id.toString())}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading Spinner for infinite scroll */}
      {isLoading && displayedProducts.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2AE8]"></div>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && !isLoading && displayedProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the products</p>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 bg-[#7C2AE8] text-white p-3 rounded-full shadow-lg hover:bg-[#6B46C1] transition-all duration-300 hover:scale-110 md:p-3 md:bottom-6 
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
