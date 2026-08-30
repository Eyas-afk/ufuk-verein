import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ dict, lang }) {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Ufuk Logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="text-lg font-bold">{dict.nav.brand}</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link href={`/${lang}`} className="hover:underline">
            {dict.nav.home}
          </Link>
          <Link href={`/${lang}/registrierung`} className="hover:underline">
            {dict.nav.register}
          </Link>
          <LanguageSwitcher lang={lang} />
        </nav>
      </div>
    </header>
  );
}
