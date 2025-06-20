"use client";

import Footer from "@/components/martaf/Footer";
import Header from "@/components/martaf/Header";
import { ProductCard } from "@/components/martaf/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, ChevronUp, ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect, useCallback, use } from "react";
import { apiService, Product, Category } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

// Category icon mapping (similar to homepage)
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Electronics and tech
  if (name.includes('electronic') || name.includes('phone') || name.includes('mobile') || name.includes('bluetooth')) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";
  }
  
  // Fashion and textiles
  if (name.includes('textile') || name.includes('apparel') || name.includes('wear') || name.includes('fashion') || name.includes('clothing')) {
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";
  }
  
  // Footwear and leather
  if (name.includes('footwear') || name.includes('shoes') || name.includes('leather')) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
  }
  
  // Agriculture and farming
  if (name.includes('agricultural') || name.includes('farm') || name.includes('crop') || name.includes('seed')) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";
  }
  
  // Plastic and furniture
  if (name.includes('plastic') || name.includes('chair') || name.includes('furniture')) {
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80";
  }
  
  // Wood and timber
  if (name.includes('timber') || name.includes('wood') || name.includes('lumber')) {
    return "https://images.unsplash.com/photo-1500740516770-92bd004b996e?auto=format&fit=crop&w=800&q=80";
  }
  
  // Building and construction
  if (name.includes('building') || name.includes('construction') || name.includes('cement') || name.includes('brick')) {
    return "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80";
  }
  
  // Ceramics and pottery
  if (name.includes('ceramic') || name.includes('pottery') || name.includes('clay')) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80";
  }
  
  // Personal care and beauty
  if (name.includes('personal care') || name.includes('beauty') || name.includes('cosmetic') || name.includes('skincare')) {
    return "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
  }
  
  // Sports and fitness
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym') || name.includes('exercise')) {
    return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80";
  }
  
  // Books and education
  if (name.includes('book') || name.includes('education') || name.includes('learning') || name.includes('study')) {
    return "https://images.unsplash.com/photo-1481627834876-b7833e8f570?auto=format&fit=crop&w=800&q=80";
  }
  
  // Toys and children
  if (name.includes('toy') || name.includes('child') || name.includes('kid') || name.includes('baby')) {
    return "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80";
  }
  
  // Automotive
  if (name.includes('automotive') || name.includes('car') || name.includes('vehicle') || name.includes('auto')) {
    return "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80";
  }
  
  // Home and living
  if (name.includes('home') || name.includes('living') || name.includes('household') || name.includes('kitchen')) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
  }
  
  // Default icon if no match found
  return "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80";
};

