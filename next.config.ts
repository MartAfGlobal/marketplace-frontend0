import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"], // ✅ allow Cloudinary images
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
