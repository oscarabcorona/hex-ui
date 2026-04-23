import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hex-core.dev";

/** robots.txt — allow-all with a pointer to the dynamic sitemap. */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [{ userAgent: "*", allow: "/" }],
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
