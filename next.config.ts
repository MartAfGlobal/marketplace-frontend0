import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /component/,
      use: ["@svgr/webpack"],
    });

    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
      resourceQuery: { not: [/component/] },
    });

    return config;
  },

  // Required to silence Turbopack/webpack conflict in Next.js 16
  turbopack: {},

};

export default withPWA({
  dest: "public",
  register: true,
  // @ts-expect-error skipWaiting is supported by the plugin but not defined in PluginOptions types
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
