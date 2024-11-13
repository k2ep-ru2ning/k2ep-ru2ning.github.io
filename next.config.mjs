import process from "node:process";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isProd ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
