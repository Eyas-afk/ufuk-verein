const routes = ["", "registrierung", "lehrer-werden", "impressum", "datenschutz", "vereinsordnung"];
const locales = ["de", "ar"];

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route ? `/${route}` : ""}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${base}/de${route ? `/${route}` : ""}`,
          ar: `${base}/ar${route ? `/${route}` : ""}`,
        },
      },
    }))
  );
}
