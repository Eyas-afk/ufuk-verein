"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PasswortZuruecksetzenPage() {
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
      setFormError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== passwordConfirm) {
      setFormError("Die Passwörter stimmen nicht überein.");
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
    <div className="mx-auto mt-24 max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <h1 className="text-xl font-bold">Neues Passwort festlegen</h1>

      {status === "checking" && <p>Link wird geprüft …</p>}

      {status === "error" && (
        <p className="text-red-600">
          Der Link ist ungültig oder abgelaufen. Bitte fordere über "Passwort vergessen?" einen
          neuen an.
        </p>
      )}

      {status === "success" && (
        <div className="space-y-3">
          <p className="text-green-700">Dein Passwort wurde geändert. Du kannst dich jetzt einloggen.</p>
          <a href="/verwaltung" className="underline">
            Zum Login
          </a>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Neues Passwort</label>
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
            <label className="mb-1 block text-sm font-medium">Passwort wiederholen</label>
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
            {submitting ? "Wird gespeichert …" : "Passwort speichern"}
          </button>
        </form>
      )}
    </div>
  );
}
