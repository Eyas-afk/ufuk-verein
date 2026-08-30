import { notFound } from "next/navigation";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import Header from "./Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header dict={dict} lang={lang} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
          <p>{dict.footer.text}</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href={`/${lang}/impressum`} className="hover:underline">
              {dict.footer.linkImpressum}
            </Link>
            <Link href={`/${lang}/datenschutz`} className="hover:underline">
              {dict.footer.linkDatenschutz}
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
