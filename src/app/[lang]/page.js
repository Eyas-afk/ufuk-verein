import Link from "next/link";
import Image from "next/image";
import { Amiri, Playfair_Display } from "next/font/google";
import { getDictionary } from "./dictionaries";
import LogoIntro from "./LogoIntro";
import EventsCarousel from "./EventsCarousel";

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
      intro: dict.home.aboutIntro,
      points: dict.home.aboutPoints,
      outro: dict.home.aboutOutro,
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
              {s.points ? (
                <>
                  {s.intro && (
                    <p className="mb-2 text-lg leading-relaxed text-neutral-700">{s.intro}</p>
                  )}
                  <ul className="list-disc space-y-1.5 ps-5 text-lg leading-relaxed text-neutral-700 marker:text-orange-500">
                    {s.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-lg leading-relaxed text-neutral-700">{s.outro}</p>
                </>
              ) : (
                <p className="text-lg leading-relaxed text-neutral-700">{s.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-3xl bg-gradient-to-b from-orange-100/70 via-orange-50 to-transparent p-6 sm:p-10">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-9 w-9 text-orange-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C3.05 7.58 2.25 8.507 2.25 9.574v9.176c0 1.24 1.01 2.25 2.25 2.25h15c1.24 0 2.25-1.01 2.25-2.25V9.574c0-1.067-.8-1.994-1.802-2.169a47.99 47.99 0 0 0-1.133-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-orange-800">{dict.home.eventsTitle}</h2>
        </div>
        <EventsCarousel events={dict.home.events} />
      </section>

      <section className="rounded-3xl bg-gradient-to-b from-orange-100/70 via-orange-50 to-transparent p-6 sm:p-10">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-9 w-9 text-orange-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-orange-800">{dict.home.coursesTitle}</h2>
        </div>
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
        <p className="mt-4 text-center text-neutral-600">{dict.home.expansionNote}</p>
      </section>

      <div className="flex justify-center">
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
