# Martaf - African Marketplace Frontend

A comprehensive e-commerce marketplace platform connecting African customers with local manufacturers and sellers. Built with Next.js 15 App Router, TypeScript, Tailwind CSS 4, and shadcn/ui components with advanced features including real-time cart synchronization, JWT authentication, and mobile-first responsive design.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Architecture](#architecture)
  - [Authentication System](#authentication-system)
  - [Cart Management](#cart-management)
  - [State Management](#state-management)
  - [API Integration](#api-integration)
- [Components](#components)
  - [UI Components](#ui-components)
  - [Custom Components](#custom-components)
  - [Auth Components](#auth-components)
- [Pages & Routing](#pages--routing)
- [Styling & Design System](#styling--design-system)
- [Development Guidelines](#development-guidelines)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Project Overview

Martaf is a comprehensive African marketplace platform that connects customers with local manufacturers and sellers. The platform features product browsing, category navigation, user authentication, shopping cart functionality, wishlist management, and order tracking.

**Key Highlights:**
- Mobile-first responsive design
- Server-side rendering with Next.js App Router
- Real-time cart synchronization between local storage and server
- Advanced product filtering and search
- User account management and order history
- Wishlist functionality
- Review and rating system

## Tech Stack

### Frontend Framework & Language
- **Framework:** Next.js 15.3.2 (App Router with React Server Components)
- **Language:** TypeScript 5+ (Strict mode enabled)
- **React Version:** 19.0.0 (Latest with concurrent features)
- **Font:** Montserrat (Google Fonts) with Latin subset

### Styling & UI
- **CSS Framework:** Tailwind CSS 4 (Latest with container queries)
- **UI Components:** shadcn/ui (Radix UI primitives with custom styling)
- **Design System:** Custom CSS variables with OKLCH color space
- **Icons:** Lucide React (500+ icons)
- **Animations:** tw-animate-css
- **Theme System:** next-themes with dark/light mode support

### State Management & Data
- **Global State:** React Context API (Auth, Cart)
- **Local Storage:** Custom service for anonymous cart persistence
- **API Layer:** Custom ApiService class with TypeScript interfaces
- **Caching:** Next.js built-in caching with revalidation
- **Form Handling:** Controlled components with validation

### Backend Integration
- **API Base:** https://marketplace-backend-hm4q.onrender.com
- **Authentication:** JWT tokens with refresh mechanism
- **Image Domains:** Unsplash, Pixabay, Pexels, Cloudinary, RawPixel
- **CORS:** Configured for mobile development (192.168.1.*)

### Development & Build Tools
- **Package Manager:** npm (lockfile version 3)
- **Build Tool:** Turbopack (Next.js experimental)
- **Type Checking:** TypeScript 5 with strict configuration
- **Code Quality:** ESLint with Next.js rules
- **CSS Processing:** PostCSS with Tailwind
- **Notifications:** Sonner toast library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/paulotokolo/martaf.git
   cd martaf
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install shadcn/ui components (if needed):**
   ```bash
   npx shadcn@latest add [component-name]
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://marketplace-backend-hm4q.onrender.com

# Optional: For development debugging
DEBUG=*

# Optional: Custom domain for development
NEXT_PUBLIC_DOMAIN=localhost:3000
```

**Environment Variable Details:**
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (required for all API calls)
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Backend URL is currently hosted on Render.com
- Local development uses proxy configuration for CORS

### Running the Application

```bash
# Development server with Turbopack (faster builds)
npm run dev

# Build for production (static optimization)
npm run build

# Start production server
npm start

# Lint the code (ESLint with Next.js rules)
npm run lint

# Generate seed data (if available)
npm run generate-seed
```

**Development Server Details:**
- **URL:** [http://localhost:3000](http://localhost:3000)
- **Turbopack:** Enabled for faster development builds
- **Hot Reload:** Automatic page refresh on file changes
- **Mobile Access:** Available on local network (192.168.1.* configured)
- **HTTPS:** Not required for development (HTTP only)

## Project Structure

```
martaf/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth-related pages
│   ├── account/                  # User account pages
│   ├── cart/                     # Shopping cart
│   ├── categories/               # Category browsing
│   ├── checkout/                 # Checkout process
│   ├── product/                  # Product details
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── martaf/                  # Custom Martaf components
│   ├── login-form.tsx           # Login form component
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility libraries
│   ├── api.ts                   # API service layer
│   ├── auth-context.tsx         # Authentication context
│   ├── cart-context.tsx         # Cart state management
│   ├── localStorage-cart.ts     # Local cart utilities
│   └── utils.ts                 # Utility functions
├── types/                       # TypeScript type definitions
├── public/                      # Static assets
├── middleware.ts                # Next.js middleware
└── components.json              # shadcn/ui configuration
```

## Core Features

### 🛍️ Shopping Experience
- **Product Catalog:** Browse products with advanced filtering
- **Category Navigation:** Hierarchical category structure
- **Product Details:** Comprehensive product pages with images, reviews, and variations
- **Search Functionality:** Find products quickly with search
- **Shopping Cart:** Add, update, and remove items
- **Wishlist:** Save products for later

### 👤 User Management
- **Authentication:** Secure login/signup system
- **Account Dashboard:** Manage profile, orders, and preferences
- **Order History:** Track past purchases
- **Address Management:** Save multiple shipping addresses
- **Payment Methods:** Manage payment options

### 📱 Responsive Design
- **Mobile-First:** Optimized for mobile devices
- **Progressive Web App:** App-like experience
- **Touch-Friendly:** Intuitive touch interactions
- **Cross-Browser:** Compatible with all modern browsers

## Architecture

### Authentication System

The authentication system uses JWT tokens with automatic token refresh:

```typescript
// lib/auth-context.tsx
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async (data) => { /* Implementation */ },
  register: async (data) => { /* Implementation */ },
  logout: async () => { /* Implementation */ },
  refreshUser: async () => { /* Implementation */ }
});
```

**Features:**
- Automatic token refresh
- Protected route middleware
- Context-based state management
- Toast notifications for auth events

### Cart Management

The cart system supports both authenticated and anonymous users:

```typescript
// lib/cart-context.tsx
const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  error: null,
  refreshCart: async () => { /* Implementation */ },
  addToCart: async (productId, quantity, variationId) => { /* Implementation */ },
  updateQuantity: async (itemId, quantity) => { /* Implementation */ },
  removeItem: async (itemId) => { /* Implementation */ },
  clearCart: async () => { /* Implementation */ }
});
```

**Features:**
- Local storage for anonymous users
- Server synchronization for authenticated users
- Automatic cart merging on login
- Real-time cart updates

### State Management

- **React Context:** Used for global state (Auth, Cart)
- **Local Storage:** Persists cart data for anonymous users
- **Server State:** Synchronized with backend API
- **Loading States:** Proper loading and error handling

### API Integration

The API integration follows a **service-based architecture** where all API communication is centralized in a single service class (`lib/api.ts` - 735 lines). This pattern ensures maintainability, consistency, and reusability across the application.

#### 🏗️ Architecture Overview

The API layer consists of three main components:

1. **ApiService Class** - Centralized API communication
2. **TypeScript Interfaces** - Type-safe data contracts
3. **Component Integration** - React hooks and state management

```typescript
// Single service instance (Singleton pattern)
class ApiService {
  private getAuthHeaders(): HeadersInit
  private getAccessToken(): string | null
  private setAccessToken(token: string): void
  private removeAccessToken(): void
}

export const apiService = new ApiService(); // Exported singleton
```

#### 🔐 Authentication System

**JWT Token Management:**
```typescript
private getAuthHeaders(): HeadersInit {
  const token = this.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}
```

**How Authentication Works:**
1. User logs in → API returns JWT access token
2. Token stored in `localStorage` and `httpOnly` cookie
3. Every API call includes: `Authorization: Bearer <token>`
4. Automatic token refresh on expiration
5. Middleware validates tokens for protected routes

#### 📊 Data Flow Example: Categories

Let's trace how categories appear on the homepage:

**Step 1: Component State Setup**
```typescript
// In app/page.tsx
const [categories, setCategories] = useState<Category[]>([]);
const [categoriesError, setCategoriesError] = useState<string | null>(null);
```

**Step 2: API Call Function**
```typescript
const fetchCategories = async () => {
  try {
    setCategoriesError(null); // Clear previous errors
    
    // 🚀 Centralized API call
    const apiCategories = await apiService.getCategories();
    
    // Business logic: Filter parent categories only
    const topLevelCategories = apiCategories
      .filter((cat: Category) => !cat.parent_id)
      .slice(0, 8); // Limit to 8 categories
    
    setCategories(topLevelCategories); // Update React state
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    setCategoriesError("Failed to load categories");
    setCategories([]); // Clear stale data
  }
};
```

**Step 3: API Service Implementation**
```typescript
// In lib/api.ts
async getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: 'GET',
    headers: this.getAuthHeaders(), // Auto-includes auth token
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results || data; // Handle different response formats
}
```

**Step 4: React Lifecycle Integration**
```typescript
useEffect(() => {
  const loadPageData = async () => {
    setIsPageLoading(true);
    
    // Parallel API calls for better performance
    await Promise.all([
      fetchCategories(), // 🎯 Categories loaded here
      fetchProducts()
    ]);
    
    setIsPageLoading(false);
  };

  loadPageData(); // Runs on component mount
}, []); // Empty deps = run once
```

#### 🎨 UI Integration Pattern

**Loading States & Error Handling:**
```typescript
{categoriesError ? (
  <div className="p-4 text-center text-sm text-red-500">
    ❌ Failed to load categories
    <button onClick={fetchCategories}>Retry</button>
  </div>
) : categories.length === 0 ? (
  <div className="p-4 text-center text-sm text-gray-500">
    ⏳ Loading categories...
  </div>
) : (
  // ✅ Render categories
  <div className="space-y-1">
    {categories.map((category) => (
      <CategoryItem key={category.id} category={category} />
    ))}
  </div>
)}
```

#### 🔄 Complete Data Flow

```
User visits page
     ↓
useEffect() triggered
     ↓
fetchCategories() called
     ↓
apiService.getCategories()
     ↓
HTTP GET /categories/
     ↓
JWT token validation
     ↓
JSON response received
     ↓
Data filtering & processing
     ↓
setCategories() updates state
     ↓
React re-renders component
     ↓
Categories visible to user
```

#### 📝 TypeScript Integration

**Type-Safe Interfaces:**
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null; // Union type for optional parent
  children: Category[];     // Recursive type for subcategories
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  discount_price?: string;  // Optional discount
  category: {
    name: string;
    parent?: { name: string }; // Nested optional parent
  };
  images_data?: Array<{      // Optional image array
    image_urls: {
      original: string;
      medium: string;
      thumbnail: string;
    };
  }>;
}
```

#### 🛠️ Available API Methods

**Authentication Methods:**
```typescript
async register(data: RegisterData): Promise<AuthResponse>
async login(data: LoginData): Promise<AuthResponse>
async logout(): Promise<void>
async refreshToken(): Promise<AuthResponse>
async getUserDetails(): Promise<User>
async resetPassword(email: string): Promise<{ message: string }>
async confirmResetPassword(token: string, password: string): Promise<{ message: string }>
isAuthenticated(): boolean
```

**Product Methods:**
```typescript
async getProducts(params?: {
  search?: string;
  category?: string;
  is_active?: boolean;
  price_min?: number;
  price_max?: number;
  page?: number;
}): Promise<Product[]>
async getProduct(id: string): Promise<Product>
async getProductBySlug(productId: string): Promise<Product>
async getProductByUrl(urlParam: string): Promise<Product>
```

**Category Methods:**
```typescript
async getCategories(): Promise<Category[]>
```

**Cart Methods:**
```typescript
async getCart(): Promise<Cart>
async addToCart(data: AddToCartRequest): Promise<AddToCartResponse>
async updateCartItemQuantity(itemId: string, quantity: number): Promise<{ message: string; cart_item?: CartItem }>
async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<{ message: string; cart_item: CartItem }>
async removeCartItem(itemId: string): Promise<{ message: string }>
async clearCart(): Promise<{ message: string }>
async batchUpdateCartItems(items: BatchUpdateCartItem[]): Promise<BatchUpdateCartResponse>
```

**Wishlist Methods:**
```typescript
async getWishlist(): Promise<WishlistItem[]>
async addToWishlist(productId: string): Promise<WishlistResponse>
async removeFromWishlist(productId: string): Promise<void>
```

**Review Methods:**
```typescript
async getProductReviews(productId: string): Promise<any[]>
async createReview(productId: string, reviewData: { rating: number; comment: string }): Promise<any>
async updateReview(reviewId: string, reviewData: { rating?: number; comment?: string }): Promise<any>
async deleteReview(reviewId: string): Promise<void>
```

#### 🎯 Best Practices Implemented

1. **Separation of Concerns:** API logic separate from UI components
2. **Error Boundaries:** Graceful error handling with user feedback
3. **Loading States:** Visual feedback during API calls
4. **Type Safety:** Full TypeScript coverage prevents runtime errors
5. **Single Source of Truth:** Centralized state management per component
6. **Async/Await Pattern:** Modern JavaScript for readable async code
7. **Token Management:** Automatic authentication with refresh logic
8. **Batch Operations:** Efficient cart updates reduce API calls

#### 🚀 Adding New API Endpoints

To extend the API service with new endpoints:

```typescript
// 1. Define TypeScript interface
export interface NewFeature {
  id: string;
  name: string;
  // ... other properties
}

// 2. Add method to ApiService class
async getNewFeature(): Promise<NewFeature[]> {
  const response = await fetch(`${API_BASE_URL}/new-feature/`, {
    headers: this.getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// 3. Use in React component
const [features, setFeatures] = useState<NewFeature[]>([]);

const fetchFeatures = async () => {
  try {
    const apiFeatures = await apiService.getNewFeature();
    setFeatures(apiFeatures);
  } catch (error) {
    console.error("Failed to fetch features:", error);
    // Handle error appropriately
  }
};
```

#### 🔧 API Configuration

**Environment Variables:**
```env
NEXT_PUBLIC_API_BASE_URL=https://marketplace-backend-hm4q.onrender.com
```

**API Features:**
- **Base URL:** Configurable via environment variables
- **Token Management:** Automatic JWT refresh and storage
- **Error Handling:** Comprehensive error catching with user-friendly messages
- **TypeScript Interfaces:** Full type safety for all API responses
- **Cookie Integration:** Sets auth cookies for middleware authentication
- **Request Interceptors:** Automatic authorization headers
- **Batch Operations:** Efficient cart updates with batch processing
- **CORS Support:** Configured for development and production environments

### Utility Functions & Services

#### Core Utilities (`lib/utils.ts` - 97 lines)
```typescript
// Class name merging utility
export function cn(...inputs: ClassValue[]): string

// Nigerian Naira formatting
export function formatNaira(amount: number): string
export function formatNairaWithDecimals(price: number | string): string

// URL generation for products
export function uuidToShortId(uuid: string): number
export function createProductUrl(uuid: string, slug: string): string
export function parseProductUrl(urlPath: string): { shortId: number; slug: string } | null
export async function shortIdToUuid(shortId: number, products: any[]): Promise<string | null>
```

**Utility Features:**
- **Currency Formatting:** Nigerian Naira with proper locale formatting
- **URL Generation:** Short IDs from UUIDs for SEO-friendly URLs  
- **Class Merging:** Tailwind CSS class optimization with clsx and tailwind-merge
- **Product URL Parsing:** Extract product information from URL parameters

#### Local Storage Cart Service (`lib/localStorage-cart.ts` - 243 lines)

Comprehensive cart persistence for anonymous users:

```typescript
export interface LocalCartItem {
  productId: string;
  quantity: number;
  variationId?: string;
  addedAt: number;
}

export class LocalStorageCartService {
  // Core cart operations
  static getLocalCart(): LocalCartItem[]
  static setLocalCart(items: LocalCartItem[]): void
  static addToLocalCart(productId: string, quantity: number, variationId?: string): void
  static updateLocalCartQuantity(productId: string, quantity: number, variationId?: string): void
  static removeFromLocalCart(productId: string, variationId?: string): void
  static clearLocalCart(): void

  // Enhanced cart operations with product details
  static async getLocalCartWithProducts(): Promise<CartItem[]>
  static async getLocalCartAsCart(): Promise<Cart | null>
  
  // Utility methods
  static getLocalCartCount(): number
  static isProductInLocalCart(productId: string, variationId?: string): boolean
  static getProductQuantityInLocalCart(productId: string, variationId?: string): number
}
```

**Local Storage Features:**
- **Expiration Management:** 7-day automatic cleanup of old cart items
- **Product Hydration:** Fetches full product details for display
- **Variation Support:** Handles product size/color variations
- **Error Resilience:** Graceful handling of missing products
- **Cart Merging:** Automatic sync with server cart on login
- **Type Safety:** Full TypeScript interfaces for all operations

## Components

### UI Components (shadcn/ui)

Located in `components/ui/`, these are customizable components built on Radix UI primitives with Tailwind CSS styling:

#### Form Components
- **`button.tsx`** - Primary, secondary, destructive, outline, ghost variants with loading states
- **`input.tsx`** - Text input with error states and validation styling  
- **`label.tsx`** - Accessible form labels with required indicators
- **`textarea.tsx`** - Multi-line text input with resize controls
- **`checkbox.tsx`** - Custom styled checkboxes with indeterminate state
- **`switch.tsx`** - Toggle switches with smooth animations

#### Navigation Components  
- **`dropdown-menu.tsx`** - Context menus with keyboard navigation (258 lines)
- **`tabs.tsx`** - Horizontal and vertical tab navigation
- **`command.tsx`** - Command palette with search and filtering (178 lines)

#### Feedback Components
- **`dialog.tsx`** - Modal dialogs with backdrop and focus management (136 lines)
- **`drawer.tsx`** - Bottom sheet drawers for mobile (133 lines) 
- **`tooltip.tsx`** - Hover tooltips with positioning
- **`sonner.tsx`** - Toast notifications with variants (success, error, info)

#### Layout Components
- **`card.tsx`** - Content containers with header, body, footer sections
- **`accordion.tsx`** - Collapsible content sections
- **`sheet.tsx`** - Side panels and overlays (140 lines)
- **`popover.tsx`** - Floating content with arrow positioning

#### Data Display
- **`avatar.tsx`** - User profile images with fallback initials
- **`badge.tsx`** - Status indicators and labels with color variants

#### Custom Components
- **`ProtectedLink.tsx`** - Link component that requires authentication

### Custom Martaf Components

Located in `components/martaf/`, these are business-specific components:

#### Core Layout Components
- **`Header.tsx`** (463 lines) - Main navigation bar with:
  - Category dropdown menu with icons
  - Search functionality with autocomplete
  - User authentication status
  - Shopping cart indicator with item count
  - Mobile hamburger menu
  - Responsive design for all screen sizes

- **`Footer.tsx`** (92 lines) - Site footer containing:
  - Company information and social links
  - Quick navigation links
  - Legal pages and policies
  - Newsletter signup
  - Multi-column responsive layout

- **`ConditionalHeader.tsx`** (28 lines) - Header visibility controller:
  - Shows/hides header based on current route
  - Excludes header from auth pages
  - Handles dynamic routing conditions

#### Product Components
- **`ProductCard.tsx`** (187 lines) - Reusable product display with:
  - Product image with lazy loading
  - Price display with discount calculation
  - Add to cart and wishlist buttons
  - Hover effects and loading states
  - Responsive grid layout support

- **`TrendingProducts.tsx`** (225 lines) - Product carousel featuring:
  - Horizontal scrolling product list
  - Category-based filtering
  - Loading skeletons
  - Mobile-optimized touch scrolling

- **`Categories.tsx`** (69 lines) - Category navigation sidebar:
  - Hierarchical category structure
  - Icons for each category
  - Active state highlighting
  - Mobile collapsible menu

#### Product Detail Components
- **`RatingsReviewsDrawer.tsx`** (457 lines) - Comprehensive review system:
  - Star rating display and input
  - Review list with pagination
  - User review submission form
  - Review filtering and sorting
  - Mobile drawer interface

- **`SizeGuideDrawer.tsx`** (187 lines) - Size guide modal with:
  - Category-specific size charts (Men, Women, Children)
  - Measurement conversion tables
  - Interactive size selector
  - Mobile-optimized drawer

- **`ReviewForm.tsx`** (145 lines) - Review submission form:
  - Star rating input component
  - Textarea for review comments
  - Form validation and submission
  - Success/error state handling

#### Homepage Components
- **`HeroSection.tsx`** (34 lines) - Homepage hero banner:
  - African woman with shopping bags image
  - Call-to-action buttons
  - Responsive background and layout
  - Brand messaging

- **`DiscountItems.tsx`** (55 lines) - Featured discount products
- **`PopularSearches.tsx`** (55 lines) - Trending search terms
- **`JoinMartaf.tsx`** (24 lines) - Seller recruitment section
- **`ImpactNumbers.tsx`** (45 lines) - Statistics display
- **`WhyChooseMartaf.tsx`** (54 lines) - Value proposition section

### Authentication Components

Located in `components/martaf/AuthPopups/`, comprehensive auth flow:

#### Main Auth Modals
- **`SignInPopup.tsx`** (276 lines) - Login interface with:
  - Email/password form with validation
  - Remember me functionality
  - Social login options
  - Forgot password link
  - Registration redirect

- **`SignUpPopup.tsx`** (232 lines) - Registration form with:
  - Email verification flow
  - Customer/manufacturer role selection
  - Terms and conditions acceptance
  - Password strength validation
  - Login redirect

#### Password Recovery Flow
- **`ForgotPasswordPopup.tsx`** (157 lines) - Password reset request
- **`ForgotEmailPopup.tsx`** (196 lines) - Email recovery for forgotten emails
- **`ResetPasswordPopup.tsx`** (225 lines) - New password setting form
- **`PasswordUpdatedPopup.tsx`** (53 lines) - Success confirmation

#### Email Verification Flow  
- **`VerifyEmailPopup.tsx`** (173 lines) - Email verification interface
- **`CheckInboxPopup.tsx`** (64 lines) - Email sent confirmation
- **`AllDonePopup.tsx`** (64 lines) - Process completion confirmation

**Authentication Features:**
- Multi-step verification process
- Email-based password recovery
- Role-based registration (customer/manufacturer)
- Form validation with error handling
- Mobile-responsive modal design
- Toast notifications for all actions

## Pages & Routing

### Public Pages
- `/` - Homepage with hero section and product showcases
- `/landing` - Alternative landing page
- `/categories/[slug]` - Category product listings
- `/product/[slug]` - Individual product details
- `/login` - User login
- `/signup` - User registration

### Protected Pages (Require Authentication)
- `/account` - User dashboard
- `/account/orders` - Order history
- `/account/wishlist` - Saved products
- `/account/shipping-addresses` - Address management
- `/account/payment-methods` - Payment options
- `/cart` - Shopping cart
- `/checkout` - Order checkout

### Middleware Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Redirects unauthenticated users from protected routes
  // Redirects authenticated users from auth pages
}
```

## Styling & Design System

### Tailwind CSS 4 Configuration

**Core Configuration (`app/globals.css` - 134 lines):**
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  /* ... 35+ CSS custom properties */
}
```

### Design Token System (OKLCH Color Space)

#### Light Theme Variables
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);           /* Pure white */
  --foreground: oklch(0.145 0 0);       /* Near black */
  --primary: oklch(0.205 0 0);          /* Dark gray */
  --secondary: oklch(0.97 0 0);         /* Light gray */
  --muted: oklch(0.97 0 0);            /* Subtle background */
  --border: oklch(0.922 0 0);          /* Border gray */
  --destructive: oklch(0.577 0.245 27.325); /* Red for errors */
  /* ... chart colors, sidebar colors, etc. */
}
```

#### Dark Theme Variables
```css
.dark {
  --background: oklch(0.145 0 0);       /* Dark background */
  --foreground: oklch(0.985 0 0);       /* Light text */
  --card: oklch(0.205 0 0);            /* Card background */
  /* ... inverted color scheme */
}
```

### Typography & Font System
- **Primary Font:** Montserrat (Google Fonts) with Latin subset
- **Font Loading:** Optimized with Next.js font optimization
- **Fallbacks:** System fonts for performance
- **Weights:** Multiple weights available for hierarchy

### Responsive Design System

#### Breakpoint Strategy
- **Mobile First:** All styles written for mobile (320px+)
- **Tablet:** md: prefix (768px+)  
- **Desktop:** lg: prefix (1024px+)
- **Large Desktop:** xl: prefix (1280px+)

#### Component Responsive Patterns
```css
/* Mobile-first approach example */
.product-grid {
  @apply grid grid-cols-1 gap-4;        /* Mobile: 1 column */
  @apply md:grid-cols-2 md:gap-6;       /* Tablet: 2 columns */
  @apply lg:grid-cols-3 lg:gap-8;       /* Desktop: 3 columns */
  @apply xl:grid-cols-4;                /* Large: 4 columns */
}
```

### Custom Utility Classes
```css
@layer utilities {
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### shadcn/ui Configuration (`components.json`)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",           // Design variant
  "rsc": true,                   // React Server Components
  "tsx": true,                   // TypeScript support
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",      // Base color palette
    "cssVariables": true,        // CSS custom properties
    "prefix": ""                 // No class prefix
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"        // Icon system
}
```

### Theme System Integration
- **Provider:** `next-themes` with system preference detection
- **Theme Toggle:** Automatic dark/light mode switching
- **Persistence:** Theme preference saved in localStorage
- **SSR Safe:** Prevents hydration mismatches

### Image Optimization (`next.config.ts`)
```typescript
const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.pixabay.com", 
      "images.pexels.com",
      "res.cloudinary.com",
      "images.rawpixel.com"
    ],
  },
  allowedDevOrigins: [
    "192.168.1.109",    // Mobile device IP
    "192.168.1.*",      // Local network access
  ],
};
```

### Accessibility Standards
- **ARIA Labels:** Comprehensive screen reader support
- **Keyboard Navigation:** Tab order and focus management
- **Color Contrast:** WCAG AA compliance
- **Touch Targets:** Minimum 44px for mobile interactions
- **Focus Indicators:** Visible focus states for all interactive elements

### Development Best Practices
- **Component Composition:** Use `cn()` utility for class merging
- **Responsive Images:** Always use Next.js Image component
- **Loading States:** Skeleton components for async content
- **Error Boundaries:** Graceful error handling with styled components
- **Performance:** Lazy loading and code splitting
- **Mobile Testing:** Test on actual devices, not just browser dev tools

## Development Guidelines

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states for async operations

### Performance
- Use Next.js Image component for optimized images
- Implement lazy loading where appropriate
- Minimize bundle size with tree shaking
- Use React Suspense for data fetching

### Testing
- Test components in isolation
- Verify responsive behavior
- Test authentication flows
- Validate API integration

## API Documentation

### Base Configuration
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://marketplace-backend-hm4q.onrender.com';
```

### Authentication Flow

#### Registration
```typescript
POST /auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "is_customer": true,
  "is_manufacturer": false
}

Response: {
  "access": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_customer": true,
    "is_manufacturer": false
  }
}
```

#### Login
```typescript
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securePassword123",
  "remember_me": true
}

Response: {
  "access": "jwt_token_here",
  "user": { /* user object */ }
}
```

#### Token Management
- **Storage:** localStorage (`access_token`) + httpOnly cookie (`auth_token`)
- **Refresh:** Automatic token refresh on API calls
- **Expiration:** Tokens handled transparently by ApiService
- **Logout:** Clears both localStorage and cookies

### Product Endpoints

#### Get Products (with advanced filtering)
```typescript
GET /products/?search=shirt&category=clothing&price_min=1000&price_max=5000&page=1

Response: {
  "count": 150,
  "next": "https://api.../products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "African Print Shirt",
      "slug": "african-print-shirt",
      "description": "Beautiful traditional shirt...",
      "price": "2500.00",
      "discount_price": "2000.00",
      "discount_percent": 20,
      "category": {
        "name": "Clothing",
        "parent": { "name": "Fashion" }
      },
      "images_data": [
        {
          "id": "uuid",
          "image_urls": {
            "original": "https://...",
            "medium": "https://...",
            "thumbnail": "https://..."
          },
          "alt_text": "African print shirt front view"
        }
      ],
      "variations_data": [
        {
          "id": "uuid",
          "size": "M",
          "color": "Blue",
          "stock": 15,
          "low_stock_threshold": 5
        }
      ],
      "reviews_data": [/* review objects */],
      "inventory": 50,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Product URL Patterns
- **By ID:** `/products/{uuid}/`
- **By Slug:** `/products/slug/{slug}/`  
- **By URL:** `/products/url/{shortId}-{slug}/`

### Cart Management

#### Get Cart
```typescript
GET /cart/
Authorization: Bearer {jwt_token}

Response: {
  "id": "uuid",
  "user": { /* user object */ },
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": "1000.00",
        "discount_price": "800.00",
        "images_data": [/* image objects */]
      },
      "variation": {
        "id": "uuid",
        "size": "L",
        "color": "Red",
        "stock": 10
      },
      "quantity": 2,
      "subtotal": 1600.00,
      "formatted_subtotal": "₦1,600.00"
    }
  ],
  "total": 1600.00,
  "formatted_total": "₦1,600.00",
  "total_items": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Add to Cart
```typescript
POST /cart/add/
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "product_id": "uuid",
  "quantity": 2,
  "variation": "uuid" // optional
}

Response: {
  "detail": "Product added to cart successfully"
}
```

#### Batch Update Cart Items
```typescript
POST /cart/batch-update/
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "items": [
    { "id": "cart_item_uuid", "quantity": 3 },
    { "id": "cart_item_uuid", "quantity": 1 }
  ]
}

Response: {
  "updated_items": [
    { "id": "uuid", "status": "updated", "quantity": 3 },
    { "id": "uuid", "status": "updated", "quantity": 1 }
  ],
  "errors": []
}
```

### Wishlist Management

#### Get Wishlist
```typescript
GET /wishlist/
Authorization: Bearer {jwt_token}

Response: {
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "user": "user_uuid",
      "products": [/* product objects */],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Review System

#### Create Review
```typescript
POST /products/{product_id}/reviews/
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product quality!"
}

Response: {
  "id": "uuid",
  "rating": 5,
  "comment": "Excellent product quality!",
  "user": "user_uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Error Handling Standards

#### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (invalid/expired token)
- **403:** Forbidden (insufficient permissions)
- **404:** Not Found
- **429:** Rate Limited
- **500:** Internal Server Error

#### Error Response Format
```typescript
{
  "detail": "Specific error message",
  "field_errors": {
    "email": ["This field is required"],
    "password": ["Password too weak"]
  },
  "non_field_errors": ["Invalid credentials"]
}
```

### Rate Limiting & Performance
- **Rate Limits:** Not currently implemented
- **Caching:** Client-side caching in ApiService
- **Pagination:** Standard offset-based pagination
- **Search:** Full-text search with category filtering
- **Image Optimization:** Multiple image sizes available

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `NEXT_PUBLIC_API_BASE_URL`

### Performance Optimizations
- Static generation where possible
- Image optimization enabled
- Bundle analysis and optimization
- CDN usage for static assets

## Troubleshooting

### Common Issues & Solutions

#### 1. Cart Synchronization Problems

**Symptoms:**
- Cart items not appearing after login
- Local cart not merging with server cart
- Cart count showing incorrect numbers

**Debugging Steps:**
```typescript
// Check localStorage cart
console.log('Local cart:', LocalStorageCartService.getLocalCart());

// Check authentication status
console.log('Auth status:', apiService.isAuthenticated());

// Check server cart
apiService.getCart().then(cart => console.log('Server cart:', cart));
```

**Solutions:**
- Clear localStorage: `localStorage.removeItem('martaf_cart')`
- Check authentication token: `localStorage.getItem('access_token')`
- Verify API connectivity: Check network tab for failed requests
- Force cart refresh: Call `refreshCart()` from cart context

#### 2. Image Loading Issues

**Symptoms:**
- Images showing broken/404 errors
- Next.js Image component not loading
- Images not optimized

**Solutions:**
```typescript
// Check next.config.ts domains
const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.pixabay.com", 
      "images.pexels.com",
      "res.cloudinary.com",
      "images.rawpixel.com"
    ],
  },
};
```

**Debugging:**
- Check browser console for CORS errors
- Verify image URL format in API response
- Test image URL directly in browser
- Ensure domain is whitelisted in Next.js config

#### 3. Authentication Flow Issues

**Symptoms:**
- Login successful but user not authenticated
- Tokens expiring immediately
- Redirect loops on protected routes

**Debugging Commands:**
```bash
# Check stored tokens
localStorage.getItem('access_token')
document.cookie // Check for auth_token cookie

# Test API endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" https://marketplace-backend-hm4q.onrender.com/auth/user/
```

**Solutions:**
- Clear all auth data: `apiService.logout()`
- Check middleware configuration in `middleware.ts`
- Verify API_BASE_URL environment variable
- Check token format (should be JWT)

#### 4. Mobile Development Issues

**Symptoms:**
- App not accessible on mobile device
- Touch events not working
- Responsive design broken

**Solutions:**
```bash
# Check local network IP
ipconfig getifaddr en0  # macOS
ip route get 1.1.1.1 | awk '{print $7}'  # Linux

# Update next.config.ts with your IP
allowedDevOrigins: ["192.168.1.XXX"]
```

**Mobile Testing:**
- Use actual device, not browser dev tools
- Test on different screen sizes (iPhone SE, iPad, etc.)
- Verify touch targets are 44px minimum
- Check horizontal scrolling issues

#### 5. Build & Deployment Issues

**Symptoms:**
- Build failing with TypeScript errors
- Static generation errors
- Performance issues in production

**Build Debugging:**
```bash
# Detailed build output
npm run build -- --debug

# Check bundle size
npm run build && npx @next/bundle-analyzer

# Type checking
npx tsc --noEmit
```

**Solutions:**
- Fix TypeScript strict mode errors
- Optimize images and fonts
- Check for circular dependencies
- Verify environment variables in production

#### 6. State Management Issues

**Symptoms:**
- Context values not updating
- Components not re-rendering
- State inconsistencies

**Debugging React Context:**
```typescript
// Add to component for debugging
const { user, isLoading, isAuthenticated } = useAuth();
console.log('Auth context:', { user, isLoading, isAuthenticated });

const { cart, error } = useCart();
console.log('Cart context:', { cart, error });
```

**Solutions:**
- Check context provider hierarchy in `app/layout.tsx`
- Verify useEffect dependencies
- Check for stale closures in event handlers
- Use React DevTools for component inspection

### Development Debugging Tools

#### Browser DevTools Setup
```javascript
// Add to browser console for debugging
window.martafDebug = {
  auth: () => console.log('Auth:', JSON.parse(localStorage.getItem('access_token') || 'null')),
  cart: () => console.log('Cart:', JSON.parse(localStorage.getItem('martaf_cart') || '[]')),
  clearAuth: () => {
    localStorage.removeItem('access_token');
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
  clearCart: () => localStorage.removeItem('martaf_cart')
};
```

#### Network Debugging
```bash
# Monitor API calls
DEBUG=* npm run dev

# Check specific API endpoint
curl -v https://marketplace-backend-hm4q.onrender.com/products/

# Test with authentication
curl -H "Authorization: Bearer TOKEN" -v https://marketplace-backend-hm4q.onrender.com/cart/
```

#### Performance Debugging
```bash
# Bundle analysis
npm run build
npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check for memory leaks
node --inspect npm run dev
```

### Environment-Specific Issues

#### Development Environment
- **Turbopack Issues:** Disable with `npm run dev -- --no-turbo`
- **Hot Reload Problems:** Clear `.next` folder and restart
- **Port Conflicts:** Use `npm run dev -- -p 3001`

#### Production Environment
- **Static Generation:** Check for dynamic imports
- **Environment Variables:** Verify all `NEXT_PUBLIC_` vars
- **Image Optimization:** Ensure image domains are configured

### Getting Help

#### Debugging Checklist
1. ✅ Check browser console for errors
2. ✅ Verify network requests in DevTools
3. ✅ Test API endpoints with curl/Postman
4. ✅ Check localStorage and cookies
5. ✅ Verify environment variables
6. ✅ Test on different devices/browsers
7. ✅ Check TypeScript compilation
8. ✅ Review component props and state

#### Log Collection
```bash
# Collect comprehensive logs
npm run dev > debug.log 2>&1

# API request logging
DEBUG=api:* npm run dev

# Database query logging (if applicable)
DEBUG=db:* npm run dev
```

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Test thoroughly on mobile and desktop
4. Submit pull request with clear description

### Code Standards
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling
- Add comments for complex logic

### Design Guidelines
- Mobile-first responsive design
- Consistent spacing and typography
- Accessible components
- Brand-compliant styling

---

**Note for Future Developers:**
This project follows modern React patterns with Next.js App Router. The authentication system is robust with automatic token management, and the cart system handles both authenticated and anonymous users seamlessly. Pay special attention to the responsive design patterns and ensure all new components follow the established mobile-first approach.

For questions about specific implementations, refer to the code comments and the comprehensive type definitions in `lib/api.ts` and `types/api.ts`.
