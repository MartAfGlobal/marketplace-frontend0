import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    name: "Diamond Earrings",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    price: "$23.45",
    rating: 4,
  },
  {
    name: "Gold Ring",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    price: "$23.45",
    rating: 5,
  },
  {
    name: "Yellow Heels",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    price: "$23.45",
    rating: 4,
  },
  {
    name: "Trendy Caps",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    price: "$23.45",
    rating: 3,
  },
  {
    name: "Leather Wallet",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    price: "$23.45",
    rating: 4,
  },
];

const TrendingProducts = () => {
  return (
    <section className="py-8 px-4 md:px-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Trending</h2>
        <a href="#" className="text-[#FF715B] text-sm font-medium hover:underline">View more</a>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts; 