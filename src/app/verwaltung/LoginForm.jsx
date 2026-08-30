"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData) {
    setPending(true);
    setError(null);
    const result = await login(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto mt-24 max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <h1 className="text-xl font-bold">Verwaltung – Login</h1>

      <div>
        <label className="mb-1 block text-sm font-medium">E-Mail</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Passwort</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {pending ? "Wird geprüft …" : "Anmelden"}
      </button>
    </form>
  );
}
