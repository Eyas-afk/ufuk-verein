"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const initialState = {
  childName: "",
  birthDate: "",
  fatherName: "",
  motherName: "",
  phone: "",
  email: "",
  address: "",
  location: "",
  school: "",
  speaksArabic: false,
  consent: false,
  consentPhotosPublic: false,
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

export default function RegisterForm({ dict, lang }) {
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

    const { error: dbError } = await supabase.from("registrations").insert({
      child_name: form.childName,
      birth_date: form.birthDate,
      father_name: form.fatherName,
      mother_name: form.motherName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      location: form.location,
      school: form.school,
      speaks_arabic: form.speaksArabic,
      consent: form.consent,
      consent_photos_public: form.consentPhotosPublic,
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
      <Field label={dict.childName}>
        <input
          required
          type="text"
          value={form.childName}
          onChange={(e) => update("childName", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.birthDate}>
        <input
          required
          type="date"
          value={form.birthDate}
          onChange={(e) => update("birthDate", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.fatherName}>
        <input
          required
          type="text"
          value={form.fatherName}
          onChange={(e) => update("fatherName", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={dict.motherName}>
        <input
          required
          type="text"
          value={form.motherName}
          onChange={(e) => update("motherName", e.target.value)}
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

      <Field label={dict.address}>
        <textarea
          required
          rows={2}
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
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

      <Field label={dict.school}>
        <input
          required
          type="text"
          value={form.school}
          onChange={(e) => update("school", e.target.value)}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.speaksArabic}
          onChange={(e) => update("speaksArabic", e.target.checked)}
        />
        {dict.speaksArabic}
      </label>

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
          {dict.consentAnd}{" "}
          <Link
            href={`/${lang}/vereinsordnung`}
            target="_blank"
            className="underline hover:no-underline"
          >
            {dict.consentLinkText2}
          </Link>{" "}
          {dict.consentPost}
        </span>
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={form.consentPhotosPublic}
          onChange={(e) => update("consentPhotosPublic", e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm">{dict.consentPhotosPublic}</span>
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
