import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const topCategories = [
  { name: "Electronics", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" },
  { name: "Clothes", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  { name: "Fresh food", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewelries", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  { name: "Fresh food", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Clothes", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
];

const gridCategories = [
  { img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" },
  { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" },
];

const Categories = () => {
  return (
    <section className="py-12">
      <div className="px-4 md:px-12">
        <h2 className="text-3xl font-bold mb-2 text-black text-center">Explore Our Categories</h2>
        <p className="mb-6 text-lg text-gray-500 text-center">Find the perfect products that suits your needs.</p>
      </div>
      {/* Top horizontal scrollable categories */}
      <div className="flex overflow-x-auto gap-4 pb-4 mb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent -mx-0">
        {topCategories.map((cat, i) => (
          <div key={i} className="flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden relative group bg-gray-800">
            <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-base font-medium text-center">
              {cat.name}
            </div>
          </div>
        ))}
      </div>
      {/* Grid of categories */}
      <div className="px-4 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {gridCategories.map((cat, i) => (
            <div key={i} className="rounded-xl overflow-hidden relative group bg-gray-800 h-56">
              <Image src={cat.img} alt="Category" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
        {/* Browse all categories button */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 px-8 py-3 rounded border border-[#FF715B] text-[#FF715B] bg-transparent font-semibold text-base transition hover:bg-[#FF715B] hover:text-white">
            Browse all categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories; 