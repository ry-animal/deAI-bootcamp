import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for minification instead of Terser
};

export default nextConfig;
