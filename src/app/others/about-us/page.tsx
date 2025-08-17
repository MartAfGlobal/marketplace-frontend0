"use client";

import AboutNav from "@/components/ui/landindPage/AboutUs/about-us-nav";
import AboutHero from "@/components/ui/landindPage/AboutUs/aboutaHero";
import OurMission from "@/components/ui/landindPage/AboutUs/ourMission";
import { useState, useEffect } from "react";
import WireframeLoader from "@/components/ui/WireframeLoader";
import OurImpact from "@/components/ui/landindPage/AboutUs/OurImpact";
import JoinU from "@/components/ui/landindPage/AboutUs/JoinUs";
import BgImage from "@/assets/images/AboutLanding.svg"

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WireframeLoader />;

  return (
    <div>
      <AboutNav />
      <AboutHero
        bgImage={BgImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About us" }, // no href means just text
        ]}
        smallTitle="About Us"
        mainTitle="Who We Are"
        description="Welcome to MartAf – Africa’s premier e-commerce platform connecting manufacturers, and producers with consumers through a seamless, secure marketplace."
      />
      <OurMission />
      <OurImpact />
      <JoinU />
    </div>
  );
}
