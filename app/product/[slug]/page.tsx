"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Share2, Star, Shield, RotateCcw, MessageCircle, Phone, MapPin, ChevronRight, Facebook, Twitter, Copy, Loader2, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/martaf/ProductCard";
import { RatingsReviewsDrawer } from "@/components/martaf/RatingsReviewsDrawer";
import { SizeGuideDrawer } from "@/components/martaf/SizeGuideDrawer";
import { ReviewForm } from "@/components/martaf/ReviewForm";
import { useState, use, useEffect } from "react";
import { apiService, Product } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data for similar products
const similarProducts = [
  {
    id: "1",
    name: "Nigerian Ankara Dress",
    price: 25000,
    originalPrice: 35000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "2", 
    name: "Adire Traditional Shirt",
    price: 18000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
  {
    id: "3",
    name: "Gele Head Wrap",
    price: 12000,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "4",
    name: "Agbada Traditional Wear",
    price: 85000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
  {
    id: "5",
    name: "Kente Cloth Fabric",
    price: 15000,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "6",
    name: "Traditional Beads",
    price: 8500,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
];

// Mock review data with images and videos
const mockReviews = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    date: "Jan 15, 2024",
    rating: 5,
    comment: "Absolutely love these shoes! The quality is outstanding and they're so comfortable. Perfect for both casual and formal occasions.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "2",
    customerName: "Mike Chen",
    date: "Jan 12, 2024",
    rating: 4,
    comment: "Great shoes, very comfortable and stylish. The delivery was fast and packaging was excellent.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "3",
    customerName: "Emma Wilson",
    date: "Jan 10, 2024",
    rating: 5,
    comment: "Perfect fit and amazing quality! I've been wearing them daily and they still look brand new.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "4",
    customerName: "David Rodriguez",
    date: "Jan 08, 2024",
    rating: 4,
    comment: "Good quality shoes, comfortable to wear. The color is exactly as shown in the pictures.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: "5",
    customerName: "Lisa Thompson",
    date: "Jan 05, 2024",
    rating: 5,
    comment: "Excellent shoes! Very comfortable and the design is beautiful. Highly recommend!",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: "6",
    customerName: "James Miller",
    date: "Jan 03, 2024",
    rating: 4,
    comment: "Nice shoes, good value for money. The sizing is accurate and they arrived quickly.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  {
    id: "7",
    customerName: "Anna Garcia",
    date: "Dec 28, 2023",
    rating: 5,
    comment: "Amazing quality and super comfortable! I love the design and they go with everything.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  },
  {
    id: "8",
    customerName: "Robert Lee",
    date: "Dec 25, 2023",
    rating: 4,
    comment: "Good shoes, comfortable fit. The material feels premium and durable.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "9",
    customerName: "Maria Santos",
    date: "Dec 22, 2023",
    rating: 5,
    comment: "Perfect shoes! Exactly what I was looking for. Great quality and fast shipping.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  },
  {
    id: "10",
    customerName: "Kevin Brown",
    date: "Dec 20, 2023",
    rating: 4,
    comment: "Nice shoes, good build quality. They're comfortable for long walks.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    id: "11",
    customerName: "Jennifer Davis",
    date: "Dec 18, 2023",
    rating: 5,
    comment: "Love these shoes! They're stylish, comfortable, and well-made. Will definitely buy again.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
  },
  {
    id: "12",
    customerName: "Thomas Anderson",
    date: "Dec 15, 2023",
    rating: 4,
    comment: "Good quality shoes. They fit well and are comfortable for daily wear.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
  },
  {
    id: "13",
    customerName: "Rachel Green",
    date: "Dec 12, 2023",
    rating: 5,
    comment: "Excellent shoes! Perfect fit, great quality, and they look amazing. Highly recommend!",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "14",
    customerName: "Mark Taylor",
    date: "Dec 10, 2023",
    rating: 4,
    comment: "Nice shoes, good value. They're comfortable and the design is appealing.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "15",
    customerName: "Sophie Clark",
    date: "Dec 08, 2023",
    rating: 5,
    comment: "Amazing shoes! They exceeded my expectations. Great quality, comfort, and style.",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  }
];

const ratingBreakdown = {
  5: 9,
  4: 4,
  3: 1,
  2: 1,
  1: 0,
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [lastQuantityAction, setLastQuantityAction] = useState<'increment' | 'decrement' | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('details');
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSimilarProductsLoading, setIsSimilarProductsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [displayedSimilarProducts, setDisplayedSimilarProducts] = useState(similarProducts.slice(0, 6));

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  // Product images array - use real product images or fallback
  const productImages: string[] = product?.images_data?.length 
    ? product.images_data.map((img: any) => img.image_urls.medium)
    : [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop"
      ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
    setLastQuantityAction('increment');
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
    setLastQuantityAction('decrement');
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    if (isWishlistLoading || !product) return;

    setIsWishlistLoading(true);

    try {
      if (isWishlisted) {
        await apiService.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await apiService.addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      const message = error instanceof Error ? error.message : "Operation failed";
      toast.error(message);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    if (!isAuthenticated || !product) return;

    try {
      const wishlist = await apiService.getWishlist();
      if (wishlist.length > 0) {
        // Check if product is in any of the wishlists (though typically there's only one per user)
        const isInWishlist = wishlist.some(list => 
          list.products.some(p => p.id === product.id)
        );
        setIsWishlisted(isInWishlist);
      } else {
        setIsWishlisted(false);
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  // Load product reviews
  const loadReviews = async () => {
    if (!product) return;

    setIsLoadingReviews(true);
    try {
      const reviewsData = await apiService.getProductReviews(product.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      // Fallback to mock reviews if API fails
      setReviews(mockReviews);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Handle review form submission
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    loadReviews(); // Reload reviews after submission
  };

  // Load product data from API
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsPageLoading(true);
        console.log("Loading product with URL param:", slug);
        
        // Use the new method that handles URL parsing
        const productData = await apiService.getProductByUrl(slug);
        console.log("Loaded product data:", productData);
        setProduct(productData);
        
        // Load similar products after main product loads
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSimilarProductsLoading(false);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error(`Failed to load product details: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsPageLoading(false);
      }
    };

    if (slug) {
      loadProductData();
    }
  }, [slug]);

  // Check wishlist status when product and auth state change
  useEffect(() => {
    if (!authLoading && product) {
      checkWishlistStatus();
    }
  }, [authLoading, isAuthenticated, product]);

  // Load reviews when product changes
  useEffect(() => {
    if (product) {
      loadReviews();
    }
  }, [product]);

  // Add to cart function using cart context
  const handleAddToCartButton = async () => {
    setIsAddingToCart(true);
    
    try {
      if (!product) {
        throw new Error("Product not found");
      }

      // Find selected variation if any
      let selectedVariation = null;
      if (selectedSize && product.variations_data) {
        selectedVariation = product.variations_data.find(
          v => v.size === selectedSize || v.color === selectedSize || v.id === selectedSize
        );
      }

      // Use cart context which automatically updates header
      await addToCartContext(product.id, quantity, selectedVariation?.id);
      
      // Cart context already shows success toast
    } catch (error) {
      console.error("Add to cart failed:", error);
      // Cart context already handles error toasts
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle add to cart with loading
  const handleAddToCart = async () => {
    await handleAddToCartButton();
  };

  // Load more similar products
  const loadMoreSimilarProducts = () => {
    if (isLoadingMoreProducts || !hasMoreProducts) return;
    
    setIsLoadingMoreProducts(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const currentLength = displayedSimilarProducts.length;
      
      // Create more products by duplicating with unique IDs
      const additionalProducts: typeof similarProducts = [];
      for (let i = 0; i < 4; i++) {
        const baseProduct = similarProducts[i % similarProducts.length];
        // Use timestamp and index to ensure unique keys
        const uniqueId = `${baseProduct.id}-${Date.now()}-${currentLength + i}`;
        additionalProducts.push({
          ...baseProduct,
          id: uniqueId,
        });
      }
      
      setDisplayedSimilarProducts(prev => [...prev, ...additionalProducts]);
      setIsLoadingMoreProducts(false);
      
      // Stop loading after showing many products
      if (displayedSimilarProducts.length > 18) {
        setHasMoreProducts(false);
      }
    }, 1200);
  };

  // Load more products when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreSimilarProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedSimilarProducts.length, isLoadingMoreProducts, hasMoreProducts]);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareOptions) {
        const target = event.target as Element;
        if (!target.closest('.share-dropdown')) {
          setShowShareOptions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareOptions]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white">
      {/* Loading Content */}
      <div className="animate-pulse">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gray-200"></div>
        
        {/* Thumbnails Skeleton */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="p-4 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          
          {/* Quantity Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-4 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>

          {/* Size Options Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-10 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Color Options Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  // Responsive three-column layout for desktop
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation - Desktop Only */}
      <div className="hidden lg:block max-w-7xl mx-auto px-2 md:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/categories" className="hover:text-purple-600 transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/categories" className="hover:text-purple-600 transition-colors">
            {product?.category?.name || 'Electronics'}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {product?.name || 'Product Name'}
          </span>
        </nav>
      </div>
      
      <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product Images */}
        <div className="col-span-1">
          {/* Product Images */}
          <div className="relative">
            {/* Main Image with Advanced Zoom */}
            <div 
              className="aspect-square bg-gray-100 relative overflow-hidden cursor-crosshair group md:cursor-crosshair cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  if (isZooming) {
                    handleMouseLeave();
                  } else {
                    handleMouseEnter();
                    handleMouseMove(e);
                  }
                }
              }}
            >
              <Image
                src={productImages[selectedImageIndex]}
                alt={product?.name || "Product image"}
                width={800}
                height={800}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZooming ? 'scale-110' : 'scale-100'}`}
              />
              
              {/* Zoom Overlay */}
              {isZooming && (
                <>
                  {/* Magnifying Glass Circle */}
                  <div
                    className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full bg-white/10 backdrop-blur-sm transition-all duration-150 ease-out"
                    style={{
                      width: '150px',
                      height: '150px',
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    {/* Zoomed Image Inside Circle */}
                    <div
                      className="w-full h-full rounded-full overflow-hidden relative"
                      style={{
                        backgroundImage: `url(${productImages[selectedImageIndex]})`,
                        backgroundSize: '400%',
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Inner glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20"></div>
                    </div>
                  </div>
                  
                  {/* Zoom Indicator */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    🔍 Zoom Active
                  </div>
                  
                  {/* Crosshair Effect */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Horizontal line */}
                    <div className="absolute w-8 h-0.5 bg-blue-500/60 -translate-x-1/2 -translate-y-1/2"></div>
                    {/* Vertical line */}
                    <div className="absolute w-0.5 h-8 bg-blue-500/60 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </>
              )}
              
              {/* Zoom Instructions */}
              <div className={`absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm transition-opacity duration-300 ${
                isZooming ? 'opacity-0' : 'opacity-100'
              }`}>
                <span className="hidden md:inline">Hover to zoom</span>
                <span className="md:hidden">Click to zoom</span>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="p-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {productImages.map((src: string, i: number) => (
                  <div 
                    key={i} 
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${selectedImageIndex === i ? 'border-blue-500 ring-2 ring-blue-200 scale-105' : 'border-gray-300 hover:border-gray-400 hover:scale-102'}`}
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <Image
                      src={src}
                      alt={`Product view ${i + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Middle: Product Info & Actions */}
        <div className="col-span-1">
          {/* Product Title, Price, Rating, Wishlist, Share, Variations, Quantity, Add to Cart */}
          <div className="mt-4">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl lg:text-3xl font-semibold flex-1">{product?.name || "Product Name"}</h1>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatNaira(Number(product?.discount_price || product?.price || 45.00))}
            </div>
            <div className="text-sm text-green-600 mb-4">
              {product?.inventory && product.inventory > 0 ? "In stock" : "Out of stock"}
            </div>
            {/* Rating row */}
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setRatingsOpen(true)}>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.5/5</span>
              <span className="text-sm text-gray-500">({product?.reviews_data?.length || 15} reviews)</span>
            </div>



            {/* Wishlist and Share buttons */}
            <div className="flex gap-2 mb-4 relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
              >
                {isWishlistLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              
              {/* Share Options Dropdown */}
              {showShareOptions && (
                <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[200px] share-dropdown">
                  <div className="text-sm font-medium mb-2 text-gray-700">Share this product</div>
                  <div className="space-y-1">
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        navigator.share?.({
                          title: product?.name || 'Product Name',
                          text: 'Check out this amazing product!',
                          url: window.location.href
                        }) || navigator.clipboard.writeText(window.location.href);
                        setShowShareOptions(false);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share via...
                    </button>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowShareOptions(false);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy link
                    </button>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook
                    </button>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out this amazing product!`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      Twitter
                    </button>
                    <button 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        window.open(`whatsapp://send?text=Check out this amazing product! ${window.location.href}`, '_blank');
                        setShowShareOptions(false);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Size/Color Selection */}
            <div className="mb-4">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Variations Available</h3>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <div className="text-sm text-gray-600">Size guide</div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Size Guide</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        Find your perfect fit with our size guide. Measurements are in centimeters.
                      </div>
                      
                      {/* Size Chart Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">US</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">UK</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">EU</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Foot Length (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">41</td>
                              <td className="border border-gray-300 px-4 py-2">8</td>
                              <td className="border border-gray-300 px-4 py-2">7</td>
                              <td className="border border-gray-300 px-4 py-2">41</td>
                              <td className="border border-gray-300 px-4 py-2">26.0</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">42</td>
                              <td className="border border-gray-300 px-4 py-2">8.5</td>
                              <td className="border border-gray-300 px-4 py-2">7.5</td>
                              <td className="border border-gray-300 px-4 py-2">42</td>
                              <td className="border border-gray-300 px-4 py-2">26.5</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">43</td>
                              <td className="border border-gray-300 px-4 py-2">9</td>
                              <td className="border border-gray-300 px-4 py-2">8</td>
                              <td className="border border-gray-300 px-4 py-2">43</td>
                              <td className="border border-gray-300 px-4 py-2">27.0</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">44</td>
                              <td className="border border-gray-300 px-4 py-2">9.5</td>
                              <td className="border border-gray-300 px-4 py-2">8.5</td>
                              <td className="border border-gray-300 px-4 py-2">44</td>
                              <td className="border border-gray-300 px-4 py-2">27.5</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">45</td>
                              <td className="border border-gray-300 px-4 py-2">10</td>
                              <td className="border border-gray-300 px-4 py-2">9</td>
                              <td className="border border-gray-300 px-4 py-2">45</td>
                              <td className="border border-gray-300 px-4 py-2">28.0</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">46</td>
                              <td className="border border-gray-300 px-4 py-2">10.5</td>
                              <td className="border border-gray-300 px-4 py-2">9.5</td>
                              <td className="border border-gray-300 px-4 py-2">46</td>
                              <td className="border border-gray-300 px-4 py-2">28.5</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">47</td>
                              <td className="border border-gray-300 px-4 py-2">11</td>
                              <td className="border border-gray-300 px-4 py-2">10</td>
                              <td className="border border-gray-300 px-4 py-2">47</td>
                              <td className="border border-gray-300 px-4 py-2">29.0</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2">48</td>
                              <td className="border border-gray-300 px-4 py-2">11.5</td>
                              <td className="border border-gray-300 px-4 py-2">10.5</td>
                              <td className="border border-gray-300 px-4 py-2">48</td>
                              <td className="border border-gray-300 px-4 py-2">29.5</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* How to Measure */}
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">How to measure your foot:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          <li>Place your foot on a piece of paper</li>
                          <li>Mark the longest toe and back of your heel</li>
                          <li>Measure the distance between the marks</li>
                          <li>Compare with the foot length in our size chart</li>
                          <li>Choose the size that matches or is slightly larger</li>
                        </ol>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {product?.variations_data?.length ? (
                    product.variations_data.map((variation, i) => (
                      <Button
                        key={variation.id || i}
                        variant={selectedSize === (variation.size || variation.id) ? "default" : "outline"}
                        size="sm"
                        className={`min-w-[40px] flex-shrink-0 ${selectedSize === (variation.size || variation.id) ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-300"}`}
                        onClick={() => setSelectedSize(variation.size || variation.id)}
                        disabled={variation.stock === 0}
                      >
                        {variation.size || `Option ${i + 1}`}
                        {variation.stock === 0 && (
                          <span className="ml-1 text-xs">(Out of stock)</span>
                        )}
                      </Button>
                    ))
                  ) : (
                    ['41', '42', '43', '44', '45', '46', '47', '48'].map((size, i) => (
                      <Button
                        key={i}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        className={`min-w-[40px] flex-shrink-0 ${selectedSize === size ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-300"}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Color:</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {product?.variations_data?.some(v => v.color) ? (
                    product.variations_data
                      .filter(v => v.color)
                      .map((variation, i) => (
                        <div key={variation.id || i} className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                            style={{ backgroundColor: variation.color?.toLowerCase() || '#gray' }}
                            onClick={() => setSelectedSize(variation.color || variation.id)}
                          ></div>
                          <span className="text-xs text-gray-600">{variation.color}</span>
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-white rounded border-2 border-gray-300"></div>
                        <span className="text-xs text-gray-600">White</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-600"></div>
                        <span className="text-xs font-medium text-gray-800">Blue</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded border-2 border-gray-300"></div>
                        <span className="text-xs text-gray-600">Red</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-black rounded border-2 border-gray-300"></div>
                        <span className="text-xs text-gray-600">Black</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 bg-amber-700 rounded border-2 border-gray-300"></div>
                        <span className="text-xs text-gray-600">Brown</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
                {/* Right: Seller & Policy Card (desktop only) */}
        <aside className="hidden lg:block col-span-1 sticky top-24 self-start h-fit">
          <div className="space-y-6">
            {/* Seller Card */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Supplier Name</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Supplier's Location
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      +234 8012345678
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={isFollowing ? "bg-blue-50 border-blue-500 text-blue-600 hover:bg-red-50 hover:border-red-500 hover:text-red-600" : ""}
                  onMouseEnter={(e) => {
                    if (isFollowing) {
                      e.currentTarget.textContent = "Unfollow";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isFollowing) {
                      e.currentTarget.textContent = "Following";
                    }
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
              
              {/* Shipping fee info */}
              <div className="text-sm text-gray-600 mb-4">
                <div className="font-medium mb-1">Shipping fee</div>
                <div>Free shipping within Lagos</div>
              </div>

              {/* Security/Refund Info - moved above buttons */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Secure payments</div>
                    <div className="text-sm text-gray-600">Every purchase on Martaf is secured with strict SSL encryption and PCI DSS data protection</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Standard refund policy</div>
                    <div className="text-sm text-gray-600">Claim a refund if your order doesn't ship, is missing, or arrives with product issues</div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 rounded-full ${lastQuantityAction === 'decrement' ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : ''}`}
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <span className="text-lg font-medium">-</span>
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 rounded-full ${lastQuantityAction === 'increment' ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : ''}`}
                  onClick={incrementQuantity}
                >
                  <span className="text-lg font-medium">+</span>
                </Button>
              </div>

              {/* Add to Cart/Buy Now Buttons */}
              <div className="space-y-3 mb-4">
                <Button
                  variant="outline"
                  className="w-full disabled:opacity-50"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Adding...
                    </div>
                  ) : (
                    "Add to cart"
                  )}
                </Button>
                <Button className="w-full bg-red-500 hover:bg-red-600">Buy now</Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View profile</Button>
                <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">Send message</Button>
              </div>
            </Card>
            
            {/* Hot Deals Banner */}
            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">EXCLUSIVE WEARS</div>
                  <div className="text-2xl font-bold">HOT DEALS</div>
                  <div className="text-sm">UPTO 50% DISCOUNT</div>
                </div>
                <div className="text-right">
                  <Button variant="secondary" size="sm">Shop now</Button>
                </div>
              </div>
            </Card>
          </div>
        </aside>
      </div>
      {/* Tabs and their content below the three columns, full width */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 mt-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="flex gap-6 border-b border-gray-200 mb-6 bg-purple-50 h-auto p-4 rounded-lg">
            <TabsTrigger value="details" className="px-0 py-3 text-base font-medium bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 text-purple-500 hover:text-purple-700">Product details</TabsTrigger>
            <TabsTrigger value="specs" className="px-0 py-3 text-base font-medium bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 text-purple-500 hover:text-purple-700">Product specifications</TabsTrigger>
            <TabsTrigger value="reviews" className="px-0 py-3 text-base font-medium bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 text-purple-500 hover:text-purple-700">Reviews</TabsTrigger>
            <TabsTrigger value="similar" className="px-0 py-3 text-base font-medium bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 text-purple-500 hover:text-purple-700">Similar items</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            {/* Product details content */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>{product?.description || "This is a high-quality product with excellent features and durability."}</p>
              {!product?.description && (
                <>
                  <p>Made from premium materials with attention to detail.</p>
                  <p>Perfect for everyday use and special occasions.</p>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="specs">
            {/* Product specifications content */}
            <div className="text-sm text-gray-600 space-y-2">
              <div className="text-sm font-medium mb-2">What's in the box?</div>
              <div className="space-y-1">
                <div>• 1 pair of shoes</div>
                <div>• 1 pair of shoelaces</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            {/* Reviews Section matching the design */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Reviews</h3>
                <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                  View more
                </button>
              </div>
              
              {/* Rating Summary and Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left: Overall Rating */}
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {reviews.length > 0 
                      ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
                      : "4.8"
                    }/5
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                {/* Right: Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm w-2">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ 
                            width: `${((ratingBreakdown[rating as keyof typeof ratingBreakdown] || 0) / (reviews.length || mockReviews.length)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm w-2">{ratingBreakdown[rating as keyof typeof ratingBreakdown] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filter/Sort Options */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <span className="text-sm font-bold text-green-600">🇳🇬</span>
                  </Button>
                </div>
              </div>
              
              {/* Pagination with Numbers and Stars */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button 
                    key={page}
                    variant={page === 1 ? "default" : "outline"} 
                    size="sm" 
                    className="w-10 h-8 p-0 flex items-center justify-center gap-1"
                  >
                    <span className="text-xs">{page}</span>
                    <Star className="w-2.5 h-2.5" />
                  </Button>
                ))}
              </div>
              
              {/* Individual Reviews */}
              <div className="space-y-6">
                {(reviews.length > 0 ? reviews : mockReviews).slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-sm mb-1">Customer Name</div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= (review.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">{review.date || "Jan 15, 2024"}</div>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Verified Purchase
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment || review.review || "There should probably something nice this guy will write that will sound sweet in the ear for people to buy the product."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="similar">
            {/* Similar Products Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Similar products</h2>
              {isSimilarProductsLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6B46C1]"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading similar products...</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {displayedSimilarProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      badge={product.badge}
                      freeShipping={product.freeShipping}
                      onFavorite={() => console.log(`Added ${product.name} to favorites`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Similar Items Section at Bottom */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 mt-12 mb-8">
        <h2 className="text-xl font-semibold mb-6">Similar items</h2>
        {isSimilarProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedSimilarProducts.slice(0, 24).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                badge={product.badge}
                freeShipping={product.freeShipping}
                onFavorite={() => console.log(`Added ${product.name} to favorites`)}
              />
            ))}
          </div>
        )}
        
        {/* Load More Button */}
        {hasMoreProducts && !isLoadingMoreProducts && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              onClick={loadMoreSimilarProducts}
              className="px-8 py-2"
            >
              Load more products
            </Button>
          </div>
        )}
        
        {isLoadingMoreProducts && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6B46C1]"></div>
            <span className="ml-2 text-sm text-gray-600">Loading more products...</span>
          </div>
        )}
      </div>
      
      {/* Ratings & Reviews Drawer */}
      <RatingsReviewsDrawer
        open={ratingsOpen}
        onOpenChange={setRatingsOpen}
        averageRating={reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
          : 4.8
        }
        totalReviews={reviews.length || mockReviews.length}
        ratingBreakdown={ratingBreakdown}
        reviews={reviews.length > 0 ? reviews : mockReviews}
      />
      {/* Size Guide Drawer */}
      <SizeGuideDrawer
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
      />
      {/* Bottom Action Bar for mobile only */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 z-50">
        <div className="relative">
          <Button variant="outline" size="sm" className="p-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
          </Button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{quantity}</span>
        </div>
        <Button 
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50" 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Adding...
            </div>
          ) : (
            "Add to cart"
          )}
        </Button>
        <Button className="flex-1 bg-red-500 hover:bg-red-600">Buy now</Button>
      </div>
      {/* Bottom padding to account for fixed bar on mobile */}
      <div className="block lg:hidden h-20"></div>
    </div>
  );
} 