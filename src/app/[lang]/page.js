import Link from "next/link";
import Image from "next/image";
import { Amiri, Playfair_Display } from "next/font/google";
import { getDictionary } from "./dictionaries";
import LogoIntro from "./LogoIntro";

const locationImages = ["/loc-moelln.webp", "/loc-ratzeburg.webp", "/loc-schwarzenbeck.jpg"];

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"], style: ["italic", "normal"] });

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const storyFont = lang === "ar" ? amiri.className : playfair.className;

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
      <h1 className="sr-only">Ufuk e.V.</h1>
      <div className="flex overflow-hidden rounded-2xl shadow-md">
        <div
          aria-hidden="true"
          className="w-4 shrink-0 bg-cover bg-center sm:w-6"
          style={{ backgroundImage: "url(/pattern-arabic-letters.webp)" }}
        />
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-white p-8 sm:p-10">
          <div
            className={`${storyFont} space-y-4 text-xl leading-relaxed text-neutral-900 sm:text-2xl`}
          >
            <p>{dict.home.nameStory1}</p>
            <p>{dict.home.nameStory2}</p>
            <p>{dict.home.nameStory3}</p>
            <p>{dict.home.nameStory4}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {storySections.map((s, i) => (
          <div
            key={s.key}
            className={`group flex flex-col gap-6 rounded-2xl bg-transparent p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl sm:items-center sm:p-6 ${
              i % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md sm:w-72 sm:shrink-0">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 640px) 288px, 100vw"
                className="object-cover transition duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-orange-800 transition-colors duration-300 group-hover:text-orange-600">
                {s.title}
              </h2>
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
        <p className="mt-4 text-neutral-600">{dict.home.expansionNote}</p>
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
