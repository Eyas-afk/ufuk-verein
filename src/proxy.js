import { NextResponse } from "next/server";

const locales = ["ar", "de"];
const defaultLocale = "ar";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Schließt _next-interne Pfade und alle Dateien mit Endung (z.B. logo.jpeg, favicon.ico) aus
  matcher: ["/((?!_next|.*\\..*).*)"],
};
