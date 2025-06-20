import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira, createProductUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  slug?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  badge?: string;
  freeShipping?: boolean;
  isFavorited?: boolean;
  isLoadingFavorite?: boolean;
  onFavorite?: () => void;
  onAddToCart?: (productId: string) => Promise<void>;
  isAddingToCart?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  image,
  price,
  originalPrice,
  rating = 0,
  badge,
  freeShipping,
  isFavorited = false,
  isLoadingFavorite = false,
  onFavorite,
  onAddToCart,
  isAddingToCart = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [localAddingToCart, setLocalAddingToCart] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking favorite
    e.stopPropagation(); // Stop event bubbling
    onFavorite?.();
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation(); // Stop event bubbling
    
    if (localAddingToCart || isAddingToCart) return;
    
    setLocalAddingToCart(true);
    
    try {
      if (onAddToCart) {
        await onAddToCart(id);
      } else {
        // Fallback success message if no handler provided
        toast.success(`${name} added to cart!`);
      }
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Add to cart failed:', error);
    } finally {
      setLocalAddingToCart(false);
    }
  };

  // Create SEO-friendly URL with short ID and slug
  const productLink = createProductUrl(id, slug || 'product');
  const isAddingToCartActive = localAddingToCart || isAddingToCart;

  return (
    <Link href={productLink} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={imageError ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" : image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            {badge && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {badge}
              </div>
            )}
            {/* Favorite Button - Positioned over image */}
            {onFavorite && (
              <button
                onClick={handleFavoriteClick}
                disabled={isLoadingFavorite}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                  isFavorited 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                } ${isLoadingFavorite ? 'cursor-not-allowed opacity-70' : 'hover:scale-110'}`}
              >
                {isLoadingFavorite ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#7C2AE8] transition-colors">
            {name}
          </h3>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${
                      star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">({rating})</span>
            </div>
          )}
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">
                  {formatNaira(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatNaira(originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Free Shipping Badge */}
              {freeShipping && (
                <div className="text-xs text-green-600 font-medium">
                  Free shipping
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCartClick}
              disabled={isAddingToCartActive}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                isAddingToCartActive
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#7C2AE8] hover:bg-[#6B46C1] hover:scale-110'
              }`}
              title="Add to cart"
            >
              {isAddingToCartActive ? (
                <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 