"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const texts = {
  de: {
    title: "Passwort festlegen",
    intro: "Willkommen bei Ufuk e.V.! Bitte lege ein Passwort für dein Lehrer-Konto fest.",
    password: "Passwort",
    passwordConfirm: "Passwort wiederholen",
    submit: "Konto aktivieren",
    submitting: "Wird gespeichert …",
    mismatch: "Die Passwörter stimmen nicht überein.",
    tooShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    error: "Der Link ist ungültig oder abgelaufen. Bitte wende dich an die Verwaltung.",
    success: "Dein Konto ist aktiviert! Du kannst dich jetzt einloggen.",
    loginLink: "Zum Login",
    checking: "Link wird geprüft …",
  },
  ar: {
    title: "تعيين كلمة المرور",
    intro: "مرحبًا بك في نادي أفق! يرجى تعيين كلمة مرور لحساب المعلم الخاص بك.",
    password: "كلمة المرور",
    passwordConfirm: "تأكيد كلمة المرور",
    submit: "تفعيل الحساب",
    submitting: "جارٍ الحفظ …",
    mismatch: "كلمتا المرور غير متطابقتين.",
    tooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    error: "الرابط غير صالح أو منتهي الصلاحية. يرجى التواصل مع الإدارة.",
    success: "تم تفعيل حسابك! يمكنك الآن تسجيل الدخول.",
    loginLink: "الذهاب لتسجيل الدخول",
    checking: "جارٍ التحقق من الرابط …",
  },
};

export default function EinladungClient() {
  const params = useSearchParams();
  const lang = params.get("lang") === "de" ? "de" : "ar";
  const t = texts[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [status, setStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setStatus(data.user ? "ready" : "error");
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError(t.tooShort);
      return;
    }
    if (password !== passwordConfirm) {
      setFormError(t.mismatch);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setStatus("success");
  }

  return (
    <div
      dir={dir}
      className="mx-auto mt-24 max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <h1 className="text-xl font-bold">{t.title}</h1>

      {status === "checking" && <p>{t.checking}</p>}

      {status === "error" && <p className="text-red-600">{t.error}</p>}

      {status === "success" && (
        <div className="space-y-3">
          <p className="text-green-700">{t.success}</p>
          <a href="/verwaltung" className="underline">
            {t.loginLink}
          </a>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-neutral-600">{t.intro}</p>
          <div>
            <label className="mb-1 block text-sm font-medium">{t.password}</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t.passwordConfirm}</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </form>
      )}
    </div>
  );
}
