import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  freeShipping?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  badgeVariant = "default",
  freeShipping = false,
  onFavorite,
  onClick,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200" onClick={onClick}>
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover"
        />
        {badge && (
          <Badge 
            className={`absolute top-2 left-2 ${
              badgeVariant === "default" ? "bg-orange-500" : ""
            }`}
            variant={badgeVariant}
          >
            {badge}
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-3">
        {freeShipping && (
          <div className="text-sm text-gray-600 mb-1">Free shipping</div>
        )}
        <div className="font-medium text-sm mb-1 line-clamp-2">{name}</div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 