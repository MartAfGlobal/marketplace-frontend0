import {
  CheckoutResponse,
  CreateOrderPayload,
  Order,
  PaginatedResponse,
  PaymentPayload,
  User as AppUser,
  CheckoutOrderResponse,
  ShippingAddress,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://marketplace-backend-hm4q.onrender.com";

// Types based on the API documentation
export interface Product {
  id: string;
  manufacturer: any;
  name: string;
  slug: string;
  description?: string;
  price: string;
  discount_percent?: number;
  discount_price?: string;
  category: {
    name: string;
    parent?: {
      name: string;
    };
  };
  is_active: boolean;
  images_data?: Array<{
    id: string;
    image_urls: {
      original: string;
      medium: string;
      thumbnail: string;
    };
    alt_text: string;
    product: string;
  }>;
  variations_data?: Array<{
    id: string;
    size?: string;
    color?: string;
    stock: number;
    low_stock_threshold: number;
    low_stock_notified: boolean;
    product: string;
  }>;
  reviews_data?: Array<any>;
  inventory: number;
  low_stock_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  is_customer: boolean;
  is_manufacturer: boolean;
}

export interface AuthResponse {
  access: string;
  user?: User;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  is_customer?: boolean;
  is_manufacturer?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  children: Category[];
}

export interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface WishlistItem {
  id: string;
  user: string;
  products: Product[];
  created_at: string;
}

export interface WishlistResponse {
  detail: string;
}

export interface WishlistPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WishlistItem[];
}

// Cart interfaces based on API documentation
export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    discount_price?: string | null;
    images_data?: Array<{
      id: string;
      image_urls: {
        original: string;
        medium: string;
        thumbnail: string;
      };
      alt_text: string;
    }>;
  };
  product_name: string;
  variation?: {
    id: string;
    size?: string;
    color?: string;
    stock: number;
  } | null;
  quantity: number;
  subtotal: number;
  formatted_subtotal: string;
  checked?: boolean;
}

export interface Cart {
  id: string;
  user?: User | null;
  items: CartItem[];
  total: number;
  formatted_total: string;
  total_items: number;
  created_at: string;
}

export interface AddToCartRequest {
  product_id: string | number;
  variation?: string | number;
  quantity: number;
}

export interface AddToCartResponse {
  detail: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  variation?: string | number;
}

export interface BatchUpdateCartItem {
  id: string;
  quantity: number;
}

export interface BatchUpdateCartResponse {
  updated_items: Array<{
    id: string;
    status?: string;
    quantity?: number;
    error?: string;
  }>;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", token);

