import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rocketbrain/shared", "@rocketbrain/ui"]
};

export default nextConfig;
