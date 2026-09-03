"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlagDE, FlagSY } from "./Flags";

const languages = [
  { code: "ar", Flag: FlagSY, label: "العربية" },
  { code: "de", Flag: FlagDE, label: "Deutsch" },
];

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-2">
      {languages.map((l) => (
        <Link
          key={l.code}
          href={`/${l.code}${rest ? `/${rest}` : ""}`}
          title={l.label}
          aria-label={l.label}
          className={l.code === lang ? "opacity-100" : "opacity-50 hover:opacity-80"}
        >
          <l.Flag className="h-4 w-6 rounded-sm shadow-sm" />
        </Link>
      ))}
    </div>
  );
}