    // Also set a cookie for middleware authentication check
    // This cookie will be httpOnly when set by the server, but we set it here for client-side
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  }

  private removeAccessToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");

    // Remove the auth cookie
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: "include", // Include cookies for refresh token
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const result = await response.json();
    if (result.access) {
      this.setAccessToken(result.access);
    }
    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/accounts/logout`, {
        method: "POST",
        credentials: "include",
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.removeAccessToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      this.removeAccessToken();
      throw new Error("Token refresh failed");
    }

    const result = await response.json();
    if (result.access) {
      this.setAccessToken(result.access);
    }
    return result;
  }

  async getUserDetails(): Promise<AppUser> {
    const response = await fetch(`${API_BASE_URL}/accounts/UserDetails`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeAccessToken();
      }
      throw new Error("Failed to get user details");
    }

    return response.json();
  }

  // Product endpoints
  async getProducts(params?: {
    search?: string;
    category?: string;
    is_active?: boolean;
    price_min?: number;
    price_max?: number;
    page?: number;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.is_active !== undefined)
      searchParams.append("is_active", params.is_active.toString());
    if (params?.price_min)
      searchParams.append("price_min", params.price_min.toString());
    if (params?.price_max)
      searchParams.append("price_max", params.price_max.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const url = `${API_BASE_URL}/products/list/?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    // The API returns a direct array, not a paginated response
    return Array.isArray(data) ? data : data.results || [];
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/list/?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    const productArray = data.results || [];

    // Find the exact product by ID
    const product = productArray.find((p: Product) => p.id === id);

    if (!product) {
      throw new Error(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async getProductBySlug(productId: string): Promise<Product> {
    // Since we're now always using product IDs, use the optimized endpoint
    const response = await fetch(
      `${API_BASE_URL}/products/list/?id=${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    const productArray = data.results || [];

    // Find the exact product by ID
    const product = productArray.find((p: Product) => p.id === productId);

    if (!product) {
      throw new Error(`Product with ID "${productId}" not found`);
    }

    console.log("Found product:", {
      id: product.id,
      slug: product.slug,
      name: product.name,
    });
    return product;
  }

  async getProductByUrl(urlParam: string): Promise<Product> {
    // Import these here to avoid circular dependencies
    const { parseProductUrl, shortIdToUuid } = await import("./utils");

    // Parse the URL to get short ID and slug
    const parsed = parseProductUrl(urlParam);

    if (!parsed) {
      // Fallback: assume it's a direct UUID (backward compatibility)
      return this.getProductBySlug(urlParam);
    }

    // Get all products to find the matching UUID
    const allProducts = await this.getProducts({ is_active: true });

    // Find the UUID that matches this short ID
    const realUuid = await shortIdToUuid(parsed.shortId, allProducts);

    if (!realUuid) {
      throw new Error("Product not found");
    }

    // Now get the specific product
    return this.getProductBySlug(realUuid);
  }

  // Reset password endpoints
  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Reset password failed");
    }

    return response.json();
  }

  async confirmResetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/reset-password-confirm/${token}`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Password reset confirmation failed");
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    const response = await fetch(
      `${API_BASE_URL}/products/categories-nested/?format=json`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data: CategoryResponse = await response.json();
    return data.results || [];
  }

  // Wishlist endpoints
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeAccessToken();
        throw new Error("Authentication required");
      }
      if (response.status === 404) {
        // If no wishlist exists, return empty array
        return [];
      }
      throw new Error(
        `Failed to fetch wishlist: ${response.status} ${response.statusText}`
      );
    }

    const data: WishlistPaginatedResponse = await response.json();

    // Handle paginated response format
    if (data && data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      return [];
    }
  }

  async addToWishlist(productId: string): Promise<WishlistResponse> {
    const response = await fetch(`${API_BASE_URL}/wishlist/add/${productId}/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeAccessToken();
        throw new Error("Authentication required");
      }
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      const error = await response.json();
      throw new Error(error.detail || "Failed to add to wishlist");
    }

    return response.json();
  }

  async removeFromWishlist(productId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/wishlist/remove/${productId}/`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        this.removeAccessToken();
        throw new Error("Authentication required");
      }
      const error = await response.json();
      throw new Error(error.detail || "Failed to remove from wishlist");
    }
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: "GET",
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies for anonymous cart support
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    return response.json();
  }

  async addToCart(data: AddToCartRequest): Promise<AddToCartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include", // Include cookies for anonymous cart support
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to add item to cart");
    }

    return response.json();
  }

  async updateCartItemQuantity(
    itemId: string,
    quantity: number
  ): Promise<{ message: string; cart_item?: CartItem }> {
    const response = await fetch(
      `${API_BASE_URL}/cart/item/${itemId}/update_quantity/`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update cart item");
    }

    return response.json();
  }

  async updateCartItem(
    itemId: string,
    data: UpdateCartItemRequest
  ): Promise<{ message: string; cart_item: CartItem }> {
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update cart item");
    }

    return response.json();
  }

  async removeCartItem(itemId: string): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/cart/item/${itemId}/remove/`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const text = await response.text();
      try {
        const error = JSON.parse(text);
        throw new Error(error.detail || "Failed to remove cart item");
      } catch {
        throw new Error(text || "Failed to remove cart item");
      }
    }

    const text = await response.text();
    if (!text) return { message: "Cart item removed successfully" };

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  async clearCart(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/cart/item/remove_all/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      // Try parsing error body safely
      const text = await response.text();
      try {
        const error = JSON.parse(text);
        throw new Error(error.detail || "Failed to clear cart");
      } catch {
        throw new Error(text || "Failed to clear cart");
      }
    }

    // Handle empty response gracefully
    const text = await response.text();
    if (!text) return { message: "Cart cleared successfully" };

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  async batchUpdateCartItems(
    items: BatchUpdateCartItem[]
  ): Promise<BatchUpdateCartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/item/batch_update/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to batch update cart items");
    }

    return response.json();
  }

  // Review methods
  async getProductReviews(productId: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/review-list/${productId}/reviews/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          console.warn(
            "Backend authentication configuration issue. Returning empty reviews."
          );
          return [];
        }
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  async createReview(
    productId: string,
    reviewData: {
      rating: number;
      comment: string;
    }
  ): Promise<any> {
    try {
      // Include the product ID in the request body as expected by the API
      const requestBody = {
        ...reviewData,
        product: productId,
      };

      const response = await fetch(
        `${API_BASE_URL}/products/review-list/${productId}/reviews/`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error(
            "Backend authentication configuration issue. Reviews are temporarily unavailable. Please contact support."
          );
        }
        const error = await response.json();
        console.error("Review creation error:", error);

        // Handle specific field errors
        if (error.product) {
          throw new Error(
            `Product error: ${
              Array.isArray(error.product)
                ? error.product.join(", ")
                : error.product
            }`
          );
        }
        if (error.rating) {
          throw new Error(
            `Rating error: ${
              Array.isArray(error.rating)
                ? error.rating.join(", ")
                : error.rating
            }`
          );
        }
        if (error.comment) {
          throw new Error(
            `Comment error: ${
              Array.isArray(error.comment)
                ? error.comment.join(", ")
                : error.comment
            }`
          );
        }

        throw new Error(
          error.detail || error.message || "Failed to create review"
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create review");
    }
  }

  async updateReview(
    reviewId: string,
    reviewData: {
      rating?: number;
      comment?: string;
    }
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/products/reviews-update/${reviewId}/`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to update review"
      );
    }

    return response.json();
  }

  async deleteReview(reviewId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/products/reviews-update/${reviewId}/`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to delete review"
      );
    }
  }

  async getOrderHistory(
    status?: Order["status"]
  ): Promise<PaginatedResponse<Order>> {
    try {
      const url = new URL(`${API_BASE_URL}/orders`);

      if (status) {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url.toString(), {
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch order history");
      }

      const data: PaginatedResponse<Order> = await response.json();
      console.log("Fetched order history:", data);
      return data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
  }

  async cancelOrder(orderId: string | number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to cancel order"
      );
    }
    const data: Order = await response.json();
    return data;
  }

  async MarkOrderDelivered(orderId: string | number | null): Promise<Order> {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/mark-delivered/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to mark order as delivered"
      );
    }
    const data: Order = await response.json();
    return data;
  }

  async getOrder(orderId: string | number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to get order details"
      );
    }
    const data: Order = await response.json();
    return data;
  }

  async trackOrder(orderId: string | number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/track/`, {
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || "Failed to track order");
    }
    const data: Order = await response.json();
    return data;
  }

  async toggleCartItem(itemId: string | number): Promise<{ checked: boolean }> {
    const response = await fetch(
      `${API_BASE_URL}/cart/items/${itemId}/set-checked/`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || error.message || "Failed to toggle item in cart"
      );
    }

    return await response.json();
  }

  async setCartItemChecked(
    itemId: string | number,
    checked: boolean
  ): Promise<{ checked: boolean; item_id: string }> {
    console.log("=== API REQUEST DEBUG ===");
    console.log("ItemId:", itemId, "Type:", typeof itemId);
    console.log("Checked:", checked, "Type:", typeof checked);

    const requestBody = { checked };
    console.log("Request body:", JSON.stringify(requestBody));

    const url = `${API_BASE_URL}/cart/items/${itemId}/set-checked/`;
    console.log("URL:", url);

    const headers = {
      ...this.getAuthHeaders(),
      "Content-Type": "application/json",
    };
    console.log("Headers:", headers);

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response body:", errorText);

        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }

        console.error("API Error:", error);
        throw new Error(
          error.detail ||
            error.message ||
            error.error ||
            "Failed to update item in cart"
        );
      }

      const result = await response.json();
      console.log("Success response:", result);
      console.log("=== API REQUEST END ===");

      return result;
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      console.log("=== API REQUEST END (ERROR) ===");
      throw fetchError;
    }
  }

  // checkout
  async checkout(): Promise<CheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout/review/`, {
      method: "GET",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || "Checkout failed");
    }

    const data: CheckoutResponse = await response.json();
    return data;
  }

  // Add this method to your ApiService class
  async getCartStatus(): Promise<any> {
    const url = `${API_BASE_URL}/cart/`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const cartData = await response.json();

      return cartData;
    } catch (error) {
      console.error("Failed to fetch cart status:", error);
      throw error;
    }
  }

  async updatePendingCheckoutInfo(data: {
    shipping_address?: string;
    // shipping_method?: string;
    // payment_card_token?: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/select/shipping-address/`, {
      method: "PATCH",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Failed to update pending checkout info"
      );
    }
  }

  async createOrder(
    payload: CreateOrderPayload
  ): Promise<CheckoutOrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // This is likely an HTML error page
        const htmlText = await response.text();
        console.error("Received HTML response instead of JSON:", htmlText);
        throw new Error("Server error - please try again later");
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        throw new Error(
          errorData.error ||
            errorData.detail ||
            errorData.message ||
            "Checkout failed"
        );
      }

      const data: CheckoutOrderResponse = await response.json();
      return data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  async initializePayment(payload: PaymentPayload): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/paystack/init/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || "Checkout failed");
    }

    const data = await response.json();
    return data;
  }

  async updateUserProfile(data: FormData): Promise<AppUser> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const response = await fetch(`${API_BASE_URL}/accounts/UserDetails/`, {
      method: "PATCH",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to update profile");
    }

    return response.json();
  }

  // GET: List user shipping addresses
  async getShippingAddresses(): Promise<ShippingAddress[]> {
    const response = await fetch(
      `${API_BASE_URL}/shipping/shipping-addresses/`,
      {
        method: "GET",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch shipping addresses");
    }

    return await response.json();
  }

  // POST: Create a new shipping address
  async createShippingAddress(data: ShippingAddress): Promise<ShippingAddress> {
    const response = await fetch(
      `${API_BASE_URL}/shipping/shipping-addresses/`,
      {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Shipping address creation error:", error); // 👈 this helps you debug
      throw new Error(
        error.detail ||
          JSON.stringify(error) ||
          "Failed to create shipping address"
      );
    }

    return await response.json();
  }
}

export const apiService = new ApiService();
