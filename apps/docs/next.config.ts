import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@hex-core/components", "@hex-core/registry", "@hex-core/tokens"],
};

export default nextConfig;
