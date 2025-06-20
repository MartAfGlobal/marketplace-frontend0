"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { apiService, Product } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

const TrendingProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  // Loading state for add to cart
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  // Add to cart function using cart context
  const handleAddToCart = async (productId: string) => {
    setAddingToCart(prev => new Set([...prev, productId]));

    try {
      // Use cart context which automatically updates header
      await addToCartContext(productId, 1);
      
      // Cart context already shows toast, but we can get product name for custom message
      const product = products.find(p => p.id === productId);
      const productName = product?.name || 'Product';
      
      // Note: Cart context already shows success toast
    } catch (error) {
      console.error("Add to cart failed:", error);
      // Cart context already handles error toasts
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

  // Fetch trending products from API
  const fetchTrendingProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await apiService.getProducts({
        is_active: true,
        page: 1
      });
      
      // Take first 5 products as trending and map them
      const trendingProducts = productsData.slice(0, 5).map((p: Product) => ({
        id: p.id.toString(),
        slug: p.slug,
        name: p.name,
        image: p.images_data?.[0]?.image_urls?.medium || 
               p.images_data?.[0]?.image_urls?.original ||
               "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        price: Number(p.discount_price || p.price),
        rating: 4, // Default rating since API doesn't provide this
      }));
      
      setProducts(trendingProducts);
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
      // Keep fallback products if API fails
      setProducts([
        {
          id: "1",
          name: "Diamond Earrings",
          image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
          price: 45000,
        },
        {
          id: "2",
          name: "Gold Ring",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
          price: 35000,
        },
        {
          id: "3",
          name: "Yellow Heels",
          image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
          price: 15000,
        },
        {
          id: "4",
          name: "Trendy Caps",
          image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
          price: 8500,
        },
        {
          id: "5",
          name: "Leather Wallet",
          image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
          price: 12000,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  // Load wishlist when authentication state changes
  useEffect(() => {
    if (!authLoading) {
      loadWishlist();
    }
  }, [authLoading, loadWishlist]);

  return (
    <section className="py-8 px-4 md:px-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Trending</h2>
        <a href="#" className="text-[#FF715B] text-sm font-medium hover:underline">View more</a>
      </div>
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
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
        )}
      </div>
    </section>
  );
};

export default TrendingProducts; 