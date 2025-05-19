import React from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  name: string;
  img: string;
  price: string;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, img, price, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col">
      <div className="relative w-full h-36 rounded-t-xl overflow-hidden">
        <Image src={img} alt={name} fill className="object-cover" />
        <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-[#6A0DAD]/20 transition">
          <Heart className="w-5 h-5 text-[#6A0DAD]" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-sm font-medium text-black mb-1">{name}</div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} className={`w-4 h-4 ${idx < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={idx < rating ? '#facc15' : 'none'} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-semibold text-base text-black">{price}</span>
          <button className="bg-[#FF715B] rounded p-2 hover:bg-[#ff4d2d] transition">
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 