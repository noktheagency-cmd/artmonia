import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.ARTMONIA_BUILD_DIR || ".next",
  reactStrictMode: true
};

export default nextConfig;
