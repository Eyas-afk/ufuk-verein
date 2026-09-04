import Link from "next/link";
import { getDictionary } from "./dictionaries";
import LogoIntro from "./LogoIntro";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: "url('/bg-calligraphy.webp')" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        <LogoIntro />
        <h1 className="text-center text-3xl font-bold sm:text-start">{dict.home.title}</h1>
        <p className="text-lg text-neutral-600">{dict.home.subtitle}</p>
        <p className="leading-relaxed">{dict.home.about}</p>

        <div>
          <h2 className="mb-2 text-xl font-semibold">{dict.home.coursesTitle}</h2>
          <ul className="list-disc space-y-1 ps-6">
            {dict.home.locations.map((loc) => (
              <li key={loc}>{loc}</li>
            ))}
          </ul>
        </div>

        <Link
          href={`/${lang}/registrierung`}
          className="inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          {dict.home.cta}
        </Link>
      </div>
    </div>
  );
}
