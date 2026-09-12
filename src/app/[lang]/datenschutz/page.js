import { getDictionary } from "../dictionaries";

export default async function DatenschutzPage({ params }) {
  const { lang } = await params;
  const dict = (await getDictionary(lang)).legal.datenschutz;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-2xl font-bold">{dict.title}</h1>

      <p>{dict.intro}</p>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.controllerTitle}</h2>
        <p className="whitespace-pre-line">{dict.controller}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.dataTitle}</h2>
        <p>{dict.dataText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.purposeTitle}</h2>
        <p>{dict.purposeText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.legalBasisTitle}</h2>
        <p>{dict.legalBasisText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.consentPhotosTitle}</h2>
        <p>{dict.consentPhotosText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.recipientsTitle}</h2>
        <p>{dict.recipientsText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.cookiesTitle}</h2>
        <p>{dict.cookiesText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.storageTitle}</h2>
        <p>{dict.storageText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.rightsTitle}</h2>
        <p>{dict.rightsText}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{dict.contactTitle}</h2>
        <p>{dict.contactText}</p>
      </section>
    </div>
  );
}
