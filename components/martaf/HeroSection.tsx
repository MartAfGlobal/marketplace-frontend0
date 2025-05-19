import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-8 py-16 overflow-hidden bg-white">
      {/* Background SVG */}
      <Image
        src="/assets/Hero_body[1].svg"
        alt="Background"
        fill
        className="contain object-left z-0 pointer-events-none select-none"
        style={{ zIndex: 0 }}
        priority
      />
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-start max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black leading-tight">Discover the<br />best of Africa</h1>
        <p className="mb-8 text-lg text-black">Explore a world of quality products across Africa at Martaf. From electronics to fashion and home goods, we offer something for everyone.</p>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded border border-[#FF715B] text-[#FF715B] bg-white font-semibold text-base transition hover:bg-[#FF715B] hover:text-white">Become a seller</button>
          <button className="px-8 py-3 rounded bg-[#FF715B] text-white font-semibold text-base flex items-center gap-2 transition hover:bg-[#ff4d2d]">
            <ShoppingCart className="w-5 h-5" /> Shop now
          </button>
        </div>
      </div>
      {/* Hero Image */}
      {/* Removed Unsplash image as requested */}
    </section>
  );
};

export default HeroSection; 