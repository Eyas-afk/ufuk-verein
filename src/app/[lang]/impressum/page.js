import { getDictionary } from "../dictionaries";

export default async function ImpressumPage({ params }) {
  const { lang } = await params;
  const dict = (await getDictionary(lang)).legal.impressum;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-2xl font-bold">{dict.title}</h1>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.sectionAngaben}</h2>
        <p className="whitespace-pre-line">{dict.vereinName}</p>
        <p className="whitespace-pre-line">{dict.address}</p>
        <p>{dict.represented}</p>
        <p className="whitespace-pre-line">{dict.register}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.contactTitle}</h2>
        <p>{dict.phone}</p>
        <p>{dict.email}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.responsibleTitle}</h2>
        <p className="whitespace-pre-line">{dict.responsible}</p>
      </section>
    </div>
  );
}
