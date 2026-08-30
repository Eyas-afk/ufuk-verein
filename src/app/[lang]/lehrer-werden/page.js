import { getDictionary } from "../dictionaries";
import TeacherForm from "./TeacherForm";

export default async function TeacherApplicationPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">{dict.teacherApplication.title}</h1>
      <TeacherForm dict={dict.teacherApplication} lang={lang} />
    </div>
  );
}
