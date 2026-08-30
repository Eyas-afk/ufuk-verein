import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["ar", "de"];
const defaultLocale = "ar";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Verwaltungsbereich: keine Sprachumleitung, aber Login-Session auf jeder
  // Anfrage auffrischen, damit abgelaufene Sitzungen zuverlässig erkannt werden.
  if (pathname.startsWith("/verwaltung")) {
    return updateSupabaseSession(request);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

async function updateSupabaseSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Wichtig: getUser() (nicht getSession()) prüft den Token aktiv beim
  // Supabase-Server, damit ein widerrufener/abgelaufener Login sofort auffliegt.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Schließt _next-interne Pfade und alle Dateien mit Endung (z.B. logo.jpeg, favicon.ico) aus
  matcher: ["/((?!_next|.*\\..*).*)"],
};
