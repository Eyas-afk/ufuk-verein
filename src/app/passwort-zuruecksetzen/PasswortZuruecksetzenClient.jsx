"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getAdminDict } from "@/lib/adminDictionary";

export default function PasswortZuruecksetzenClient() {
  const params = useSearchParams();
  const locale = params.get("lang") === "ar" ? "ar" : "de";
  const t = getAdminDict(locale).resetPassword;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [status, setStatus] = useState("checking"); // checking | ready | error | success
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
    <div dir={dir} className="mx-auto mt-24 max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <h1 className="text-xl font-bold">{t.title}</h1>

      {status === "checking" && <p>{t.checking}</p>}

      {status === "error" && <p className="text-red-600">{t.error}</p>}

      {status === "success" && (
        <div className="space-y-3">
          <p className="text-green-700">{t.success}</p>
          <a href="/verwaltung" className="underline">
            {t.toLogin}
          </a>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t.newPassword}</label>
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
            <label className="mb-1 block text-sm font-medium">{t.repeatPassword}</label>
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
            {submitting ? t.saving : t.save}
          </button>
        </form>
      )}
    </div>
  );
}
