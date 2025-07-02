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


// order types based on the api documentation
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  is_customer: boolean;
  is_manufacturer: boolean;
  // Add other fields if exposed
}


export interface ShippingAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  full_name: string; // Full name of the recipient
  phone: string; // Phone number of the recipient
}

export interface ShippingMethod {
  id: number;
  name: string;
  cost: string; // Decimal → string
  estimated_days: number;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

export interface Escrow {
  id: number;
  reference: string;
  status: string; // Enum? e.g., 'Pending', 'Released', etc.
}

export interface OrderItem {
  id: string;
  product: Product;
  variant?: ProductVariation;
  quantity: number;
  price_at_purchase: string;
}

export interface Order {
  id: string | number; // Depending on your API, it could be a string or number
  order_no: string;
  user: number | User;

  shipping_address?: ShippingAddress;
  shipping_method?: ShippingMethod;
  coupon?: Coupon;
  escrow?: Escrow;

  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount_amount: number;
  total_price: number;

  payment_reference?: string;
  payment_status: 'Pending' | 'Successful' | 'Failed';
  status:
    | 'Awaiting Confirmation'
    | 'Order Placed'
    | 'Processing'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';

  tracking_number?: string;
  estimated_delivery_date?: string;

  created_at: string;
  updated_at: string;

  items: OrderItem[];
}