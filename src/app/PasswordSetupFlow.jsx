"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Gemeinsame Logik für /einladung (Lehrer-Konto aktivieren) und
// /passwort-zuruecksetzen (Passwort ändern). Beide bekommen per E-Mail einen
// Link mit token_hash + type und verifizieren ihn erst bei aktivem Klick auf
// "Bestätigen" – nicht automatisch beim Laden der Seite. Das verhindert, dass
// E-Mail-Sicherheitsscanner (die Links beim Empfang vorab abrufen) das
// Einmal-Token schon vor dem echten Klick der Nutzerin/des Nutzers verbrauchen.
export default function PasswordSetupFlow({ texts, dir, loginHref }) {
  const params = useSearchParams();
  const tokenHash = params.get("token_hash");
  const type = params.get("type");

  const [status, setStatus] = useState(tokenHash && type ? "confirm" : "invalid");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setStatus("verifying");
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    setStatus(error ? "invalid" : "ready");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError(texts.tooShort);
      return;
    }
    if (password !== passwordConfirm) {
      setFormError(texts.mismatch);
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
      <h1 className="text-xl font-bold">{texts.title}</h1>

      {status === "invalid" && <p className="text-red-600">{texts.error}</p>}

      {status === "confirm" && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">{texts.confirmIntro}</p>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
          >
            {texts.confirmButton}
          </button>
        </div>
      )}

      {status === "verifying" && <p>{texts.verifying}</p>}

      {status === "success" && (
        <div className="space-y-3">
          <p className="text-green-700">{texts.success}</p>
          <a href={loginHref} className="underline">
            {texts.loginLink}
          </a>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {texts.intro && <p className="text-sm text-neutral-600">{texts.intro}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium">{texts.password}</label>
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
            <label className="mb-1 block text-sm font-medium">{texts.passwordConfirm}</label>
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
            {submitting ? texts.submitting : texts.submit}
          </button>
        </form>
      )}
    </div>
  );
}
