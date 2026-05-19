"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";

export default function ShowcaseSection() {
  const [showcaseImages, setShowcaseImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/website/images/");
        console.log("[ShowcaseSection] /website/images/ response:", response.data);

        // Handle both flat array and paginated { results: [] } responses
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results ?? [];

        // API returns 'image_url' field
        const urls = data
          .map((item: any) => item.image_url ?? item.image ?? item.url ?? item.file)
          .filter((url: any) => typeof url === "string" && url.length > 0);

        console.log("[ShowcaseSection] image URLs found:", urls);
        setShowcaseImages(urls);
      } catch (e) {
        console.error("[ShowcaseSection] Failed to fetch showcase images", e);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="my-20 md:my-52 ">
      <div className="w-full ">
        <div className="flex flex-col md:flex-row items-center md:items-end px-6 md:px-18 lg:px-34.5 justify-between mb-16 gap-8 text-center md:text-left">
          <div className="max-w-full md:max-w-207.25 flex flex-col gap-10">
            <span className="text-6a0dad/68 font-MontserratMedium border border-6a0dad/68 text-c18 rounded-[48px] w-full  md:max-w-fit h-fit py-6 lg:px-12 md:px-8  mx-auto md:mx-0">
              Problems we are solving
            </span>
            <div>
              <h2 className="text-3xl md:text-5xl font-MontserratNormal text-000000 mb-6 leading-[150%]">
                Africa produces extraordinary things
              </h2>
              <p className="text-000000/68 text-base leading-[32px] font-MontserratNormal">
                Clothing that takes weeks to hand-craft. Beauty products
                refined over generations. Food that carries the flavors of
                home across 5,000 miles. But the world can't find them. Not
                because the products don't exist — but because the
                infrastructure to reach the world doesn't exist yet. Until
                now.
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden -mx-6 md:-mx-18 min-h-[465px] flex items-center">
          {showcaseImages.length === 0 ? (
            <div className="w-full flex items-center justify-center py-20 text-gray-300 text-sm font-MontserratMedium italic">
              No showcase images yet — add some from the Manager Dashboard.
            </div>
          ) : (
            <motion.div
              className="flex gap-8 px-6 md:px-18"
              animate={{
                x: [0, "-50%"],
              }}
              transition={{
                duration: Math.max(20, showcaseImages.length * 8),
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: "fit-content" }}
            >
              {/* Duplicate for seamless loop */}
              {[...showcaseImages, ...showcaseImages].map((url, index) => (
                <div
                  key={index}
                  className="w-[349px] h-[465px] flex-shrink-0 group cursor-pointer"
                >
                  <div className="relative  overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 w-[349px] h-[465px]">
                    <img
                      src={url}
                      alt={`Showcase ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
