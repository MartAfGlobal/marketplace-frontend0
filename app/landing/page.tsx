"use client";

import Header from "@/components/martaf/Header";
import HeroSection from "@/components/martaf/HeroSection";
import Categories from "@/components/martaf/Categories";
import TrendingProducts from "@/components/martaf/TrendingProducts";
import PopularSearches from "@/components/martaf/PopularSearches";
import DiscountItems from "@/components/martaf/DiscountItems";
import WhyChooseMartaf from "@/components/martaf/WhyChooseMartaf";
import ImpactNumbers from "@/components/martaf/ImpactNumbers";
import JoinMartaf from "@/components/martaf/JoinMartaf";
import Footer from "@/components/martaf/Footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col gap-8">
        <HeroSection />
        <Categories />
        <TrendingProducts />
        <PopularSearches />
        <DiscountItems />
        <WhyChooseMartaf />
        <ImpactNumbers />
        <JoinMartaf />
      </main>
      <Footer />
    </div>
  );
}
