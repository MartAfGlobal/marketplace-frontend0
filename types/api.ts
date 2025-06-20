// Product types based on the API documentation
export interface ProductVariation {
  id: string;
  size: string;
  color: string | null;
  stock: number;
  low_stock_threshold: number;
  low_stock_notified: boolean;
  product: string;
}

export interface ProductImage {
  id: string;
  image: string;
  alt_text: string | null;
  product: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  user: string;
  created_at: string;
}

export interface Product {
  id: string;
  variations_data: ProductVariation[];
  images_data: ProductImage[];
  reviews_data: ProductReview[];
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  inventory: number;
  low_stock_notified: boolean;
  manufacturer: string | null;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Auth types
export interface LoginResponse {
  access: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  is_customer: boolean;
  is_manufacturer: boolean;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
} 