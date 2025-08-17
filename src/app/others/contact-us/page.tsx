"use client";
import AboutNav from "@/components/ui/landindPage/AboutUs/about-us-nav";
import AboutHero from "@/components/ui/landindPage/AboutUs/aboutaHero";
import { useState, useEffect } from "react";
import WireframeLoader from "@/components/ui/WireframeLoader";
import bgImage from "@/assets/images/ContactLanding.png";
import GetIntouch from "@/components/ui/contact-us/GetIntouch";
import ContactForm from "@/components/ui/contact-us/contact-form";
import Image from "next/image";
import Map from "@/assets/icons/Contact-us/Map.svg";

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WireframeLoader />;

  return (
    <div className="w-full">
      <AboutNav />
      <div>
        <AboutHero
          bgImage={bgImage}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Contact us" }, // no href means just text
          ]}
          smallTitle="Contact Us"
          mainTitle="Get in Touch with Us"
          description="At MartAf, we’re here to help! Whether you're a manufacturer, retailer, consumer, or investor, reach out to us anytime."
        />
        <div className="relative w-full px-19.75 pb-4">
          <div className="relative z-50 flex gap-c24 w-full m-auto pb-12.5 bg-ffffff rounded-c24 px-c48 circle-shadow pt-c64 -mt-[90px]">
            <GetIntouch />
            <ContactForm />
          </div>
        </div>
         <div className="px-c60 pt-c64 pb-c80">
              <div className="w-full h-c500 rounded-c12">
                <Image src={Map} alt="map" width={1000} height={500} className="rounded-c12 h-full w-full object-cover"/>
              </div>
            </div>
      </div>
    </div>
  );
}
