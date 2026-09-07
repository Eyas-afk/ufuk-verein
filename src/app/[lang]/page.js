import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "./dictionaries";
import LogoIntro from "./LogoIntro";

const locationImages = ["/loc-moelln.webp", "/loc-ratzeburg.webp", "/loc-schwarzenbeck.jpg"];

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <LogoIntro />
      <h1 className="text-center text-3xl font-bold sm:text-start">{dict.home.title}</h1>
      <p className="text-lg text-neutral-600">{dict.home.subtitle}</p>
      <p className="leading-relaxed">{dict.home.about}</p>

      <div>
        <h2 className="mb-4 text-xl font-semibold">{dict.home.coursesTitle}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dict.home.locations.map((loc, i) => (
            <div
              key={loc}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm"
            >
              <Image
                src={locationImages[i]}
                alt={loc}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-3 font-semibold text-white">{loc}</p>
            </div>
          ))}
        </div>
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
