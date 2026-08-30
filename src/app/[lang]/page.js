import Link from "next/link";
import { getDictionary } from "./dictionaries";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-3xl font-bold">{dict.home.title}</h1>
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
  );
}
