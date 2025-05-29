const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://marketplace-backend-hm4q.onrender.com';

// Types based on the API documentation
export interface Product {
  id: number;
  manufacturer: any;
  name: string;
  description?: string;
  price: number;
  discount_percent?: number;
  discount_price?: number;
  category: {
    name: string;
    parent?: {
      name: string;
    };
  };
  is_active: boolean;
  images?: Array<{
    id: number;
    image: string;
  }>;
  variations?: Array<{
    size?: string;
    color?: string;
    stock: number;
  }>;
  inventory: number;
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
  is_customer?: boolean;
  is_manufacturer?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  private removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies for refresh token
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const result = await response.json();
    if (result.access) {
      this.setAccessToken(result.access);
    }
    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/accounts/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.removeAccessToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/accounts/refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      this.removeAccessToken();
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    if (result.access) {
      this.setAccessToken(result.access);
    }
    return result;
  }

  async getUserDetails(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/accounts/UserDetails/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeAccessToken();
      }
      throw new Error('Failed to get user details');
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
  }): Promise<{
    results: Product[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
    if (params?.price_min) searchParams.append('price_min', params.price_min.toString());
    if (params?.price_max) searchParams.append('price_max', params.price_max.toString());
    if (params?.page) searchParams.append('page', params.page.toString());

    const url = `${API_BASE_URL}/products/list/?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/list/?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data.results?.[0] || data;
  }

  // Reset password endpoints
  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/reset-password/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Reset password failed');
    }

    return response.json();
  }

  async confirmResetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/reset-password-confirm/${token}/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset confirmation failed');
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiService = new ApiService(); 