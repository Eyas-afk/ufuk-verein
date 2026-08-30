"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const initialState = {
  fullName: "",
  phone: "",
  email: "",
  location: "",
  qualification: "",
  message: "",
  consent: false,
};

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      {children}
    </div>
  );
}

export default function TeacherForm({ dict, lang }) {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const { error: dbError } = await supabase.from("teacher_applications").insert({
      full_name: form.fullName,
      phone: form.phone,
      email: form.email,
      location: form.location,
      qualification: form.qualification,
      message: form.message || null,
      locale: lang,
    });

    setSubmitting(false);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      setError(true);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-green-800">
        {dict.successPlaceholder}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label={dict.fullName}>
        <input
          required
          type="text"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.phone}>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.email}>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.location}>
        <select
          required
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            {dict.locationPlaceholder}
          </option>
          <option value="moelln">{dict.locationOptions.moelln}</option>
          <option value="ratzeburg">{dict.locationOptions.ratzeburg}</option>
          <option value="schwarzenbeck">
            {dict.locationOptions.schwarzenbeck}
          </option>
        </select>
      </Field>

      <Field label={dict.qualification}>
        <textarea
          required
          rows={3}
          value={form.qualification}
          onChange={(e) => update("qualification", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.message}>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputClass}
        />
      </Field>

      <label className="flex items-start gap-2">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm">
          {dict.consentPre}{" "}
          <Link
            href={`/${lang}/datenschutz`}
            target="_blank"
            className="underline hover:no-underline"
          >
            {dict.consentLinkText}
          </Link>{" "}
          {dict.consentPost}
        </span>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-800">
          {dict.errorPlaceholder}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {submitting ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
