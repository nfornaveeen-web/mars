import type { NextConfig } from "next";
import { getLegacyProductRedirects } from "./lib/product-slugs";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    // Legacy ID-based product URLs 301 to descriptive slugs (SEO migration).
    return getLegacyProductRedirects();
  },
};

export default nextConfig;
