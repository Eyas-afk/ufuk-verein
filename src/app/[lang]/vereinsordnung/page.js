import { getDictionary } from "../dictionaries";

export default async function VereinsordnungPage({ params }) {
  const { lang } = await params;
  const dict = (await getDictionary(lang)).legal.vereinsordnung;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-2xl font-bold">{dict.title}</h1>

      <p className="rounded-lg border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
        {dict.draftNotice}
      </p>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.admissionTitle}</h2>
        <p>{dict.admissionText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.attendanceTitle}</h2>
        <p>{dict.attendanceText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.conductTitle}</h2>
        <p>{dict.conductText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.generalRulesTitle}</h2>
        <ul className="list-disc space-y-1 ps-6">
          {dict.generalRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.suppliesTitle}</h2>
        <p>{dict.suppliesText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.communicationTitle}</h2>
        <p>{dict.communicationText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.offerTitle}</h2>
        <p>{dict.offerText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.changesTitle}</h2>
        <p>{dict.changesText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.contactTitle}</h2>
        <p>{dict.contactText}</p>
      </section>
    </div>
  );
}
