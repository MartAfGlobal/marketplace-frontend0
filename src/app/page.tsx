"use client";
import AboutPage from "@/components/ui/landindPage/AboutUs/AboutUs";
import ProductListPage from "@/components/ui/landindPage/ShoppingItems/Product-List";
import HeroPage from "@/components/ui/landindPage/HeroPage/HeroPage";
import JoinUsPage from "@/components/ui/landindPage/JoinUs/JoinUs";
import { useState, useEffect } from "react";
import WireframeLoader from "@/components/ui/WireframeLoader";
import MobileCategory from "@/components/ui/mobile/mobile-category";
import Gallary from "@/components/ui/mobile/gallary";


export default function Home() {
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WireframeLoader />;

  return (
    <main className="">
      <div className=" md:px-15 pt-6 ">
        <HeroPage />
        <div className="md:hidden">
          <MobileCategory/>
        </div>
        <div className="md:hidden">
         < Gallary/>
        </div>
        <ProductListPage/>
        <AboutPage />
      </div>
      <JoinUsPage />
    </main>
  );
}
