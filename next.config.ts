import type { NextConfig } from "next";
import process from "node:process";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
