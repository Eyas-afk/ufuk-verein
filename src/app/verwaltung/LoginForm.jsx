"use client";

import { useState } from "react";
import { login, requestPasswordReset } from "./actions";

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

export default function LoginForm() {
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  async function handleLogin(formData) {
    setPending(true);
    setError(null);
    const result = await login(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  async function handleForgot(formData) {
    setPending(true);
    const result = await requestPasswordReset(formData);
    setPending(false);
    setResetMessage(result.message);
  }

  if (mode === "forgot") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <form
          action={handleForgot}
          className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <Logo />
          <h1 className="text-center text-xl font-bold text-neutral-900">Passwort vergessen</h1>

          {resetMessage ? (
            <p className="text-center text-sm text-green-700">{resetMessage}</p>
          ) : (
            <>
              <div>
                <label className={labelClass}>E-Mail</label>
                <input name="email" type="email" required className={fieldClass} />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Wird gesendet …" : "Link zum Zurücksetzen senden"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setResetMessage(null);
            }}
            className="w-full text-center text-sm text-neutral-500 underline"
          >
            Zurück zum Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        action={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <Logo />
        <h1 className="text-center text-xl font-bold text-neutral-900">Verwaltung – Login</h1>

        <div>
          <label className={labelClass}>E-Mail</label>
          <input name="email" type="email" required className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>Passwort</label>
          <input name="password" type="password" required className={fieldClass} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Wird geprüft …" : "Anmelden"}
        </button>

        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="w-full text-center text-sm text-neutral-500 underline"
        >
          Passwort vergessen?
        </button>
      </form>
    </div>
  );
}
