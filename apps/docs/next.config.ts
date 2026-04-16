import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@hex-ui/components", "@hex-ui/registry", "@hex-ui/tokens"],
};

export default nextConfig;
