import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.ARTMONIA_BUILD_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mzdcmdvxmonpynssghmw.supabase.co",
        pathname: "/storage/v1/object/public/site-media/**"
      }
    ]
  }
};

export default nextConfig;
