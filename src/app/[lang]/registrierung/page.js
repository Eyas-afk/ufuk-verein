import { getDictionary } from "../dictionaries";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">{dict.register.title}</h1>
      <RegisterForm dict={dict.register} lang={lang} />
    </div>
  );
}
