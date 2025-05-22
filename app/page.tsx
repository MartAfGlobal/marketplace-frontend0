import Header from "@/components/martaf/Header";
import Footer from "@/components/martaf/Footer";
import ProductCard from "@/components/martaf/ProductCard";
import Image from "next/image";

// Reusable category circle component
const CategoryCircle = ({ name, icon }: { name: string; icon: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
      <Image src={icon} alt={name} width={48} height={48} className="object-cover" />
    </div>
    <span className="text-xs font-medium text-gray-700">{name}</span>
  </div>
);

const categories = [
  { name: "Fashion", icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  { name: "Electronics", icon: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" },
  { name: "Home & living", icon: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Beauty", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
];

const products = [
  { name: "Diamond Earrings", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
  { name: "Yellow Heels", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
  { name: "Diamond Earrings", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
  { name: "Trendy Caps", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 3 },
  { name: "Leather Wallet", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
  { name: "Trendy Caps", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 3 },
  { name: "Leather Wallet", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
  { name: "Yellow Heels", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", price: "$40.00", rating: 4 },
];

export default function Home() {
  return (
    <div className="bg-[#faf9fb] min-h-screen flex flex-col">
      <Header />
      {/* Search bar */}
      <div className="px-4 py-3">
        <input
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#6C1EB1]"
          placeholder="Search for products"
        />
      </div>
      {/* Banner */}
      <div className="px-4 mb-4">
        <div className="rounded-xl overflow-hidden w-full h-32 relative flex items-center justify-between bg-gradient-to-r from-[#ff715b] to-[#ffb347]">
          <div className="flex-1 p-4">
            <div className="text-xs font-semibold text-white mb-1">EXCLUSIVE WEARS</div>
            <div className="text-2xl font-bold text-white mb-1">HOT DEALS</div>
            <div className="text-xs text-white mb-2">UPTO <span className="bg-yellow-300 text-black px-1 rounded">20%</span> DISCOUNT</div>
            <button className="bg-white text-[#ff715b] rounded px-4 py-1 text-sm font-semibold">Shop now</button>
          </div>
          <div className="h-full w-24 relative hidden sm:block">
            <Image src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Banner suit" fill className="object-cover" />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="text-lg font-semibold mb-3">Explore popular categories</div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <CategoryCircle key={cat.name} name={cat.name} icon={cat.icon} />
          ))}
        </div>
      </div>
      {/* Product recommendations */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">We think you'd love this</div>
          <a href="#" className="text-[#7C2AE8] text-xs font-medium">View more</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">More to love</div>
          <a href="#" className="text-[#7C2AE8] text-xs font-medium">View more</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(4, 8).map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">On sale</div>
          <a href="#" className="text-[#7C2AE8] text-xs font-medium">View more</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
