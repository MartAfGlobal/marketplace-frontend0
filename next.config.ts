import type { NextConfig } from "next";
import withPWA from "next-pwa";

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

// ✅ Wrap config with PWA support
const withPWAWrapped = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disable during dev mode
})(nextConfig);

export default withPWAWrapped;
