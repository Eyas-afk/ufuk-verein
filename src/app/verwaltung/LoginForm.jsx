"use client";

import { useState } from "react";
import { login, requestPasswordReset } from "./actions";
import { getAdminDict } from "@/lib/adminDictionary";
import { FlagDE, FlagSY } from "../[lang]/Flags";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.jpeg"
      alt="Ufuk e.V."
      className="mx-auto mb-4 h-14 w-14 rounded-full object-cover"
    />
  );
}

function MiniLanguageSwitcher({ locale, setLocale }) {
  return (
    <div className="mb-2 flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setLocale("ar")}
        title="العربية"
        className={locale === "ar" ? "opacity-100" : "opacity-50 hover:opacity-80"}
      >
        <FlagSY className="h-4 w-6 rounded-sm shadow-sm" />
      </button>
      <button
        type="button"
        onClick={() => setLocale("de")}
        title="Deutsch"
        className={locale === "de" ? "opacity-100" : "opacity-50 hover:opacity-80"}
      >
        <FlagDE className="h-4 w-6 rounded-sm shadow-sm" />
      </button>
    </div>
  );
}

export default function LoginForm() {
  const [locale, setLocale] = useState("de");
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const t = getAdminDict(locale).login;
  const dir = locale === "ar" ? "rtl" : "ltr";

  async function handleLogin(formData) {
    setPending(true);
    setError(null);
    const result = await login(formData);
    setPending(false);
    if (result?.error) setError(t.wrongCredentials);
  }

  async function handleForgot(formData) {
    setPending(true);
    await requestPasswordReset(locale, formData);
    setPending(false);
    setResetSent(true);
  }

  if (mode === "forgot") {
    return (
      <div dir={dir} className="flex min-h-screen items-center justify-center px-4">
        <form
          action={handleForgot}
          className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <Logo />
          <MiniLanguageSwitcher locale={locale} setLocale={setLocale} />
          <h1 className="text-center text-xl font-bold text-neutral-900">{t.forgotTitle}</h1>

          {resetSent ? (
            <p className="text-center text-sm text-green-700">{t.resetSent}</p>
          ) : (
            <>
              <div>
                <label className={labelClass}>{t.email}</label>
                <input name="email" type="email" required className={fieldClass} />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? t.sending : t.sendReset}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setResetSent(false);
            }}
            className="w-full text-center text-sm text-neutral-500 underline"
          >
            {t.backToLogin}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex min-h-screen items-center justify-center px-4">
      <form
        action={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <Logo />
        <MiniLanguageSwitcher locale={locale} setLocale={setLocale} />
        <h1 className="text-center text-xl font-bold text-neutral-900">{t.title}</h1>

        <div>
          <label className={labelClass}>{t.email}</label>
          <input name="email" type="email" required className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>{t.password}</label>
          <input name="password" type="password" required className={fieldClass} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? t.submitting : t.submit}
        </button>

        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="w-full text-center text-sm text-neutral-500 underline"
        >
          {t.forgot}
        </button>
      </form>
    </div>
  );
}
