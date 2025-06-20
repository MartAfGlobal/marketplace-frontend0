"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ShoppingCart, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { apiService, Product } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { formatNaira, createProductUrl } from '@/lib/utils';

const WishlistPage = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load wishlist data from API
  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const wishlist = await apiService.getWishlist();
      
      if (wishlist.length > 0) {
        // Get all products from all wishlists (though typically there's only one per user)
        const allProducts: Product[] = [];
        wishlist.forEach(list => {
          allProducts.push(...list.products);
        });
        setItems(allProducts);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setError(error instanceof Error ? error.message : 'Failed to load wishlist');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (removingItems.has(id)) return;
    
    setRemovingItems(prev => new Set([...prev, id]));
    
    try {
      await apiService.removeFromWishlist(id);
      setItems(prev => prev.filter(item => item.id !== id));
      
      const itemName = items.find(item => item.id === id)?.name;
      toast.success(`${itemName || 'Item'} removed from wishlist`);
    } catch (error) {
      console.error('Failed to remove item:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      toast.error(message);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    const productId = product.id;
    setAddingToCart(prev => new Set([...prev, productId]));

    try {
      // Use cart context which automatically updates header
      await addToCartContext(productId, 1);
      
      // Cart context already shows success toast
    } catch (error) {
      console.error("Add to cart failed:", error);
      // Cart context already handles error toasts
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleRetry = () => {
    loadWishlist();
  };

  // Load wishlist when component mounts or authentication changes
  useEffect(() => {
    if (!authLoading) {
      loadWishlist();
    }
  }, [authLoading, isAuthenticated]);

  // Show loading skeleton while checking authentication
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link href="/account">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 flex-shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-black flex-1 text-center">Wishlist</h1>
          <div className="w-10 flex-shrink-0"></div>
        </div>

        {/* Loading Content */}
        <div className="bg-white">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF715B] mb-4" />
            <p className="text-gray-500">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Link href="/account">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Wishlist</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search wishlist items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      <div className="bg-white">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-red-400 mb-4">
              <X className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading wishlist</h3>
            <p className="text-gray-500 text-center mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="text-[#FF715B] border-[#FF715B] hover:bg-[#FF715B] hover:text-white"
            >
              Try again
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {searchQuery ? (
              <>
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 text-center mb-4">Try searching with different keywords</p>
                <Button 
                  variant="outline" 
                  onClick={clearSearch}
                  className="text-[#FF715B] border-[#FF715B] hover:bg-[#FF715B] hover:text-white"
                >
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 text-center mb-4">Start adding items you love to your wishlist</p>
                <Link href="/">
                  <Button className="bg-[#FF715B] hover:bg-[#e55a47] text-white">
                    Browse products
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="px-4 py-3 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </p>
              </div>
            )}
            {filteredItems.map((item) => {
              const isRemoving = removingItems.has(item.id);
              const imageUrl = item.images_data?.[0]?.image_urls?.medium || 
                             item.images_data?.[0]?.image_urls?.original ||
                             "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80";
              
              return (
                <div key={item.id} className={`flex items-center gap-4 p-4 border-b border-gray-100 ${isRemoving ? 'opacity-50' : ''}`}>
                  {/* Product Image and Info - Clickable */}
                  <Link href={createProductUrl(item.id, item.slug || 'product')} className="flex items-center gap-4 flex-1 hover:bg-gray-50 rounded-lg transition-colors">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={imageUrl} 
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-black font-medium text-sm mb-1 hover:text-[#FF715B] transition-colors">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{item.manufacturer?.name || 'Store'}</p>
                      <p className="text-black font-semibold">
                        {formatNaira(Number(item.discount_price || item.price))}
                      </p>
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Add to Cart Button */}
                    <button 
                      className={`w-10 h-10 rounded-full border border-[#FF715B] flex items-center justify-center transition-colors group ${
                        addingToCart.has(item.id) 
                          ? 'cursor-not-allowed opacity-60' 
                          : 'hover:bg-[#FF715B] hover:text-white'
                      }`}
                      onClick={() => handleAddToCart(item)}
                      disabled={isRemoving || addingToCart.has(item.id)}
                    >
                      {addingToCart.has(item.id) ? (
                        <Loader2 className="w-5 h-5 text-[#FF715B] animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5 text-[#FF715B] group-hover:text-white" />
                      )}
                    </button>

                    {/* Remove Button */}
                    <button 
                      className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors group ${
                        isRemoving ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 