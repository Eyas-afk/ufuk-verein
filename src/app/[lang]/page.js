import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "./dictionaries";
import LogoIntro from "./LogoIntro";

const locationImages = ["/loc-moelln.webp", "/loc-ratzeburg.webp", "/loc-schwarzenbeck.jpg"];

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const storySections = [
    {
      key: "about",
      title: dict.home.aboutTitle,
      text: dict.home.about,
      image: "/section-anbieten.jpeg",
    },
    {
      key: "why",
      title: dict.home.whyTitle,
      text: dict.home.whyText1,
      image: "/section-warum.jpeg",
    },
    {
      key: "join",
      title: dict.home.joinTitle,
      text: dict.home.whyText2,
      image: "/section-team.jpeg",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <LogoIntro />
      <h1 className="text-center text-3xl font-bold sm:text-start">{dict.home.title}</h1>
      <p className="text-lg text-neutral-600">{dict.home.subtitle}</p>

      <div className="space-y-6">
        {storySections.map((s, i) => (
          <div
            key={s.key}
            className={`flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-lg sm:items-center sm:p-6 ${
              i % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
            }`}
          >
            <div className="relative aspect-[4/3] w-full sm:w-72 sm:shrink-0">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 640px) 288px, 100vw"
                className="rounded-2xl object-cover shadow-md"
              />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-orange-800">{s.title}</h2>
              <p className="text-lg leading-relaxed text-neutral-700">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

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
