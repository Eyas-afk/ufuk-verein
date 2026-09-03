"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNav({ dict, lang }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/registrierung`, label: dict.nav.register },
    { href: `/${lang}/lehrer-werden`, label: dict.nav.teacherApplication },
  ];

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-10 border-b border-neutral-200 bg-[#fefdec] px-4 py-3 shadow-sm">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="hover:underline"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-1">
              <LanguageSwitcher lang={lang} />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
