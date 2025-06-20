"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, Cart, CartItem } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { LocalStorageCartService } from '@/lib/localStorage-cart';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, variationId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // Merge local cart with server cart when user logs in
  const mergeLocalCartWithServer = async () => {
    if (isMerging) return;
    
    const localCart = LocalStorageCartService.getLocalCart();
    if (localCart.length === 0) return;

    setIsMerging(true);
    console.log('Merging local cart with server cart...', localCart);

    try {
      // Add each local cart item to server
      for (const item of localCart) {
        try {
          await apiService.addToCart({
            product_id: item.productId,
            quantity: item.quantity,
            ...(item.variationId && { variation: item.variationId }),
          });
        } catch (error) {
          console.error(`Failed to merge item ${item.productId}:`, error);
          // Continue with other items even if one fails
        }
      }

      // Clear local cart after successful merge
      LocalStorageCartService.clearLocalCart();
      
      // Refresh server cart
      await refreshCart();
      
      if (localCart.length > 0) {
        toast.success(`${localCart.length} item(s) from your previous session added to cart`);
      }
    } catch (error) {
      console.error('Failed to merge local cart:', error);
      toast.error('Some items from your previous session could not be restored');
    } finally {
      setIsMerging(false);
    }
  };

  // Save server cart to localStorage when user logs out
  const saveCartToLocal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return;

    // Clear existing local cart first
    LocalStorageCartService.clearLocalCart();

    // Add each server cart item to local storage
    cart.items.forEach(item => {
      LocalStorageCartService.addToLocalCart(
        item.product.id,
        item.quantity,
        item.variation?.id
      );
    });

    console.log('Saved cart to localStorage for anonymous session');
  };

  const refreshCart = async () => {
    if (authLoading) return; // Wait for auth to be ready

    try {
      setIsLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // For authenticated users, get server cart
        const cartData = await apiService.getCart();
        setCart(cartData);
      } else {
        // For anonymous users, get local cart with full product details
        const localCartData = await LocalStorageCartService.getLocalCartAsCart();
        setCart(localCartData);
      }
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      setError(error.message || 'Failed to load cart');
      
      // Fallback to basic local cart for anonymous users
      if (!isAuthenticated) {
        const localCartCount = LocalStorageCartService.getLocalCartCount();
        if (localCartCount > 0) {
          const fallbackCart: Cart = {
            id: 'local-cart',
            items: [],
            total: 0,
            formatted_total: '₦0.00',
            total_items: localCartCount,
            created_at: new Date().toISOString(),
          };
          setCart(fallbackCart);
        } else {
          setCart(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, variationId?: string) => {
    try {
      if (isAuthenticated) {
        // For authenticated users, add to server cart
        await apiService.addToCart({
          product_id: productId,
          quantity,
          ...(variationId && { variation: variationId }),
        });
        
        toast.success('Product added to cart');
        await refreshCart();
      } else {
        // For anonymous users, add to localStorage
        LocalStorageCartService.addToLocalCart(productId, quantity, variationId);
        await refreshCart(); // Update the local cart display
        toast.success('Product added to cart');
      }
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add product to cart');
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity === 0) {
        await removeItem(itemId);
        return;
      }
      
      if (isAuthenticated) {
        await apiService.updateCartItemQuantity(itemId, quantity);
        await refreshCart();
      } else {
        // For anonymous users, parse the local cart item ID to get productId and variationId
        if (itemId.startsWith('local|')) {
          const idParts = itemId.replace('local|', '').split('|');
          const productId = idParts[0];
          const variationPart = idParts.length > 1 ? idParts[1] : 'default';
          const variationId = variationPart !== 'default' ? variationPart.replace(/_/g, '-') : undefined;
          
          // Update local cart
          LocalStorageCartService.updateLocalCartQuantity(productId, quantity, variationId);
          await refreshCart();
        } else {
          toast.error('Unable to update item');
        }
      }
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast.error(error.message || 'Failed to update quantity');
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      if (isAuthenticated) {
        await apiService.removeCartItem(itemId);
        toast.success('Item removed from cart');
        await refreshCart();
      } else {
        // For anonymous users, parse the local cart item ID to get productId and variationId
        if (itemId.startsWith('local|')) {
          const idParts = itemId.replace('local|', '').split('|');
          const productId = idParts[0];
          const variationPart = idParts.length > 1 ? idParts[1] : 'default';
          const variationId = variationPart !== 'default' ? variationPart.replace(/_/g, '-') : undefined;
          
          // Remove from local cart
          LocalStorageCartService.removeFromLocalCart(productId, variationId);
          toast.success('Item removed from cart');
          await refreshCart();
        } else {
          toast.error('Unable to remove item');
        }
      }
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      toast.error(error.message || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await apiService.clearCart();
        toast.success('Cart cleared');
        await refreshCart();
      } else {
        LocalStorageCartService.clearLocalCart();
        setCart(null);
        toast.success('Cart cleared');
      }
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to be ready

    const handleAuthChange = async () => {
      if (isAuthenticated) {
        // User just logged in - merge local cart with server
        await mergeLocalCartWithServer();
      } else {
        // User just logged out - save server cart to local storage
        if (cart && cart.items && cart.items.length > 0) {
          saveCartToLocal();
        }
        // Refresh to show local cart
        await refreshCart();
      }
    };

    handleAuthChange();
  }, [isAuthenticated, authLoading]);

  // Initial cart load
  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [authLoading]);

  const value: CartContextType = {
    cart,
    isLoading: isLoading || isMerging,
    error,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 