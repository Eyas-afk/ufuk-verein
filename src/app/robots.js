export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/verwaltung", "/einladung", "/passwort-zuruecksetzen"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
