"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const languages = [
  { code: "ar", label: "العربية" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-3 text-sm">
      {languages.map((l) => (
        <Link
          key={l.code}
          href={`/${l.code}${rest ? `/${rest}` : ""}`}
          className={
            l.code === lang
              ? "font-semibold underline"
              : "text-neutral-500 hover:underline"
          }
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
