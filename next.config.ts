import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "cdn.pixabay.com", "images.pexels.com", "res.cloudinary.com", "images.rawpixel.com"],
  },
  // Allow cross-origin requests from mobile devices during development
  allowedDevOrigins: [
    "192.168.1.109", // Your mobile device IP
    "192.168.1.*",   // Allow all devices on your local network (optional)
  ],
};

export default nextConfig;
