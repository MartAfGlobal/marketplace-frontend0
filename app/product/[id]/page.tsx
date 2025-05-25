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
import { Heart, Share2, Star, Shield, RotateCcw, MessageCircle, Phone, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/martaf/ProductCard";
import { RatingsReviewsDrawer } from "@/components/martaf/RatingsReviewsDrawer";
import { SizeGuideDrawer } from "@/components/martaf/SizeGuideDrawer";
import { useState, use, useEffect } from "react";

// Mock data for similar products
const similarProducts = [
  {
    id: "1",
    name: "Nike Air Max 270",
    price: 40.00,
    originalPrice: 50.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "2", 
    name: "Adidas Ultraboost 22",
    price: 40.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
  {
    id: "3",
    name: "Puma RS-X3",
    price: 40.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "4",
    name: "New Balance 990v5",
    price: 40.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
  {
    id: "5",
    name: "Converse Chuck Taylor",
    price: 40.00,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&h=200&fit=crop",
    badge: "Hot sale",
    freeShipping: true,
  },
  {
    id: "6",
    name: "Vans Old Skool",
    price: 40.00,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=200&fit=crop",
    badge: "On sale",
    freeShipping: true,
  },
];

// Mock review data
const mockReviews = [
  {
    id: "1",
    customerName: "Customer Name",
    date: "Jan 02, 2024",
    rating: 4,
    comment: "there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.",
    verified: true,
  },
  {
    id: "2",
    customerName: "Customer Name",
    date: "Jan 02, 2024",
    rating: 4,
    comment: "there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.",
    verified: true,
  },
  {
    id: "3",
    customerName: "Customer Name",
    date: "Jan 02, 2024",
    rating: 4,
    comment: "there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.",
    verified: true,
  },
  {
    id: "4",
    customerName: "Customer Name",
    date: "Jan 02, 2024",
    rating: 4,
    comment: "there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.",
    verified: true,
  },
  {
    id: "5",
    customerName: "Customer Name",
    date: "Jan 02, 2024",
    rating: 5,
    comment: "there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.",
    verified: true,
  },
];

const ratingBreakdown = {
  5: 8,
  4: 7,
  3: 3,
  2: 1,
  1: 1,
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSimilarProductsLoading, setIsSimilarProductsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Product images array
  const productImages = [
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
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  // Simulate loading product data
  useEffect(() => {
    const loadProductData = async () => {
      // Simulate API call for product data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsPageLoading(false);
      
      // Load similar products after main product loads
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSimilarProductsLoading(false);
    };

    loadProductData();
  }, [id]);

  // Handle add to cart with loading
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
    // You can add success toast here
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#6B46C1] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#6B46C1] font-bold text-sm">M</span>
          </div>
          <span className="font-semibold">MARTAF</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
        </div>
      </div>

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#6B46C1] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#6B46C1] font-bold text-sm">M</span>
          </div>
          <span className="font-semibold">MARTAF</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative">
        {/* Main Image with Advanced Zoom */}
        <div 
          className="aspect-square bg-gray-100 relative overflow-hidden cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image */}
          <Image
            src={productImages[selectedImageIndex]}
            alt="Product image"
            width={800}
            height={800}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZooming ? 'scale-110' : 'scale-100'
            }`}
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
            Hover to zoom
          </div>
        </div>
        
        {/* Image thumbnails - Horizontally scrollable */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {productImages.map((src, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                  selectedImageIndex === i 
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-102'
                }`}
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

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-lg font-semibold flex-1">Product Name</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-2xl font-bold text-green-600 mb-2">$45.00</div>
        <div className="text-sm text-green-600 mb-4">In stock</div>

        {/* Rating - Single row, clickable */}
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setRatingsOpen(true)}
        >
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm font-medium">4.5/5</span>
          <span className="text-sm text-gray-500">(20 reviews)</span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <span className="text-lg font-medium">-</span>
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            onClick={incrementQuantity}
          >
            <span className="text-lg font-medium">+</span>
          </Button>
        </div>

        {/* Size and Color Selection */}
        <div className="mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Variation Available</h3>
            </div>
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setSizeGuideOpen(true)}
            >
              <div className="text-sm text-gray-600">Size guide</div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {['41', '42', '43', '44', '45', '46', '47', '48'].map((size, i) => (
                <Button 
                  key={i} 
                  variant={selectedSize === size ? "default" : "outline"} 
                  size="sm" 
                  className={`min-w-[40px] flex-shrink-0 ${
                    selectedSize === size 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Color:</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
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
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3 mb-6">
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

        {/* Supplier Info */}
        <Card className="p-4 mb-6">
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
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View profile
            </Button>
            <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
              Send message
            </Button>
          </div>
        </Card>

        {/* Hot Deals Banner */}
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">EXCLUSIVE WEARS</div>
              <div className="text-2xl font-bold">HOT DEALS</div>
              <div className="text-sm">UPTO 50% DISCOUNT</div>
            </div>
            <div className="text-right">
              <Button variant="secondary" size="sm">
                Shop now
              </Button>
            </div>
          </div>
        </Card>

        {/* Accordion Sections */}
        <div className="mb-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-left font-medium">
                Product details
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>This is a high-quality product with excellent features and durability.</p>
                  <p>Made from premium materials with attention to detail.</p>
                  <p>Perfect for everyday use and special occasions.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="specifications">
              <AccordionTrigger className="text-left font-medium">
                Product Specifications
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="text-sm font-medium mb-2">What's in the box?</div>
                  <div className="space-y-1">
                    <div>• 1 pair of shoes</div>
                    <div>• 1 pair of shoelaces</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mb-6">
          <div 
            className="cursor-pointer"
            onClick={() => setRatingsOpen(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Ratings & Reviews</h3>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-semibold">4.8/5</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Single Review */}
            <div className="border-t pt-3">
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-sm">Customer Name</div>
                <div className="text-xs text-gray-500">Jan 02, 2024</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Verified Purchase
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                there should probably something nice this guy will write that will sound sweet in the ear for people to buy the product.
              </p>
            </div>
          </div>
        </div>

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
              {similarProducts.map((product) => (
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
                  onClick={() => console.log(`Clicked on ${product.name}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ratings & Reviews Drawer */}
      <RatingsReviewsDrawer
        open={ratingsOpen}
        onOpenChange={setRatingsOpen}
        averageRating={4.8}
        totalReviews={20}
        ratingBreakdown={ratingBreakdown}
        reviews={mockReviews}
      />

      {/* Size Guide Drawer */}
      <SizeGuideDrawer
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
      />

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
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
        <Button className="flex-1 bg-red-500 hover:bg-red-600">
          Buy now
        </Button>
      </div>

      {/* Bottom padding to account for fixed bar */}
      <div className="h-20"></div>
    </div>
  );
} 