import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com", "flagcdn.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // 👈 allow localhost images in dev
      },
    ],
  },
  webpack(config) {
    // 👇 SVG as React Component
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /component/, // usage: import Icon from 'file.svg?component'
      use: ["@svgr/webpack"],
    });

    // 👇 SVG as file URL (for <Image src="..." />)
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
      resourceQuery: { not: [/component/] }, // default when ?component is not used
    });

    return config;
  },
};

export default nextConfig;
