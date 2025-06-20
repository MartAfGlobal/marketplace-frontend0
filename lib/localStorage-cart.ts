import { apiService, Product, Cart, CartItem } from './api';

export interface LocalCartItem {
  productId: string;
  quantity: number;
  variationId?: string;
  addedAt: number;
}

export interface LocalCartWithProducts extends LocalCartItem {
  product?: Product;
  loading?: boolean;
  error?: string;
}

const LOCAL_CART_KEY = 'martaf_cart';
const CART_EXPIRY_DAYS = 7;

export class LocalStorageCartService {
  // Get raw local cart items
  static getLocalCart(): LocalCartItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Filter out expired items
      const cutoffTime = Date.now() - (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      const validItems = parsed.filter((item: LocalCartItem) => 
        item.addedAt && item.addedAt > cutoffTime
      );
      
      // Update localStorage with valid items only
      if (validItems.length !== parsed.length) {
        this.setLocalCart(validItems);
      }
      
      return validItems;
    } catch (error) {
      console.error('Error reading local cart:', error);
      return [];
    }
  }

  // Save local cart items
  static setLocalCart(items: LocalCartItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }

  // Add item to local cart
  static addToLocalCart(productId: string, quantity: number, variationId?: string): void {
    const localCart = this.getLocalCart();
    const existingIndex = localCart.findIndex(
      item => item.productId === productId && item.variationId === variationId
    );

    if (existingIndex >= 0) {
      // Update existing item
      localCart[existingIndex].quantity += quantity;
      localCart[existingIndex].addedAt = Date.now();
    } else {
      // Add new item
      localCart.push({
        productId,
        quantity,
        variationId,
        addedAt: Date.now()
      });
    }

    this.setLocalCart(localCart);
  }

  // Update item quantity in local cart
  static updateLocalCartQuantity(productId: string, quantity: number, variationId?: string): void {
    const localCart = this.getLocalCart();
    const existingIndex = localCart.findIndex(
      item => item.productId === productId && item.variationId === variationId
    );

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        localCart.splice(existingIndex, 1);
      } else {
        // Update quantity
        localCart[existingIndex].quantity = quantity;
        localCart[existingIndex].addedAt = Date.now();
      }
      this.setLocalCart(localCart);
    }
  }

  // Remove item from local cart
  static removeFromLocalCart(productId: string, variationId?: string): void {
    const localCart = this.getLocalCart();
    const filteredCart = localCart.filter(
      item => !(item.productId === productId && item.variationId === variationId)
    );
    this.setLocalCart(filteredCart);
  }

  // Clear local cart
  static clearLocalCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_CART_KEY);
    }
  }

  // Get local cart with product details
  static async getLocalCartWithProducts(): Promise<CartItem[]> {
    const localCart = this.getLocalCart();
    if (localCart.length === 0) return [];

    const cartItems: CartItem[] = [];

    for (const item of localCart) {
      try {
        // Fetch product details
        const product = await apiService.getProduct(item.productId);
        
        // Find variation if specified
        let variation = null;
        if (item.variationId && product.variations_data) {
          variation = product.variations_data.find(v => v.id === item.variationId) || null;
        }

        // Calculate price
        const unitPrice = parseFloat(product.discount_price || product.price);
        const subtotal = unitPrice * item.quantity;

        // Create cart item with safe ID generation (use | as separator to avoid UUID conflicts)
        const safeVariationId = item.variationId ? item.variationId.replace(/-/g, '_') : 'default';
        const cartItem: CartItem = {
          id: `local|${item.productId}|${safeVariationId}`,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            discount_price: product.discount_price,
            images_data: product.images_data
          },
          product_name: product.name,
          variation: variation,
          quantity: item.quantity,
          subtotal: subtotal,
          formatted_subtotal: `₦${subtotal.toLocaleString()}`
        };

        cartItems.push(cartItem);
      } catch (error) {
        console.error(`Failed to fetch product ${item.productId}:`, error);
        // Create a minimal cart item with error info
        const safeVariationId = item.variationId ? item.variationId.replace(/-/g, '_') : 'default';
        const cartItem: CartItem = {
          id: `local|${item.productId}|${safeVariationId}`,
          product: {
            id: item.productId,
            name: 'Product not found',
            price: '0',
            discount_price: null
          },
          product_name: 'Product not found',
          variation: null,
          quantity: item.quantity,
          subtotal: 0,
          formatted_subtotal: '₦0.00'
        };
        cartItems.push(cartItem);
      }
    }

    return cartItems;
  }

  // Convert local cart to full Cart object
  static async getLocalCartAsCart(): Promise<Cart | null> {
    const localCart = this.getLocalCart();
    if (localCart.length === 0) return null;

    try {
      const cartItems = await this.getLocalCartWithProducts();
      
      const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        id: 'local-cart',
        items: cartItems,
        total: total,
        formatted_total: `₦${total.toLocaleString()}`,
        total_items: totalItems,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating local cart:', error);
      
      // Return basic cart with just counts
      const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
      return {
        id: 'local-cart',
        items: [],
        total: 0,
        formatted_total: '₦0.00',
        total_items: totalItems,
        created_at: new Date().toISOString()
      };
    }
  }

  // Get total items count (for header display)
  static getLocalCartCount(): number {
    const localCart = this.getLocalCart();
    return localCart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Check if product is in local cart
  static isProductInLocalCart(productId: string, variationId?: string): boolean {
    const localCart = this.getLocalCart();
    return localCart.some(
      item => item.productId === productId && item.variationId === variationId
    );
  }

  // Get product quantity in local cart
  static getProductQuantityInLocalCart(productId: string, variationId?: string): number {
    const localCart = this.getLocalCart();
    const item = localCart.find(
      item => item.productId === productId && item.variationId === variationId
    );
    return item ? item.quantity : 0;
  }
} 