// Desktop Product Card Component
const DesktopProductCard = ({ 
  product, 
  isFavorited, 
  isLoadingFavorite, 
  onFavorite, 
  onAddToCart, 
  isAddingToCart 
}: {
  product: any;
  isFavorited: boolean;
  isLoadingFavorite: boolean;
  onFavorite: () => void;
  onAddToCart: (id: string) => Promise<void>;
  isAddingToCart: boolean;
}) => {
  const handleAddToCart = async () => {
    try {
      await onAddToCart(product.id);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{Math.floor(Math.random() * 30 + 10)}%
        </span>
      </div>
      
      {/* Favorite Button */}
      <button
        onClick={onFavorite}
        disabled={isLoadingFavorite}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <Heart 
          className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${isLoadingFavorite ? 'animate-pulse' : ''}`} 
        />
      </button>

      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-1">Free shipping</div>
        <h3 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">₦{product.price.toLocaleString()}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {isAddingToCart ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  // Unwrap the params Promise
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug;

  // Add to cart function
  const handleAddToCart = async (productId: string) => {
    setAddingToCart(prev => new Set([...prev, productId]));

    try {
      await addToCartContext(productId, 1);
    } catch (error) {
      console.error("Add to cart failed:", error);
      throw error;
    } finally {
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
    
    if (loadingWishlist.has(id)) {
      return;
    }

    setLoadingWishlist(prev => new Set([...prev, id]));

    try {
      if (wishlistItems.has(id)) {
        await apiService.removeFromWishlist(id);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Removed from wishlist");
      } else {
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

  // Load more products with proper infinite scroll
  const loadMoreProducts = useCallback(async () => {
    // Don't load more if there are no products, we're already loading, no more products, no category, or there's an error
    if (isLoading || !hasMore || !currentCategory || displayedProducts.length === 0 || error) return;
    
    setIsLoading(true);
    try {
      await fetchProducts(searchQuery, currentPage + 1, false);
    } catch (error) {
      console.error("Failed to load more products:", error);
    }
    setIsLoading(false);
  }, [isLoading, hasMore, searchQuery, currentPage, currentCategory, displayedProducts.length, error]);

  // Fetch products from API for the current category
  const fetchProducts = async (search?: string, page: number = 1, resetProducts: boolean = true) => {
    if (!currentCategory) return;

    try {
      setError(null);
      
      const products = await apiService.getProducts({
        search,
        category: currentCategory.slug,
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
        rating: 4,
      }));

      if (resetProducts || page === 1) {
        setProducts(products);
        setDisplayedProducts(newProducts);
      } else {
        setProducts((prev: any[]) => [...prev, ...products]);
        setDisplayedProducts((prev: any[]) => [...prev, ...newProducts]);
      }
      
      const hasMoreData = products.length >= 10;
      setHasMore(hasMoreData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
      
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

  // Find current category and fetch data
  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);
      try {
        // Fetch all categories to find the current one
        const categories = await apiService.getCategories();
        setAllCategories(categories);
        
        // Find the category by slug
        const category = categories.find(cat => cat.slug === categorySlug);
        
        if (category) {
          setCurrentCategory(category);
          // Fetch products for this category
          await fetchProducts();
        } else {
          setError("Category not found");
        }
      } catch (error) {
        console.error("Failed to load category data:", error);
        setError("Failed to load category. Please try again later.");
      }
      setIsPageLoading(false);
    };

    loadPageData();
  }, [categorySlug]);

  // Load wishlist when authentication state changes
  useEffect(() => {
    if (!authLoading) {
      loadWishlist();
    }
  }, [authLoading, loadWishlist]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Don't trigger infinite scroll if there are no products or if we're in an error state
      if (displayedProducts.length === 0 || error) {
        return;
      }
      
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts, displayedProducts.length, error]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="animate-pulse flex-1">
        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:block">
          {/* Breadcrumb Skeleton */}
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <span>›</span>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Hero Banner Skeleton */}
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
          
          {/* Product Sections Skeleton */}
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Layout Skeleton */}
        <div className="lg:hidden">
          <div className="px-4 py-3">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="px-4 mb-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="px-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
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

  if (error && !currentCategory) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage 
            message={error} 
            retry={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden lg:block flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link 
              href="/"
              className="hover:text-gray-800"
            >
              Building materials
            </Link>
            <span>›</span>
            <span className="text-gray-800">{currentCategory?.name || 'Home Appliance'}</span>
          </div>
        </div>

        {/* Hero Banner */}
        {currentCategory && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
            <div className="rounded-xl overflow-hidden w-full h-48 relative flex items-center justify-center" 
                 style={{
                   backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${getCategoryIcon(currentCategory.name)})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}>
              <div className="text-center z-10 relative">
                <div className="text-4xl font-bold text-white uppercase tracking-wider">
                  {currentCategory.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Sections */}
        {error ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ErrorMessage 
              message={error} 
              retry={() => fetchProducts(searchQuery, 1, true)}
            />
          </div>
        ) : displayedProducts.length === 0 && !isLoading ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <EmptyState 
              message={searchQuery ? `No products found for "${searchQuery}" in ${currentCategory?.name}` : `No products available in ${currentCategory?.name}`} 
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Today's deals */}
            {displayedProducts.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Today's deals</h2>
                  <Link href="#" className="text-orange-500 text-sm font-medium hover:text-orange-600">View more</Link>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {displayedProducts.slice(0, 6).map((product) => (
                    <DesktopProductCard
                      key={product.id}
                      product={product}
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

            {/* Best sellers */}
            {displayedProducts.length > 6 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Best sellers</h2>
                  <Link href="#" className="text-orange-500 text-sm font-medium hover:text-orange-600">View more</Link>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {displayedProducts.slice(6, 12).map((product) => (
                    <DesktopProductCard
                      key={product.id}
                      product={product}
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

            {/* Promotional Banners */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Red Banner */}
              <div className="bg-red-500 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -translate-y-8 translate-x-8 opacity-80"></div>
                <div className="relative z-10">
                  <div className="text-white text-xs font-semibold mb-1">EXCLUSIVE WEARS</div>
                  <div className="text-white text-2xl font-bold mb-2">HOT DEALS</div>
                  <div className="text-white text-sm mb-4">UPTO 50% DISCOUNT</div>
                  <button className="bg-white text-red-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Show Now
                  </button>
                </div>
                <div className="absolute bottom-0 right-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Man in suit"
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Blue Banner */}
              <div className="bg-blue-600 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -translate-y-8 translate-x-8 opacity-80"></div>
                <div className="relative z-10">
                  <div className="text-white text-xs font-semibold mb-1">EXCLUSIVE WEARS</div>
                  <div className="text-white text-2xl font-bold mb-2">HOT DEALS</div>
                  <div className="text-white text-sm mb-4">UPTO 50% DISCOUNT</div>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Show Now
                  </button>
                </div>
                <div className="absolute bottom-0 right-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Man in suit"
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* More to love */}
            {displayedProducts.length > 12 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">More to love</h2>
                  <Link href="#" className="text-orange-500 text-sm font-medium hover:text-orange-600">View more</Link>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {displayedProducts.slice(12, 18).map((product) => (
                    <DesktopProductCard
                      key={product.id}
                      product={product}
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

            {/* Additional promotional banners at bottom */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Red Banner */}
              <div className="bg-red-500 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -translate-y-8 translate-x-8 opacity-80"></div>
                <div className="relative z-10">
                  <div className="text-white text-xs font-semibold mb-1">EXCLUSIVE WEARS</div>
                  <div className="text-white text-2xl font-bold mb-2">HOT DEALS</div>
                  <div className="text-white text-sm mb-4">UPTO 50% DISCOUNT</div>
                  <button className="bg-white text-red-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Show Now
                  </button>
                </div>
                <div className="absolute bottom-0 right-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Man in suit"
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Blue Banner */}
              <div className="bg-blue-600 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -translate-y-8 translate-x-8 opacity-80"></div>
                <div className="relative z-10">
                  <div className="text-white text-xs font-semibold mb-1">EXCLUSIVE WEARS</div>
                  <div className="text-white text-2xl font-bold mb-2">HOT DEALS</div>
                  <div className="text-white text-sm mb-4">UPTO 50% DISCOUNT</div>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Show Now
                  </button>
                </div>
                <div className="absolute bottom-0 right-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Man in suit"
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
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
      </div>

      {/* Mobile Layout - Keep existing mobile design */}
      <div className="lg:hidden flex-1 bg-[#faf9fb]">
        {/* Back button */}
        <div className="px-4 py-3 bg-white border-b">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3">
          <div className="flex items-center w-full rounded-lg px-4 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6C1EB1] bg-white">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              className="ml-2 w-full outline-none border-0 bg-transparent"
              placeholder={`Search in ${currentCategory?.name || 'category'}`}
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

        {/* Breadcrumb */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link 
              href="/"
              className="hover:text-gray-800"
            >
              Home
            </Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">{currentCategory?.name}</span>
          </div>
        </div>

        {/* Category Header */}
        {currentCategory && (
          <div className="px-4 py-4">
            <div className="rounded-xl overflow-hidden w-full h-32 relative flex items-center justify-between" 
                 style={{
                   backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${getCategoryIcon(currentCategory.name)})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}>
              <div className="flex-1 p-4 z-10 relative">
                <div className="text-xs font-semibold text-white mb-1">EXPLORE</div>
                <div className="text-2xl font-bold text-white mb-1">{currentCategory.name}</div>
                <div className="text-xs text-white mb-2">Discover amazing products in this category</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Products */}
        {error ? (
          <div className="px-4">
            <ErrorMessage 
              message={error} 
              retry={() => fetchProducts(searchQuery, 1, true)}
            />
          </div>
        ) : displayedProducts.length === 0 && !isLoading ? (
          <div className="px-4">
            <EmptyState 
              message={searchQuery ? `No products found for "${searchQuery}" in ${currentCategory?.name}` : `No products available in ${currentCategory?.name}`} 
            />
          </div>
        ) : (
          <>
            {/* Featured products */}
            {displayedProducts.length > 0 && (
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold">Featured in {currentCategory?.name}</div>
                  <Link href="#" className="text-[#7C2AE8] text-xs font-medium">View more</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold">More in {currentCategory?.name}</div>
                  <Link href="#" className="text-[#7C2AE8] text-xs font-medium">View more</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-semibold">All products</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 bg-[#7C2AE8] text-white p-3 rounded-full shadow-lg hover:bg-[#6B46C1] transition-all duration-300 hover:scale-110 lg:bottom-6 
          w-12 h-12 lg:w-auto lg:h-auto
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