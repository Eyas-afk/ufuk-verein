import Link from "next/link";
import { logout } from "./actions";
import AdminLanguageSwitcher from "./AdminLanguageSwitcher";
import { getAdminDict } from "@/lib/adminDictionary";

export default function VerwaltungHeader({ profile, user, active }) {
  const locale = profile?.locale === "de" ? "de" : "ar";
  const t = getAdminDict(locale).header;
  const isVerwaltung = profile?.role === "verwaltung";

  const NAV_ITEMS = [
    { key: "antraege", href: "/verwaltung", label: t.antraege },
    { key: "gruppen", href: "/verwaltung/gruppen", label: t.gruppen },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/verwaltung" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-bold text-neutral-900">
              {isVerwaltung ? t.verwaltung : t.lehrerBereich}
            </span>
          </Link>

          {isVerwaltung && (
            <nav className="flex gap-4 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={
                    active === item.key
                      ? "font-semibold text-orange-600"
                      : "text-neutral-500 hover:text-neutral-900"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <AdminLanguageSwitcher locale={locale} />
          <span className="text-neutral-500">{profile?.full_name || user?.email}</span>
          <form action={logout}>
            <button type="submit" className="text-neutral-500 underline hover:text-neutral-900">
              {t.logout}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
