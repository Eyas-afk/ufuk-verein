import "../plain.css";
import { getSessionAndProfile } from "./auth";

export const metadata = {
  title: "Verwaltung – Ufuk e.V.",
};

export default async function VerwaltungLayout({ children }) {
  const { profile } = await getSessionAndProfile();
  const locale = profile?.locale === "de" ? "de" : profile ? "ar" : "de";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
