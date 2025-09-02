import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@maccabi/cart", "@maccabi/core"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
