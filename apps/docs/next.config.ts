import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	transpilePackages: ["@hex-ui/components", "@hex-ui/registry", "@hex-ui/tokens"],
};

export default bundleAnalyzer(nextConfig);
